import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/static-page";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping · EBM" },
      { name: "description", content: "Delivery zones, timelines, and fees for orders placed on EBM." },
    ],
  }),
  component: () => (
    <StaticPage title="Shipping & delivery" subtitle="Fast, reliable delivery across Burundi.">
      <h2 className="text-2xl font-semibold">Delivery zones</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>Bujumbura Mairie:</strong> 1–2 business days.</li>
        <li><strong>Gitega, Ngozi, Bujumbura Rural:</strong> 2–4 business days.</li>
        <li><strong>Other provinces:</strong> 3–7 business days.</li>
      </ul>
      <h2 className="text-2xl font-semibold">Shipping fees</h2>
      <p>Fees depend on weight, size, and destination. The exact amount is shown at checkout before you pay.</p>
      <h2 className="text-2xl font-semibold">Tracking</h2>
      <p>Every order gets a tracking number. Follow it in real time from <a className="text-primary hover:underline" href="/orders">My orders</a>.</p>
    </StaticPage>
  ),
});
