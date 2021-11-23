const http = require('http');

const get = (URL) => new Promise((resolve, reject) => {
  http.get(URL, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      const respObj = JSON.parse(data);
      if (respObj.err) resolve(respObj.err);
      resolve(respObj.data);
    });
  }).on('error', (err) => {
    console.log('Error: ' + err.message);
    reject();
  }).on('error', (err) => {
    console.log('Error: ' + err.message);
    reject(err);
  }).on('timeout', (err) => {
    reject(err);
  });

});

const post = (url, data) => new Promise((resolve, reject) => {
  const u = new URL(url);
  const uHostname = u.hostname;
  const uPathname = u.pathname;
  const uPort = u.port;
  console.log(u);
  const options = {
    hostname: uHostname,
    port: uPort,
    path: uPathname,
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Content-Length': data.length,
    },
  };

  const req = http.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);
    resolve(res);
  });

  req.on('error', (err) => {
    reject(err);
  });

  req.end(data);

});

module.exports = {
  get,
  post,
};