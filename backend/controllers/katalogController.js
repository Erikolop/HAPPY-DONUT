const model = require('../models/model');

// Mengambil semua produk untuk ditampilkan ke pengunjung [cite: 755]
const tampilkanKatalog = async (req, res) => {
    const { data, error } = await model.getAllKatalog();
    
    if (error) return res.status(500).json({ message: "Gagal mengambil data", error });
    res.status(200).json(data);
};

// Admin mengupdate stok 
const ubahStok = async (req, res) => {
    const { id } = req.params;
    const { stok } = req.body;

    const { data, error } = await model.updateStokKatalog(id, stok);
    
    if (error) return res.status(500).json({ message: "Gagal update stok", error });
    res.status(200).json({ message: "Stok berhasil diupdate", data });
};

// Proses Login Admin [cite: 648-650]
const prosesLogin = async (req, res) => {
    const { username, password } = req.body;
    const { data, error } = await model.loginAdmin(username, password);

    if (error || !data) {
        return res.status(401).json({ message: "Kredensial Salah" }); // Sesuai Sequence Diagram [cite: 643]
    }
    
    res.status(200).json({ message: "Login Berhasil", admin: data });
};

module.exports = {
    tampilkanKatalog,
    ubahStok,
    prosesLogin
};