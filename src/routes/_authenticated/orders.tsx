import { createFileRoute, Link } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRoles } from "@/hooks/use-roles";
import { navFor, roleLabel } from "@/lib/dashboard-nav";

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({ meta: [{ title: "Orders · KaramaMarket" }, { name: "robots", content: "noindex" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const { primaryRole } = useRoles();
  return (
    <DashboardShell roleLabel={roleLabel(primaryRole)} groups={navFor(primaryRole)} breadcrumbs={["Dashboard", "Orders"]}>
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold">My orders</h1>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> No orders yet</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">When you place an order it will appear here with status, tracking, and invoices.</p>
            <Button asChild><Link to="/products" search={{ category: "", q: "", sort: "featured" }}>Start shopping</Link></Button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
