
## Scope

1. All 9 admin pages become real CRUD wired to the database.
2. Storefront (home, products list, product detail, category, store, flash sales, cart, wishlist) reads from `products` / `categories` / `stores` / `banners` / `coupons` in the database.
3. Real checkout with **Lumicash mobile-money** as the primary method, plus card and cash-on-delivery as manual options. Orders persist to `orders` + `order_items` with a proper status lifecycle.

## 1. Database migration

Additive migration on the existing tables:

- `products`: ensure `store_id`, `category_id`, `price`, `compare_at_price`, `stock`, `image_url`, `images jsonb`, `is_active`, `rating`, `reviews_count`, `sku`, `slug`. Add missing columns.
- `orders`: add `payment_method` (`lumicash` | `card` | `cod`), `payment_status` (`pending` | `awaiting_confirmation` | `paid` | `failed` | `refunded`), `payment_ref` (Lumicash transaction ID entered by buyer), `shipping_address jsonb`, `subtotal`, `shipping_fee`, `total`, `currency` default `'BIF'`, `coupon_code`.
- `order_items`: `order_id`, `product_id`, `title_snapshot`, `unit_price`, `qty`, `store_id`.
- `site_settings`: add key/value rows for `lumicash_merchant_number`, `lumicash_merchant_name`, `support_email`.
- Trigger `handle_order_totals` to recompute totals from items.
- RLS + GRANTs on all touched tables. Buyer sees own orders; seller sees orders containing their store's items; admin sees all.

## 2. Storefront on DB

- New `src/lib/products.functions.ts` with public server fns (publishable-key client) — `listProducts({ q, category, sort, storeId, flashOnly, limit })`, `getProduct(id)`, `listCategories()`, `listStores()`, `listBanners()`.
- Replace `src/lib/catalog.ts` usage in `index.tsx`, `products.tsx`, `products.$id.tsx`, `categories.$slug.tsx`, `stores.$slug.tsx`, `stores.index.tsx`, `flash-sales.tsx`, `wishlist.tsx`, `cart.tsx`, `checkout.tsx`. Keep `fmtFbu` helper.
- Seed migration inserts ~30 diversified Burundi products across the existing 10 stores + 8 categories + 3 banners.

## 3. Admin pages (all dynamic)

Each becomes a full CRUD table with create dialog, inline edit, delete confirm, search, pagination. Wired via `createServerFn` + `requireSupabaseAuth` + `has_role('admin')` guard.

- `/admin/users` — list profiles + roles, grant/revoke roles, disable user (soft flag).
- `/admin/stores` — approve/suspend, edit name/slug/description/owner.
- `/admin/products` — full CRUD, image URL, stock, price, flash sale toggle.
- `/admin/orders` — list with filters, view items, update `status` and `payment_status`, mark Lumicash `paid`.
- `/admin/categories` — CRUD + parent, slug, icon.
- `/admin/coupons` — CRUD, code, percent/amount, expiry, min total, active.
- `/admin/banners` — CRUD, image, link, position, active window.
- `/admin/roles` — grant/revoke `super_admin`/`admin`/`store_owner`/`seller` for any user.
- `/admin/role-requests` — already exists, wire the approve/deny to the new server fns (email via Gmail connector when linked, no-op otherwise).

Shared building block: `<AdminDataTable>` component (columns, actions, dialog form) so each page is small.

Seller dashboard pages (`/seller/store`, `/seller/products`, `/seller/orders`, `/seller/analytics`) become dynamic on the same server fns, scoped by the seller's `store_id`.

## 4. Real Lumicash checkout

Lumicash has no public API for merchants, so this is a **manual-confirmation flow** that matches how real Burundi merchants take Lumicash:

1. Checkout page shows the merchant Lumicash number + amount + a generated `order_ref` (e.g. `EBM-4F2A9C`).
2. Buyer sends the amount to the merchant number from their Lumicash app, then pastes the Lumicash transaction ID and phone number into the form.
3. `createOrder` server fn writes the order with `payment_method='lumicash'`, `payment_status='awaiting_confirmation'`, and `payment_ref` = the transaction ID.
4. Admin sees it in `/admin/orders`, checks their Lumicash statement, clicks **Mark paid** → status flips to `paid` and buyer sees "confirmed" on `/orders`.
5. Same server fn also supports `payment_method='cod'` (skips ref, sets `payment_status='pending'`) and `payment_method='card'` (also `pending`; card capture would need Stripe — clearly labelled "not automated yet").

Merchant number and support email are read from `site_settings`, editable by admin.

## Out of scope for this batch

- Automated card capture (would need Stripe; user picked Lumicash).
- SMS notifications to buyers on payment confirmation (needs a paid SMS provider).
- Full i18n on new admin screens.

Reply "go" and I'll ship it end to end.
