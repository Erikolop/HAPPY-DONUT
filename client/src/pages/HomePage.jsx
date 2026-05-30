import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import { getAllKatalog } from '../api/katalog'
import { getAllKategori } from '../api/kategori'

export default function HomePage() {
  const navigate = useNavigate()
  const [katalog, setKatalog] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [kategori, setKategori] = useState([])
  const [activeKat, setActiveKat] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getAllKatalog(), getAllKategori()])
      .then(([items, cats]) => {
        setKatalog(items)
        setKategori(cats)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = katalog.filter(item => {
    const matchCat = activeKat === 'All' || item.kategori_nama === activeKat
    const matchSearch = item.nama_katalog.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleSearch = ()=>{
    setSearch(searchInput)
  }

  const handleKeyDown = (e)=>{
    if (e.key === 'Enter') handleSearch()
  }

  return (
    // Full page layout wrapper
<div style={{ minHeight: '100vh', background: '#FFF5F8' }}>

  {/* ── NAVBAR ── */}
  <header style={{
    background: '#fff',
    borderBottom: '1.5px solid #fce4ec',
    boxShadow: '0 2px 12px rgba(163,42,88,0.06)',
    position: 'sticky', top: 0, zIndex: 50,
  }}>
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: '0 24px',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      {/* Left: Brand / existing Header content */}
      <Header />

      {/* Right: Admin Login */}
      <button
        onClick={() => navigate('/admin/login')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '8px 18px',
          borderRadius: 10,
          border: '1.5px solid #A32A58',
          background: 'transparent',
          color: '#A32A58',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          letterSpacing: '0.02em',
          transition: 'all 0.18s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#A32A58';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#A32A58';
        }}
      >
        {/* Lock icon */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Admin
      </button>
    </div>
  </header>

  {/* ── MAIN CONTENT ── */}
  <main style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px 48px' }}>

    {/* Search */}
<div style={{ position: 'relative', marginBottom: 22, maxWidth: 480 }}>
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
  >
    <svg
      width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="#A32A58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
    </svg>
  </button>

  <input
    type="text"
    placeholder="Search your favorite donut..."
    value={searchInput}
    onChange={e => setSearchInput(e.target.value)}
    onKeyDown={handleKeyDown}
    style={{
      width: '100%', padding: '13px 16px 13px 42px',
      background: '#fff', border: '1.5px solid #fce4ec',
      borderRadius: 14, fontSize: 14, color: '#1a1a1a',
      outline: 'none', boxSizing: 'border-box',
      boxShadow: '0 1px 6px rgba(163,42,88,0.05)',
    }}
  />
</div>

    {/* Category Pills */}
    <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
      {['All', ...kategori.map(k => k.nama)].map(cat => (
        <button
          key={cat}
          onClick={() => setActiveKat(cat)}
          style={{
            padding: '7px 20px', borderRadius: 99, fontSize: 13, fontWeight: 600,
            border: 'none', cursor: 'pointer', transition: 'all 0.18s',
            background: activeKat === cat ? '#A32A58' : '#FCE4EC',
            color: activeKat === cat ? '#fff' : '#A32A58',
          }}
        >{cat}</button>
      ))}
    </div>

    {/* Product Grid — responsive: 2 cols mobile → 3 cols md → 4 cols lg */}
    {loading && (
      <div style={{ textAlign: 'center', padding: '64px 0', color: '#A32A58', fontSize: 14 }}>
        Memuat produk...
      </div>
    )}
    {error && (
      <div style={{ textAlign: 'center', padding: '64px 0', color: '#ef4444', fontSize: 14 }}>
        {error}
      </div>
    )}
    {!loading && !error && (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 18,
      }}>
        {filtered.length === 0
          ? <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#9ca3af', paddingTop: 40, fontSize: 14 }}>
              Tidak ada produk ditemukan.
            </p>
          : filtered.map(item => <ProductCard key={item.id_katalog} item={item} />)
        }
      </div>
    )}
  </main>
</div>
  )
}
