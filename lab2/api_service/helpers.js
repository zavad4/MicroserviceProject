const http = require('http');

const replaceAt = (str, index, replacement) => {
  return str.substr(0, index) + replacement + str.substr(index + replacement.length);
};

const wrapStr = (str) => str = typeof str === 'string' ? `'${str}'` : str;

const wrapUpdateObjFields = (updateObj) => {
  const wrapped = { ...updateObj };
  for (const field in updateObj) {
    wrapped[field] = wrapStr(updateObj[field]);
  }
  return wrapped;
}

const parseUrlArgs = (stringToParse) => {
  return JSON.parse('{"' + stringToParse.replace(/&/g, '","').replace(/=/g,'":"') + '"}', (key, value) => {
    return key === "" ? value : decodeURIComponent(value);
  });
}

const wdo = (url, data, method) => new Promise((resolve, reject) => {
  const u = new URL(url);
  const uHostname = u.hostname;
  const uPathname = u.pathname;
  const uPort = u.port;
  const options = {
    hostname: uHostname,
    port: uPort,
    path: uPathname,
    method: method,
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

const delegate = (data, serviceUrl, options) => new Promise(async (resolve, reject) => {
  const res = await wdo(serviceUrl, data, 'POST');
  console.log('res:', res);
  resolve(res);
});

module.exports = {
  replaceAt,
  wrapStr,
  wrapUpdateObjFields,
  parseUrlArgs,
  delegate,

};
