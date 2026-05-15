const supabase = require('../config/db');

// --- Fungsi Model Katalog ---
const getAllKatalog = async () => {
    const { data, error } = await supabase.from('Katalog').select('*');
    return { data, error };
};

const getKatalogById = async (id) => {
    const { data, error } = await supabase.from('Katalog').select('*').eq('id_katalog', id).single();
    return { data, error };
};

const updateStokKatalog = async (id, stokBaru) => {
    const { data, error } = await supabase.from('Katalog')
        .update({ stok: stokBaru })
        .eq('id_katalog', id)
        .select();
    return { data, error };
};

// --- Fungsi Model Admin ---
const loginAdmin = async (username, password) => {
    const { data, error } = await supabase.from('Admin')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();
    return { data, error };
};

module.exports = {
    getAllKatalog,
    getKatalogById,
    updateStokKatalog,
    loginAdmin
};