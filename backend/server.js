require('dotenv').config({ path: './backend/.env' });
const express = require('express');
const cors = require('cors');
const katalogController = require('./controllers/katalogController');
// Import middleware yang baru dibuat
const { verifikasiToken } = require('./middlewares/midleware'); 

const app = express();
const port = process.env.PORT || 5000;

// Middleware Global
app.use(cors());
app.use(express.json());

// --- ROUTES PENGUNJUNG (Bebas Akses) ---
// Tampil semua menu atau cari menu. Contoh akses: http://localhost:5000/api/katalog?cari=coklat
app.get('/api/katalog', katalogController.tampilkanKatalog);

// --- ROUTES ADMIN ---
// Login (Bebas Akses untuk dapat token)
app.post('/api/admin/login', katalogController.prosesLogin);

// Ubah Stok (TERKUNCI: Wajib pakai token dari login)
app.put('/api/katalog/:id/stok', verifikasiToken, katalogController.ubahStok);

// Jalankan Server
app.listen(port, () => {
    console.log(`Server Happy Donut berjalan aman di http://localhost:${port}`);
});