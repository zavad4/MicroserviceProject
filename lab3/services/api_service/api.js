const http = require('http');
const getRoute = require('./apiRouter.js').getRoute;
const parseUrlArgs = require('./helpers.js').parseUrlArgs;
const wrpKafka = require('./kafka.js');
const executors = require('./executors');

const PORT = process.env.PORT || 8080;
const URL = 'http://localhost:';

let CRASH = false;
const CRASH_DELAY_TIME = 15_000; //ms

const execReq = async (req, res, postData) => {
  console.log('New API REQ:', req.method, req.url);
  const urlArr = req.url.split('?');
  const urlStr = urlArr[0];
  const argsStr = urlArr[1];
  const route = getRoute(urlStr);

  ///
  if (req.url === '/api/some-api-service/crash') CRASH = !CRASH;
  ///

  let argsArr = [];
  if (argsStr) {
    argsArr = parseUrlArgs(argsStr); //Object.values(parseUrlArgs(argsStr));
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

const sendMail = async (msg) => {
  console.log('sendMail called');
  console.log('msg.email', msg.value.toString());
  await executors.default.notificate({argsArr: { email: msg.value.toString() }});
  wrpKafka.send('save-email-topic', { value: msg.value.toString() });
}

(async () => {
  await wrpKafka.init();
  wrpKafka.subscribe({ topic: 'email-topic', fromBeginning: true });
  wrpKafka.addExecutor('email-topic', sendMail);
  wrpKafka.startConsumer();
  
  http.createServer(async (req, res) => {
    receiveReq(req, res);
  }).listen(PORT);
  
  console.log(`Some Api listen on ${URL}${PORT}`);
  
})()

