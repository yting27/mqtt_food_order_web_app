const sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

let db;

module.exports.connectToDB = async () => {
  // open the database
  db = await open({
    filename: './database/proj_db.db',
    driver: sqlite3.Database
  })

  await db.exec(`CREATE TABLE IF NOT EXISTS Orders (
            order_id INTEGER PRIMARY KEY, 
            created_at TEXT NOT NULL,
            status INTEGER NOT NULL,
            table_number INTEGER NOT NULL, 
            total_amount REAL NOT NULL
          )`);

  await db.exec(`CREATE TABLE IF NOT EXISTS Items (
            item_id TEXT NOT NULL, 
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