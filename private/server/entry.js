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

const requestData = () => (
  new Promise((resolve, reject) => {
    if(Math.random() < 1){
      reject(new RandomError('How unfortunate! The API Request Failed'));
    }
    const req = http.request({
      host: 'finance.google.com',
      path: '/finance/info?client=ig&q=AAPL,ABC,MSFT,TSLA,F',
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(data.slice(4)));
      });
    });
    req.end();
  })
)

const withCache = (request) => async () => {
  (await request()).forEach((stock) => {
    const { t: stockName } = stock;
    client.hset(stockName, moment().unix(), JSON.stringify(stock))
  })
}

const requestWithCache = withCache(requestData);

client.on('connect', () => {
  server.listen(3000, async () => {
    console.log('Server listening on localhost:3000');
  });
});
