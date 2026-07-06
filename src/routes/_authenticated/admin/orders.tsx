import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderDashboardPage } from "@/components/dashboard/placeholder-page";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  head: () => ({ meta: [{ title: "Orders · KaramaMarket" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <PlaceholderDashboardPage
      title="Orders"
      description="Marketplace-wide order oversight and support tools."
      breadcrumbs={["Dashboard","Admin","Orders"]}
    />
  ),
});
