import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MapPin, Star } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { getStore, PRODUCTS } from "@/lib/catalog";

export const Route = createFileRoute("/stores/$slug")({
  loader: ({ params }) => {
    const store = getStore(params.slug);
    if (!store) throw notFound();
    return { store };
  },
  component: StoreDetail,
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.store.name} · EBM` : "Store · EBM" }],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="mx-auto max-w-xl flex-1 p-12 text-center">
        <h1 className="text-2xl font-bold">Store not found</h1>
        <Button asChild className="mt-4"><Link to="/stores">All stores</Link></Button>
      </div>
      <SiteFooter />
    </div>
  ),
});

function StoreDetail() {
  const { store } = Route.useLoaderData();
  const products = PRODUCTS.filter((p) => p.sellerSlug === store.slug);

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <SiteHeader />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-primary to-primary/70 text-primary-foreground">
          <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 py-10">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-background text-2xl font-extrabold text-primary">
              {store.name.slice(0, 2)}
            </div>
            <div>
              <h1 className="font-display text-3xl font-extrabold">{store.name}</h1>
              <p className="opacity-90">{store.tagline}</p>
              <div className="mt-2 flex items-center gap-4 text-sm opacity-90">
                <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> Bujumbura</span>
                <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-current" /> 4.7 · Verified</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 py-8">
          <h2 className="mb-4 text-xl font-bold">{products.length} products</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
