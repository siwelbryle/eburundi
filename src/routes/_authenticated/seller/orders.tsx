import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderDashboardPage } from "@/components/dashboard/placeholder-page";

export const Route = createFileRoute("/_authenticated/seller/orders")({
  head: () => ({ meta: [{ title: "Orders · EBM" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <PlaceholderDashboardPage
      title="Orders"
      description="Track incoming orders, mark them shipped, and issue refunds."
      breadcrumbs={["Dashboard","Seller","Orders"]}
    />
  ),
});
