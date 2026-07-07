import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderDashboardPage } from "@/components/dashboard/placeholder-page";

export const Route = createFileRoute("/_authenticated/admin/categories")({
  head: () => ({ meta: [{ title: "Categories · EBM" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <PlaceholderDashboardPage
      title="Categories"
      description="Curate categories, subcategories, and merchandising rules."
      breadcrumbs={["Dashboard","Admin","Categories"]}
    />
  ),
});
