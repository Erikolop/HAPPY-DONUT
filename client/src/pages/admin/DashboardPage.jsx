import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getAllKatalog } from '../../api/katalog'
import StockBadge, { getStockInfo } from '../../components/StockBadge'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { admin, logout } = useAuth()
  const [katalog, setKatalog] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllKatalog()
      .then(setKatalog)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const lowStock = katalog.filter(item => item.stok <= 10)
  const fastestHabis = katalog.filter(item => item.stok === 0 || item.stok <= 10).slice(0, 4)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
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
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/images/solar_donut-bitten-bold-duotone.png" alt="logo" style={{ width: 28, height: 28 }} />
            <span style={{ fontSize: 18, fontWeight: 800, color: '#A32A58' }}>Happy Donut</span>
          </div>

          {/* Right: Add Product + Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
              Tambah Produk
            </button>

            <button
              onClick={handleLogout}
              style={{
                background: '#FCE4EC', border: 'none',
                color: '#A32A58', fontSize: 13, fontWeight: 600,
                padding: '8px 18px', borderRadius: 10, cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px 60px' }}>

        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a', marginBottom: 28 }}>
          Dashboard Admin
        </h1>

        {/* ── Top Row: Low Stock Card + Manajemen Stok Card ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
          marginBottom: 36,
        }}>

          {/* Low Stock Alert */}
          {!loading && (
            <div style={{
              background: '#A32A58', borderRadius: 20,
              padding: '24px 28px', color: '#fff',
            }}>
              <p style={{
                fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.08em', opacity: 0.8, marginBottom: 8,
              }}>
                Stok Menipis
              </p>
              <p style={{ fontSize: 52, fontWeight: 800, lineHeight: 1, marginBottom: 6 }}>
                {String(lowStock.length).padStart(2, '0')}
              </p>
              <p style={{ fontSize: 14, opacity: 0.85 }}>Perlu segera restock</p>
            </div>
          )}

          {/* Manajemen Stok */}
          <div style={{
            background: '#FCE4EC', borderRadius: 20,
            padding: '24px 28px',
            display: 'flex', alignItems: 'center', gap: 20,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: '#fff', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#A32A58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1a1a1a', marginBottom: 4 }}>
                Manajemen Stok
              </h3>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 14, lineHeight: 1.5 }}>
                Perlu memperbarui menu hari ini atau menambah varian baru?
              </p>
              <button
                onClick={() => navigate('/admin/stok')}
                style={{
                  background: '#A32A58', color: '#fff',
                  fontSize: 13, fontWeight: 700,
                  padding: '10px 24px', border: 'none',
                  borderRadius: 12, cursor: 'pointer',
                  transition: 'opacity 0.18s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Update Menu
              </button>
            </div>
          </div>

        </div>

        {/* ── Paling Cepat Habis ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#A32A58">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a' }}>
              Paling Cepat Habis
            </h2>
          </div>

          {loading && <p style={{ color: '#9ca3af', fontSize: 14 }}>Memuat...</p>}
          {!loading && fastestHabis.length === 0 && (
            <p style={{ color: '#9ca3af', fontSize: 14 }}>Semua stok aman.</p>
          )}

          {/* Responsive grid: 1 col mobile → 2 col md → 3 col lg */}
          {!loading && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 20,
            }}>
              {fastestHabis.map(item => (
                <div key={item.id_katalog} style={{
                  background: '#fff', borderRadius: 18,
                  overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(163,42,88,0.07)',
                }}>
                  {/* Image */}
                  <div style={{ width: '100%', height: 180, background: '#FFF5F8', overflow: 'hidden' }}>
                    {item.gambar
                      ? <img src={item.gambar} alt={item.nama_katalog} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 60 }}>🍩</div>
                    }
                  </div>
                  {/* Info */}
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{item.nama_katalog}</p>
                      <StockBadge stok={item.stok} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{
                        background: '#1a1a1a', color: '#fff',
                        fontSize: 12, fontWeight: 700,
                        padding: '3px 12px', borderRadius: 99,
                      }}>
                        Rp {Math.round(item.harga / 1000)}k
                      </span>
                      <button
                        onClick={() => navigate(`/admin/produk/edit/${item.id_katalog}`)}
                        style={{
                          background: '#fff', border: '1.5px solid #A32A58',
                          color: '#A32A58', fontSize: 13, fontWeight: 700,
                          padding: '8px 20px', borderRadius: 10, cursor: 'pointer',
                          transition: 'all 0.18s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#A32A58'; e.currentTarget.style.color = '#fff' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#A32A58' }}
                      >
                        Tambah Stok
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
