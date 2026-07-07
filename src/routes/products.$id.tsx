import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Heart, ShieldCheck, Truck, Zap } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Stars, ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { fmtFbu, getProduct, PRODUCTS } from "@/lib/catalog";
import { useCart, useWishlist } from "@/hooks/use-shop-store";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  component: ProductDetail,
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.product.title} · EBM` : "Product · EBM" },
      loaderData && { name: "description", content: loaderData.product.description },
    ].filter(Boolean) as { title?: string; name?: string; content?: string }[],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="mx-auto max-w-xl flex-1 p-12 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Button asChild className="mt-4"><Link to="/products" search={{ category: "", q: "", sort: "featured" }}>Browse products</Link></Button>
      </div>
      <SiteFooter />
    </div>
  ),
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const [img, setImg] = useState(product.image);
  const [qty, setQty] = useState(1);
  const cart = useCart();
  const wish = useWishlist();
  const wished = wish.has(product.id);
  const related = PRODUCTS.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <nav className="mb-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link> ·{" "}
          <Link to="/products" search={{ category: product.categorySlug, q: "", sort: "featured" }} className="hover:text-primary">{product.category}</Link> ·{" "}
          <span className="text-foreground">{product.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="relative overflow-hidden rounded-2xl border bg-card">
              <img src={img} alt={product.title} className="aspect-square w-full object-cover" />
              {product.flash && (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
                  <Zap className="h-3 w-3" /> Flash Sale
                </span>
              )}
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {product.gallery.map((g: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setImg(g)}
                  className={`overflow-hidden rounded-lg border-2 ${img === g ? "border-primary" : "border-transparent"}`}
                >
                  <img src={g} alt="" className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <Link to="/stores/$slug" params={{ slug: product.sellerSlug }} className="text-sm font-bold uppercase tracking-wider text-primary hover:underline">
              {product.seller}
            </Link>
            <h1 className="font-display text-3xl font-extrabold">{product.title}</h1>
            <div className="flex items-center gap-2">
              <Stars value={product.rating} />
              <span className="text-sm text-muted-foreground">{product.rating.toFixed(1)} · {product.reviews} reviews</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-primary">{fmtFbu(product.price)}</span>
              {product.compareAt && <span className="text-lg text-muted-foreground line-through">{fmtFbu(product.compareAt)}</span>}
              {product.discount && (
                <span className="rounded-md bg-success px-2 py-1 text-xs font-bold text-success-foreground">-{product.discount}%</span>
              )}
            </div>
            <p className="text-foreground/80">{product.description}</p>

            <div className="flex items-center gap-3 text-sm">
              <span className={`inline-flex items-center gap-1 font-semibold ${product.stock > 5 ? "text-success" : "text-primary"}`}>
                <Check className="h-4 w-4" /> {product.stock > 5 ? "In stock" : `Only ${product.stock} left`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center rounded-full border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-10 w-10 text-lg">−</button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="h-10 w-10 text-lg">+</button>
              </div>
              <Button
                size="lg"
                onClick={() => { cart.add(product.id, qty); toast.success("Added to cart"); }}
                className="flex-1 bg-success text-success-foreground hover:bg-success/90"
              >
                Add to cart · {fmtFbu(product.price * qty)}
              </Button>
              <Button size="lg" variant="outline" onClick={() => wish.toggle(product.id)} aria-label="Wishlist">
                <Heart className={`h-5 w-5 ${wished ? "fill-primary text-primary" : ""}`} />
              </Button>
            </div>

            <div className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm"><Truck className="h-4 w-4 text-primary" /> Fast delivery in Bujumbura</div>
              <div className="flex items-center gap-2 text-sm"><ShieldCheck className="h-4 w-4 text-success" /> 30-day return policy</div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-4 text-2xl font-extrabold">Related products</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
