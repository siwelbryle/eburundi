// Mock catalog used across storefront pages until Phase 2 wires up real DB reads.
export type Product = {
  id: string;
  slug: string;
  seller: string;
  sellerSlug: string;
  category: string;
  categorySlug: string;
  title: string;
  description: string;
  image: string;
  gallery: string[];
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  stock: number;
  flash?: boolean;
  discount?: number;
};

export const CATEGORIES = [
  { name: "Automotive", slug: "automotive", emoji: "🚗" },
  { name: "Baby Products", slug: "baby", emoji: "🍼" },
  { name: "Beauty & Health", slug: "beauty", emoji: "💄" },
  { name: "Books", slug: "books", emoji: "📚" },
  { name: "Computers", slug: "computers", emoji: "💻" },
  { name: "Electronics", slug: "electronics", emoji: "📱" },
  { name: "Fashion", slug: "fashion", emoji: "👗" },
  { name: "Furniture", slug: "furniture", emoji: "🛋️" },
  { name: "Garden", slug: "garden", emoji: "🌱" },
  { name: "Groceries", slug: "groceries", emoji: "🛒" },
];

const SELLERS = [
  { name: "UBWIZA", slug: "ubwiza", tagline: "Home & lifestyle from Bujumbura" },
  { name: "KIRUNDO", slug: "kirundo", tagline: "Fashion made in Burundi" },
  { name: "RUYUBU", slug: "ruyubu", tagline: "Electronics & accessories" },
  { name: "KARAMA", slug: "karama", tagline: "Everyday essentials" },
  { name: "PEAK", slug: "peak", tagline: "Sports & outdoor" },
  { name: "SUNSET", slug: "sunset", tagline: "Beauty & wellness" },
  { name: "TANGANYIKA", slug: "tanganyika", tagline: "Fresh groceries" },
  { name: "RUMONGE", slug: "rumonge", tagline: "Books & stationery" },
  { name: "NGOZI", slug: "ngozi", tagline: "Baby & kids" },
  { name: "NOVA", slug: "nova", tagline: "Computers & office" },
];

export const STORES = SELLERS;

const IMAGES = [
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1439337153520-7082a56a81f4?auto=format&fit=crop&w=800&q=70",
  "https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?auto=format&fit=crop&w=800&q=70",
];

const TITLES = [
  "Modern Phone Mount", "Eco Bluetooth Speaker", "Deluxe Feeding Set", "Smart Tea Selection",
  "Vibrant Bookshelf", "Elegant Screen Protector", "Modern Baby Carrier", "Eco Cat Tree",
  "Modern Anklet", "Pro Webcam", "Modern Filing Box", "Classic Leather Wallet",
  "Premium Wireless Buds", "Solar Garden Lamp", "Organic Face Cream", "Hand-woven Basket",
  "Kitenge Wrap Dress", "USB-C Fast Charger", "Reusable Water Bottle", "Kids Learning Tablet",
];

function seeded(i: number, mod: number) {
  return ((i * 9301 + 49297) * 233280) % mod;
}

export const PRODUCTS: Product[] = Array.from({ length: 60 }, (_, i) => {
  const seller = SELLERS[i % SELLERS.length];
  const category = CATEGORIES[i % CATEGORIES.length];
  const title = TITLES[i % TITLES.length];
  const price = 15_000 + seeded(i + 1, 60) * 5_000;
  const discount = 15 + (seeded(i + 3, 35));
  const compareAt = Math.round((price / (1 - discount / 100)) / 100) * 100;
  const flash = seeded(i + 7, 5) === 0;
  const img = IMAGES[i % IMAGES.length];
  return {
    id: `p-${i + 1}`,
    slug: `p-${i + 1}`,
    seller: seller.name,
    sellerSlug: seller.slug,
    category: category.name,
    categorySlug: category.slug,
    title: `${title} #${i + 1}`,
    description:
      "Carefully sourced by a verified Burundian seller. Quality checked, fast delivery in Bujumbura and beyond. 30-day return policy.",
    image: img,
    gallery: [img, IMAGES[(i + 1) % IMAGES.length], IMAGES[(i + 2) % IMAGES.length], IMAGES[(i + 3) % IMAGES.length]],
    price,
    compareAt,
    rating: 3.2 + (seeded(i + 2, 18) / 10),
    reviews: 5 + seeded(i + 4, 220),
    stock: 3 + seeded(i + 5, 50),
    flash,
    discount,
  };
});

export function fmtFbu(n: number) {
  return "FBu " + Math.round(n).toLocaleString("en-US");
}

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id || p.slug === id);
}

export function getStore(slug: string) {
  return STORES.find((s) => s.slug === slug);
}

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}
