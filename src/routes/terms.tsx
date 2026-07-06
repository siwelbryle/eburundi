import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/static-page";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service · eBurundi Market" },
      { name: "description", content: "The terms and conditions that govern the use of eBurundi Market." },
    ],
  }),
  component: () => (
    <StaticPage title="Terms of Service" subtitle="Last updated: July 2026">
      <p>By using eBurundi Market, you agree to these terms. Please read them carefully.</p>
      <h2 className="text-2xl font-semibold">Accounts</h2>
      <p>You are responsible for the accuracy of your account information and the security of your credentials.</p>
      <h2 className="text-2xl font-semibold">Orders and payments</h2>
      <p>Prices are shown in Burundian Franc (FBu). Sellers are responsible for the accuracy of their listings; eBurundi Market mediates disputes.</p>
      <h2 className="text-2xl font-semibold">Prohibited activities</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>Listing counterfeit, illegal, or unsafe products.</li>
        <li>Manipulating reviews or abusing coupons.</li>
        <li>Any activity that violates Burundian law.</li>
      </ul>
      <h2 className="text-2xl font-semibold">Contact</h2>
      <p>Questions? Email <a className="text-primary hover:underline" href="mailto:legal@karamamarket.bi">legal@karamamarket.bi</a>.</p>
    </StaticPage>
  ),
});
