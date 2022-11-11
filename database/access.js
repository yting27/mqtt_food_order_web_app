const sqlite3 = require('sqlite3').verbose();
let db;

module.exports.connectToDB = async () => {
  db = new sqlite3.Database('./save_db');
}

module.exports.getDB = () => {
  return db
}