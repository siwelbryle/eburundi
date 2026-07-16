import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Package, RefreshCw } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useRoles } from "@/hooks/use-roles";
import { navFor, roleLabel } from "@/lib/dashboard-nav";
import { supabase } from "@/integrations/supabase/client";
import { fmtFbu } from "@/lib/catalog";

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({ meta: [{ title: "Orders · EBM" }, { name: "robots", content: "noindex" }] }),
  component: OrdersPage,
});

type Order = {
  id: string;
  order_number: string;
  status: string;
  payment_method: string;
  payment_status: string;
  payment_ref: string | null;
  total: number;
  currency: string;
  created_at: string;
  order_items: { id: string; name: string; price: number; quantity: number; image_url: string | null }[];
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  awaiting_confirmation: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  paid: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  processing: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  shipped: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
  delivered: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
  cancelled: "bg-destructive/10 text-destructive",
  refunded: "bg-muted text-muted-foreground",
  failed: "bg-destructive/10 text-destructive",
};

function OrdersPage() {
  const { primaryRole } = useRoles();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("id, order_number, status, payment_method, payment_status, payment_ref, total, currency, created_at, order_items(id, name, price, quantity, image_url)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setLoading(false);
    if (!error) setOrders(((data as unknown) as Order[]) ?? []);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id]);

  return (
    <DashboardShell roleLabel={roleLabel(primaryRole)} groups={navFor(primaryRole)} breadcrumbs={["Dashboard","Orders"]}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">My orders</h1>
          <Button variant="outline" size="icon" onClick={load}><RefreshCw className="h-4 w-4" /></Button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
        ) : orders.length === 0 ? (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> No orders yet</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">When you place an order it will appear here with status and payment updates.</p>
              <Button asChild><Link to="/products" search={{ category: "", q: "", sort: "featured" }}>Start shopping</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <Card key={o.id}>
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                  <div>
                    <CardTitle className="font-mono text-base">{o.order_number}</CardTitle>
                    <div className="mt-1 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    <Badge variant="secondary" className={STATUS_COLORS[o.payment_status] || ""}>{o.payment_method} · {o.payment_status}</Badge>
                    <Badge variant="secondary" className={STATUS_COLORS[o.status] || ""}>{o.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="divide-y">
                    {o.order_items?.map((i) => (
                      <div key={i.id} className="flex items-center gap-3 py-2">
                        {i.image_url && <img src={i.image_url} alt="" className="h-10 w-10 rounded object-cover" />}
                        <div className="flex-1"><div className="text-sm font-semibold">{i.name}</div><div className="text-xs text-muted-foreground">Qty {i.quantity}</div></div>
                        <div className="text-sm font-semibold">{fmtFbu(Number(i.price) * i.quantity)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t pt-2 text-sm font-bold">
                    <span>Total</span><span className="text-primary">{fmtFbu(Number(o.total))}</span>
                  </div>
                  {o.payment_status === "awaiting_confirmation" && (
                    <p className="text-xs text-amber-700 dark:text-amber-400">Waiting for us to confirm your Lumicash payment{o.payment_ref ? ` (ref ${o.payment_ref})` : ""}. This typically takes a few minutes during business hours.</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
