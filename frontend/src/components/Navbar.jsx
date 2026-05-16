import "./Navbar.css";

function Navbar({ searchQuery, onSearchChange }) {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="navbar-logo" aria-hidden="true">
          <svg viewBox="0 0 64 64" width="40" height="40">
            <circle cx="32" cy="32" r="28" fill="#3a2c2c" />
            <circle cx="32" cy="32" r="9" fill="#fdf6f7" />
            <circle cx="22" cy="22" r="2.2" fill="#a52545" />
            <circle cx="44" cy="24" r="1.8" fill="#f4a261" />
            <circle cx="46" cy="40" r="2" fill="#e76f51" />
            <circle cx="20" cy="42" r="1.6" fill="#f4a261" />
            <circle cx="32" cy="14" r="1.6" fill="#a52545" />
            <circle cx="14" cy="32" r="1.8" fill="#e76f51" />
          </svg>
        </div>
        <h1 className="navbar-title">Happy Donut</h1>
      </div>
      <div className="navbar-search">
        <svg
          className="navbar-search-icon"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          className="navbar-search-input"
          placeholder="Search your favorite donut..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </header>
  );
}

export default Navbar;
