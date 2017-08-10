import http from 'http';
import { readFileSync } from 'fs';
import socketIO from 'socket.io';
import redis from 'redis';
import moment from 'moment';
import st from 'st';

import RandomError from './RandomError';
import { supportedStocks, redisUrl } from '../app/config/globals';

const index = readFileSync('./public/server/views/index.html', 'utf8');
const client = redis.createClient(redisUrl);
const mount = st({ path: './public/app/', url: '/assets' });

const requestData = () => {
  try{
    if(Math.random() < 0.1){
      throw new RandomError('How unfortunate! The API Request Failed');
    }
    return fetch(`http://finance.google.com/finance/info?client=ig&q=${supportedStocks.join()}`, {
      headers: { 'Content-Type': 'text/plain' },
      method: 'GET',
    })
      .then((res) => res.text())
      .then((data) => JSON.parse(data.slice(4)))
    ;
  }catch({ isRandom }){
    if(isRandom){
      console.log('Retrying...');
      requestData();
    }
  }
};

const toRedis = (request) => async () => {
  const data = (await request()) || [];
  data.forEach((stock) => {
    const { t: stockName, lt_dts: lastUpdate } = stock;
    const lastUpdateUnix = Math.round(+new Date(lastUpdate) / 1000);
    client.hset(stockName, lastUpdateUnix, JSON.stringify(stock));
  });
  return data;
};

const parseValues = (request) => async () => {
  const data = await request();
  return data.reduce((current, { t: stock, l: value, lt_dts: date }) => ({
    ...current,
    [stock]: { value, date },
  }), {});
};
const parseHistoryValues = (request) => (stock) => (
  new Promise(async (resolve, reject) => {
    await request();
    client.hgetall(stock, (err, data) => {
      if(err){ return reject(new Error(err)); }
      return resolve(Object.values(data).reduce((current, next) => {
        const { t: stock, l: value, lt_dts: date } = JSON.parse(next);
        return { ...current, [date]: value };
      }, {}));
    });
  })
);

const withDiff = (request) => {
  let lastUpdates = {};
  return async () => {
    const data = await request();
    const changedData = Object.entries(data)
      .filter(([key, { value }]) => (lastUpdates[key] || {}).value !== value)
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

const getStockStatus = () => {
  // Opens: 14:30
  // Closes: 21:00
  const currentTime = moment().utc();
  const HH = currentTime.hours();
  const MM = currentTime.minutes();
  return {
    status: !!((HH > 14 && MM > 30) && HH < 21),
  };
};

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  const [base, stock] = url.split('/').slice(1);

  if(method === 'GET' && stock && supportedStocks.includes(stock)){
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(await getHistoryValues(stock)));
  }else if(method === 'GET' && base === 'getStocks'){
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(await getValues()));
  }else if(method === 'GET' && base === 'getStockStatus'){
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getStockStatus()));
  }else if(method === 'GET' && base === 'assets'){
    mount(req, res);
  }else{
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(index);
  }
});
const io = socketIO(server);
const [,, port = 3000] = process.argv;

server.listen(port, async() => {
  console.log(`Server listening on ${port}`);

  let stockStatus = getStockStatus().status;
  const getValuesWithDiff = withDiff(getValues);

  await getValuesWithDiff();
  setInterval(async () => {
    const { isChanged, data } = await getValuesWithDiff();
    const { status } = getStockStatus();
    if(isChanged){
      io.sockets.emit('updateStocks', data);
    }
    if(status !== stockStatus){
      stockStatus = status;
      io.sockets.emit('updateStockStatus', status);
    }
  }, 2500);
});
