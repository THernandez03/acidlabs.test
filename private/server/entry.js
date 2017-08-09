import { readFileSync } from 'fs';
import http from 'http';

const index = readFileSync('./public/server/views/index.html', 'utf8');

http.createServer((req, res) => {
  console.log('Server listening on localhost:3000');
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(index);
}).listen(3000);
