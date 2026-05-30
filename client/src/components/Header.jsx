import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Header({ showBack = false, backTo = '/' }) {
  const navigate = useNavigate()

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '20px 0 12px',
      cursor: showBack ? 'default' : 'pointer'
    }}
      onClick={() => !showBack && navigate('/')}
    >
      {showBack && (
        <button
          onClick={() => navigate(backTo)}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#FCE4EC',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            marginRight: 4
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A32A58" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
      )}
      <img
        src="/images/solar_donut-bitten-bold-duotone.png"
        alt="logo"
        style={{ width: 32, height: 32, objectFit: 'contain' }}
      />
      <h1 style={{
        fontSize: 22,
        fontWeight: 800,
        color: '#A32A58',
        letterSpacing: '-0.5px'
      }}>
        Happy Donut
      </h1>
    </div>
  )
}
