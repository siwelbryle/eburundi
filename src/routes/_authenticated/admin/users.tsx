import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Copy, Loader2, RefreshCw, Shield, ShieldOff } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useRoles } from "@/hooks/use-roles";
import { navFor, roleLabel } from "@/lib/dashboard-nav";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({ meta: [{ title: "Users · EBM" }, { name: "robots", content: "noindex" }] }),
  component: AdminUsers,
});

const ALL_ROLES = ["super_admin","admin","store_owner","seller","customer"] as const;
type AppRole = typeof ALL_ROLES[number];

type Profile = { id: string; full_name: string | null; email: string | null; phone: string | null; created_at: string };
type RoleRow = { user_id: string; role: AppRole };

function AdminUsers() {
  const { primaryRole } = useRoles();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, email, phone, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    setProfiles((p ?? []) as Profile[]);
    setRoles(((r ?? []) as unknown) as RoleRow[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const rolesFor = (uid: string) => roles.filter((r) => r.user_id === uid).map((r) => r.role);

  const toggle = async (uid: string, role: AppRole, has: boolean) => {
    if (has) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", role);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: uid, role } as never);
      if (error) return toast.error(error.message);
    }
    toast.success(has ? `Revoked ${role}` : `Granted ${role}`);
    load();
  };

  const filtered = profiles.filter((p) => {
    if (!q) return true;
    const n = q.toLowerCase();
    return (p.email ?? "").toLowerCase().includes(n) || (p.full_name ?? "").toLowerCase().includes(n);
  });

  return (
    <DashboardShell roleLabel={roleLabel(primaryRole)} groups={navFor(primaryRole)} breadcrumbs={["Dashboard","Admin","Users"]}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold">Users</h1><p className="text-sm text-muted-foreground">{filtered.length} users</p></div>
        <div className="flex items-center gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search email or name…" className="w-64" />
          <Button variant="outline" size="icon" onClick={load}><RefreshCw className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Roles</th>
              <th className="px-4 py-3 text-right">Grant / revoke</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-16 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></td></tr>
            ) : filtered.map((p) => {
              const userRoles = rolesFor(p.id);
              return (
                <tr key={p.id} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{p.full_name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{p.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => { navigator.clipboard.writeText(p.id); toast.success("Copied"); }} className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1 font-mono text-[11px] hover:bg-muted/70">
                      {p.id.slice(0, 8)}… <Copy className="h-3 w-3" />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {userRoles.length ? userRoles.map((r) => <Badge key={r} variant="secondary">{r}</Badge>) : <span className="text-muted-foreground">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-1">
                      {ALL_ROLES.map((r) => {
                        const has = userRoles.includes(r);
                        return (
                          <Button key={r} size="sm" variant={has ? "default" : "outline"} onClick={() => toggle(p.id, r, has)} className="text-xs">
                            {has ? <ShieldOff className="mr-1 h-3 w-3" /> : <Shield className="mr-1 h-3 w-3" />}
                            {r}
                          </Button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
