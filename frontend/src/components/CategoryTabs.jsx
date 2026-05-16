import "./CategoryTabs.css";

function CategoryTabs({ categories, active, onChange }) {
  return (
    <div className="category-tabs" role="tablist">
      {categories.map((cat) => (
        <button
          key={cat}
          role="tab"
          aria-selected={active === cat}
          className={`category-tab ${active === cat ? "active" : ""}`}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;
