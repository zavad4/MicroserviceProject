const srvc = require('../services.config.js');
const wdo = require('../wdo.js');

const addBank = async () => {
  const res = await wdo.get(srvc.DBCService + '/makeDBCall');

  return { data: res, err: null };
};

module.exports.default = addBank;