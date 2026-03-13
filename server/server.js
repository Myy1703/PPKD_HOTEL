const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Main Route - Check if server is running
app.get('/', (req, res) => {
  res.json({ message: 'PPKD Hotel Backend Server is running!' });
});

// API Route - Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const sql = 'SELECT id, username, role FROM users WHERE username = ? AND password = ?';
  db.get(sql, [username, password], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (row) {
      res.json({
        message: 'Login successful',
        user: row
      });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  });
});

// API Route - Get all guests (for dashboard)
app.get('/api/guests', (req, res) => {
  const sql = 'SELECT * FROM guests ORDER BY created_at DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// API Route - Create new guest registration
app.post('/api/guests', (req, res) => {
  const {
    roomNo1, roomNo2, jumlahTamu, jumlahKamar, jenisKamar, receptionist,
    nama, pekerjaan, perusahaan, kebangsaan, noKtp, tanggalLahir,
    alamat, telepon, email, waktuKedatangan, tanggalKedatangan,
    tanggalKeberangkatan, noMember, safetyDepositBox, dikeluarkanOleh, tanggal,
    metodePembayaran
  } = req.body;

  const sql = `INSERT INTO guests (
    roomNo1, roomNo2, jumlahTamu, jumlahKamar, jenisKamar, receptionist,
    nama, pekerjaan, perusahaan, kebangsaan, noKtp, tanggalLahir,
    alamat, telepon, email, waktuKedatangan, tanggalKedatangan,
    tanggalKeberangkatan, noMember, safetyDepositBox, dikeluarkanOleh, tanggal, metodePembayaran,
    cardNumber, cardHolderName, cardType, expiredDate, bankTransferTo, mandiriAccount, mandiriNameAccount
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  
  const params = [
    roomNo1, roomNo2, jumlahTamu, jumlahKamar, jenisKamar, receptionist,
    nama, pekerjaan, perusahaan, kebangsaan, noKtp, tanggalLahir,
    alamat, telepon, email, waktuKedatangan, tanggalKedatangan,
    tanggalKeberangkatan, noMember, safetyDepositBox, dikeluarkanOleh, tanggal, metodePembayaran,
    cardNumber, cardHolderName, cardType, expiredDate, bankTransferTo, mandiriAccount, mandiriNameAccount
  ];

  db.run(sql, params, function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({
      message: 'success',
      data: { id: this.lastID, ...req.body }
    });
  });
});

// API Route - Delete guest
app.delete('/api/guests/:id', (req, res) => {
  const { id } = req.params;
  console.log("DELETE request for ID:", id);
  const sql = 'DELETE FROM guests WHERE id = ?';
  db.run(sql, id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'deleted', changes: this.changes });
  });
});

// API Route - Update guest
app.put('/api/guests/:id', (req, res) => {
  const { id } = req.params;
  console.log("PUT request for ID:", id);
  const {
    roomNo1, roomNo2, jumlahTamu, jumlahKamar, jenisKamar, receptionist,
    nama, pekerjaan, perusahaan, kebangsaan, noKtp, tanggalLahir,
    alamat, telepon, email, waktuKedatangan, tanggalKedatangan,
    tanggalKeberangkatan, noMember, safetyDepositBox, dikeluarkanOleh, tanggal,
    metodePembayaran
  } = req.body;

  const sql = `UPDATE guests SET 
    roomNo1=?, roomNo2=?, jumlahTamu=?, jumlahKamar=?, jenisKamar=?, receptionist=?,
    nama=?, pekerjaan=?, perusahaan=?, kebangsaan=?, noKtp=?, tanggalLahir=?,
    alamat=?, telepon=?, email=?, waktuKedatangan=?, tanggalKedatangan=?,
    tanggalKeberangkatan=?, noMember=?, safetyDepositBox=?, dikeluarkanOleh=?, tanggal=?,
    metodePembayaran=?, cardNumber=?, cardHolderName=?, cardType=?, expiredDate=?, bankTransferTo=?, mandiriAccount=?, mandiriNameAccount=?
  WHERE id=?`;
  
  const params = [
    roomNo1, roomNo2, jumlahTamu, jumlahKamar, jenisKamar, receptionist,
    nama, pekerjaan, perusahaan, kebangsaan, noKtp, tanggalLahir,
    alamat, telepon, email, waktuKedatangan, tanggalKedatangan,
    tanggalKeberangkatan, noMember, safetyDepositBox, dikeluarkanOleh, tanggal,
    metodePembayaran, cardNumber, cardHolderName, cardType, expiredDate, bankTransferTo, mandiriAccount, mandiriNameAccount,
    id
  ];

  db.run(sql, params, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'updated', changes: this.changes, data: { id, ...req.body } });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
