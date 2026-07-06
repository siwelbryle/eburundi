import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderDashboardPage } from "@/components/dashboard/placeholder-page";

export const Route = createFileRoute("/_authenticated/seller/store")({
  head: () => ({ meta: [{ title: "My store · KaramaMarket" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <PlaceholderDashboardPage
      title="My store"
      description="Manage your store profile, branding, and payout details."
      breadcrumbs={["Dashboard","Seller","Store"]}
    />
  ),
});
