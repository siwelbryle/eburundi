import { createFileRoute, Link } from "@tanstack/react-router";
import { Store } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { STORES, PRODUCTS } from "@/lib/catalog";

export const Route = createFileRoute("/stores/")({
  component: StoresIndex,
  head: () => ({ meta: [{ title: "Sellers · KaramaMarket" }, { name: "description", content: "Discover verified Burundian sellers on KaramaMarket." }] }),
});

function StoresIndex() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <h1 className="mb-2 text-3xl font-extrabold">Verified sellers</h1>
        <p className="mb-6 text-muted-foreground">Shop from trusted local stores across Burundi.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STORES.map((s) => {
            const count = PRODUCTS.filter((p) => p.sellerSlug === s.slug).length;
            return (
              <Link
                key={s.slug}
                to="/stores/$slug"
                params={{ slug: s.slug }}
                className="group flex items-center gap-4 rounded-xl border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary/50"
              >
                <div className="grid h-14 w-14 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {s.name.slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="font-bold group-hover:text-primary">{s.name}</div>
                  <div className="text-sm text-muted-foreground">{s.tagline}</div>
                  <div className="mt-1 text-xs text-muted-foreground"><Store className="mr-1 inline h-3 w-3" />{count} products</div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
