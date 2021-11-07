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
    else{
      return resolve({ data: 'ok', err: null });
    }
  });
});

module.exports.default = makeDBcall;