// Diversified mock catalog for EBM — Burundi-relevant products, varied sellers,
// varied prices (8,000 – 950,000 FBu), varied ratings and reviews.
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
  { name: "UBWIZA Home", slug: "ubwiza", tagline: "Home & lifestyle from Bujumbura" },
  { name: "KIRUNDO Fashion", slug: "kirundo", tagline: "Fashion made in Burundi" },
  { name: "RUYUBU Electronics", slug: "ruyubu", tagline: "Electronics & accessories" },
  { name: "KARAMA Essentials", slug: "karama", tagline: "Everyday essentials" },
  { name: "PEAK Outdoors", slug: "peak", tagline: "Sports & outdoor" },
  { name: "SUNSET Beauty", slug: "sunset", tagline: "Beauty & wellness" },
  { name: "TANGANYIKA Fresh", slug: "tanganyika", tagline: "Fresh groceries from the lake" },
  { name: "RUMONGE Books", slug: "rumonge", tagline: "Books & stationery" },
  { name: "NGOZI Kids", slug: "ngozi", tagline: "Baby & kids" },
  { name: "NOVA Tech", slug: "nova", tagline: "Computers & office" },
];

export const STORES = SELLERS;

// Curated product list — real Burundi-relevant products across all categories.
type Seed = {
  title: string;
  desc: string;
  category: string;
  seller: string;
  price: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  flash?: boolean;
  stock: number;
};

const SEEDS: Seed[] = [
  // Electronics / Computers
  { title: "Tecno Spark 20 Smartphone 128GB", desc: "6.6\" display, 50MP camera, 5000mAh battery. Perfect daily phone.", category: "electronics", seller: "ruyubu", price: 385_000, discount: 12, rating: 4.5, reviews: 128, stock: 24, flash: true, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=70" },
  { title: "JBL Go 3 Portable Bluetooth Speaker", desc: "Waterproof, punchy sound, all-day battery. Great for the lakefront.", category: "electronics", seller: "ruyubu", price: 68_500, discount: 20, rating: 4.7, reviews: 342, stock: 60, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=70" },
  { title: "Anker PowerCore 20000mAh Power Bank", desc: "Two USB outputs, fast charge. Keeps you online during outages.", category: "electronics", seller: "ruyubu", price: 89_000, discount: 15, rating: 4.6, reviews: 210, stock: 45, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=70" },
  { title: "Samsung 32\" Smart TV (HD)", desc: "Wi-Fi, YouTube, Netflix built in. HDMI + USB inputs.", category: "electronics", seller: "ruyubu", price: 720_000, discount: 10, rating: 4.4, reviews: 88, stock: 6, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=70" },
  { title: "Sony WH-CH520 Wireless Headphones", desc: "50h battery, comfortable over-ear, deep bass.", category: "electronics", seller: "nova", price: 145_000, discount: 18, rating: 4.5, reviews: 76, stock: 20, flash: true, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=70" },
  { title: "Logitech M185 Wireless Mouse", desc: "Plug-and-play. 1-year battery. Reliable everyday mouse.", category: "computers", seller: "nova", price: 22_500, discount: 25, rating: 4.6, reviews: 512, stock: 120, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=70" },
  { title: "HP 15\" Laptop – Ryzen 5, 8GB, 512GB SSD", desc: "Great for office work and study. Full HD screen.", category: "computers", seller: "nova", price: 945_000, discount: 8, rating: 4.4, reviews: 34, stock: 4, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=70" },
  { title: "Wireless Keyboard & Mouse Combo", desc: "Quiet keys, ergonomic. Ready for home office.", category: "computers", seller: "nova", price: 55_000, discount: 20, rating: 4.3, reviews: 91, stock: 40, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=70" },
  { title: "1080p HD USB Webcam", desc: "Auto-focus, built-in mic. Perfect for online classes and meetings.", category: "computers", seller: "nova", price: 68_000, discount: 15, rating: 4.2, reviews: 47, stock: 32, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=70" },
  { title: "USB-C Fast Charger 65W", desc: "Charges phones, tablets, and laptops. Foldable pins.", category: "electronics", seller: "ruyubu", price: 42_000, discount: 22, rating: 4.5, reviews: 158, stock: 80, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=70" },

  // Fashion
  { title: "Kitenge Wrap Dress – Handmade", desc: "Vibrant local print, tailor-made in Bujumbura. 100% cotton.", category: "fashion", seller: "kirundo", price: 78_000, discount: 15, rating: 4.8, reviews: 96, stock: 15, image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=70" },
  { title: "Men's Ankara Print Shirt", desc: "Slim fit, breathable cotton. Perfect for weekends and events.", category: "fashion", seller: "kirundo", price: 45_000, discount: 20, rating: 4.6, reviews: 74, stock: 28, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=70" },
  { title: "Genuine Leather Sandals (Made in Bujumbura)", desc: "Hand-stitched. Comfortable for daily wear.", category: "fashion", seller: "kirundo", price: 62_000, discount: 10, rating: 4.7, reviews: 41, stock: 22, image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=800&q=70" },
  { title: "Kids School Backpack", desc: "Durable, water-resistant. Reflective strips for safety.", category: "fashion", seller: "ngozi", price: 28_000, discount: 25, rating: 4.5, reviews: 118, stock: 55, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=70" },
  { title: "Classic Leather Wallet", desc: "Slim design, RFID protection, 8 card slots.", category: "fashion", seller: "kirundo", price: 32_000, discount: 30, rating: 4.4, reviews: 67, stock: 40, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=70" },
  { title: "Umushanana Ceremonial Set", desc: "Traditional Burundian outfit for weddings and ceremonies.", category: "fashion", seller: "kirundo", price: 185_000, discount: 8, rating: 4.9, reviews: 22, stock: 6, image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=70" },

  // Beauty & Health
  { title: "Shea Butter Body Cream 250ml", desc: "Locally sourced, unscented, deep moisturizing.", category: "beauty", seller: "sunset", price: 18_500, discount: 15, rating: 4.7, reviews: 214, stock: 100, image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=70" },
  { title: "Argan Oil Hair Serum", desc: "Restores shine, tames frizz. Suitable for all hair types.", category: "beauty", seller: "sunset", price: 24_000, discount: 20, rating: 4.6, reviews: 189, stock: 75, image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=70" },
  { title: "African Black Soap Bar", desc: "Handmade, deep cleansing, gentle on skin.", category: "beauty", seller: "sunset", price: 8_500, discount: 30, rating: 4.8, reviews: 405, stock: 200, flash: true, image: "https://images.unsplash.com/photo-1600857062241-98c3d02c15fb?auto=format&fit=crop&w=800&q=70" },
  { title: "First Aid Kit – Family Size", desc: "50-piece kit. Bandages, antiseptic, thermometer.", category: "beauty", seller: "karama", price: 42_000, discount: 12, rating: 4.5, reviews: 63, stock: 35, image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=800&q=70" },

  // Groceries — Burundian specialties
  { title: "Isano Burundi Coffee Beans 500g", desc: "Single-origin Arabica from Kayanza. Medium roast, notes of berry & chocolate.", category: "groceries", seller: "tanganyika", price: 22_000, discount: 10, rating: 4.9, reviews: 287, stock: 90, image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=70" },
  { title: "Pure Bujumbura Honey 500g", desc: "Raw, unfiltered forest honey. Locally harvested.", category: "groceries", seller: "tanganyika", price: 16_500, discount: 15, rating: 4.8, reviews: 152, stock: 60, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=70" },
  { title: "Palm Oil 1L (Cold-pressed)", desc: "Traditional Burundian palm oil. Rich flavor.", category: "groceries", seller: "tanganyika", price: 12_000, discount: 8, rating: 4.4, reviews: 68, stock: 120, image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=70" },
  { title: "Basmati Rice 25kg Bag", desc: "Premium long-grain rice. Family bulk pack.", category: "groceries", seller: "karama", price: 82_000, discount: 12, rating: 4.6, reviews: 74, stock: 30, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=70" },
  { title: "Ikivuguto (Fermented Milk) 1L – Pack of 6", desc: "Traditional Burundian drink. Refrigerate.", category: "groceries", seller: "tanganyika", price: 18_000, discount: 5, rating: 4.7, reviews: 41, stock: 40, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=70" },
  { title: "Roasted Cassava Chips 250g", desc: "Crunchy local snack. Salted, ready to eat.", category: "groceries", seller: "tanganyika", price: 4_500, discount: 20, rating: 4.5, reviews: 128, stock: 200, image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=800&q=70" },

  // Home / Garden / Furniture
  { title: "Solar Garden Lamp Set (4 pieces)", desc: "Auto on/off. Perfect for load-shedding evenings.", category: "garden", seller: "ubwiza", price: 68_000, discount: 22, rating: 4.5, reviews: 142, stock: 45, flash: true, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=70" },
  { title: "Hand-woven Agaseke Basket", desc: "Traditional peace basket. Beautiful home decor piece.", category: "furniture", seller: "ubwiza", price: 45_000, discount: 10, rating: 4.9, reviews: 88, stock: 20, image: "https://images.unsplash.com/photo-1503694978374-8a2fa686963a?auto=format&fit=crop&w=800&q=70" },
  { title: "Rattan Living Room Chair", desc: "Locally crafted rattan armchair. Cushion included.", category: "furniture", seller: "ubwiza", price: 235_000, discount: 15, rating: 4.6, reviews: 34, stock: 8, image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=70" },
  { title: "Non-stick Cookware Set (5 pieces)", desc: "Even heat, easy to clean. Induction compatible.", category: "furniture", seller: "ubwiza", price: 128_000, discount: 20, rating: 4.5, reviews: 55, stock: 25, image: "https://images.unsplash.com/photo-1584990347449-a5d9f800a783?auto=format&fit=crop&w=800&q=70" },
  { title: "Ceramic Dinner Set (16 pieces)", desc: "Service for 4. Dishwasher & microwave safe.", category: "furniture", seller: "ubwiza", price: 78_000, discount: 18, rating: 4.4, reviews: 46, stock: 30, image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=800&q=70" },
  { title: "Portable Gas Cooker (2-burner)", desc: "Reliable, safe, ideal for kitchens without electricity.", category: "furniture", seller: "karama", price: 92_000, discount: 12, rating: 4.6, reviews: 62, stock: 18, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=70" },
  { title: "Watering Can 5L", desc: "Sturdy plastic. Perfect for small gardens.", category: "garden", seller: "ubwiza", price: 9_500, discount: 10, rating: 4.3, reviews: 28, stock: 80, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=70" },
  { title: "Vegetable Seed Starter Kit", desc: "10 varieties: tomato, spinach, onion, carrot & more.", category: "garden", seller: "ubwiza", price: 12_500, discount: 25, rating: 4.7, reviews: 51, stock: 65, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=70" },

  // Baby
  { title: "Baby Wrap Carrier – Traditional Style", desc: "Soft cotton, easy tie. Newborn to toddler.", category: "baby", seller: "ngozi", price: 32_000, discount: 15, rating: 4.8, reviews: 82, stock: 40, image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=70" },
  { title: "Baby Feeding Bottle Set (4 bottles)", desc: "BPA-free, anti-colic. 240ml each.", category: "baby", seller: "ngozi", price: 28_500, discount: 20, rating: 4.6, reviews: 96, stock: 55, image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=70" },
  { title: "Cotton Baby Blanket Set (3)", desc: "Soft, breathable, machine washable.", category: "baby", seller: "ngozi", price: 24_000, discount: 25, rating: 4.7, reviews: 67, stock: 45, image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=70" },
  { title: "Wooden Learning Blocks Set", desc: "36 blocks. Numbers, letters, colors. Non-toxic paint.", category: "baby", seller: "ngozi", price: 38_000, discount: 18, rating: 4.8, reviews: 74, stock: 30, image: "https://images.unsplash.com/photo-1584389064523-2bf22c0d3aac?auto=format&fit=crop&w=800&q=70" },
  { title: "Baby Stroller – 3 Wheel", desc: "Foldable, all-terrain wheels. Sun canopy included.", category: "baby", seller: "ngozi", price: 195_000, discount: 12, rating: 4.5, reviews: 38, stock: 10, image: "https://images.unsplash.com/photo-1600001895873-a58fcb69f8c8?auto=format&fit=crop&w=800&q=70" },

  // Books
  { title: "\"Grand dictionnaire Kirundi–Français\"", desc: "Comprehensive Kirundi–French dictionary. 850 pages.", category: "books", seller: "rumonge", price: 42_000, discount: 10, rating: 4.9, reviews: 116, stock: 25, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=70" },
  { title: "Cahier d'exercices – Primaire (Pack of 10)", desc: "Notebooks for primary school. Ruled 96 pages.", category: "books", seller: "rumonge", price: 12_000, discount: 15, rating: 4.5, reviews: 89, stock: 200, image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=800&q=70" },
  { title: "\"Histoire du Burundi\" — E. Ndayishimiye", desc: "Illustrated history of Burundi. In French.", category: "books", seller: "rumonge", price: 28_500, discount: 8, rating: 4.7, reviews: 42, stock: 30, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=70" },
  { title: "English Grammar for Beginners", desc: "Learn English step by step. Practice exercises included.", category: "books", seller: "rumonge", price: 18_000, discount: 12, rating: 4.6, reviews: 74, stock: 50, image: "https://images.unsplash.com/photo-1509266272358-7701da638078?auto=format&fit=crop&w=800&q=70" },
  { title: "Kids' Bilingual Storybook (Kirundi + French)", desc: "10 illustrated stories. Ages 4–8.", category: "books", seller: "rumonge", price: 14_500, discount: 20, rating: 4.8, reviews: 63, stock: 45, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=70" },
  { title: "Scientific Calculator (Casio fx-991)", desc: "552 functions. For secondary school and university.", category: "books", seller: "rumonge", price: 48_000, discount: 5, rating: 4.7, reviews: 128, stock: 65, image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=70" },

  // Sports / Outdoor / Automotive
  { title: "Football Ball – Official Size 5", desc: "Match-quality. Suitable for grass or dirt fields.", category: "automotive", seller: "peak", price: 24_500, discount: 15, rating: 4.6, reviews: 88, stock: 70, image: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?auto=format&fit=crop&w=800&q=70" },
  { title: "Adult Bicycle 26\" – Mountain Style", desc: "18-speed, front suspension. Great for city and off-road.", category: "automotive", seller: "peak", price: 285_000, discount: 15, rating: 4.5, reviews: 44, stock: 12, image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=70" },
  { title: "Motorcycle Helmet – Full Face", desc: "DOT certified. Comfortable padding. Multiple sizes.", category: "automotive", seller: "peak", price: 68_500, discount: 18, rating: 4.6, reviews: 96, stock: 35, image: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&w=800&q=70" },
  { title: "Yoga Mat 6mm Non-slip", desc: "Extra thick, eco-friendly. Includes carry strap.", category: "automotive", seller: "peak", price: 22_000, discount: 22, rating: 4.7, reviews: 132, stock: 80, image: "https://images.unsplash.com/photo-1591291621164-2c6367723315?auto=format&fit=crop&w=800&q=70" },
  { title: "Motorcycle Phone Mount", desc: "Waterproof, universal fit. Vibration-damping.", category: "automotive", seller: "peak", price: 15_500, discount: 25, rating: 4.4, reviews: 58, stock: 90, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=70" },
  { title: "Reusable Water Bottle 1L (Stainless)", desc: "Keeps cold 24h, hot 12h. BPA-free.", category: "automotive", seller: "peak", price: 18_500, discount: 20, rating: 4.7, reviews: 174, stock: 100, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=70" },
  { title: "LED Bicycle Light Set", desc: "Front & rear. Rechargeable USB. 4 modes.", category: "automotive", seller: "peak", price: 12_500, discount: 15, rating: 4.5, reviews: 66, stock: 55, image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=70" },
];

function categoryName(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}
function sellerRec(slug: string) {
  return SELLERS.find((s) => s.slug === slug) ?? SELLERS[0];
}

export const PRODUCTS: Product[] = SEEDS.map((s, i) => {
  const seller = sellerRec(s.seller);
  const price = s.price;
  const compareAt = Math.round(price / (1 - s.discount / 100) / 100) * 100;
  const slug = `p-${i + 1}`;
  return {
    id: slug,
    slug,
    seller: seller.name,
    sellerSlug: seller.slug,
    category: categoryName(s.category),
    categorySlug: s.category,
    title: s.title,
    description: s.desc,
    image: s.image,
    gallery: [s.image, SEEDS[(i + 1) % SEEDS.length].image, SEEDS[(i + 2) % SEEDS.length].image, SEEDS[(i + 3) % SEEDS.length].image],
    price,
    compareAt,
    rating: s.rating,
    reviews: s.reviews,
    stock: s.stock,
    flash: s.flash,
    discount: s.discount,
  };
});

// Verified buyer testimonials shown on the home page.
export const TESTIMONIALS = [
  { name: "Aline N.", city: "Bujumbura", quote: "Fast delivery and the coffee beans are amazing. My go-to marketplace.", rating: 5 },
  { name: "Eric M.", city: "Gitega", quote: "Love supporting local sellers. Flash sales are unbeatable.", rating: 5 },
  { name: "Sandrine K.", city: "Ngozi", quote: "Easy checkout with Lumicash. Highly recommend EBM.", rating: 5 },
  { name: "Jean-Claude R.", city: "Rumonge", quote: "Bought a laptop and it arrived in 2 days. Great service.", rating: 4 },
  { name: "Béatrice U.", city: "Kayanza", quote: "The kitenge dress fits perfectly. Beautiful workmanship.", rating: 5 },
  { name: "Patrick I.", city: "Muyinga", quote: "Solar lamp saved my evenings during power cuts. Worth every FBu.", rating: 5 },
];

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
