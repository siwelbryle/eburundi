import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { CrudTable } from "@/components/admin/crud-table";
import { useRoles } from "@/hooks/use-roles";
import { navFor, roleLabel } from "@/lib/dashboard-nav";
import { supabase } from "@/integrations/supabase/client";
import { fmtFbu } from "@/lib/catalog";

export const Route = createFileRoute("/_authenticated/admin/products")({
  head: () => ({ meta: [{ title: "Products · EBM" }, { name: "robots", content: "noindex" }] }),
  component: AdminProducts,
});

function AdminProducts() {
  const { primaryRole } = useRoles();
  const [stores, setStores] = useState<{ value: string; label: string }[]>([]);
  const [cats, setCats] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    supabase.from("stores").select("id, name").then(({ data }) => setStores((data ?? []).map((s) => ({ value: s.id, label: s.name }))));
    supabase.from("categories").select("id, name").then(({ data }) => setCats((data ?? []).map((c) => ({ value: c.id, label: c.name }))));
  }, []);

  return (
    <DashboardShell roleLabel={roleLabel(primaryRole)} groups={navFor(primaryRole)} breadcrumbs={["Dashboard","Admin","Products"]}>
      <CrudTable<Record<string, unknown> & { id?: string }>
        title="Products"
        table="products"
        searchColumn="name"
        columns={[
          { key: "name", label: "Name" },
          { key: "price", label: "Price", render: (r) => fmtFbu(Number(r.price)) },
          { key: "stock", label: "Stock" },
          { key: "status", label: "Status" },
          { key: "is_featured", label: "Featured", render: (r) => (r.is_featured ? "Yes" : "—") },
        ]}
        fields={[
          { key: "name", label: "Name", required: true },
          { key: "slug", label: "Slug", required: true, hint: "URL-safe, e.g. tecno-spark-20" },
          { key: "store_id", label: "Store", type: "select", options: stores, required: true },
          { key: "category_id", label: "Category", type: "select", options: cats },
          { key: "price", label: "Price (FBu)", type: "number", required: true },
          { key: "compare_at_price", label: "Compare-at price", type: "number" },
          { key: "stock", label: "Stock", type: "number" },
          { key: "status", label: "Status", type: "select", options: [
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
            { value: "archived", label: "Archived" },
          ]},
          { key: "is_featured", label: "Featured", type: "boolean" },
          { key: "flash_sale_ends_at", label: "Flash sale ends at", type: "datetime" },
          { key: "description", label: "Description", type: "textarea" },
        ]}
        defaultRow={{ status: "published", stock: 0, currency: "BIF", images: [] }}
        transformOut={(r) => {
          const out = { ...r } as Record<string, unknown>;
          delete out.created_at; delete out.updated_at;
          return out;
        }}
      />
    </DashboardShell>
  );
}
