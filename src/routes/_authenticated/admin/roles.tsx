import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderDashboardPage } from "@/components/dashboard/placeholder-page";

export const Route = createFileRoute("/_authenticated/admin/roles")({
  head: () => ({ meta: [{ title: "Roles & permissions · KaramaMarket" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <PlaceholderDashboardPage
      title="Roles & permissions"
      description="Grant super-admin, admin, store-owner, seller, and customer roles."
      breadcrumbs={["Dashboard","Admin","Roles"]}
    />
  ),
});
