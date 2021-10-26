const mysql = require('mysql');
const connData = require('../secret.js').dbConnData;

const getConnection = () => new Promise((resolve, reject) => {
  const conn = mysql.createConnection(connData);
  conn.connect((err) => {
    if (err) return resolve({err, conn});
    resolve({err, conn});
  });
});

module.exports = {
  getConnection,
};
