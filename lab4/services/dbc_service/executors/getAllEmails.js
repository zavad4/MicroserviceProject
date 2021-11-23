const DBC = require('../db/dbc.js').default;

const getAllEmails = async () => {
  //insert email to db
  const dbc = new DBC();
  const err = await dbc.init();
  if (err) return { data: null, err };
  try {
    const res = await dbc.getAllEmails();
    return { data: res, err: null };
  } catch (err) {
    return { data: null, err };
  }
};
  
module.exports.default = getAllEmails;
