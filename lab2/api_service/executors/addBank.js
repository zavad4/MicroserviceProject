const srvc = require('../services.config.js');
const delegate = require('../helpers.js').delegate;

const addBank = async ({ data, req }) => {
  const res = await delegate(data, srvc.DBCService + '/addBank', null);

  return res;
};

module.exports.default = addBank;