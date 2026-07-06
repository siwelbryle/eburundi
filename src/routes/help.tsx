import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/static-page";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Center · eBurundi Market" },
      { name: "description", content: "Answers to common questions about ordering, delivery, returns, and selling on eBurundi Market." },
    ],
  }),
  component: () => (
    <StaticPage title="Help center" subtitle="Answers to the questions we get most often.">
      <h2 className="text-2xl font-semibold">Ordering</h2>
      <p><strong>How do I place an order?</strong> Add products to your cart, go to checkout, choose a delivery address and payment method, and confirm.</p>
      <p><strong>Can I order without an account?</strong> You can browse freely, but an account is required to checkout so we can track and deliver your order.</p>
      <h2 className="text-2xl font-semibold">Delivery</h2>
      <p><strong>How long does delivery take?</strong> Typically 1–3 days in Bujumbura and 2–5 days elsewhere in Burundi.</p>
      <h2 className="text-2xl font-semibold">Payments</h2>
      <p><strong>Which payment methods do you accept?</strong> Mobile money, cash on delivery, and bank cards (rolling out).</p>
      <h2 className="text-2xl font-semibold">Selling</h2>
      <p><strong>How do I become a seller?</strong> Create an account, then request seller access from your dashboard. Our team reviews new stores within 48h.</p>
      <p>Still need help? Visit our <a className="text-primary hover:underline" href="/contact">contact page</a>.</p>
    </StaticPage>
  ),
});
