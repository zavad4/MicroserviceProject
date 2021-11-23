const makeCalls = require('./makeCalls.js').default;
const crash = require('./crash.js').default;
const callDb = require('./callDb.js').default;
const addEmail = require('./addEmail.js').default;

module.exports.default = {
  makeCalls,
  crash,
  callDb,
  addEmail,
};