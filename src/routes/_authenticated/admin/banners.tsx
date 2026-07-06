import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderDashboardPage } from "@/components/dashboard/placeholder-page";

export const Route = createFileRoute("/_authenticated/admin/banners")({
  head: () => ({ meta: [{ title: "Homepage banners · eBurundi Market" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <PlaceholderDashboardPage
      title="Homepage banners"
      description="Schedule hero carousel slides and marketing banners."
      breadcrumbs={["Dashboard","Admin","Banners"]}
    />
  ),
});
