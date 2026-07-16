import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { CrudTable } from "@/components/admin/crud-table";
import { useRoles } from "@/hooks/use-roles";
import { navFor, roleLabel } from "@/lib/dashboard-nav";

type Row = Record<string, unknown> & { id?: string };

export const Route = createFileRoute("/_authenticated/admin/categories")({
  head: () => ({ meta: [{ title: "Categories · EBM" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const { primaryRole } = useRoles();
    return (
      <DashboardShell roleLabel={roleLabel(primaryRole)} groups={navFor(primaryRole)} breadcrumbs={["Dashboard","Admin","Categories"]}>
        <CrudTable<Row>
          title="Categories"
          table="categories"
          searchColumn="name"
          orderBy={{ column: "sort_order", ascending: true }}
          columns={[
            { key: "name", label: "Name" },
            { key: "slug", label: "Slug" },
            { key: "sort_order", label: "Order" },
            { key: "is_active", label: "Active", render: (r) => (r.is_active ? "Yes" : "—") },
          ]}
          fields={[
            { key: "name", label: "Name", required: true },
            { key: "slug", label: "Slug", required: true },
            { key: "image_url", label: "Image URL" },
            { key: "sort_order", label: "Sort order", type: "number" },
            { key: "is_active", label: "Active", type: "boolean" },
            { key: "description", label: "Description", type: "textarea" },
          ]}
          defaultRow={{ is_active: true, sort_order: 0 }}
        />
      </DashboardShell>
    );
  },
});
