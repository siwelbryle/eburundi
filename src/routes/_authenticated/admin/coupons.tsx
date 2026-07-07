import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderDashboardPage } from "@/components/dashboard/placeholder-page";

export const Route = createFileRoute("/_authenticated/admin/coupons")({
  head: () => ({ meta: [{ title: "Coupons · EBM" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <PlaceholderDashboardPage
      title="Coupons"
      description="Run promotions with percentage, fixed-amount, and free-shipping codes."
      breadcrumbs={["Dashboard","Admin","Coupons"]}
    />
  ),
});
