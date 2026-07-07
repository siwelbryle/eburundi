import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderDashboardPage } from "@/components/dashboard/placeholder-page";

export const Route = createFileRoute("/_authenticated/seller/products")({
  head: () => ({ meta: [{ title: "Products · EBM" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <PlaceholderDashboardPage
      title="Products"
      description="Create, edit, and publish your product catalog."
      breadcrumbs={["Dashboard","Seller","Products"]}
    />
  ),
});
