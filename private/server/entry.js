import http from 'http';
import { readFileSync } from 'fs';
import socketIO from 'socket.io';
import redis from 'redis';

import RandomError from './RandomError';
import { supportedStocks } from '../app/config/globals';

const index = readFileSync('./public/server/views/index.html', 'utf8');
const client = redis.createClient();

const requestData = () => {
  if(Math.random() < 0){
    throw new RandomError('How unfortunate! The API Request Failed');
  }
  return fetch(`http://finance.google.com/finance/info?client=ig&q=${supportedStocks.join()}`, {
    headers: { 'Content-Type': 'text/plain' },
    method: 'GET',
  })
    .then((res) => res.text())
    .then((data) => JSON.parse(data.slice(4)))
  ;
};

const toRedis = (request) => async () => {
  const data = await request();
  data.forEach((stock) => {
    const { t: stockName, lt_dts: lastUpdate } = stock;
    const lastUpdateUnix = Math.round(+new Date(lastUpdate) / 1000);
    client.hset(stockName, lastUpdateUnix, JSON.stringify(stock));
  });
  return data;
};

const parseValues = (request) => async () => {
  const data = await request();
  return data.reduce((current, { t: stock, l: value }) => ({
    ...current,
    [stock]: value,
  }), {});
};
const parseHistoryValues = (request) => (stock) => (
  new Promise(async (resolve, reject) => {
    await request();
    client.hgetall(stock, (err, data) => {
      if(err){ return reject(new Error(err)); }
      return resolve(data.reduce((current, { t: stock, l: value }) => ({
        ...current,
        [stock]: value,
      }), {}));
    });
  })
);

const withDiff = (request) => {
  let lastUpdates = {};
  return async () => {
    const data = await request();
    const changedData = Object.entries(data)
      .filter(([key, value]) => lastUpdates[key] !== value)
      .reduce((current, [key, value]) => ({ ...current, [key]: value }), {})
    ;
    lastUpdates = data;
    return {
      isChanged: !!Object.keys(changedData).length,
      data: changedData,
    };
  };
};

const getValues = parseValues(toRedis(requestData));
const getHistoryValues = parseHistoryValues(toRedis(requestData));

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  const [base, stock] = url.split('/').slice(1);

  if(method === 'GET' && stock && supportedStocks.includes(stock)){
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(await getHistoryValues(stock)));
  }else if(method === 'GET' && base === 'getStocks'){
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(await getValues()));
  }else{
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(index);
  }
});
const io = socketIO(server);

client.on('connect', () => {
  server.listen(3000, async() => {
    console.log('Server listening on localhost:3000');

    const getValuesWithDiff = withDiff(getValues);

    setInterval(async () => {
      const { isChanged, data } = await getValuesWithDiff();
      if(isChanged){
        io.sockets.emit('updateStocks', data);
      }
    }, 2500);
  });
});
