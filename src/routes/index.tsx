import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Shield, Store, Truck } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const categories = [
  { name: "Electronics", emoji: "📱" },
  { name: "Fashion", emoji: "👗" },
  { name: "Home & Living", emoji: "🛋️" },
  { name: "Beauty", emoji: "💄" },
  { name: "Groceries", emoji: "🥑" },
  { name: "Sports", emoji: "⚽" },
  { name: "Toys & Kids", emoji: "🧸" },
  { name: "Books", emoji: "📚" },
];

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-90"
            style={{ background: "var(--gradient-hero)" }}
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.35),transparent_40%),radial-gradient(circle_at_80%_90%,rgba(255,255,255,0.25),transparent_45%)]"
          />
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 text-primary-foreground md:grid-cols-2 md:py-28">
            <div className="flex flex-col justify-center">
              <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                🇧🇮 Made for Burundi · Trusted vendors
              </span>
              <h1 className="text-4xl font-bold leading-[1.05] md:text-6xl">
                The marketplace <br />
                <span className="opacity-90">everyone in Burundi</span> <br />
                is shopping on.
              </h1>
              <p className="mt-6 max-w-lg text-base opacity-90 md:text-lg">
                Thousands of products from local sellers and international brands — delivered fast,
                paid securely, backed by real reviews.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" variant="secondary" className="font-semibold">
                  Start shopping
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground">
                  <Link to="/auth">Become a seller</Link>
                </Button>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="relative mx-auto grid h-full max-w-md grid-cols-2 gap-4">
                {[
                  { emoji: "📦", label: "1,200+ sellers" },
                  { emoji: "🚚", label: "Fast delivery" },
                  { emoji: "🛡️", label: "Buyer protection" },
                  { emoji: "⭐", label: "Real reviews" },
                ].map((c, i) => (
                  <div
                    key={c.label}
                    className="rounded-2xl bg-white/15 p-6 backdrop-blur transition hover:scale-[1.02]"
                    style={{ transform: `translateY(${i % 2 === 0 ? "0" : "24px"})` }}
                  >
                    <div className="text-4xl">{c.emoji}</div>
                    <div className="mt-3 text-sm font-medium">{c.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="border-b bg-muted/30">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-3">
            {[
              { icon: Truck, title: "Fast delivery", desc: "Nationwide shipping in 24–72h" },
              { icon: Shield, title: "Buyer protection", desc: "Refund if it doesn't arrive" },
              { icon: Store, title: "Trusted sellers", desc: "Verified stores only" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">{title}</div>
                  <div className="text-sm text-muted-foreground">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold">Shop by category</h2>
              <p className="mt-1 text-muted-foreground">Explore what's popular today.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {categories.map((c) => (
              <div
                key={c.name}
                className="group flex cursor-pointer flex-col items-center gap-2 rounded-2xl border bg-card p-5 shadow-card transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant"
              >
                <div className="text-3xl transition group-hover:scale-110">{c.emoji}</div>
                <div className="text-center text-sm font-medium">{c.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-24">
          <div className="relative overflow-hidden rounded-3xl border bg-card p-10 shadow-card md:p-16">
            <div
              aria-hidden
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20"
              style={{ background: "var(--gradient-primary)" }}
            />
            <div className="relative grid gap-6 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-3xl font-bold md:text-4xl">Sell on Soko Burundi</h2>
                <p className="mt-3 max-w-lg text-muted-foreground">
                  Reach thousands of buyers, manage your store from one dashboard, and grow with
                  us. No setup fees.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Button asChild size="lg">
                  <Link to="/auth">Open your store</Link>
                </Button>
                <Button size="lg" variant="outline">
                  Learn more
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
