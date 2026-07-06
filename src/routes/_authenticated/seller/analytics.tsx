import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderDashboardPage } from "@/components/dashboard/placeholder-page";

export const Route = createFileRoute("/_authenticated/seller/analytics")({
  head: () => ({ meta: [{ title: "Analytics · KaramaMarket" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <PlaceholderDashboardPage
      title="Analytics"
      description="Sales trends, top products, and customer insights."
      breadcrumbs={["Dashboard","Seller","Analytics"]}
    />
  ),
});
