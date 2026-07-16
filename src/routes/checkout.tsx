import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, CreditCard, Loader2, Phone, Wallet } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/use-shop-store";
import { fmtFbu, getProduct } from "@/lib/catalog";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({ meta: [{ title: "Checkout · EBM" }, { name: "robots", content: "noindex" }] }),
});

type PayMethod = "lumicash" | "card" | "cod";

function CheckoutPage() {
  const cart = useCart();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [pay, setPay] = useState<PayMethod>("lumicash");
  const [placed, setPlaced] = useState<{ id: string; number: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [merchant, setMerchant] = useState<{ number: string; name: string } | null>(null);

  const [form, setForm] = useState({
    full_name: "", phone: "", address: "", city: "Bujumbura", province: "",
    payment_ref: "", payment_phone: "", card_number: "", card_exp: "", card_cvc: "", note: "",
  });

  useEffect(() => {
    supabase.from("site_settings").select("key, value").in("key", ["lumicash_merchant_number","lumicash_merchant_name"]).then(({ data }) => {
      const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
      setMerchant({
        number: (map.lumicash_merchant_number as string) || "+257 69 393 285",
        name: (map.lumicash_merchant_name as string) || "EBM - eBurundi Market",
      });
    });
  }, []);

  const rows = cart.items.map((i) => ({ item: i, product: getProduct(i.productId) })).filter((r) => r.product);
  const subtotal = rows.reduce((s, r) => s + r.product!.price * r.item.qty, 0);
  const shipping = rows.length === 0 ? 0 : subtotal > 200_000 ? 0 : 8_000;
  const total = subtotal + shipping;
  const orderRef = "EBM-" + Math.random().toString(36).slice(2, 8).toUpperCase();

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to place an order");
      navigate({ to: "/auth", search: { redirect: "/checkout" } });
      return;
    }
    if (pay === "lumicash" && !form.payment_ref.trim()) {
      toast.error("Please enter the Lumicash transaction ID after sending payment");
      return;
    }
    setSubmitting(true);

    const payment_status = pay === "lumicash" ? "awaiting_confirmation" : "pending";
    const { data: order, error: orderErr } = await supabase.from("orders").insert({
      user_id: user.id,
      subtotal,
      shipping,
      total,
      tax: 0,
      currency: "BIF",
      status: "pending",
      payment_method: pay,
      payment_status,
      payment_ref: pay === "lumicash" ? form.payment_ref.trim() : null,
      payment_phone: form.payment_phone || form.phone || null,
      shipping_address: {
        full_name: form.full_name, phone: form.phone, address: form.address, city: form.city, province: form.province, note: form.note,
      },
    } as never).select("id, order_number").single();

    if (orderErr || !order) {
      setSubmitting(false);
      toast.error(orderErr?.message || "Could not create order");
      return;
    }

    const items = rows.map((r) => ({
      order_id: order.id,
      product_id: null,
      store_id: null,
      name: r.product!.title,
      price: r.product!.price,
      quantity: r.item.qty,
      image_url: r.product!.image,
    }));
    const { error: itemsErr } = await supabase.from("order_items").insert(items as never);
    if (itemsErr) {
      setSubmitting(false);
      toast.error(itemsErr.message);
      return;
    }

    cart.clear();
    setSubmitting(false);
    setPlaced({ id: order.id, number: order.order_number });
    toast.success("Order placed!");
  };

  if (placed) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/40">
        <SiteHeader />
        <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success text-success-foreground"><Check className="h-8 w-8" /></div>
          <h1 className="mt-6 text-3xl font-extrabold">Thank you!</h1>
          <p className="mt-2 text-muted-foreground">Your order <span className="font-bold text-foreground">{placed.number}</span> has been placed.</p>
          {pay === "lumicash" && (
            <p className="mt-2 text-sm text-muted-foreground">We'll verify your Lumicash transaction and confirm shortly. You'll see the status update in your Orders page.</p>
          )}
          <div className="mt-6 flex justify-center gap-2">
            <Button asChild><Link to="/orders">View my orders</Link></Button>
            <Button asChild variant="outline"><Link to="/">Back home</Link></Button>
          </div>
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

  const set = <K extends keyof typeof form>(k: K, v: string) => setForm({ ...form, [k]: v });

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <h1 className="mb-6 text-3xl font-extrabold">Checkout</h1>
        {!user && !authLoading && (
          <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
            You need to <Link to="/auth" search={{ redirect: "/checkout" }} className="font-semibold underline">sign in</Link> to place an order.
          </div>
        )}
        <form onSubmit={placeOrder} className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-xl border bg-card p-5">
              <h2 className="mb-4 text-lg font-bold">Shipping address</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label>Full name</Label><Input required value={form.full_name} onChange={(e) => set("full_name", e.target.value)} /></div>
                <div><Label>Phone</Label><Input required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+257 …" /></div>
                <div className="sm:col-span-2"><Label>Address</Label><Input required value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
                <div><Label>City</Label><Input required value={form.city} onChange={(e) => set("city", e.target.value)} /></div>
                <div><Label>Province</Label><Input required value={form.province} onChange={(e) => set("province", e.target.value)} placeholder="Bujumbura Mairie" /></div>
                <div className="sm:col-span-2"><Label>Delivery note</Label><Textarea rows={2} value={form.note} onChange={(e) => set("note", e.target.value)} placeholder="Optional — landmarks, delivery instructions…" /></div>
              </div>
            </section>

            <section className="rounded-xl border bg-card p-5">
              <h2 className="mb-4 text-lg font-bold">Payment method</h2>
              <div className="grid gap-2">
                {([
                  { id: "lumicash" as const, label: "Lumicash", hint: "Mobile money — recommended", icon: Phone },
                  { id: "card" as const, label: "Card", hint: "Visa / Mastercard", icon: CreditCard },
                  { id: "cod" as const, label: "Cash on delivery", hint: "Pay upon arrival", icon: Wallet },
                ]).map((m) => (
                  <label key={m.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${pay === m.id ? "border-primary bg-primary/5" : ""}`}>
                    <input type="radio" name="pay" checked={pay === m.id} onChange={() => setPay(m.id)} />
                    <m.icon className="h-4 w-4" />
                    <div className="flex-1"><div className="font-semibold">{m.label}</div><div className="text-xs text-muted-foreground">{m.hint}</div></div>
                  </label>
                ))}
              </div>

              {pay === "lumicash" && (
                <div className="mt-4 space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
                  <div className="font-bold">Pay {fmtFbu(total)} with Lumicash</div>
                  <ol className="ml-4 list-decimal space-y-1 text-muted-foreground">
                    <li>Open Lumicash on your phone → <b>Transfer</b>.</li>
                    <li>Send <b className="text-foreground">{fmtFbu(total)}</b> to <b className="text-foreground">{merchant?.number}</b> ({merchant?.name}).</li>
                    <li>Use reference <b className="text-foreground font-mono">{orderRef}</b> if asked.</li>
                    <li>Paste the Lumicash transaction ID you received by SMS below.</li>
                  </ol>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div><Label>Lumicash transaction ID</Label><Input required value={form.payment_ref} onChange={(e) => set("payment_ref", e.target.value)} placeholder="e.g. 4X9K2P" /></div>
                    <div><Label>Lumicash phone (optional)</Label><Input value={form.payment_phone} onChange={(e) => set("payment_phone", e.target.value)} placeholder="+257 …" /></div>
                  </div>
                  <p className="text-xs text-muted-foreground">We'll verify your payment and update the order status within a few minutes.</p>
                </div>
              )}

              {pay === "card" && (
                <div className="mt-4 space-y-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
                  <div className="font-semibold">Card capture is not automated yet.</div>
                  <p className="text-muted-foreground">Your order will be placed as <b>pending</b> and our team will contact you to complete the card payment.</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2"><Label>Card number</Label><Input value={form.card_number} onChange={(e) => set("card_number", e.target.value)} placeholder="4242 4242 4242 4242" /></div>
                    <div><Label>Expiry</Label><Input value={form.card_exp} onChange={(e) => set("card_exp", e.target.value)} placeholder="MM/YY" /></div>
                    <div><Label>CVC</Label><Input value={form.card_cvc} onChange={(e) => set("card_cvc", e.target.value)} placeholder="123" /></div>
                  </div>
                </div>
              )}

              {pay === "cod" && (
                <div className="mt-4 rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
                  Pay <b className="text-foreground">{fmtFbu(total)}</b> in cash to the courier on delivery. Available in Bujumbura Mairie and surrounding areas.
                </div>
              )}
            </section>
          </div>

          <aside className="h-fit rounded-xl border bg-card p-5">
            <h2 className="mb-4 text-lg font-bold">Order summary</h2>
            <div className="max-h-64 space-y-3 overflow-auto">
              {rows.map(({ item, product }) => (
                <div key={item.productId} className="flex gap-3 text-sm">
                  <img src={product!.image} alt="" className="h-12 w-12 rounded object-cover" />
                  <div className="flex-1"><div className="line-clamp-1 font-semibold">{product!.title}</div><div className="text-xs text-muted-foreground">Qty {item.qty}</div></div>
                  <div className="font-semibold">{fmtFbu(product!.price * item.qty)}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t pt-4 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{fmtFbu(subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : fmtFbu(shipping)}</span></div>
              <div className="flex justify-between border-t pt-2 text-base font-bold"><span>Total</span><span className="text-primary">{fmtFbu(total)}</span></div>
            </div>
            <Button type="submit" size="lg" disabled={submitting} className="mt-4 w-full bg-success text-success-foreground hover:bg-success/90">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {pay === "lumicash" ? "I've paid — place order" : pay === "cod" ? "Place order (COD)" : "Place order"}
            </Button>
          </aside>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
