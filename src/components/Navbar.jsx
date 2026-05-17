import './Navbar.css';

function Navbar({ searchQuery, onSearchChange }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="navbar-logo" aria-hidden="true">
            <svg viewBox="0 0 64 64" width="38" height="38">
              <circle cx="32" cy="32" r="28" fill="#a52545" />
              <circle cx="32" cy="32" r="9" fill="#fdf6f7" />
              <circle cx="22" cy="22" r="2.2" fill="#fdf6f7" />
              <circle cx="44" cy="24" r="1.8" fill="#f4a261" />
              <circle cx="46" cy="40" r="2" fill="#fdf6f7" />
              <circle cx="20" cy="42" r="1.6" fill="#f4a261" />
              <circle cx="32" cy="14" r="1.6" fill="#fdf6f7" />
              <circle cx="14" cy="32" r="1.8" fill="#f4a261" />
            </svg>
          </div>
          <h1 className="navbar-title">Happy Donut</h1>
        </div>

        <div className="navbar-search">
          <svg
            className="navbar-search-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search your favorite donut..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Cari produk"
          />
        </div>

        <a href="/admin/login" className="navbar-admin-link">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Admin
        </a>
      </div>
    </header>
  );
}

export default Navbar;
