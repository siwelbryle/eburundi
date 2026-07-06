import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/static-page";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Returns & refunds · eBurundi Market" },
      { name: "description", content: "How to return an item and request a refund on eBurundi Market." },
    ],
  }),
  component: () => (
    <StaticPage title="Returns & refunds" subtitle="Not what you expected? We'll make it right.">
      <h2 className="text-2xl font-semibold">Return window</h2>
      <p>You have <strong>7 days</strong> from delivery to request a return for most items. Items must be unused and in their original packaging.</p>
      <h2 className="text-2xl font-semibold">Non-returnable items</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Perishable food and beverages.</li>
        <li>Personal care and hygiene items once opened.</li>
        <li>Custom or personalised orders.</li>
      </ul>
      <h2 className="text-2xl font-semibold">How to return</h2>
      <ol className="list-decimal pl-6 space-y-1">
        <li>Open the order from <a className="text-primary hover:underline" href="/orders">My orders</a>.</li>
        <li>Tap "Request a return" and pick a reason.</li>
        <li>Drop the parcel at any eBurundi Market pickup point.</li>
      </ol>
      <p>Refunds are issued within 5 business days after the item is inspected.</p>
    </StaticPage>
  ),
});
