const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database (will create if it doesn't exist)
const dbPath = path.resolve(__dirname, 'ppkd_hotel.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create the guests table
    db.run(`CREATE TABLE IF NOT EXISTS guests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      roomNo1 TEXT,
      roomNo2 TEXT,
      jumlahTamu INTEGER,
      jumlahKamar INTEGER,
      jenisKamar TEXT,
      receptionist TEXT,
      nama TEXT,
      pekerjaan TEXT,
      perusahaan TEXT,
      kebangsaan TEXT,
      noKtp TEXT,
      tanggalLahir TEXT,
      alamat TEXT,
      telepon TEXT,
      email TEXT,
      waktuKedatangan TEXT,
      tanggalKedatangan TEXT,
      tanggalKeberangkatan TEXT,
      noMember TEXT,
      safetyDepositBox TEXT,
      dikeluarkanOleh TEXT,
      tanggal TEXT,
      metodePembayaran TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating table', err.message);
      } else {
        console.log('Guests table ready.');
        // Add new column to existing database backwards-compatibly
        db.run('ALTER TABLE guests ADD COLUMN metodePembayaran TEXT', (err) => {});
        db.run('ALTER TABLE guests ADD COLUMN cardNumber TEXT', (err) => {});
        db.run('ALTER TABLE guests ADD COLUMN cardHolderName TEXT', (err) => {});
        db.run('ALTER TABLE guests ADD COLUMN cardType TEXT', (err) => {});
        db.run('ALTER TABLE guests ADD COLUMN expiredDate TEXT', (err) => {});
        db.run('ALTER TABLE guests ADD COLUMN bankTransferTo TEXT', (err) => {});
        db.run('ALTER TABLE guests ADD COLUMN mandiriAccount TEXT', (err) => {});
        db.run('ALTER TABLE guests ADD COLUMN mandiriNameAccount TEXT', (err) => {});

        // Create Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          password TEXT,
          role TEXT DEFAULT 'staff'
        )`, (err) => {
          if (err) {
            console.error('Error creating users table', err.message);
          } else {
            console.log('Users table ready.');
            // Insert default admin
            db.run("INSERT OR IGNORE INTO users (username, password, role) VALUES ('admin', 'admin123', 'admin')");
          }
        });
      }
    });
  }
});

module.exports = db;
