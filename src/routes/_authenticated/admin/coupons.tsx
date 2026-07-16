import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { CrudTable } from "@/components/admin/crud-table";
import { useRoles } from "@/hooks/use-roles";
import { navFor, roleLabel } from "@/lib/dashboard-nav";
import { fmtFbu } from "@/lib/catalog";

type Row = Record<string, unknown> & { id?: string };

export const Route = createFileRoute("/_authenticated/admin/coupons")({
  head: () => ({ meta: [{ title: "Coupons · EBM" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const { primaryRole } = useRoles();
    return (
      <DashboardShell roleLabel={roleLabel(primaryRole)} groups={navFor(primaryRole)} breadcrumbs={["Dashboard","Admin","Coupons"]}>
        <CrudTable<Row>
          title="Coupons"
          table="coupons"
          searchColumn="code"
          columns={[
            { key: "code", label: "Code" },
            { key: "discount_type", label: "Type" },
            { key: "discount_value", label: "Value", render: (r) => r.discount_type === "percent" ? `${r.discount_value}%` : fmtFbu(Number(r.discount_value)) },
            { key: "min_order", label: "Min order", render: (r) => fmtFbu(Number(r.min_order)) },
            { key: "used_count", label: "Used" },
            { key: "is_active", label: "Active", render: (r) => (r.is_active ? "Yes" : "—") },
          ]}
          fields={[
            { key: "code", label: "Code", required: true, placeholder: "WELCOME10" },
            { key: "description", label: "Description" },
            { key: "discount_type", label: "Type", type: "select", required: true, options: [
              { value: "percent", label: "Percent" },
              { value: "fixed", label: "Fixed FBu" },
            ]},
            { key: "discount_value", label: "Value", type: "number", required: true },
            { key: "min_order", label: "Min order (FBu)", type: "number" },
            { key: "usage_limit", label: "Usage limit", type: "number" },
            { key: "starts_at", label: "Starts at", type: "datetime" },
            { key: "expires_at", label: "Expires at", type: "datetime" },
            { key: "is_active", label: "Active", type: "boolean" },
          ]}
          defaultRow={{ is_active: true, discount_type: "percent", min_order: 0 }}
        />
      </DashboardShell>
    );
  },
});
