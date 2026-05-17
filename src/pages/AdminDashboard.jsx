import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchKatalog } from '../services/api';
import { formatPrice, getStockStatus } from '../data/products';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchKatalog();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const allStock = products.map((p) => p.stok ?? p.stock ?? 0);
  const lowStockItems = products.filter((_, i) => allStock[i] <= 5);
  const totalProducts = products.length;
  const totalStok = allStock.reduce((s, v) => s + v, 0);

  return (
    <div className="dash-page">
      {/* Mobile brand header — hidden when desktop sidebar is visible */}
      <header className="dash-mobile-header">
        <div className="dash-brand">
          <svg viewBox="0 0 64 64" width="28" height="28" aria-hidden="true">
            <circle cx="32" cy="32" r="28" fill="#a52545" />
            <circle cx="32" cy="32" r="9" fill="#fdf6f7" />
            <circle cx="22" cy="22" r="2.2" fill="#fdf6f7" />
            <circle cx="44" cy="24" r="1.8" fill="#f4a261" />
            <circle cx="46" cy="40" r="2" fill="#fdf6f7" />
            <circle cx="20" cy="42" r="1.6" fill="#f4a261" />
          </svg>
          <span className="dash-brand-name">Happy Donut</span>
        </div>
      </header>

      <div className="dash-content">
        <div className="dash-page-head">
          <div>
            <h1 className="dash-title">Dashboard Admin</h1>
            <p className="dash-sub">Selamat datang kembali. Pantau stok dan produk Anda.</p>
          </div>
          <button className="dash-add-btn" onClick={() => navigate('/admin/produk/tambah')}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah Produk Baru
          </button>
        </div>

      {loading && <p className="dash-loading">Memuat data...</p>}
      {error && <p className="dash-error">{error}</p>}

      {!loading && !error && (
        <>
          {/* Stok Menipis highlight card — matches mobile design */}
          <div className="dash-alert-card">
            <p className="dash-alert-label">STOK MENIPIS</p>
            <p className="dash-alert-count">{String(lowStockItems.length).padStart(2, '0')}</p>
            <p className="dash-alert-sub">Perlu segera restock</p>
          </div>

          {/* Stat row (desktop only) */}
          <div className="dash-stats">
            <div className="stat-card">
              <p className="stat-label">Total Produk</p>
              <p className="stat-value">{totalProducts}</p>
            </div>
            <div className="stat-card stat-card--warn">
              <p className="stat-label">Stok Menipis</p>
              <p className="stat-value">{lowStockItems.length}</p>
              <p className="stat-desc">Perlu segera restock</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Total Stok</p>
              <p className="stat-value">{totalStok}</p>
            </div>
          </div>

          {/* Critical items */}
          {lowStockItems.length > 0 && (
            <section className="dash-section">
              <div className="dash-section-head">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <h2 className="dash-section-title">Paling Cepat Habis</h2>
              </div>

              <div className="dash-critical-grid">
                {lowStockItems.map((p) => {
                  const id = p.id_katalog ?? p.id;
                  const stock = p.stok ?? p.stock ?? 0;
                  const status = getStockStatus(stock);
                  return (
                    <div key={id} className="crit-card">
                      <div className="crit-img-wrap">
                        <img src={p.gambar ?? p.image} alt={p.nama_katalog ?? p.name} className="crit-img" loading="lazy" />
                      </div>
                      <div className="crit-body">
                        <p className="crit-name">{p.nama_katalog ?? p.name}</p>
                        <div className="crit-row">
                          <span className="crit-price">{formatPrice(p.harga ?? p.price)}</span>
                          <div className={`crit-stock crit-stock--${status.level}`}>
                            <span className="crit-dot" />
                            <span>{status.label}</span>
                          </div>
                        </div>
                        <button className="crit-btn" onClick={() => navigate('/admin/stok', { state: { highlight: id } })}>
                          Tambah Stok
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Management shortcut */}
          <div className="dash-mgmt-card" onClick={() => navigate('/admin/stok')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && navigate('/admin/stok')}>
            <div className="dash-mgmt-icon">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="var(--color-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div className="dash-mgmt-text">
              <h3 className="dash-mgmt-title">Manajemen Stok</h3>
              <p className="dash-mgmt-sub">Perbarui menu atau tambah varian baru</p>
            </div>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </>
      )}
      </div>
    </div>
  );
}

export default AdminDashboard;
