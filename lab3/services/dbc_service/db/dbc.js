const Procedures = require('./procedures.js');
const Connection = require('./connection.js');
const DatabaseDataValidator = require('./dataValidator.js').default;

const defaultOptions = {
  dbdv: DatabaseDataValidator,

};

//data base controller
class DBC {
  constructor(options = {}) {
    this._conn = null;
    this.options = { ...defaultOptions, ...options };
    this.dbdv = null;
    this.schema = null;
  }

  connect = (cb) => new Promise((resolve, reject) => {
    Connection.getConnection().then((res) => {
      if (res.err) return resolve(res.err);
      this._conn = res.conn;
      if (cb) cb();
      resolve();
    });
  });

  connDestroy() {
    this._conn.destroy();
    this._conn = null;
  }

  init = (dbSchema) => new Promise(async (resolve, reject) => {
    try {
      if (!this._conn) {
        const err = await this.connect();
        if (err) throw err;
      }
      const schema = dbSchema ? dbSchema : await this.queryDbSchema();
      this.schema = schema;
      this.dbdv = new this.options.dbdv(this.schema);
      resolve();
    } catch (err) {
      reject(err);
    }
  });

  queryDbSchema = () => new Promise(async (resolve, reject) => {
    try {
      const schema = {
        name: null,
        tables: {},
      };
      const data = await Procedures.getBaseTableNames(this._conn);
      const tableNames = [];
      for (const row of data) tableNames.push(row['table_name']);
      const promises = [];
      for (const tName of tableNames) {
        promises.push(Procedures.descTable(this._conn, tName));
      }
      Promise.all(promises).then((data) => {
        if (data.length === 0) throw new Error('Empty Tables!');
        for (let i = 0; i < tableNames.length; i++) {
          const tableFields = data[i];
          schema.tables[tableNames[i]] = {};
          for (const fieldRow of tableFields) {
            schema.tables[tableNames[i]][fieldRow.Field] = fieldRow.Type;
          }
        }
        resolve(schema);
      });
    } catch (err) {
      reject(err);
    }
  });

  insertBank = (updateObj) => Procedures.insertIntoTable(this._conn, 'Banks', updateObj);

  updateBankByName = (name, updateObj) => Procedures.updateTable(this._conn, 'Banks', 'bankName', name, updateObj);

  deleteFromBankByName = (name) => Procedures.deleteRowsFromTable(this._conn, 'Banks', 'bankName', name);

  getAllBanks = () => Procedures.getAllFromTable(this._conn, 'Banks');

  getBankByName = (name) => Procedures.getFromTableBy(this._conn, 'Banks', 'bankName', name);

}

module.exports.default = DBC;

//example

// const dbc = new DBC();
// (async () => {
//   let res;
  
//   try {
//     const err = await dbc.init();
//     if (err) return console.log('const error connect:', err);
//     res = await dbc.insertBank({
//       bankName: `'monobank'`,
//       interstRate: 4,
//       maxLoan: 1230.1,
//       minDownPayment: 3,
//       loanTerm: 77,
//     });


//   } catch (err) {
//     console.log('catch error:', err)
//   }
//   console.log(res);
// })()
