const model = require('../models/model');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const rahasia = process.env.JWT_SECRET || 'rahasia-happy-donut';

const tampilkanKatalog = async (req, res) => {
    const { cari } = req.query;
    if (cari) {
        const { data, error } = await model.cariKatalog(cari);
        if (error) return res.status(500).json({ message: 'Gagal mencari data', error });
        return res.status(200).json(data);
    }
    const { data, error } = await model.getAllKatalog();
    if (error) return res.status(500).json({ message: 'Gagal mengambil data', error });
    res.status(200).json(data);
};

const tampilkanKatalogById = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await model.getKatalogById(id);
    if (error || !data) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.status(200).json(data);
};

/**
 * Image handling — gambar TEXT column:
 *   multer saves the file to public/uploads/ on disk.
 *   The path "/uploads/<filename>" is stored as plain text in the gambar column.
 *   Express serves the file statically so React can render it directly.
 *
 * Schema: id_katalog | nama_katalog (text) | harga (numeric) | stok (int4) | gambar (text) | deskripsi (text)
 */
const tambahProduk = async (req, res) => {
    const payload = {
        nama_katalog: req.body.nama_katalog?.trim(),
        harga: parseFloat(req.body.harga) || 0,
        stok: parseInt(req.body.stok, 10) || 0,
        deskripsi: req.body.deskripsi?.trim() || '',
        gambar: req.body.gambar_existing || '',
    };

    if (!payload.nama_katalog) {
        return res.status(400).json({ message: 'Nama produk wajib diisi.' });
    }

    if (req.file) {
        payload.gambar = `/uploads/${req.file.filename}`;
    }

    const { data, error } = await model.createKatalog(payload);
    if (error) return res.status(500).json({ message: 'Gagal menambah produk', error });
    res.status(201).json({ message: 'Produk berhasil ditambahkan', data });
};

const updateProduk = async (req, res) => {
    const { id } = req.params;
    const { data: existing } = await model.getKatalogById(id);

    const payload = {
        nama_katalog: req.body.nama_katalog?.trim(),
        harga: parseFloat(req.body.harga) || 0,
        stok: parseInt(req.body.stok, 10) || 0,
        deskripsi: req.body.deskripsi?.trim() || '',
        gambar: req.body.gambar_existing || existing?.gambar || '',
    };

    if (req.file) {
        payload.gambar = `/uploads/${req.file.filename}`;
        if (existing?.gambar?.startsWith('/uploads/')) {
            const oldPath = path.join(__dirname, '..', 'public', existing.gambar);
            fs.unlink(oldPath, () => {});
        }
    }

    const { data, error } = await model.updateKatalog(id, payload);
    if (error) return res.status(500).json({ message: 'Gagal memperbarui produk', error });
    res.status(200).json({ message: 'Produk berhasil diperbarui', data });
};

const ubahStok = async (req, res) => {
    const { id } = req.params;
    const { stok } = req.body;
    const { data, error } = await model.updateStokKatalog(id, stok);
    if (error) return res.status(500).json({ message: 'Gagal update stok', error });
    res.status(200).json({ message: 'Stok berhasil diupdate', data });
};

const hapusProduk = async (req, res) => {
    const { id } = req.params;
    const { data: existing } = await model.getKatalogById(id);
    if (existing?.gambar?.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '..', 'public', existing.gambar);
        fs.unlink(filePath, () => {});
    }
    const { data, error } = await model.deleteKatalog(id);
    if (error) return res.status(500).json({ message: 'Gagal menghapus produk', error });
    res.status(200).json({ message: 'Produk berhasil dihapus', data });
};

const prosesLogin = async (req, res) => {
    const { username, password } = req.body;
    const { data, error } = await model.loginAdmin(username, password);
    if (error || !data) {
        return res.status(401).json({ message: 'Username atau Password Salah!' });
    }
    const token = jwt.sign(
        { id: data.id_admin, username: data.username },
        rahasia,
        { expiresIn: '24h' }
    );
    res.status(200).json({
        message: 'Login Berhasil',
        token,
        admin: { id: data.id_admin, username: data.username },
    });
};

module.exports = {
    tampilkanKatalog,
    tampilkanKatalogById,
    tambahProduk,
    updateProduk,
    ubahStok,
    hapusProduk,
    prosesLogin,
};