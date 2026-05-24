import React, { useState, useEffect } from 'react'
import { useAsyncError, useNavigate } from 'react-router-dom'
import { getAllKatalog, deleteKatalog } from '../../api/katalog'
import { getStockInfo } from '../../components/StockBadge'

export default function ManageStokPage() {
  const navigate = useNavigate()
  const [katalog, setKatalog] = useState([])
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  const load = () => {
    setLoading(true)
    getAllKatalog()
      .then(setKatalog)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = katalog.filter(item =>
    item.nama_katalog.toLowerCase().includes(search.toLowerCase())
  )

  const handleSearch = ()=>{
    setSearch(searchInput)
  }

  const handleKeyDown = (e)=>{
    if (e.key === 'Enter') handleSearch()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus produk ini?')) return
    setDeleting(id)
    try {
      await deleteKatalog(id)
      load()
    } catch (err) {
      alert(err.message)
    } finally {
      setDeleting(null)
    }
  }

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
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Left: back + brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          onClick={() => navigate('/admin/dashboard')}
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
        <img src="/images/solar_donut-bitten-bold-duotone.png" alt="logo" style={{ width: 28, height: 28 }} />
        <span style={{ fontSize: 18, fontWeight: 800, color: '#A32A58' }}>Happy Donut</span>
        <span style={{
          fontSize: 14, color: '#9ca3af',
          borderLeft: '1.5px solid #fce4ec', paddingLeft: 14, marginLeft: 4,
        }}>
        </span>
      </div>

      {/* Right: Add Product button */}
      <button
        onClick={() => navigate('/admin/produk/baru')}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '8px 18px', borderRadius: 10,
          background: '#A32A58', border: 'none',
          color: '#fff', fontSize: 13, fontWeight: 700,
          cursor: 'pointer', transition: 'opacity 0.18s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Tambah Produk Baru
      </button>
    </div>
  </header>

  {/* ── Main ── */}
  <main style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px 60px' }}>

    <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a1a', marginBottom: 24 }}>
      Tambah Stok
    </h1>

    {/* Search */}
    <div style={{ position: 'relative', marginBottom: 24, maxWidth: 480 }}>
      <button
    onClick={handleSearch}
    style={{
      position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
      background: 'none', border: 'none', padding: 0, cursor: 'pointer',
      display: 'flex', alignItems: 'center', opacity: 0.5,
      transition: 'opacity 0.18s',
    }}
    onMouseEnter={e => e.currentTarget.style.opacity = 1}
    onMouseLeave={e => e.currentTarget.style.opacity = 0.5}
    aria-label="Search"
  ><svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="#A32A58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg></button>
      
      <input
        type="text"
        placeholder="Search donuts..."
        value={searchInput}
        onChange={e => setSearchInput(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%', padding: '13px 16px 13px 42px',
          background: '#fff', border: '1.5px solid #fce4ec',
          borderRadius: 14, fontSize: 14, outline: 'none', boxSizing: 'border-box',
        }}
      />
    </div>

    {/* Product Grid */}
    {loading && (
      <p style={{ textAlign: 'center', color: '#9ca3af', padding: '48px 0', fontSize: 14 }}>Memuat...</p>
    )}

    {!loading && filtered.length === 0 && (
      <p style={{ textAlign: 'center', color: '#9ca3af', paddingTop: 40, fontSize: 14 }}>Tidak ada produk.</p>
    )}

    {!loading && (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 14,
      }}>
        {filtered.map(item => {
          const info = getStockInfo(item.stok)
          const isOut = item.stok === 0
          return (
            <div
              key={item.id_katalog}
              style={{
                background: '#fff', borderRadius: 16, padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: '0 1px 6px rgba(163,42,88,0.06)',
              }}
            >
              {/* Thumbnail */}
              <div style={{
                width: 70, height: 70, borderRadius: 12, overflow: 'hidden',
                background: '#FFF5F8', flexShrink: 0,
              }}>
                {item.gambar
                  ? <img src={item.gambar} alt={item.nama_katalog} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 30 }}>🍩</div>
                }
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 2,
                  textDecoration: isOut ? 'line-through' : 'none',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {item.nama_katalog}
                </p>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#A32A58', marginBottom: 3 }}>
                  Rp {Math.round(item.harga / 1000)}k
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: info.dot, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>
                    STOK: {isOut ? 'HABIS' : item.stok}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => navigate(`/admin/produk/edit/${item.id_katalog}`)}
                  style={{
                    width: 34, height: 34, borderRadius: 10, background: '#FFF5F8',
                    border: '1px solid #fce4ec', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A32A58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(item.id_katalog)}
                  disabled={deleting === item.id_katalog}
                  style={{
                    width: 34, height: 34, borderRadius: 10, background: '#fff5f5',
                    border: '1px solid #fecaca', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer',
                    opacity: deleting === item.id_katalog ? 0.5 : 1,
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                  </svg>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    )}
  </main>
</div>
  )
}
