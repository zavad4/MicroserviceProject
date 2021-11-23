const makeDBCall = require('./makeDBCall.js').default;
const insertEmail = require('./insertEmail.js').default;
const getAllEmails = require('./getAllEmails.js').default;

module.exports.default = {
  makeDBCall,
  insertEmail,
  getAllEmails,

};