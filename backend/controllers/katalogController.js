const model = require('../models/model');
const jwt = require('jsonwebtoken');
const rahasia = process.env.JWT_SECRET || 'rahasia-happy-donut';

// Tampilkan katalog & Fitur Pencarian
const tampilkanKatalog = async (req, res) => {
    const { cari } = req.query; // Menangkap kata kunci dari URL (?cari=donat)
    
    if (cari) {
        const { data, error } = await model.cariKatalog(cari);
        if (error) return res.status(500).json({ message: "Gagal mencari data", error });
        return res.status(200).json(data);
    }

    const { data, error } = await model.getAllKatalog();
    if (error) return res.status(500).json({ message: "Gagal mengambil data", error });
    res.status(200).json(data);
};

// Ubah Stok (Sudah diamankan Middleware nanti di server.js)
const ubahStok = async (req, res) => {
    const { id } = req.params;
    const { stok } = req.body;

    const { data, error } = await model.updateStokKatalog(id, stok);
    
    if (error) return res.status(500).json({ message: "Gagal update stok", error });
    res.status(200).json({ message: "Stok berhasil diupdate", data });
};

// Proses Login Admin
const prosesLogin = async (req, res) => {
    const { username, password } = req.body;
    const { data, error } = await model.loginAdmin(username, password);

    if (error || !data) {
        return res.status(401).json({ message: "Username atau Password Salah!" });
    }
    
    // Buat token khusus untuk admin ini yang berlaku 24 jam
    const token = jwt.sign({ id: data.id_admin, username: data.username }, rahasia, { expiresIn: '24h' });
    
    res.status(200).json({ 
        message: "Login Berhasil", 
        token: token, 
        admin: { id: data.id_admin, username: data.username } 
    });
};

module.exports = {
    tampilkanKatalog,
    ubahStok,
    prosesLogin
};