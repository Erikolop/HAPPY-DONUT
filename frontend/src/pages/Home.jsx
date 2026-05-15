import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";
import { CATEGORIES, products } from "../data/products";
import "./Home.css";

function Home({ initialCategory = "All" }) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="home">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CategoryTabs
        categories={CATEGORIES}
        active={activeCategory}
        onChange={setActiveCategory}
      />
      <main className="home-content">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-title">Donat tidak ditemukan</p>
            <p className="empty-state-subtitle">
              Coba kata kunci atau kategori lain.
            </p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
