const DBC = require('../db/dbc.js').default;

const removeBank = async ({ argsArr }) => {
  const name = argsArr[0];
  const dbc = new DBC();
  const err = await dbc.init();
  if (err) return { ok: false, data: null, err };
  try {
    const res = await dbc.deleteFromBankByName(name);
    dbc.connDestroy();
    return { ok: true, data: res, err: null };
  } catch (err) {
    return { ok: false, data: null, err };
  }

};

module.exports.default = removeBank;