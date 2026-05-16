export const CATEGORIES = ["All", "Glazed", "Sprinkle"];

export const products = [
  {
    id: 1,
    name: "Classic Glazed",
    description: "Lumer Dimulut",
    price: 12000,
    stock: 25,
    category: "Glazed",
    image:
      "https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Chocolate Sprinkle",
    description: "Coklat Premium",
    price: 15000,
    stock: 5,
    category: "Sprinkle",
    image:
      "https://images.unsplash.com/photo-1581873372796-635b67ca2008?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Strawberry Crumb",
    description: "Glaze Strawberry",
    price: 16000,
    stock: 0,
    category: "Glazed",
    image:
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Matcha Ci",
    description: "Matcha Premium",
    price: 18000,
    stock: 18,
    category: "Glazed",
    image:
      "https://images.unsplash.com/photo-1606101205828-bd24c1d4cd24?w=400&h=400&fit=crop",
  },
  {
    id: 5,
    name: "Taro Velvet",
    description: "Taro lumer",
    price: 17000,
    stock: 22,
    category: "Sprinkle",
    image:
      "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=400&fit=crop",
  },
  {
    id: 6,
    name: "Blueberry Pop",
    description: "Ada Scrumble Berry",
    price: 15000,
    stock: 3,
    category: "Sprinkle",
    image:
      "https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=400&h=400&fit=crop",
  },
];

export function getStockStatus(stock) {
  if (stock === 0) return { label: "Stok Kosong", level: "empty" };
  if (stock <= 5) return { label: `Sisa ${stock}`, level: "low" };
  return { label: "Stok Melimpah", level: "high" };
}

export function formatPrice(price) {
  if (price >= 1000) {
    const k = price / 1000;
    return `Rp ${Number.isInteger(k) ? k : k.toFixed(1)}k`;
  }
  return `Rp ${price}`;
}
