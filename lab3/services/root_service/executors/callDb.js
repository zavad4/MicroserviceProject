const wdo = require('../wdo.js');
const mysql = require('mysql');

const connObj = {
  host: '192.168.39.170',
  user: 'root',
  password: 'password',
  port: 3306,
};


const makeDBcall = async () => {
  const res = await mysql.createConnection(connObj);
  return { data: res, err: null };
};

module.exports.default = makeDBcall;