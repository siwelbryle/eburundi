import { Logo } from "./logo";

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
        {[
          { title: "Marketplace", items: ["Shop", "Categories", "Flash sales", "Sellers"] },
          { title: "Support", items: ["Help center", "Shipping", "Returns", "Contact"] },
          { title: "Company", items: ["About", "Careers", "Privacy", "Terms"] },
        ].map((col) => (
          <div key={col.title}>
            <h3 className="mb-3 text-sm font-semibold">{col.title}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.items.map((i) => (
                <li key={i} className="cursor-not-allowed opacity-70">{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Soko Burundi. All rights reserved.</p>
          <p>Made in Burundi 🇧🇮</p>
        </div>
      </div>
    </footer>
  );
}
