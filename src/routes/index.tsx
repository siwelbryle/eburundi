import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Flame, Heart, Star, Trophy, Zap } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "EBM — Burundi's trusted multi-vendor marketplace" },
      {
        name: "description",
        content:
          "Shop electronics, fashion, beauty, groceries and more from trusted Burundian sellers on EBM.",
      },
    ],
  }),
});

const CATEGORIES = [
  { name: "Automotive", emoji: "🚗" },
  { name: "Baby Products", emoji: "🍼" },
  { name: "Beauty & Health", emoji: "💄" },
  { name: "Books", emoji: "📚" },
  { name: "Computers", emoji: "💻" },
  { name: "Electronics", emoji: "📱" },
  { name: "Fashion", emoji: "👗" },
  { name: "Furniture", emoji: "🛋️" },
  { name: "Garden", emoji: "🌱" },
  { name: "Groceries", emoji: "🛒" },
];

const SLIDES = [
  {
    badge: "KARAMA MARKET",
    title: "Mega Flash Sale",
    subtitle: "Up to 40% off electronics, fashion & more. Limited time only!",
    cta: "Shop the Sale",
    image:
      "https://images.unsplash.com/photo-1470549638415-0a0755be0619?auto=format&fit=crop&w=1600&q=70",
  },
  {
    badge: "NEW ARRIVALS",
    title: "Fresh drops every week",
    subtitle: "Discover the latest from Burundi's top sellers.",
    cta: "Explore now",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=70",
  },
  {
    badge: "LOCAL SELLERS",
    title: "Support Made in Burundi",
    subtitle: "Hand-picked stores. Verified quality. Fast delivery.",
    cta: "Browse stores",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=70",
  },
];

const SELLERS = ["UBWIZA", "KIRUNDO", "RUYUBU", "KARAMA", "PEAK", "SUNSET", "TANGANYIKA", "RUMONGE", "NGOZI", "NOVA"];
const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1487887235947-a955ef187fcc?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1439337153520-7082a56a81f4?auto=format&fit=crop&w=600&q=70",
  "https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?auto=format&fit=crop&w=600&q=70",
];

const TITLES = [
  "Modern Phone Mount",
  "Eco Bluetooth Speaker",
  "Deluxe Feeding Set",
  "Smart Tea Selection",
  "Vibrant Bookshelf",
  "Elegant Screen Protector",
  "Modern Baby Carrier",
  "Eco Cat Tree",
  "Modern Anklet",
  "Pro Webcam",
  "Modern Filing Box",
];

function fmtFbu(n: number) {
  return "FBu " + n.toLocaleString("en-US");
}

type Product = {
  id: string;
  seller: string;
  title: string;
  image: string;
  price: number;
  compareAt?: number;
  rating: number;
  reviews: number;
  flash?: boolean;
  discount?: number;
};

function makeProducts(seed: number, count: number, allFlash = false): Product[] {
  const rand = (i: number, mod: number) => (seed * 9301 + i * 49297) % mod;
  return Array.from({ length: count }, (_, i) => {
    const price = 30_000 + rand(i, 40) * 10_000;
    const discount = 20 + (rand(i + 3, 30));
    const compareAt = Math.round((price / (1 - discount / 100)) / 100) * 100;
    return {
      id: `${seed}-${i}`,
      seller: SELLERS[(seed + i) % SELLERS.length],
      title: TITLES[(seed + i) % TITLES.length],
      image: PRODUCT_IMAGES[(seed + i) % PRODUCT_IMAGES.length],
      price,
      compareAt,
      rating: 3 + (rand(i + 1, 20) / 10),
      reviews: rand(i + 2, 12),
      flash: allFlash || rand(i + 4, 4) === 0,
      discount,
    };
  });
}

const FLASH = makeProducts(1, 5, true);
const FEATURED = makeProducts(2, 5);
const TRENDING = makeProducts(3, 5);
const BEST = makeProducts(4, 5);

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-500">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(value) ? "fill-current" : "opacity-30"}`} />
      ))}
    </div>
  );
}

function ProductCard({ p, onDark = false }: { p: Product; onDark?: boolean }) {
  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant ${
        onDark ? "border-transparent" : ""
      }`}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {p.flash && (
            <span className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
              <Zap className="h-3 w-3" /> Flash
            </span>
          )}
          {p.discount && (
            <span className="inline-flex items-center rounded-md bg-success px-2 py-0.5 text-[10px] font-bold text-success-foreground">
              -{p.discount}%
            </span>
          )}
        </div>
        <button
          aria-label="Add to wishlist"
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/90 text-foreground shadow-card transition hover:bg-background"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-primary">{p.seller}</div>
        <div className="line-clamp-1 text-sm font-semibold">{p.title}</div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Stars value={p.rating} />
          <span>({p.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-primary">{fmtFbu(p.price)}</span>
          {p.compareAt && (
            <span className="text-xs text-muted-foreground line-through">{fmtFbu(p.compareAt)}</span>
          )}
        </div>
        <Button size="sm" className="mt-1 w-full bg-success text-success-foreground hover:bg-success/90">
          Add to cart
        </Button>
      </div>
    </div>
  );
}

function HomePage() {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);
  const s = SLIDES[slide];

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero carousel */}
        <section className="mx-auto max-w-7xl px-4 pt-6">
          <div className="relative overflow-hidden rounded-2xl shadow-card">
            <div className="relative aspect-[21/9] w-full">
              <img
                key={s.image}
                src={s.image}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-xl px-8 md:px-14 text-white">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-[11px] font-bold tracking-wider text-primary-foreground">
                    <span>🇧🇮</span> {s.badge}
                  </span>
                  <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight md:text-6xl">
                    {s.title}
                  </h1>
                  <p className="mt-3 max-w-md text-sm opacity-90 md:text-base">{s.subtitle}</p>
                  <Button
                    size="lg"
                    className="mt-6 rounded-md bg-success font-semibold text-success-foreground hover:bg-success/90"
                  >
                    {s.cta}
                  </Button>
                </div>
              </div>
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === slide ? "w-8 bg-white" : "w-2 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto max-w-7xl px-4 py-10">
          <h2 className="mb-5 text-2xl font-extrabold">Shop by Category</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10">
            {CATEGORIES.map((c) => (
              <button
                key={c.name}
                className="group flex flex-col items-center gap-2 rounded-xl border bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:border-primary/50"
              >
                <div className="text-3xl transition group-hover:scale-110">{c.emoji}</div>
                <div className="text-center text-xs font-semibold">{c.name}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Flash Sales — red band */}
        <section className="mx-auto max-w-7xl px-4">
          <div className="rounded-2xl bg-primary p-5 text-primary-foreground shadow-elegant">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-2xl font-extrabold">
                  <Zap className="h-6 w-6 fill-white" /> Flash Sales
                </h2>
                <p className="text-sm opacity-90">Grab them before they're gone!</p>
              </div>
              <Button variant="secondary" className="bg-black text-white hover:bg-black/80">
                See all deals
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {FLASH.map((p) => (
                <ProductCard key={p.id} p={p} onDark />
              ))}
            </div>
          </div>
        </section>

        <ProductRow title="Featured Products" icon={<span className="text-amber-500">⭐</span>} products={FEATURED} />
        <ProductRow title="Trending Now" icon={<Flame className="h-5 w-5 text-primary" />} products={TRENDING} />
        <ProductRow title="Best Sellers" icon={<Trophy className="h-5 w-5 text-amber-500" />} products={BEST} />

        {/* Testimonials */}
        <section className="mx-auto max-w-7xl px-4 py-14">
          <h2 className="mb-6 text-center text-2xl font-extrabold">What our customers say</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                quote:
                  "Fast delivery in Bujumbura and great quality products. My go-to marketplace!",
                name: "Aline N.",
              },
              {
                quote: "Love supporting local sellers. The flash sales are unbeatable.",
                name: "Eric M.",
              },
              {
                quote: "Easy checkout with Lumicash. Highly recommend EBM.",
                name: "Sandrine K.",
              },
            ].map((t) => (
              <div key={t.name} className="rounded-xl border bg-card p-5 shadow-card">
                <Stars value={5} />
                <p className="mt-3 text-sm text-foreground/80">"{t.quote}"</p>
                <p className="mt-3 text-sm font-semibold">— {t.name}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function ProductRow({
  title,
  icon,
  products,
}: {
  title: string;
  icon: React.ReactNode;
  products: Product[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-extrabold">
          {icon} {title}
        </h2>
        <button className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          View all <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
