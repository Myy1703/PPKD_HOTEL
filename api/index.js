const express = require('express');
const cors = require('cors');
const db = require('../server/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main Route
app.get('/api', (req, res) => {
  res.json({ message: 'PPKD Hotel Backend Server is running on Vercel!' });
});

// API Routes (copied from server.js)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT id, username, role FROM users WHERE username = ? AND password = ?';
  db.get(sql, [username, password], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      res.json({ message: 'Login successful', user: row });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  });
});

app.get('/api/guests', (req, res) => {
  const sql = 'SELECT * FROM guests ORDER BY created_at DESC';
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'success', data: rows });
  });
});

app.post('/api/guests', (req, res) => {
  const {
    roomNo1, roomNo2, jumlahTamu, jumlahKamar, jenisKamar, receptionist,
    nama, pekerjaan, perusahaan, kebangsaan, noKtp, tanggalLahir,
    alamat, telepon, email, waktuKedatangan, tanggalKedatangan,
    tanggalKeberangkatan, noMember, safetyDepositBox, dikeluarkanOleh, tanggal,
    metodePembayaran, cardNumber, cardHolderName, cardType, expiredDate, 
    bankTransferTo, mandiriAccount, mandiriNameAccount
  } = req.body;

  const sql = `INSERT INTO guests (
    roomNo1, roomNo2, jumlahTamu, jumlahKamar, jenisKamar, receptionist,
    nama, pekerjaan, perusahaan, kebangsaan, noKtp, tanggalLahir,
    alamat, telepon, email, waktuKedatangan, tanggalKedatangan,
    tanggalKeberangkatan, noMember, safetyDepositBox, dikeluarkanOleh, tanggal, metodePembayaran,
    cardNumber, cardHolderName, cardType, expiredDate, bankTransferTo, mandiriAccount, mandiriNameAccount
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  
  const params = [
    roomNo1, roomNo2, jumlahTamu, jumlahKamar, jenisKamar, receptionist,
    nama, pekerjaan, perusahaan, kebangsaan, noKtp, tanggalLahir,
    alamat, telepon, email, waktuKedatangan, tanggalKedatangan,
    tanggalKeberangkatan, noMember, safetyDepositBox, dikeluarkanOleh, tanggal, metodePembayaran,
    cardNumber, cardHolderName, cardType, expiredDate, bankTransferTo, mandiriAccount, mandiriNameAccount
  ];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'success', data: { id: this.lastID, ...req.body } });
  });
});

app.delete('/api/guests/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM guests WHERE id = ?';
  db.run(sql, id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'deleted', changes: this.changes });
  });
});

app.put('/api/guests/:id', (req, res) => {
  const { id } = req.params;
  const {
    roomNo1, roomNo2, jumlahTamu, jumlahKamar, jenisKamar, receptionist,
    nama, pekerjaan, perusahaan, kebangsaan, noKtp, tanggalLahir,
    alamat, telepon, email, waktuKedatangan, tanggalKedatangan,
    tanggalKeberangkatan, noMember, safetyDepositBox, dikeluarkanOleh, tanggal,
    metodePembayaran, cardNumber, cardHolderName, cardType, expiredDate, 
    bankTransferTo, mandiriAccount, mandiriNameAccount
  } = req.body;

  const sql = `UPDATE guests SET 
    roomNo1=?, roomNo2=?, jumlahTamu=?, jumlahKamar=?, jenisKamar=?, receptionist=?,
    nama=?, pekerjaan=?, perusahaan=?, kebangsaan=?, noKtp=?, tanggalLahir=?,
    alamat=?, telepon=?, email=?, waktuKedatangan=?, tanggalKedatangan=?,
    tanggalKeberangkatan=?, noMember=?, safetyDepositBox=?, dikeluarkanOleh=?, tanggal=?,
    metodePembayaran=?, cardNumber=?, cardHolderName=?, cardType=?, expiredDate=?, 
    bankTransferTo=?, mandiriAccount=?, mandiriNameAccount=?
  WHERE id=?`;
  
  const params = [
    roomNo1, roomNo2, jumlahTamu, jumlahKamar, jenisKamar, receptionist,
    nama, pekerjaan, perusahaan, kebangsaan, noKtp, tanggalLahir,
    alamat, telepon, email, waktuKedatangan, tanggalKedatangan,
    tanggalKeberangkatan, noMember, safetyDepositBox, dikeluarkanOleh, tanggal,
    metodePembayaran, cardNumber, cardHolderName, cardType, expiredDate, 
    bankTransferTo, mandiriAccount, mandiriNameAccount, id
  ];

  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'updated', changes: this.changes, data: { id, ...req.body } });
  });
});

module.exports = app;
