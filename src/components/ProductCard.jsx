import { formatPrice, getStockStatus } from '../data/products';
import './ProductCard.css';

function ProductCard({ product }) {
  const name  = product.nama_katalog ?? product.name ?? '';
  const desc  = product.deskripsi ?? product.description ?? '';
  const price = product.harga ?? product.price ?? 0;
  const stock = product.stok ?? product.stock ?? 0;
  const image = product.gambar ?? product.image ?? '';

  const status  = getStockStatus(stock);
  const isEmpty = status.level === 'empty';

  return (
    <article className={`product-card ${isEmpty ? 'is-empty' : ''}`}>
      <div className="product-image-wrapper">
        <img
          src={image}
          alt={name}
          className="product-image"
          loading="lazy"
        />
        {isEmpty && <span className="product-badge-habis">Habis</span>}
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{desc}</p>
        <div className={`product-stock product-stock--${status.level}`}>
          <span className="product-stock-dot" aria-hidden="true" />
          <span className="product-stock-label">{status.label}</span>
        </div>
        <p className="product-price">{formatPrice(price)}</p>
      </div>
    </article>
  );
}

export default ProductCard;
