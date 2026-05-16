import { formatPrice, getStockStatus } from "../data/products";
import "./ProductCard.css";

function ProductCard({ product }) {
  const status = getStockStatus(product.stock);
  const isEmpty = status.level === "empty";

  return (
    <article className={`product-card ${isEmpty ? "is-empty" : ""}`}>
      <div className="product-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {isEmpty && <span className="product-badge-habis">Habis</span>}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className={`product-stock product-stock--${status.level}`}>
          <span className="product-stock-dot" aria-hidden="true"></span>
          <span className="product-stock-label">{status.label}</span>
        </div>
        <p className="product-price">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}

export default ProductCard;
