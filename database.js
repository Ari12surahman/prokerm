
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./program_kerja.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS program_kerja (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      divisi TEXT,
      kegiatan TEXT,
      tanggal TEXT,
      penanggung_jawab TEXT
    )
  `);
});

module.exports = db;
