const BASE = '/api/katalog'

export const getAllKatalog = async () => {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error('Gagal memuat produk')
  return res.json()
}

export const getKatalogById = async (id) => {
  const res = await fetch(`${BASE}/${id}`)
  if (!res.ok) throw new Error('Produk tidak ditemukan')
  return res.json()
}

export const createKatalog = async (formData) => {
  const res = await fetch(BASE, { method: 'POST', body: formData })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Gagal membuat produk')
  }
  return res.json()
}

export const updateKatalog = async (id, formData) => {
  const res = await fetch(`${BASE}/${id}`, { method: 'PUT', body: formData })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Gagal memperbarui produk')
  }
  return res.json()
}

export const deleteKatalog = async (id) => {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Gagal menghapus produk')
  return res.json()
}
