import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2, Clock } from "lucide-react";
import { toast } from "sonner";
import { useRoles } from "@/hooks/use-roles";
import { navFor, roleLabel } from "@/lib/dashboard-nav";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/admin/role-requests")({
  head: () => ({ meta: [{ title: "Role requests · EBM" }, { name: "robots", content: "noindex" }] }),
  component: RoleRequestsPage,
});

type Row = {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  requested_role: "seller" | "store_owner" | "customer" | "admin" | "super_admin";
  status: "pending" | "approved" | "denied";
  note: string | null;
  created_at: string;
};

function RoleRequestsPage() {
  const { primaryRole, isAdmin } = useRoles();
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["role-requests"],
    enabled: isAdmin,
    queryFn: async (): Promise<Row[]> => {
      const { data, error } = await supabase
        .from("role_requests" as never)
        .select("id,user_id,email,full_name,requested_role,status,note,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const mutate = useMutation({
    mutationFn: async ({ row, decision }: { row: Row; decision: "approved" | "denied" }) => {
      // 1) Update the request
      const { error: upErr } = await supabase
        .from("role_requests" as never)
        .update({
          status: decision,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        } as never)
        .eq("id" as never, row.id as never);
      if (upErr) throw upErr;

      // 2) If approved, grant the role
      if (decision === "approved") {
        const { error: rErr } = await supabase
          .from("user_roles" as never)
          .insert({ user_id: row.user_id, role: row.requested_role } as never);
        // ignore duplicate-role error
        if (rErr && !rErr.message.toLowerCase().includes("duplicate")) throw rErr;
      }
    },
    onSuccess: (_, vars) => {
      toast.success(vars.decision === "approved" ? "Access granted." : "Request denied — user will be notified.");
      qc.invalidateQueries({ queryKey: ["role-requests"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to update request"),
  });

  const rows = query.data ?? [];
  const pending = rows.filter((r) => r.status === "pending");
  const decided = rows.filter((r) => r.status !== "pending");

  return (
    <DashboardShell
      roleLabel={roleLabel(primaryRole)}
      groups={navFor(primaryRole)}
      breadcrumbs={["Dashboard", "Admin", "Role requests"]}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Role requests</h1>
          <p className="text-muted-foreground">Review seller and store-owner applications.</p>
        </div>

        <Card>
          <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-2"><Clock className="h-4 w-4" /> Pending</CardTitle>
              <CardDescription>New accounts waiting for approval.</CardDescription>
            </div>
            <Badge variant="secondary">{pending.length}</Badge>
          </CardHeader>
          <CardContent>
            {query.isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : pending.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending requests. 🎉</p>
            ) : (
              <ul className="divide-y">
                {pending.map((r) => (
                  <li key={r.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{r.full_name ?? r.email}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {r.email} · wants <span className="font-medium">{r.requested_role.replace("_", " ")}</span>
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={mutate.isPending}
                        onClick={() => mutate.mutate({ row: r, decision: "denied" })}
                      >
                        <X className="mr-1 h-4 w-4" /> Deny
                      </Button>
                      <Button
                        size="sm"
                        disabled={mutate.isPending}
                        onClick={() => mutate.mutate({ row: r, decision: "approved" })}
                      >
                        <Check className="mr-1 h-4 w-4" /> Approve
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {decided.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent decisions</CardTitle>
              <CardDescription>The last 20 approvals and denials.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="divide-y text-sm">
                {decided.slice(0, 20).map((r) => (
                  <li key={r.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate">{r.full_name ?? r.email} — <span className="text-muted-foreground">{r.requested_role.replace("_", " ")}</span></p>
                    </div>
                    <Badge variant={r.status === "approved" ? "default" : "outline"} className="shrink-0">
                      {r.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
