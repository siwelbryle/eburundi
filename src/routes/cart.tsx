import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-shop-store";
import { fmtFbu, getProduct } from "@/lib/catalog";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Cart · KaramaMarket" }, { name: "robots", content: "noindex" }] }),
});

function CartPage() {
  const cart = useCart();
  const rows = cart.items
    .map((i) => ({ item: i, product: getProduct(i.productId) }))
    .filter((r) => r.product);

  const subtotal = rows.reduce((sum, r) => sum + (r.product!.price * r.item.qty), 0);
  const shipping = rows.length === 0 ? 0 : subtotal > 200_000 ? 0 : 8_000;
  const total = subtotal + shipping;

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <h1 className="mb-6 text-3xl font-extrabold">Your cart</h1>

        {rows.length === 0 ? (
          <div className="rounded-2xl border bg-card p-12 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">Add products to get started.</p>
            <Button asChild className="mt-6"><Link to="/products" search={{ category: "", q: "", sort: "featured" }}>Browse products</Link></Button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-3">
              {rows.map(({ item, product }) => (
                <div key={item.productId} className="flex gap-4 rounded-xl border bg-card p-4">
                  <img src={product!.image} alt={product!.title} className="h-24 w-24 rounded-lg object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div className="text-[11px] font-bold uppercase text-primary">{product!.seller}</div>
                    <Link to="/products/$id" params={{ id: product!.id }} className="font-semibold hover:text-primary">{product!.title}</Link>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border">
                        <button onClick={() => cart.updateQty(item.productId, item.qty - 1)} className="grid h-8 w-8 place-items-center"><Minus className="h-3 w-3" /></button>
                        <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                        <button onClick={() => cart.updateQty(item.productId, item.qty + 1)} className="grid h-8 w-8 place-items-center"><Plus className="h-3 w-3" /></button>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{fmtFbu(product!.price * item.qty)}</div>
                        <button onClick={() => cart.remove(item.productId)} className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
                          <Trash2 className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="h-fit rounded-xl border bg-card p-5">
              <h2 className="mb-4 text-lg font-bold">Order summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{fmtFbu(subtotal)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : fmtFbu(shipping)}</span></div>
                <div className="mt-3 flex justify-between border-t pt-3 text-base font-bold"><span>Total</span><span className="text-primary">{fmtFbu(total)}</span></div>
              </div>
              <Button asChild size="lg" className="mt-5 w-full bg-success text-success-foreground hover:bg-success/90">
                <Link to="/checkout">Checkout</Link>
              </Button>
              <Button asChild variant="outline" className="mt-2 w-full">
                <Link to="/products" search={{ category: "", q: "", sort: "featured" }}>Continue shopping</Link>
              </Button>
            </aside>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
