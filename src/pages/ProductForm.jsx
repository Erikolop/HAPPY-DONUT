import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchKatalogById, createProduk, updateProduk } from '../services/api';
import './ProductForm.css';

const CATEGORIES = ['Glazed', 'Sprinkles'];

const EMPTY_FORM = {
  nama_katalog: '',
  harga: '',
  stok: '',
  kategori: 'Glazed',
  deskripsi: '',
};

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(isEdit);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const p = await fetchKatalogById(id);
        setForm({
          nama_katalog: p.nama_katalog ?? p.name ?? '',
          harga: String(p.harga ?? p.price ?? ''),
          stok: String(p.stok ?? p.stock ?? ''),
          kategori: p.kategori ?? p.category ?? 'Glazed',
          deskripsi: p.deskripsi ?? p.description ?? '',
        });
        const img = p.gambar ?? p.image ?? '';
        setExistingImageUrl(img);
        setPreviewUrl(img);
      } catch (err) {
        setFormError(err.message);
      } finally {
        setFetchingProduct(false);
      }
    };
    load();
  }, [id, isEdit]);

  // ── Image validation ─────────────────────────────
  const processFile = useCallback((file) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setFileError('Format tidak didukung. Gunakan JPG, PNG, atau WebP.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFileError('Ukuran file melebihi batas 2 MB.');
      return;
    }
    setFileError('');
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  // ── File input change ────────────────────────────
  const handleFileInput = (e) => {
    processFile(e.target.files?.[0]);
    e.target.value = '';
  };

  // ── Drag-and-drop handlers ───────────────────────
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  // ── Form field change ────────────────────────────
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ── Submit: build FormData and call API ──────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.nama_katalog.trim()) {
      setFormError('Nama produk wajib diisi.');
      return;
    }

    const fd = new FormData();
    fd.append('nama_katalog', form.nama_katalog.trim());
    fd.append('harga', form.harga || '0');
    fd.append('stok', form.stok || '0');
    fd.append('deskripsi', form.deskripsi.trim());

    if (imageFile) {
      // New file selected — multer will save to disk and return the /uploads/ path
      fd.append('gambar', imageFile);
    } else if (existingImageUrl) {
      // No new file — pass the existing URL so the controller keeps it
      fd.append('gambar_existing', existingImageUrl);
    }

    setLoading(true);
    try {
      if (isEdit) {
        await updateProduk(id, fd);
      } else {
        await createProduk(fd);
      }
      navigate('/admin/stok');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stockNum = Number(form.stok);
  const stockOk = form.stok !== '' && stockNum > 5;

  if (fetchingProduct) {
    return <div className="pf-page"><p className="pf-loading">Memuat produk...</p></div>;
  }

  return (
    <div className="pf-page">
      {/* Mobile header — hidden when desktop sidebar is visible */}
      <header className="pf-mobile-header">
        <button
          type="button"
          className="pf-back-btn"
          onClick={() => navigate('/admin/stok')}
          aria-label="Kembali"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h1 className="pf-mobile-title">{isEdit ? 'Edit Produk' : 'Tambah Produk'}</h1>
      </header>

      <div className="pf-inner">
        <div className="pf-head">
          <h1 className="pf-title">{isEdit ? 'Edit Produk' : 'Tambah Produk'}</h1>
          <p className="pf-sub">{isEdit ? 'Perbarui detail produk yang ada' : 'Isi detail untuk menambahkan produk baru'}</p>
        </div>

        <form className="pf-form" onSubmit={handleSubmit} noValidate>
          <div className="pf-grid">
            {/* Left column: image */}
            <div className="pf-col-img">
              <p className="pf-label">Foto Produk</p>
              <div
                ref={dropZoneRef}
                className={`pf-dropzone ${isDragging ? 'pf-dropzone--active' : ''} ${previewUrl ? 'pf-dropzone--filled' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                aria-label="Zona unggah foto"
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview produk" className="pf-preview" />
                    <div className="pf-preview-overlay">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      <span>Ganti Foto</span>
                    </div>
                  </>
                ) : (
                  <div className="pf-dropzone-placeholder">
                    {isDragging ? (
                      <>
                        <div className="pf-drop-icon pf-drop-icon--active">
                          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="var(--color-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="16 16 12 12 8 16" />
                            <line x1="12" y1="12" x2="12" y2="21" />
                            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                          </svg>
                        </div>
                        <p className="pf-drop-text">Lepaskan file di sini</p>
                      </>
                    ) : (
                      <>
                        <div className="pf-drop-icon">
                          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <p className="pf-drop-text">Seret &amp; lepas foto di sini</p>
                        <p className="pf-drop-hint">atau klik untuk memilih file</p>
                        <p className="pf-drop-format">JPG, PNG, WebP — Maks. 2MB</p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {fileError && <p className="pf-file-error">{fileError}</p>}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={handleFileInput}
              />
            </div>

            {/* Right column: fields */}
            <div className="pf-col-fields">
              <div className="pf-field">
                <label className="pf-label" htmlFor="pf-name">Nama Produk</label>
                <input
                  id="pf-name"
                  type="text"
                  className="pf-input"
                  placeholder="Misal: Strawberry Sprinkle Dream"
                  value={form.nama_katalog}
                  onChange={(e) => handleChange('nama_katalog', e.target.value)}
                  required
                />
              </div>

              <div className="pf-row">
                <div className="pf-field">
                  <label className="pf-label" htmlFor="pf-price">Harga (Rp)</label>
                  <div className="pf-prefix-wrap">
                    <span className="pf-prefix">Rp</span>
                    <input
                      id="pf-price"
                      type="number"
                      className="pf-input pf-input--prefixed"
                      placeholder="12000"
                      value={form.harga}
                      onChange={(e) => handleChange('harga', e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
                <div className="pf-field">
                  <label className="pf-label" htmlFor="pf-stock">Stok</label>
                  <div className="pf-suffix-wrap">
                    <input
                      id="pf-stock"
                      type="number"
                      className="pf-input"
                      placeholder="45"
                      value={form.stok}
                      onChange={(e) => handleChange('stok', e.target.value)}
                      min="0"
                    />
                    {form.stok !== '' && (
                      <span className={`pf-stock-badge pf-stock-badge--${stockOk ? 'ok' : 'warn'}`}>
                        {stockOk ? 'AMAN' : 'MENIPIS'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pf-field">
                <p className="pf-label">Kategori</p>
                <div className="pf-cats">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`pf-cat ${form.kategori === cat ? 'pf-cat--active' : ''}`}
                      onClick={() => handleChange('kategori', cat)}
                    >
                      {form.kategori === cat && (
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pf-field">
                <label className="pf-label" htmlFor="pf-desc">Deskripsi</label>
                <textarea
                  id="pf-desc"
                  className="pf-textarea"
                  placeholder="Jelaskan kelezatan donat ini..."
                  value={form.deskripsi}
                  onChange={(e) => handleChange('deskripsi', e.target.value)}
                  rows={4}
                />
              </div>

              {formError && <p className="pf-error">{formError}</p>}

              <div className="pf-actions">
                <button type="button" className="pf-btn pf-btn--cancel" onClick={() => navigate('/admin/stok')}>
                  Batal
                </button>
                <button type="submit" className="pf-btn pf-btn--submit" disabled={loading}>
                  {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan Produk'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
