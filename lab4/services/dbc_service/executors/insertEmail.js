const DBC = require('../db/dbc.js').default;

const insertEmail = async (args) => {
  //insert email to db
  const { email } = args.argsArr;
  const dbc = new DBC();
  const err = await dbc.init();
  if (err) return { data: null, err };
  try {
    const res = await dbc.insertEmail({ 
      email_str: email,
    });
    return { data: res, err: null };
  } catch (err) {
    return { data: null, err };
  }
};
  
module.exports.default = insertEmail;
