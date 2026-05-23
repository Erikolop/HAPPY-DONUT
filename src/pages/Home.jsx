import { useMemo, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CategoryTabs from '../components/CategoryTabs';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { fetchKatalog } from '../services/api';
import { CATEGORIES } from '../data/products';
import './Home.css';

function Home({ initialCategory = 'All' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchKatalog();
        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const name = p.nama_katalog ?? p.name ?? '';
      const desc = p.deskripsi ?? p.description ?? '';
      const cat  = p.kategori ?? p.category ?? '';

      const matchesCategory = activeCategory === 'All' || cat === activeCategory;
      const matchesSearch = !q || name.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <div className="home">
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CategoryTabs
        categories={CATEGORIES}
        active={activeCategory}
        onChange={setActiveCategory}
      />
      <main className="home-content">
        {loading ? (
          <div className="empty-state">
            <p className="empty-state-title">Memuat katalog...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-title">Donat tidak ditemukan</p>
            <p className="empty-state-subtitle">Coba kata kunci atau kategori lain.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard
                key={p.id_katalog ?? p.id}
                product={p}
                onClick={() => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
