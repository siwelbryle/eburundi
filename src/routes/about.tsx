import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/static-page";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · eBurundi Market" },
      { name: "description", content: "eBurundi Market is Burundi's trusted multi-vendor marketplace connecting local sellers to shoppers nationwide." },
      { property: "og:title", content: "About eBurundi Market" },
      { property: "og:description", content: "Burundi's trusted multi-vendor marketplace." },
    ],
  }),
  component: () => (
    <StaticPage
      title="About eBurundi Market"
      subtitle="Burundi's trusted multi-vendor marketplace — built at home, for everyone."
    >
      <p>
        eBurundi Market exists to give Burundian sellers a modern place to build their business online,
        and to give shoppers a reliable way to discover local products, compare prices, and receive
        their orders quickly.
      </p>
      <h2 className="text-2xl font-semibold">Our mission</h2>
      <p>
        Empower every seller in Burundi — from village artisans to established boutiques — with the
        tools they need to compete online: a professional storefront, transparent reviews, safe
        payments, and dependable delivery.
      </p>
      <h2 className="text-2xl font-semibold">What makes us different</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Verified sellers and moderated listings.</li>
        <li>Prices in Burundian Franc, no hidden fees.</li>
        <li>Nationwide delivery and local pickup points.</li>
        <li>Support in Kirundi, French, and English.</li>
      </ul>
    </StaticPage>
  ),
});
