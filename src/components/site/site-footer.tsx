import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";

const COLS: { title: string; items: { label: string; to: string }[] }[] = [
  {
    title: "Marketplace",
    items: [
      { label: "Shop", to: "/products" },
      { label: "Categories", to: "/products" },
      { label: "Flash sales", to: "/flash-sales" },
      { label: "Sellers", to: "/stores" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Help center", to: "/help" },
      { label: "Shipping", to: "/shipping" },
      { label: "Returns", to: "/returns" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            KaramaMarket — Burundi's trusted multi-vendor marketplace. Local sellers, real reviews, fast delivery.
          </p>
          <div className="flex gap-1.5 pt-2">
            <span className="h-2 w-8 rounded-full bg-primary" />
            <span className="h-2 w-8 rounded-full bg-success" />
            <span className="h-2 w-8 rounded-full border" />
          </div>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3 text-sm font-semibold">{col.title}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.items.map((i) => (
                <li key={i.label}>
                  <Link
                    to={i.to}
                    className="transition-colors hover:text-primary"
                  >
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} KaramaMarket. All rights reserved.</p>
          <p>Made in Burundi 🇧🇮</p>
        </div>
      </div>
    </footer>
  );
}
