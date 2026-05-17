import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchKatalog, deleteProduk } from '../services/api';
import { formatPrice, getStockStatus } from '../data/products';
import './StockManagement.css';

function DeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="sm-overlay" role="dialog" aria-modal="true">
      <div className="sm-modal">
        <div className="sm-modal-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h2 className="sm-modal-title">Hapus Produk?</h2>
        <p className="sm-modal-text">Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.</p>
        <button className="sm-modal-btn sm-modal-btn--danger" onClick={onConfirm}>Hapus</button>
        <button className="sm-modal-btn sm-modal-btn--cancel" onClick={onCancel}>Batal</button>
      </div>
    </div>
  );
}

function StockManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const highlightId = location.state?.highlight;
  const highlightRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

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

  useEffect(() => {
    if (highlightId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightId, products]);

  const filtered = products.filter((p) => {
    const name = p.nama_katalog ?? p.name ?? '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduk(deleteTarget.id_katalog ?? deleteTarget.id);
      setDeleteTarget(null);
      loadProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="sm-page">
      {/* Visible only on mobile when the sidebar is hidden */}
      <header className="sm-mobile-header">
        <button
          className="sm-back-btn"
          onClick={() => navigate('/admin/dashboard')}
          aria-label="Kembali"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h1 className="sm-mobile-title">Tambah Stok</h1>
      </header>

      <div className="sm-body">
        {/* Desktop page title — visible only alongside the sidebar */}
        <div className="sm-desktop-header">
          <div>
            <h1 className="sm-title">Manajemen Stok</h1>
            <p className="sm-subtitle">Kelola semua produk dan stok Anda</p>
          </div>
          <button className="sm-add-btn" onClick={() => navigate('/admin/produk/tambah')}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Tambah Produk
          </button>
        </div>

        {/* Mobile add button */}
        <button
          className="sm-add-btn sm-add-btn--mobile"
          onClick={() => navigate('/admin/produk/tambah')}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Produk Baru
        </button>

        <div className="sm-search-bar">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="sm-search"
            type="text"
            className="sm-search-input"
            placeholder="Search donuts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && <p className="sm-state">Memuat produk...</p>}
        {error && <p className="sm-state sm-state--error">{error}</p>}

        {!loading && !error && (
          <ul className="sm-list">
            {filtered.map((p) => {
              const id = p.id_katalog ?? p.id;
              const name = p.nama_katalog ?? p.name ?? '';
              const stok = p.stok ?? p.stock ?? 0;
              const price = p.harga ?? p.price ?? 0;
              const image = p.gambar ?? p.image ?? '';
              const status = getStockStatus(stok);
              const isEmpty = stok === 0;
              const isHighlighted = highlightId && String(id) === String(highlightId);

              return (
                <li
                  key={id}
                  className={`sm-card ${isHighlighted ? 'sm-card--highlighted' : ''}`}
                  ref={isHighlighted ? highlightRef : null}
                >
                  <div className="sm-thumb-wrap">
                    <img
                      src={image}
                      alt={name}
                      className={`sm-thumb ${isEmpty ? 'sm-thumb--empty' : ''}`}
                      loading="lazy"
                    />
                  </div>
                  <div className="sm-info">
                    <p className={`sm-name ${isEmpty ? 'sm-name--empty' : ''}`}>{name}</p>
                    <p className="sm-price">{formatPrice(price)}</p>
                    <div className={`sm-stock sm-stock--${status.level}`}>
                      <span className="sm-dot" />
                      <span>STOK: {isEmpty ? 'HABIS' : stok}</span>
                    </div>
                  </div>
                  <div className="sm-actions">
                    <button
                      className="sm-action-btn"
                      onClick={() => navigate(`/admin/produk/edit/${id}`)}
                      aria-label={`Edit ${name}`}
                    >
                      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      className="sm-action-btn sm-action-btn--delete"
                      onClick={() => setDeleteTarget(p)}
                      aria-label={`Hapus ${name}`}
                    >
                      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" /><path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </div>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="sm-empty">Tidak ada produk ditemukan.</li>
            )}
          </ul>
        )}
      </div>

      {deleteTarget && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

export default StockManagement;
