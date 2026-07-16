import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { CrudTable } from "@/components/admin/crud-table";
import { useRoles } from "@/hooks/use-roles";
import { navFor, roleLabel } from "@/lib/dashboard-nav";

type Row = Record<string, unknown> & { id?: string };

export const Route = createFileRoute("/_authenticated/admin/banners")({
  head: () => ({ meta: [{ title: "Banners · EBM" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const { primaryRole } = useRoles();
    return (
      <DashboardShell roleLabel={roleLabel(primaryRole)} groups={navFor(primaryRole)} breadcrumbs={["Dashboard","Admin","Banners"]}>
        <CrudTable<Row>
          title="Banners"
          table="banners"
          searchColumn="title"
          orderBy={{ column: "position", ascending: true }}
          columns={[
            { key: "image_url", label: "Preview", render: (r) => r.image_url ? <img src={String(r.image_url)} alt="" className="h-10 w-20 rounded object-cover" /> : "—" },
            { key: "title", label: "Title" },
            { key: "position", label: "Order" },
            { key: "is_active", label: "Active", render: (r) => (r.is_active ? "Yes" : "—") },
          ]}
          fields={[
            { key: "title", label: "Title", required: true },
            { key: "subtitle", label: "Subtitle" },
            { key: "image_url", label: "Image URL", required: true },
            { key: "link_url", label: "Link URL", placeholder: "/flash-sales" },
            { key: "position", label: "Position", type: "number" },
            { key: "is_active", label: "Active", type: "boolean" },
            { key: "starts_at", label: "Starts at", type: "datetime" },
            { key: "ends_at", label: "Ends at", type: "datetime" },
          ]}
          defaultRow={{ is_active: true, position: 0 }}
        />
      </DashboardShell>
    );
  },
});
