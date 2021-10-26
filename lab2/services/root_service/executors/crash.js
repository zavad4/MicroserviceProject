const srvc = require('../services.config.js');
const wdo = require('../wdo.js');

const makeDBcall = async () => {
  wdo.get('http://some-api-service/api/some-api-service/crash');
  return { data: 'send crash signal to some-api', err: null };
};

module.exports.default = makeDBcall;