import React from 'react'

export function getStockInfo(stok) {
  if (stok === 0) return { text: 'Stok Kosong', dot: '#ef4444', label: 'STOK KOSONG' }
  if (stok <= 10) return { text: `Sisa ${stok}`, dot: '#f97316', label: `SISA ${stok}` }
  return { text: 'Stok Melimpah', dot: '#22c55e', label: 'STOK MELIMPAH' }
}

export default function StockBadge({ stok, uppercase = false }) {
  const info = getStockInfo(stok)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: info.dot, flexShrink: 0
      }} />
      <span style={{
        fontSize: uppercase ? 11 : 11,
        fontWeight: 600,
        color: '#6b7280',
        textTransform: uppercase ? 'uppercase' : 'none',
        letterSpacing: uppercase ? '0.06em' : 0
      }}>
        {uppercase ? info.label : info.text}
      </span>
    </div>
  )
}
