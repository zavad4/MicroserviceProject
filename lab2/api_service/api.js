const http = require('http');
const getRoute = require('./apiRouter.js').getRoute;
const parseUrlArgs = require('./helpers.js').parseUrlArgs;

const PORT = process.env.PORT || 7070;
const URL = 'http://localhost:';

let CRASH = false;
const CRASH_DELAY_TIME = 5000; //ms

const execReq = async (req, res, postData) => {
  console.log('New API REQ:', req.method, req.url);
  const urlArr = req.url.split('?');
  const urlStr = urlArr[0];
  const argsStr = urlArr[1];
  const route = getRoute(urlStr);

  ///
  if (req.url === '/crash') CRASH = !CRASH;
  ///

  let argsArr = [];
  if (argsStr) {
    argsArr = Object.values(parseUrlArgs(argsStr));
    console.log(`Request ${req.url} args:`, argsArr);
  }

  const {data, err} = await route.executor({ req, data: postData, argsArr });

  res.setHeader('Content-Type', route.contentType);
  if (err) console.log(`Request ${req.url} ERROR:`, err);
  else console.log(`Request ${req.url} executed:`, data);

  if (CRASH) {
    setTimeout(() => res.end(JSON.stringify({data, err})), CRASH_DELAY_TIME);
  } else {
    res.end(JSON.stringify({data, err}));
  }
  
};

const receiveReq = async (req, res) => {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    execReq(req, res, data);
  });
};

http.createServer(async (req, res) => {
  receiveReq(req, res);
}).listen(PORT);

console.log(`Some Api listen on ${URL}${PORT}`);

