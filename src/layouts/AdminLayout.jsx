import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="al-root">
      <aside className="al-sidebar">
        <div className="al-sidebar-brand">
          <svg viewBox="0 0 64 64" width="32" height="32" aria-hidden="true">
            <circle cx="32" cy="32" r="28" fill="#fff" fillOpacity="0.15" />
            <circle cx="32" cy="32" r="28" fill="none" stroke="#fff" strokeWidth="2" />
            <circle cx="32" cy="32" r="9" fill="#fdf6f7" />
            <circle cx="22" cy="22" r="2.2" fill="#f4a261" />
            <circle cx="44" cy="24" r="1.8" fill="#f4a261" />
            <circle cx="46" cy="40" r="2" fill="#fdf6f7" />
            <circle cx="20" cy="42" r="1.6" fill="#f4a261" />
          </svg>
          <span className="al-brand-name">Happy Donut</span>
        </div>

        <nav className="al-nav">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => `al-nav-link ${isActive ? 'al-nav-link--active' : ''}`}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/stok"
            className={({ isActive }) => `al-nav-link ${isActive ? 'al-nav-link--active' : ''}`}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            <span>Manajemen Stok</span>
          </NavLink>

          <NavLink
            to="/admin/produk/tambah"
            className={({ isActive }) => `al-nav-link ${isActive ? 'al-nav-link--active' : ''}`}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <span>Tambah Produk</span>
          </NavLink>
        </nav>

        <div className="al-sidebar-footer">
          <a href="/" className="al-nav-link al-nav-link--ghost" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Lihat Katalog</span>
          </a>
          <button className="al-nav-link al-nav-link--logout" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="al-content">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
