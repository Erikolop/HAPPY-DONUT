const supabase = require('../config/db');

const getAllKatalog = async () => {
    const { data, error } = await supabase.from('katalog').select('*');
    return { data, error };
};

const getKatalogById = async (id) => {
    const { data, error } = await supabase
        .from('katalog')
        .select('*')
        .eq('id_katalog', id)
        .single();
    return { data, error };
};

const cariKatalog = async (keyword) => {
    const { data, error } = await supabase
        .from('katalog')
        .select('*')
        .ilike('nama_katalog', `%${keyword}%`);
    return { data, error };
};

const createKatalog = async (payload) => {
    const { data, error } = await supabase
        .from('katalog')
        .insert([payload])
        .select()
        .single();
    return { data, error };
};

const updateKatalog = async (id, payload) => {
    const { data, error } = await supabase
        .from('katalog')
        .update(payload)
        .eq('id_katalog', id)
        .select()
        .single();
    return { data, error };
};

const updateStokKatalog = async (id, stokBaru) => {
    const { data, error } = await supabase
        .from('katalog')
        .update({ stok: stokBaru })
        .eq('id_katalog', id)
        .select()
        .single();
    return { data, error };
};

const deleteKatalog = async (id) => {
    const { data, error } = await supabase
        .from('katalog')
        .delete()
        .eq('id_katalog', id)
        .select()
        .single();
    return { data, error };
};

const loginAdmin = async (username, password) => {
    const { data, error } = await supabase
        .from('admin')
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
    createKatalog,
    updateKatalog,
    updateStokKatalog,
    deleteKatalog,
    loginAdmin,
};