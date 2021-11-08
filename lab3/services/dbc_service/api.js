const http = require('http');
const getRoute = require('./apiRouter.js').getRoute;
const parseUrlArgs = require('./helpers.js').parseUrlArgs;

const PORT = process.env.PORT || 8081;
const URL = 'http://localhost:';

const execReq = async (req, res, postData) => {
  console.log('New API REQ:', req.method, req.url);
  const urlArr = req.url.split('?');
  const urlStr = urlArr[0];
  const argsStr = urlArr[1];
  const route = getRoute(urlStr);

  let argsArr = [];
  if (argsStr) {
    argsArr = parseUrlArgs(argsStr); //Object.values(parseUrlArgs(argsStr));
    console.log(`Request ${req.url} args:`, argsArr);
  }

  const {data, err} = await route.executor({ req, data: postData, argsArr });

  res.setHeader('Content-Type', route.contentType);
  if (err) console.log(`Request ${req.url} ERROR:`, err);
  else console.log(`Request ${req.url} executed:`, data);

  res.end(JSON.stringify({data, err}));
  
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

console.log(`DBC api listen on ${URL}${PORT}`);


