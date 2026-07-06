import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ProductCard } from "@/components/shop/product-card";
import { PRODUCTS } from "@/lib/catalog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/flash-sales")({
  head: () => ({
    meta: [
      { title: "Flash Sales · KaramaMarket" },
      { name: "description", content: "Limited-time deals from KaramaMarket sellers. Grab them before they're gone." },
    ],
  }),
  component: FlashSalesPage,
});

function FlashSalesPage() {
  const deals = PRODUCTS.filter((p) => p.flash || (p.compareAt && p.compareAt > p.price)).slice(0, 24);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b bg-gradient-to-br from-primary/10 via-background to-success/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-14">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            <Zap className="h-3.5 w-3.5" /> Live now
          </span>
          <h1 className="text-4xl font-bold tracking-tight">Flash Sales</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Hand-picked deals from KaramaMarket sellers. New drops every day — while stocks last.
          </p>
          <Button asChild variant="outline"><Link to="/products">Browse all products</Link></Button>
        </div>
      </section>
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {deals.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
