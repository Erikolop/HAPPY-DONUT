import { useEffect } from 'react';
import { formatPrice, getStockStatus } from '../data/products';
import './ProductModal.css';

function ProductModal({ product, onClose }) {
  const name     = product.nama_katalog ?? product.name ?? '';
  const desc     = product.deskripsi ?? product.description ?? '';
  const price    = product.harga ?? product.price ?? 0;
  const stock    = product.stok ?? product.stock ?? 0;
  const image    = product.gambar ?? product.image ?? '';
  const category = product.kategori ?? product.category ?? '';

  const status  = getStockStatus(stock);
  const isEmpty = status.level === 'empty';

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="pm-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pm-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="pm-close" onClick={onClose} aria-label="Tutup">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Image */}
        <div className={`pm-image-wrap ${isEmpty ? 'pm-image-wrap--empty' : ''}`}>
          <img src={image} alt={name} className="pm-image" />
          {isEmpty && <span className="pm-badge-habis">Habis</span>}
        </div>

        {/* Content */}
        <div className="pm-body">
          <div className="pm-meta">
            {category && <span className="pm-category">{category}</span>}
            <span className={`pm-stock pm-stock--${status.level}`}>
              <span className="pm-stock-dot" />
              {status.label.toUpperCase()}
            </span>
          </div>

          <h2 className="pm-name">{name}</h2>
          <p className="pm-price">{formatPrice(price)}</p>

          {desc && (
            <div className="pm-desc-box">
              <p className="pm-desc">{desc}</p>
            </div>
          )}

          <div className="pm-info-grid">
            <div className="pm-info-item">
              <svg className="pm-info-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <div>
                <span className="pm-info-label">Stok</span>
                <span className="pm-info-value">{stock} pcs</span>
              </div>
            </div>
            <div className="pm-info-item">
              <svg className="pm-info-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M12 6v6l4 2" />
              </svg>
              <div>
                <span className="pm-info-label">Kategori</span>
                <span className="pm-info-value">{category || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
