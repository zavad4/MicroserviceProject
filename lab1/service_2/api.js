'use strict';
const http = require('http');
const PORT = process.env.port || 8080;
const URL = 'http://localhost:';

const execReq = async (req, res) => {
  console.log('New API REQ:', req.method, req.url);

  res.setHeader('Content-Type', 'application/json');

  res.end('Hello from service 2');
};

http.createServer(async (req, res) => {
  execReq(req, res);
}).listen(PORT);

console.log(`Api listen on ${URL}${PORT}`);
