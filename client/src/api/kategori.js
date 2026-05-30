export const getAllKategori = async () => {
  const res = await fetch('/api/kategori')
  if (!res.ok) throw new Error('Gagal memuat kategori')
  return res.json()
}
