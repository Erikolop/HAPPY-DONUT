const jwt = require('jsonwebtoken');
const rahasia = process.env.JWT_SECRET || 'rahasia-happy-donut';

const verifikasiToken = (req, res, next) => {
    // Ambil token dari header request
    const token = req.headers['authorization'];
    
    // Jika tidak ada token, tolak aksesnya
    if (!token) {
        return res.status(403).json({ message: "Akses ditolak, token tidak ditemukan!" });
    }

    // Pisahkan kata "Bearer" dari token (format standar)
    const tokenBersih = token.split(" ")[1] || token;

    // Verifikasi keaslian token
    jwt.verify(tokenBersih, rahasia, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token tidak valid atau sudah kadaluarsa!" });
        }
        req.admin = decoded; // Simpan data admin ke request
        next(); // Lanjut ke proses controller
    });
};

module.exports = { verifikasiToken };