import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderDashboardPage } from "@/components/dashboard/placeholder-page";

export const Route = createFileRoute("/_authenticated/admin/stores")({
  head: () => ({ meta: [{ title: "Stores · EBM" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <PlaceholderDashboardPage
      title="Stores"
      description="Approve, suspend, and moderate stores on the marketplace."
      breadcrumbs={["Dashboard","Admin","Stores"]}
    />
  ),
});
