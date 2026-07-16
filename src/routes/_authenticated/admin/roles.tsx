import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, UserCheck, Users } from "lucide-react";
import { useRoles } from "@/hooks/use-roles";
import { navFor, roleLabel } from "@/lib/dashboard-nav";

export const Route = createFileRoute("/_authenticated/admin/roles")({
  head: () => ({ meta: [{ title: "Roles · EBM" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const { primaryRole } = useRoles();
    return (
      <DashboardShell roleLabel={roleLabel(primaryRole)} groups={navFor(primaryRole)} breadcrumbs={["Dashboard","Admin","Roles"]}>
        <div className="mx-auto max-w-4xl space-y-4">
          <div>
            <h1 className="text-2xl font-bold">Roles & permissions</h1>
            <p className="text-sm text-muted-foreground">Grant super-admin, admin, store-owner, seller and customer roles.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Grant / revoke roles</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">Toggle roles for any user from the Users page.</p>
                <Button asChild><Link to="/admin/users">Open Users</Link></Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><UserCheck className="h-5 w-5" /> Role requests</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">Review pending seller and store-owner applications.</p>
                <Button asChild variant="outline"><Link to="/admin/role-requests">Open requests</Link></Button>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Role guide</CardTitle></CardHeader>
            <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
              <div><b>super_admin</b> — full platform control, incl. granting admins.</div>
              <div><b>admin</b> — manage catalog, orders, users.</div>
              <div><b>store_owner</b> — owns one or more stores and their products.</div>
              <div><b>seller</b> — manages products under an assigned store.</div>
              <div><b>customer</b> — default. Buys and reviews.</div>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    );
  },
});
