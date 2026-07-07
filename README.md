# eBurundi Market

Burundi's multi-vendor marketplace — a production-grade storefront, seller
back-office, and admin console built on the Lovable stack.

Buyers browse products from verified Burundian sellers, add to cart / wishlist,
and check out (mock in Phase 1). Sellers manage their store, catalog, and
orders. Admins moderate users, stores, categories, coupons, and banners.

---

## Tech stack

| Layer          | Choice                                                         |
| -------------- | -------------------------------------------------------------- |
| Framework      | **TanStack Start v1** (React 19, SSR, file-based routing)      |
| Build tool     | **Vite 7**                                                     |
| Styling        | **Tailwind CSS v4** via `src/styles.css` + shadcn/ui           |
| Icons          | **lucide-react**                                                |
| State (client) | React hooks + `localStorage` (cart / wishlist / theme)         |
| Backend        | **Lovable Cloud** (managed Postgres + Auth + Storage)          |
| Server logic   | **TanStack `createServerFn`** with auth middleware             |
| Auth           | Email / password + **Google OAuth**                            |
| Runtime        | Cloudflare Workers edge (bundled at build)                     |

Lovable AI Gateway is available for future AI features (recommendations, review
summaries) with no extra key setup.

---

## Project layout

```text
src/
├── routes/                      # File-based routing (TanStack Router)
│   ├── __root.tsx               # HTML shell, global head metadata
│   ├── index.tsx                # Homepage (hero, categories, flash sales…)
│   ├── products.tsx             # Catalog with filters/sort
│   ├── products.$id.tsx         # Product detail
│   ├── categories.$slug.tsx     # Category listing
│   ├── stores.index.tsx         # All sellers
│   ├── stores.$slug.tsx         # Seller storefront
│   ├── cart.tsx / wishlist.tsx  # Shopping state pages
│   ├── checkout.tsx             # Mock checkout (Phase 1)
│   ├── auth.tsx                 # Sign in / sign up (email + Google)
│   ├── about / careers / contact / privacy / terms / help / shipping
│   │   / returns / flash-sales                     # Static & marketing pages
│   └── _authenticated/          # Route gate — redirects to /auth if no session
│       ├── dashboard.tsx        # Role-aware landing
│       ├── orders.tsx / account.tsx / addresses.tsx
│       ├── seller/              # store, products, orders, analytics
│       └── admin/               # users, roles, stores, products,
│                                # categories, orders, coupons, banners
├── components/
│   ├── site/                    # header, footer, logo, theme toggle, static shell
│   ├── shop/                    # product card, etc.
│   ├── dashboard/               # dashboard shell + placeholder pages
│   └── ui/                      # shadcn primitives
├── hooks/                       # use-auth, use-roles, use-shop-store
├── lib/                         # catalog (mock data), dashboard-nav, utils
├── integrations/supabase/       # AUTO-GENERATED — do not edit
├── styles.css                   # Tailwind v4 theme tokens
└── start.ts / router.tsx        # TanStack Start bootstrap
supabase/
├── config.toml                  # Auto-generated
└── migrations/                  # SQL migrations (schema + RLS + grants)
```

---

## Routing

TanStack Start uses **file-based routing**. Add a page by creating a file in
`src/routes/`; `routeTree.gen.ts` regenerates automatically.

| File                          | URL                       |
| ----------------------------- | ------------------------- |
| `index.tsx`                   | `/`                       |
| `products.$id.tsx`            | `/products/:id`           |
| `categories.$slug.tsx`        | `/categories/:slug`       |
| `_authenticated/dashboard.tsx`| `/dashboard` (auth-gated) |

Protected routes live under `src/routes/_authenticated/` — the `route.tsx`
gate redirects unauthenticated visitors to `/auth`.

---

## Data model (Phase 1 foundation)

Schema is defined in `supabase/migrations/`. All tables live in `public`, have
RLS enabled, and are exposed via explicit `GRANT` statements.

Core tables:

- `profiles` — 1:1 with `auth.users`, holds display name / avatar / phone
- `user_roles` — role assignments (`admin`, `seller`, `customer`) checked by a
  `has_role(uuid, app_role)` SECURITY DEFINER function to avoid RLS recursion
- `stores` — seller storefronts (name, slug, banner, owner)
- `categories` — taxonomy
- `products` — priced catalog rows linked to store + category
- `orders` / `order_items` — checkout output (mock in Phase 1)
- `reviews` — per-product buyer reviews
- `coupons` — promo codes
- `banners` — homepage merchandising slots
- `addresses` — buyer shipping addresses

Never store `role` on `profiles` — always on `user_roles` (privilege-escalation
safety).

---

## Auth

- Email + password via Lovable Cloud auth.
- Google OAuth (only social provider in Phase 1).
- Session hydrates on the client; server functions read the caller via the
  `requireSupabaseAuth` middleware.
- Role checks use the `has_role(auth.uid(), 'admin' | 'seller' | 'customer')`
  Postgres function.

---

## Design system

Tokens live in `src/styles.css` (`@theme` block) — never hardcode colors in
components. Key semantic tokens:

- `--primary` — brand red (from the reference design)
- `--success` — green CTAs ("Add to cart", "Shop the sale")
- `--background`, `--card`, `--muted`, `--foreground` — surfaces
- `--shadow-card`, `--shadow-elegant` — elevation

Typography pairs a display font for headings with a neutral UI font for body.
Dark mode is provided via the `.dark` class on `<html>`; the theme toggle in
the header persists preference in `localStorage`.

---

## Client-side shop state

`src/hooks/use-shop-store.ts` exposes `useCart()` and `useWishlist()` backed by
`localStorage`. This lets the storefront work end-to-end (add, remove, quantity,
mock checkout) before real orders are wired to the DB in Phase 2.

---

## Getting started

```bash
bun install
bun run dev      # http://localhost:8080
bun run build    # production build
```

Environment variables are managed by Lovable Cloud and injected automatically
(`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, …). Never commit real
service-role keys — they are not accessible on Lovable Cloud anyway.

---

## Roadmap

**Phase 1 (current)** — foundation

- ✅ Design system + full page structure (storefront, dashboards, static pages)
- ✅ Auth (email + Google) with role gating
- ✅ Database schema, RLS, grants
- ✅ Client cart / wishlist / mock checkout

**Phase 2** — commerce wiring

- Replace mock `src/lib/catalog.ts` with real product queries
- Seller product CRUD, image uploads (Storage)
- Order lifecycle: create → pay → fulfill → deliver
- Reviews, coupons, banners writable from admin
- Seed realistic demo data (200 users, 30 sellers, 20 categories,
  100+ products, orders, reviews, coupons, banners)

**Phase 3** — payments & polish

- Real payments (Lumicash / card gateway)
- Notifications (email + in-app)
- Seller analytics
- SEO: per-product OG images, sitemap, structured data

---

## Contributing / conventions

- Server logic → `createServerFn` from `@tanstack/react-start` (not edge
  functions, unless it's a webhook / cron / public API).
- Public tables → always add `GRANT` + `ENABLE ROW LEVEL SECURITY` + policies
  in the same migration.
- Never edit auto-generated files: `src/routeTree.gen.ts`,
  `src/integrations/supabase/*`, `supabase/config.toml`, `.env`.
- Prefer semantic Tailwind tokens over hardcoded colors.

---

© eBurundi Market — Made in Burundi 🇧🇮
