const DBC = require('../db/dbc.js').default;

const isUniqueBankName = async ({ name }) => {
  const dbc = new DBC();
  const err = await dbc.init();
  if (err) return { ok: false, data: null, err };
  let banks;
  try {
    banks = await dbc.getAllBanks();
    dbc.connDestroy();
  } catch (err) {
    return { ok: false, data: null, err };
  }
  if (banks.length < 1) return { ok: true, data: true, err: null };
  const bankNames = [];
  for (const bank of banks) {
    bankNames.push(bank.bankName);
  }
  const isUnique = !bankNames.includes(name);
  return { ok: true, data: isUnique ? 'true' : '', err: null };
};

module.exports.default = isUniqueBankName;
