import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/static-page";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers · KaramaMarket" },
      { name: "description", content: "Join the KaramaMarket team and help build Burundi's leading marketplace." },
    ],
  }),
  component: () => (
    <StaticPage
      title="Careers"
      subtitle="Help us build the marketplace Burundi deserves."
    >
      <p>
        We're a small, ambitious team based in Bujumbura. We hire engineers, designers, operations
        specialists, and customer support agents who care about local commerce.
      </p>
      <h2 className="text-2xl font-semibold">Open roles</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Full-stack Engineer — Bujumbura / Remote</li>
        <li>Seller Success Manager — Bujumbura</li>
        <li>Logistics Coordinator — Gitega</li>
        <li>Customer Support (Kirundi / French) — Remote</li>
      </ul>
      <p>
        Interested? Send your CV to <a className="text-primary hover:underline" href="mailto:careers@karamamarket.bi">careers@karamamarket.bi</a>.
      </p>
    </StaticPage>
  ),
});
