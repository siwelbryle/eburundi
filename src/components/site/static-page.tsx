import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export function StaticPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>}
        </div>
      </section>
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="prose prose-neutral max-w-none dark:prose-invert space-y-6 text-[15px] leading-relaxed text-foreground/90">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
