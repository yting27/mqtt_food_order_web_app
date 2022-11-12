const sqlite3 = require('sqlite3').verbose();
let db;

module.exports.connectToDB = async () => {
  db = new sqlite3.Database('./database/proj_db.db');

  _db.run(`CREATE TABLE IF NOT EXISTS Orders (
            order_id INTEGER PRIMARY KEY, 
            created_at TEXT NOT NULL,
            status INTEGER NOT NULL,
            table_number INTEGER NOT NULL, 
            total_amount REAL NOT NULL
          )`);
  
  _db.run(`CREATE TABLE IF NOT EXISTS Items (
            item_id INTEGER NOT NULL, 
            order_id INTEGER NOT NULL, 
            name TEXT NOT NULL, 
            unit_price REAL NOT NULL,
            qty INTEGER NOT NULL, 
            created_at TEXT NOT NULL,
            PRIMARY KEY (item_id, order_id)
          )`);
}

module.exports.getDB = () => {
  return db;
}