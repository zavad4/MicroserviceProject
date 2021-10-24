const srvc = require('../services.config.js');
const wdo = require('../wdo.js');

const makeDBcall = async () => {
  const res = await wdo.get(srvc.APIService + '/crash')
  return { data: res, err: null };
};

module.exports.default = makeDBcall;