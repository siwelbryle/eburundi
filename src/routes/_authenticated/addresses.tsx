import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRoles } from "@/hooks/use-roles";
import { navFor, roleLabel } from "@/lib/dashboard-nav";

export const Route = createFileRoute("/_authenticated/addresses")({
  head: () => ({ meta: [{ title: "Addresses · KaramaMarket" }, { name: "robots", content: "noindex" }] }),
  component: AddressesPage,
});

function AddressesPage() {
  const { primaryRole } = useRoles();
  return (
    <DashboardShell roleLabel={roleLabel(primaryRole)} groups={navFor(primaryRole)} breadcrumbs={["Dashboard", "Addresses"]}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Shipping addresses</h1>
          <Button>Add address</Button>
        </div>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" /> No addresses saved</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Add a shipping address to speed up checkout on your next order.
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
