const srvc = require('../services.config.js');
const wdo = require('../wdo.js');

const makeCalls = async () => {;
  const res1 = await wdo.get(srvc.APIService + '/addBank');
  const res2 = await wdo.get(srvc.DBCService + '/makeDBCall');
  return { data: { res1, res2 }, err: null };
};

module.exports.default = makeCalls;