import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/static-page";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy · eBurundi Market" },
      { name: "description", content: "How eBurundi Market collects, uses, and protects your personal information." },
    ],
  }),
  component: () => (
    <StaticPage title="Privacy Policy" subtitle="Last updated: July 2026">
      <p>This policy explains what data we collect, how we use it, and the choices you have.</p>
      <h2 className="text-2xl font-semibold">Information we collect</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Account details: name, email, phone, addresses.</li>
        <li>Orders, payments (processed by our partners), and reviews.</li>
        <li>Device and usage data to secure and improve the service.</li>
      </ul>
      <h2 className="text-2xl font-semibold">How we use your data</h2>
      <p>To operate the marketplace, fulfil orders, prevent fraud, and communicate with you.</p>
      <h2 className="text-2xl font-semibold">Your rights</h2>
      <p>You can access, correct, or delete your data at any time from your account settings, or by contacting us at <a className="text-primary hover:underline" href="mailto:privacy@karamamarket.bi">privacy@karamamarket.bi</a>.</p>
    </StaticPage>
  ),
});
