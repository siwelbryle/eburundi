import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Eye, Loader2, RefreshCw } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useRoles } from "@/hooks/use-roles";
import { navFor, roleLabel } from "@/lib/dashboard-nav";
import { supabase } from "@/integrations/supabase/client";
import { fmtFbu } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  head: () => ({ meta: [{ title: "Orders · EBM" }, { name: "robots", content: "noindex" }] }),
  component: AdminOrders,
});

type OrderRow = {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  payment_method: string;
  payment_status: string;
  payment_ref: string | null;
  payment_phone: string | null;
  total: number;
  subtotal: number;
  shipping: number;
  currency: string;
  created_at: string;
  shipping_address: Record<string, unknown> | null;
  order_items?: { id: string; name: string; price: number; quantity: number; image_url: string | null }[];
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  paid: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  processing: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  shipped: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
  delivered: "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
  cancelled: "bg-destructive/10 text-destructive",
  refunded: "bg-muted text-muted-foreground",
  awaiting_confirmation: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  failed: "bg-destructive/10 text-destructive",
};

function AdminOrders() {
  const { primaryRole } = useRoles();
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<OrderRow | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(id, name, price, quantity, image_url)")
      .order("created_at", { ascending: false })
      .limit(200);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setRows(((data as unknown) as OrderRow[]) ?? []);
  };

  useEffect(() => { load(); }, []);

  const update = async (id: string, patch: Partial<OrderRow>) => {
    const { error } = await supabase.from("orders").update(patch as never).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order updated");
    load();
    setSelected((s) => (s ? { ...s, ...patch } : s));
  };

  return (
    <DashboardShell roleLabel={roleLabel(primaryRole)} groups={navFor(primaryRole)} breadcrumbs={["Dashboard","Admin","Orders"]}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground">{rows.length} orders</p>
        </div>
        <Button variant="outline" size="icon" onClick={load}><RefreshCw className="h-4 w-4" /></Button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-16 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-16 text-center text-muted-foreground">No orders yet.</td></tr>
            ) : rows.map((o) => (
              <tr key={o.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">{o.order_number}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase">{o.payment_method}</span>
                    <Badge className={STATUS_COLORS[o.payment_status] || ""} variant="secondary">{o.payment_status}</Badge>
                  </div>
                </td>
                <td className="px-4 py-3"><Badge className={STATUS_COLORS[o.status] || ""} variant="secondary">{o.status}</Badge></td>
                <td className="px-4 py-3 font-semibold">{fmtFbu(Number(o.total))}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    {o.payment_status === "awaiting_confirmation" && (
                      <Button size="sm" variant="outline" onClick={() => update(o.id, { payment_status: "paid", status: "processing" })}>
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Mark paid
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" onClick={() => setSelected(o)}><Eye className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Order {selected?.order_number}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground">Payment status</div>
                  <Select value={selected.payment_status} onValueChange={(v) => update(selected.id, { payment_status: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["pending","awaiting_confirmation","paid","failed","refunded"].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground">Fulfillment</div>
                  <Select value={selected.status} onValueChange={(v) => update(selected.id, { status: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["pending","paid","processing","shipped","delivered","cancelled","refunded"].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase text-muted-foreground">Payment details</div>
                <div className="mt-1 rounded-lg border bg-muted/30 p-3 text-sm">
                  <div><b>Method:</b> {selected.payment_method}</div>
                  {selected.payment_ref && <div><b>Reference:</b> <span className="font-mono">{selected.payment_ref}</span></div>}
                  {selected.payment_phone && <div><b>Phone:</b> {selected.payment_phone}</div>}
                </div>
              </div>

              {selected.shipping_address && (
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground">Shipping</div>
                  <div className="mt-1 rounded-lg border bg-muted/30 p-3 text-sm">
                    {Object.entries(selected.shipping_address).map(([k, v]) => (
                      <div key={k}><b className="capitalize">{k}:</b> {String(v)}</div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs font-semibold uppercase text-muted-foreground">Items</div>
                <div className="mt-1 divide-y rounded-lg border">
                  {selected.order_items?.map((i) => (
                    <div key={i.id} className="flex items-center gap-3 p-2">
                      {i.image_url && <img src={i.image_url} alt="" className="h-10 w-10 rounded object-cover" />}
                      <div className="flex-1"><div className="text-sm font-semibold">{i.name}</div><div className="text-xs text-muted-foreground">Qty {i.quantity}</div></div>
                      <div className="text-sm font-semibold">{fmtFbu(Number(i.price) * i.quantity)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-3 text-sm">
                <span>Subtotal</span><span>{fmtFbu(Number(selected.subtotal))}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Shipping</span><span>{fmtFbu(Number(selected.shipping))}</span>
              </div>
              <div className="flex items-center justify-between text-base font-bold">
                <span>Total</span><span className="text-primary">{fmtFbu(Number(selected.total))}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
