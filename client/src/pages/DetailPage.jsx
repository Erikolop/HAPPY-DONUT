import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StockBadge from '../components/StockBadge'
import { getKatalogById } from '../api/katalog'

export default function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getKatalogById(id)
      .then(setItem)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const centerScreen = {
    minHeight: '100vh', background: '#FFF5F8',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  }

  if (loading) return (
    <div style={centerScreen}>
      <p style={{ color: '#A32A58', fontSize: 14 }}>Memuat...</p>
    </div>
  )

  if (error || !item) return (
    <div style={centerScreen}>
      <p style={{ color: '#ef4444', fontSize: 14 }}>{error || 'Produk tidak ditemukan'}</p>
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
          {/* Back button */}
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
          <img src="/images/solar_donut-bitten-bold-duotone.png" alt="logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
          <span style={{ fontSize: 20, fontWeight: 800, color: '#A32A58' }}>Happy Donut</span>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 60px' }}>

        {/* Two-column layout: image left, details right */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 36,
          alignItems: 'flex-start',
        }}>

          {/* ── LEFT: Product Image ── */}
          <div style={{ flex: '1 1 340px', minWidth: 0 }}>
            <div style={{
              width: '100%', aspectRatio: '1/1',
              borderRadius: 24, background: '#fff',
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 32px rgba(163,42,88,0.11)',
            }}>
              {item.gambar
                ? <img src={item.gambar} alt={item.nama_katalog} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ fontSize: 100 }}>🍩</div>
              }
            </div>
          </div>

          {/* ── RIGHT: Product Details ── */}
          <div style={{ flex: '1 1 340px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Badge Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{
                background: '#A32A58', color: '#fff',
                fontSize: 12, fontWeight: 700,
                padding: '5px 16px', borderRadius: 99,
              }}>
                {item.kategori_nama || 'Uncategorized'}
              </span>
              <StockBadge stok={item.stok} uppercase />
            </div>

            {/* Name */}
            <h2 style={{
              fontSize: 36, fontWeight: 800, color: '#1a1a1a',
              letterSpacing: '-0.5px', margin: 0, lineHeight: 1.2,
            }}>
              {item.nama_katalog}
            </h2>

            {/* Price */}
            <p style={{
              fontSize: 28, fontWeight: 700,
              color: '#A32A58', margin: 0,
            }}>
              Rp {Number(item.harga).toLocaleString('id-ID')}
            </p>

            {/* Divider */}
            <div style={{ height: 1, background: '#fce4ec', borderRadius: 99 }} />

            {/* Description */}
            <div style={{
              background: '#fff', borderRadius: 16,
              padding: '20px 22px',
              boxShadow: '0 1px 8px rgba(163,42,88,0.06)',
            }}>
              <p style={{
                fontSize: 13, fontWeight: 700, color: '#A32A58',
                textTransform: 'uppercase', letterSpacing: '0.07em',
                marginBottom: 10,
              }}>
                Deskripsi
              </p>
              <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.7, margin: 0 }}>
                {item.deskripsi || 'Tidak ada deskripsi.'}
              </p>
            </div>

            {/* Stock detail */}
            <div style={{
              background: '#fff', borderRadius: 16,
              padding: '16px 22px',
              boxShadow: '0 1px 8px rgba(163,42,88,0.06)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: '#FFF5F8', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A32A58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>Stok Tersedia</p>
                <p style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>{item.stok} pcs</p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}