import http from 'http';
import { readFileSync } from 'fs';
import socketIO from 'socket.io';
import redis from 'redis';
import moment from 'moment';

class RandomError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.isRandom = true;
    if(typeof Error.captureStackTrace === 'function'){
      Error.captureStackTrace(this, this.constructor);
    }else{
      this.stack = (new Error(message)).stack;
    }
  }
}

const index = readFileSync('./public/server/views/index.html', 'utf8');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(index);
});
const io = socketIO(server);
const client = redis.createClient();

const requestData = () => {
  if(Math.random() < 0.1){
    throw new RandomError('How unfortunate! The API Request Failed');
  }
  return fetch('http://finance.google.com/finance/info?client=ig&q=AAPL,ABC,MSFT,TSLA,F', {
    headers: { 'Content-Type': 'text/plain' },
    method: 'GET',
  }).then((res) => res.text())
    .then((data) => {
      return JSON.parse(data.slice(4));
    })
  ;
};

const withCache = (request) => async () => {
  const data = await request();
  data.forEach((stock) => {
    const { t: stockName } = stock;
    client.hset(stockName, moment().unix(), JSON.stringify(stock));
  });
  return data;
};

const requestWithCache = withCache(requestData);

client.on('connect', () => {
  server.listen(3000, async () => {
    console.log('Server listening on localhost:3000');
  });
});
