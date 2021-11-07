const wdo = require('../wdo.js');
const mysql = require('mysql');

const connObj = {
  host: 'mysql-service',
  user: 'root',
  password: 'password',
  //port: 3306,
};


const makeDBcall = () => new Promise(async (resolve) => {
  const conn = await mysql.createConnection(connObj);
  await conn.connect((err) => {
    if (err) {
      return resolve({ data: 'ne ok', err });
    }
  });
  let res = [];
  try {
    res = await conn.query('select User from mysql.user;');
  } catch (err) {
    return resolve({ data: 'ne ok', err });
  }
  return resolve({ data: 'ok:' + res, err: null });
});

module.exports.default = makeDBcall;