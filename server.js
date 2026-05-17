require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const katalogController = require('./controllers/katalogController');
const { verifikasiToken } = require('./middlewares/midleware');

const app = express();
const port = process.env.PORT || 5000;

// --- Multer: disk storage for product images ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        cb(null, `${unique}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Format file tidak didukung. Gunakan JPG, PNG, atau WebP.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

// --- Global Middleware ---
app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// --- Public API Routes ---
app.get('/api/katalog', katalogController.tampilkanKatalog);
app.get('/api/katalog/:id', katalogController.tampilkanKatalogById);
app.post('/api/admin/login', katalogController.prosesLogin);

// --- Protected Admin API Routes ---
// NOTE: specific route (/stok) must come before the generic (:id) PUT route
app.put('/api/katalog/:id/stok', verifikasiToken, katalogController.ubahStok);

app.post('/api/katalog', verifikasiToken, upload.single('gambar'), katalogController.tambahProduk);
app.put('/api/katalog/:id', verifikasiToken, upload.single('gambar'), katalogController.updateProduk);
app.delete('/api/katalog/:id', verifikasiToken, katalogController.hapusProduk);

// --- Multer error handler ---
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.message) {
        return res.status(400).json({ message: err.message });
    }
    next(err);
});

// --- Serve React Build (SPA) ---
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Happy Donut server running at http://localhost:${port}`);
});