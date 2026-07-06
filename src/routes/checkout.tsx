import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, CreditCard } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/use-shop-store";
import { fmtFbu, getProduct } from "@/lib/catalog";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({ meta: [{ title: "Checkout · KaramaMarket" }, { name: "robots", content: "noindex" }] }),
});

function CheckoutPage() {
  const cart = useCart();
  const navigate = useNavigate();
  const [pay, setPay] = useState<"lumicash" | "card" | "cod">("lumicash");
  const [placed, setPlaced] = useState<string | null>(null);

  const rows = cart.items.map((i) => ({ item: i, product: getProduct(i.productId) })).filter((r) => r.product);
  const subtotal = rows.reduce((s, r) => s + r.product!.price * r.item.qty, 0);
  const shipping = rows.length === 0 ? 0 : subtotal > 200_000 ? 0 : 8_000;
  const total = subtotal + shipping;

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = "KM-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    cart.clear();
    setPlaced(orderId);
    toast.success("Order placed!");
    setTimeout(() => navigate({ to: "/" }), 4000);
  };

  if (placed) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/40">
        <SiteHeader />
        <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success text-success-foreground"><Check className="h-8 w-8" /></div>
          <h1 className="mt-6 text-3xl font-extrabold">Thank you!</h1>
          <p className="mt-2 text-muted-foreground">Your order <span className="font-bold text-foreground">{placed}</span> has been placed. A confirmation will be sent to your email.</p>
          <Button asChild className="mt-6"><Link to="/">Back to home</Link></Button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/40">
        <SiteHeader />
        <main className="mx-auto max-w-xl flex-1 p-12 text-center">
          <p>Your cart is empty.</p>
          <Button asChild className="mt-4"><Link to="/products" search={{ category: "", q: "", sort: "featured" }}>Browse products</Link></Button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <h1 className="mb-6 text-3xl font-extrabold">Checkout</h1>
        <form onSubmit={placeOrder} className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-xl border bg-card p-5">
              <h2 className="mb-4 text-lg font-bold">Shipping address</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label>Full name</Label><Input required /></div>
                <div><Label>Phone</Label><Input required /></div>
                <div className="sm:col-span-2"><Label>Address</Label><Input required /></div>
                <div><Label>City</Label><Input required defaultValue="Bujumbura" /></div>
                <div><Label>Province</Label><Input required /></div>
              </div>
            </section>

            <section className="rounded-xl border bg-card p-5">
              <h2 className="mb-4 text-lg font-bold">Payment method</h2>
              <div className="grid gap-2">
                {[
                  { id: "lumicash", label: "Lumicash", hint: "Mobile money" },
                  { id: "card", label: "Card", hint: "Visa / Mastercard" },
                  { id: "cod", label: "Cash on delivery", hint: "Pay upon arrival" },
                ].map((m) => (
                  <label key={m.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${pay === m.id ? "border-primary bg-primary/5" : ""}`}>
                    <input type="radio" name="pay" checked={pay === m.id} onChange={() => setPay(m.id as typeof pay)} />
                    <CreditCard className="h-4 w-4" />
                    <div className="flex-1"><div className="font-semibold">{m.label}</div><div className="text-xs text-muted-foreground">{m.hint}</div></div>
                  </label>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Payments are simulated in this preview.</p>
            </section>
          </div>

          <aside className="h-fit rounded-xl border bg-card p-5">
            <h2 className="mb-4 text-lg font-bold">Order summary</h2>
            <div className="max-h-64 space-y-3 overflow-auto">
              {rows.map(({ item, product }) => (
                <div key={item.productId} className="flex gap-3 text-sm">
                  <img src={product!.image} alt="" className="h-12 w-12 rounded object-cover" />
                  <div className="flex-1">
                    <div className="line-clamp-1 font-semibold">{product!.title}</div>
                    <div className="text-xs text-muted-foreground">Qty {item.qty}</div>
                  </div>
                  <div className="font-semibold">{fmtFbu(product!.price * item.qty)}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t pt-4 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{fmtFbu(subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : fmtFbu(shipping)}</span></div>
              <div className="flex justify-between border-t pt-2 text-base font-bold"><span>Total</span><span className="text-primary">{fmtFbu(total)}</span></div>
            </div>
            <Button type="submit" size="lg" className="mt-4 w-full bg-success text-success-foreground hover:bg-success/90">Place order</Button>
          </aside>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
