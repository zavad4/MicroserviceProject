const srvc = require('../services.config.js');
const wdo = require('../wdo.js');

const addEmail = async (email) => {
  wdo.get(`http://some-api-service/notification?email=${email}`);
  wdo.get(`http://dbc-service/insertEmail?email=${email}`);
  return { data: `email added. Check ${email}`, err: null};
};

module.exports.default = addEmail;