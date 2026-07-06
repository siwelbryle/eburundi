import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ProductCard } from "@/components/shop/product-card";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/products")({
  validateSearch: (s: Record<string, unknown>) => ({
    category: (s.category as string) || "",
    q: (s.q as string) || "",
    sort: (s.sort as string) || "featured",
  }),
  component: ProductsPage,
  head: () => ({ meta: [{ title: "All Products · KaramaMarket" }] }),
});

function ProductsPage() {
  const { category, q, sort } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [search, setSearch] = useState(q);

  let list = PRODUCTS.slice();
  if (category) list = list.filter((p) => p.categorySlug === category);
  if (q) list = list.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));
  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  if (sort === "rating") list.sort((a, b) => b.rating - a.rating);

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold">{category ? CATEGORIES.find((c) => c.slug === category)?.name : "All Products"}</h1>
            <p className="text-sm text-muted-foreground">{list.length} products</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ search: (prev) => ({ ...prev, q: search }) });
            }}
            className="flex gap-2"
          >
            <Input placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
            <Button type="submit">Search</Button>
          </form>
        </div>

        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-xl border bg-card p-4">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => navigate({ search: (p) => ({ ...p, category: "" }) })}
                  className={`block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-muted ${!category ? "bg-muted font-semibold" : ""}`}
                >
                  All
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => navigate({ search: (p) => ({ ...p, category: c.slug }) })}
                    className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-muted ${category === c.slug ? "bg-muted font-semibold" : ""}`}
                  >
                    <span>{c.emoji}</span> {c.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Sort</h3>
              <select
                value={sort}
                onChange={(e) => navigate({ search: (p) => ({ ...p, sort: e.target.value }) })}
                className="w-full rounded border bg-background px-2 py-1.5 text-sm"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </div>
          </aside>

          {list.length === 0 ? (
            <div className="rounded-xl border bg-card p-10 text-center">
              <p className="text-muted-foreground">No products match your filters.</p>
              <Button className="mt-4" asChild>
                <Link to="/products" search={{ category: "", q: "", sort: "featured" }}>Clear filters</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {list.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
