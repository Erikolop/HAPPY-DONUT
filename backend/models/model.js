const supabase = require('../config/db');

// Mengambil semua katalog
const getAllKatalog = async () => {
    // Ubah jadi huruf kecil: 'katalog'
    const { data, error } = await supabase.from('katalog').select('*');
    return { data, error };
};

// Mengambil katalog berdasarkan ID
const getKatalogById = async (id) => {
    const { data, error } = await supabase.from('katalog').select('*').eq('id_katalog', id).single();
    return { data, error };
};

// Fitur Pencarian Katalog berdasarkan nama produk
const cariKatalog = async (keyword) => {
    const { data, error } = await supabase.from('katalog').select('*').ilike('nama_katalog', `%${keyword}%`);
    return { data, error };
};

// Admin update stok
const updateStokKatalog = async (id, stokBaru) => {
    const { data, error } = await supabase.from('katalog')
        .update({ stok: stokBaru })
        .eq('id_katalog', id)
        .select();
    return { data, error };
};

// Admin Login
const loginAdmin = async (username, password) => {
    // Ubah jadi huruf kecil: 'admin'
    const { data, error } = await supabase.from('admin')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();
    return { data, error };
};

module.exports = {
    getAllKatalog,
    getKatalogById,
    cariKatalog,
    updateStokKatalog,
    loginAdmin
};