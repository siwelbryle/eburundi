import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-shop-store";
import { getProduct } from "@/lib/catalog";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
  head: () => ({ meta: [{ title: "Wishlist · KaramaMarket" }, { name: "robots", content: "noindex" }] }),
});

function WishlistPage() {
  const wish = useWishlist();
  const products = wish.items.map(getProduct).filter(Boolean);

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <h1 className="mb-6 text-3xl font-extrabold">Your wishlist</h1>
        {products.length === 0 ? (
          <div className="rounded-2xl border bg-card p-12 text-center">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold">No favorites yet</p>
            <p className="text-sm text-muted-foreground">Tap the heart on any product to save it here.</p>
            <Button asChild className="mt-6"><Link to="/products" search={{ category: "", q: "", sort: "featured" }}>Browse products</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => <ProductCard key={p!.id} p={p!} />)}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
