import http from 'http';
import { readFileSync } from 'fs';
import socketIO from 'socket.io';

const index = readFileSync('./public/server/views/index.html', 'utf8');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(index);
});
const io = socketIO(server);

server.listen(3000, () => {
  console.log('Server listening on localhost:3000');
});
