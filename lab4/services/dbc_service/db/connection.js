const mysql = require('mysql');
const vault = require("node-vault")({
  apiVersion: "v1",
  endpoint: "http://127.0.0.1:8200",
});

const roleId = process.env.ROLE_ID;
const secretId = process.env.SECRET_ID;

const getConnection = () => new Promise(async (resolve, reject) => {
  const result = await vault.approleLogin({
    role_id: roleId,
    secret_id: secretId,
  });

  vault.token = result.auth.client_token; // Add token to vault object for subsequent requests.

  const { data } = await vault.read("secret/data/mysql/appservice"); // Retrieve the secret stored in previous steps.
  console.log(data.data);
  const conn = mysql.createConnection(data.data);
  conn.connect((err) => {
    if (err) return resolve({err, conn});
    resolve({err, conn});
  });
});

module.exports = {
  getConnection,
};
