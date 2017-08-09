import http from 'http';
import { readFileSync } from 'fs';
import socketIO from 'socket.io';
import redis from 'redis';
import moment from 'moment';

const index = readFileSync('./public/server/views/index.html', 'utf8');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(index);
});
const io = socketIO(server);
const client = redis.createClient();

const requestData = () => (
  new Promise((resolve, reject) => {
    if(Math.random() < 0.1){
      throw new Error('How unfortunate! The API Request Failed');
    }
    http.request({
      host: 'finance.google.com',
      path: '/finance/info?client=ig&q=AAPL,ABC,MSFT,TSLA,F',
    }, (res) => {
      let str = '';
      res.on('data', (chunk) => {
        str += chunk;
      });
      res.on('end', () => {
        resolve(JSON.parse(str.slice(4)));
      });
    }).end();
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
    requestWithCache();
  });
});
