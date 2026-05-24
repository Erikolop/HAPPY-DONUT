import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getKatalogById, createKatalog, updateKatalog } from '../../api/katalog'
import { getAllKategori } from '../../api/kategori'
import { getStockInfo } from '../../components/StockBadge'

export default function EditProdukPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  const fileRef = useRef()

  const [kategori, setKategori] = useState([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    nama_katalog: '',
    harga: '',
    stok: '',
    deskripsi: '',
    kategori: '',
  })
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)

  useEffect(() => {
    getAllKategori().then(setKategori).catch(console.error)
    if (isEdit) {
      getKatalogById(id)
        .then(item => {
          setForm({
            nama_katalog: item.nama_katalog || '',
            harga: item.harga || '',
            stok: item.stok ?? '',
            deskripsi: item.deskripsi || '',
            kategori: item.kategori?.id ?? item.kategori ?? '',
          })
          setPreview(item.gambar || null)
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false))
    }
  }, [id])

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('nama_katalog', form.nama_katalog)
      fd.append('harga', form.harga)
      fd.append('stok', form.stok)
      fd.append('deskripsi', form.deskripsi)
      fd.append('kategori', form.kategori)
      if (file) fd.append('gambar', file)

      if (isEdit) {
        await updateKatalog(id, fd)
      } else {
        await createKatalog(fd)
      }
      navigate('/admin/stok')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const stockInfo = form.stok !== '' ? getStockInfo(Number(form.stok)) : null

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FFF5F8', maxWidth: 430, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#A32A58', fontSize: 14 }}>Memuat...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#FFF5F8' }}>

      {/* ── Navbar ── */}
      <header style={{
        background: '#fff',
        borderBottom: '1.5px solid #fce4ec',
        boxShadow: '0 2px 12px rgba(163,42,88,0.06)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '0 24px', height: 64,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: '#FCE4EC', border: 'none', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.18s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8b4cc'}
            onMouseLeave={e => e.currentTarget.style.background = '#FCE4EC'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A32A58" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>

          {/* Brand */}
          <img src="/images/solar_donut-bitten-bold-duotone.png" alt="logo" style={{ width: 28, height: 28 }} />
          <span style={{ fontSize: 18, fontWeight: 800, color: '#A32A58' }}>Happy Donut</span>

          {/* Page title */}
          <span style={{
            fontSize: 14, color: '#9ca3af',
            borderLeft: '1.5px solid #fce4ec',
            paddingLeft: 14, marginLeft: 4,
          }}>
            {isEdit ? 'Edit Produk' : 'Tambah Produk'}
          </span>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px 60px' }}>

        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a1a', marginBottom: 28 }}>
          {isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}
        </h1>

        <form onSubmit={handleSubmit}>
          {/* ── Two-column layout: image left, fields right ── */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 24,
            alignItems: 'flex-start',
          }}>

            {/* ── LEFT: Photo upload ── */}
            <div style={{
              flex: '1 1 300px', minWidth: 0,
              background: '#fff', borderRadius: 20,
              padding: '20px', boxShadow: '0 1px 10px rgba(163,42,88,0.07)',
            }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 10 }}>
                Foto Produk
              </p>

              {/* Upload area */}
              <div
                onClick={() => fileRef.current.click()}
                style={{
                  width: '100%', aspectRatio: '1/1', borderRadius: 16,
                  background: '#FFF5F8', overflow: 'hidden', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 10, border: '2px dashed #fce4ec',
                }}
              >
                {preview
                  ? <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : (
                    <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#A32A58" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4, marginBottom: 8 }}>
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <p style={{ fontSize: 13 }}>Klik untuk upload</p>
                    </div>
                  )
                }
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={handleFile}
              />
              <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center' }}>
                Format: JPG, PNG (Maks. 5MB). Rekomendasi rasio 1:1
              </p>
            </div>

            {/* ── RIGHT: Fields ── */}
            <div style={{ flex: '2 1 400px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Nama + Kategori card */}
              <div style={{
                background: '#fff', borderRadius: 20,
                padding: '20px 22px', boxShadow: '0 1px 10px rgba(163,42,88,0.07)',
              }}>
                {/* Nama Produk */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', display: 'block', marginBottom: 6 }}>
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    value={form.nama_katalog}
                    onChange={e => setForm(f => ({ ...f, nama_katalog: e.target.value }))}
                    required
                    placeholder="Contoh: Classic Glazed"
                    style={{
                      width: '100%', padding: '12px 14px',
                      background: '#FFF5F8', border: '1.5px solid #fce4ec',
                      borderRadius: 12, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Harga & Stok — side by side */}
                <div style={{ display: 'flex', gap: 14, marginBottom: 18, alignItems: 'flex-end' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', display: 'block', marginBottom: 6 }}>
                      Harga (Rp)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{
                        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                        fontSize: 13, color: '#9ca3af', fontWeight: 600,
                      }}>Rp</span>
                      <input
                        type="number"
                        value={form.harga}
                        onChange={e => setForm(f => ({ ...f, harga: e.target.value }))}
                        required min="0" placeholder="12000"
                        style={{
                          width: '100%', padding: '12px 14px 12px 36px',
                          background: '#FFF5F8', border: '1.5px solid #fce4ec',
                          borderRadius: 12, fontSize: 14, fontWeight: 700,
                          outline: 'none', boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', display: 'block', marginBottom: 6 }}>
                      Stok
                    </label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        type="number"
                        value={form.stok}
                        onChange={e => setForm(f => ({ ...f, stok: e.target.value }))}
                        required min="0" placeholder="0"
                        style={{
                          width: '100%', padding: '12px 14px',
                          background: '#FFF5F8', border: '1.5px solid #fce4ec',
                          borderRadius: 12, fontSize: 14,
                          outline: 'none', boxSizing: 'border-box',
                        }}
                      />
                      {stockInfo && (
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '4px 10px',
                          borderRadius: 99, background: stockInfo.dot + '22', color: stockInfo.dot,
                          flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth:'70px',
                        }}>
                          {form.stok == 0 ? 'HABIS' : Number(form.stok) <= 10 ? 'MENIPIS' : 'AMAN'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Kategori */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', display: 'block', marginBottom: 10 }}>
                    Kategori
                  </label>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {kategori.map(k => (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, kategori: k.id }))}
                        style={{
                          padding: '9px 20px', borderRadius: 99, fontSize: 13, fontWeight: 600,
                          cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                          background: form.kategori == k.id ? '#A32A58' : '#FCE4EC',
                          color: form.kategori == k.id ? '#fff' : '#A32A58',
                          display: 'flex', alignItems: 'center', gap: 6,
                        }}
                      >
                        {form.kategori == k.id && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                        {k.nama}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Deskripsi card */}
              <div style={{
                background: '#fff', borderRadius: 20,
                padding: '20px 22px', boxShadow: '0 1px 10px rgba(163,42,88,0.07)',
              }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', display: 'block', marginBottom: 6 }}>
                  Deskripsi
                </label>
                <textarea
                  value={form.deskripsi}
                  onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))}
                  rows={5}
                  placeholder="Deskripsi produk..."
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: '#FFF5F8', border: '1.5px solid #fce4ec',
                    borderRadius: 12, fontSize: 14, outline: 'none',
                    resize: 'vertical', boxSizing: 'border-box',
                    fontFamily: 'inherit', lineHeight: 1.6,
                  }}
                />
              </div>

              {/* Error */}
              {error && (
                <p style={{ color: '#ef4444', fontSize: 13, textAlign: 'center' }}>{error}</p>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  style={{
                    padding: '13px 32px', background: '#fff',
                    color: '#6b7280', fontSize: 14, fontWeight: 600,
                    border: '1.5px solid #e5e7eb', borderRadius: 14, cursor: 'pointer',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '13px 40px', background: '#A32A58',
                    color: '#fff', fontSize: 14, fontWeight: 700,
                    border: 'none', borderRadius: 14,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1, transition: 'opacity 0.18s',
                  }}
                >
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>

            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
