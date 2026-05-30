import React from 'react'
import { useNavigate } from 'react-router-dom'
import StockBadge, { getStockInfo } from './StockBadge'

export default function ProductCard({ item }) {
  const navigate = useNavigate()
  const info = getStockInfo(item.stok)
  const isOut = item.stok === 0

  return (
    <div
      onClick={() => !isOut && navigate(`/produk/${item.id_katalog}`)}
      style={{
        background: '#fff',
        borderRadius: 24,
        padding: 14,
        boxShadow: '0 1px 8px rgba(163,42,88,0.07)',
        border: '1px solid #fce4ec',
        display: 'flex',
        flexDirection: 'column',
        cursor: isOut ? 'not-allowed' : 'pointer',
        opacity: isOut ? 0.65 : 1,
        transition: 'transform 0.18s, box-shadow 0.18s',
        position: 'relative',
      }}
      onMouseEnter={e => { if (!isOut) { e.currentTarget.style.transform = 'scale(1.025)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(163,42,88,0.13)' } }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 1px 8px rgba(163,42,88,0.07)' }}
    >
      {/* Image */}
      <div style={{
        width: '100%', aspectRatio: '1/1', borderRadius: 16,
        background: '#FFF5F8', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 10, position: 'relative'
      }}>
        {item.gambar
          ? <img src={item.gambar} alt={item.nama_katalog} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ fontSize: 48 }}></div>
        }
        {isOut && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.18)',
            backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{
              background: '#ef4444', color: '#fff', fontSize: 11,
              fontWeight: 700, padding: '3px 14px', borderRadius: 99
            }}>Habis</span>
          </div>
        )}
      </div>

      {/* Info */}
      <h3 style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {item.nama_katalog}
      </h3>
      <div style={{ marginBottom: 6 }}>
        <StockBadge stok={item.stok} />
      </div>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#A32A58' }}>
        Rp {Number(item.harga).toLocaleString('id-ID')}
      </p>
    </div>
  )
}