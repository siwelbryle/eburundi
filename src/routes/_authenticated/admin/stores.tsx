import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { CrudTable } from "@/components/admin/crud-table";
import { useRoles } from "@/hooks/use-roles";
import { navFor, roleLabel } from "@/lib/dashboard-nav";

type Row = Record<string, unknown> & { id?: string };

export const Route = createFileRoute("/_authenticated/admin/stores")({
  head: () => ({ meta: [{ title: "Stores · EBM" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const { primaryRole } = useRoles();
    return (
      <DashboardShell roleLabel={roleLabel(primaryRole)} groups={navFor(primaryRole)} breadcrumbs={["Dashboard","Admin","Stores"]}>
        <CrudTable<Row>
          title="Stores"
          table="stores"
          searchColumn="name"
          columns={[
            { key: "logo_url", label: "", render: (r) => r.logo_url ? <img src={String(r.logo_url)} alt="" className="h-8 w-8 rounded object-cover" /> : "—" },
            { key: "name", label: "Name" },
            { key: "slug", label: "Slug" },
            { key: "status", label: "Status" },
            { key: "rating", label: "Rating" },
          ]}
          fields={[
            { key: "name", label: "Name", required: true },
            { key: "slug", label: "Slug", required: true },
            { key: "owner_id", label: "Owner user ID", required: true, hint: "Copy from /admin/users" },
            { key: "logo_url", label: "Logo URL" },
            { key: "banner_url", label: "Banner URL" },
            { key: "status", label: "Status", type: "select", options: [
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "suspended", label: "Suspended" },
            ]},
            { key: "description", label: "Description", type: "textarea" },
          ]}
          defaultRow={{ status: "approved", rating: 0 }}
        />
      </DashboardShell>
    );
  },
});
