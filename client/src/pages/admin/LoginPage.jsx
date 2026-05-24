import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { loginAdmin } from '../../api/admin'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await loginAdmin(username, password)
      login(data.admin)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF5F8', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
      overflow: 'hidden', }}>

      <img
        src="/images/croisant.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: -10,
          left: -20,
          width: 260,
          pointerEvents: 'none',
          zIndex: 0,
          transform: 'rotate(-15deg)',
        }}
      />

      {/* ── Responsive wrapper: stacks on mobile, side-by-side on desktop ── */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        maxWidth: 900,
        minHeight: 600,
        margin: '32px 16px',
        borderRadius: 28,
        overflow: 'hidden',
        boxShadow: '0 8px 48px rgba(163,42,88,0.13)',
        background: '#fff',
        
      }}>


        {/* ── LEFT PANEL: Brand + Hero Image ── */}
        <div style={{
          flex: '1 1 340px',
          background: '#FFF5F8',
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 24px 28px',
          minWidth: 0,
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <img
              src="/images/solar_donut-bitten-bold-duotone.png"
              alt="Happy Donut logo"
              style={{ width: 32, height: 32, objectFit: 'contain' }}
            />
            <span style={{ fontSize: 22, fontWeight: 800, color: '#A32A58' }}>Happy Donut</span>
          </div>

          {/* Hero Image */}
          <div style={{
            flex: 1,
            borderRadius: 20,
            overflow: 'hidden',
            background: '#fce4ec',
            minHeight: 200,
            maxHeight: 480,
          }}>
            <img
              src="/images/AB6AXuC04TD0-LI5uFb-e3ck7qxK2yz1oIzSk7iTlzZlufv1wFtebGG0a7xPicr6pgTVSQzPd5U3fPEIsmdEPynwCah9wHylqgpcPoxLwaZchFyVPkMHdoms9ZNMX_P5dnGNlY_cLRIGrfDos3fNjk12sobMDq-D7QE-RJ-FoMPwAKTJHNzaICgf0HsNsy2d4dTeHmB-J4.png"
              alt="Fresh glazed donuts"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* ── RIGHT PANEL: Form ── */}
        <div style={{
          flex: '1 1 320px',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px 36px',
          minWidth: 0,
        }}>
          <h2 style={{
            fontSize: 28, fontWeight: 800, color: '#1a1a1a',
            textAlign: 'center', marginBottom: 8, marginTop: 0,
          }}>
            Admin Access
          </h2>
          <p style={{
            fontSize: 14, color: '#9ca3af', textAlign: 'center',
            marginBottom: 32, lineHeight: 1.6,
          }}>
            Manage your sweet inventory and orders
          </p>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                fontSize: 11, fontWeight: 700, color: '#6b7280',
                textTransform: 'uppercase', letterSpacing: '0.07em',
                display: 'block', marginBottom: 6,
              }}>
                Email or Username
              </label>
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}
                  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A32A58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  type="text"
                  placeholder="admin@happydonut.com"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '14px 16px 14px 44px',
                    background: '#FFF5F8', border: '1.5px solid #fce4ec',
                    borderRadius: 14, fontSize: 14, color: '#1a1a1a',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{
                fontSize: 11, fontWeight: 700, color: '#6b7280',
                textTransform: 'uppercase', letterSpacing: '0.07em',
                display: 'block', marginBottom: 6,
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}
                  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A32A58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '14px 44px',
                    background: '#FFF5F8', border: '1.5px solid #fce4ec',
                    borderRadius: 14, fontSize: 14, color: '#1a1a1a',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0, opacity: 0.5,
                  }}
                >
                  {showPw
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A32A58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A32A58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                  }
                </button>
              </div>
            </div>

            {error && (
              <p style={{ color: '#ef4444', fontSize: 13, textAlign: 'center', marginBottom: 14 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '16px',
                background: '#A32A58', color: '#fff',
                fontSize: 16, fontWeight: 700,
                border: 'none', borderRadius: 14,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Masuk...' : 'Login'}
              {!loading && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none', border: 'none',
                color: '#9ca3af', fontSize: 13,
                cursor: 'pointer', textDecoration: 'underline',
              }}
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
