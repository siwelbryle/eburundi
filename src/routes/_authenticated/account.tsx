import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useRoles } from "@/hooks/use-roles";
import { navFor, roleLabel } from "@/lib/dashboard-nav";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({ meta: [{ title: "Account · KaramaMarket" }, { name: "robots", content: "noindex" }] }),
  component: AccountPage,
});

function AccountPage() {
  const { user } = useAuth();
  const { primaryRole } = useRoles();
  return (
    <DashboardShell roleLabel={roleLabel(primaryRole)} groups={navFor(primaryRole)} breadcrumbs={["Dashboard", "Account"]}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Account settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences.</p>
        </div>
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle><CardDescription>Update your personal information.</CardDescription></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div><Label>Email</Label><Input value={user?.email ?? ""} disabled /></div>
            <div><Label>Full name</Label><Input placeholder="Your name" /></div>
            <div><Label>Phone</Label><Input placeholder="+257 …" /></div>
            <div><Label>City</Label><Input placeholder="Bujumbura" /></div>
            <div className="sm:col-span-2"><Button>Save changes</Button></div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
