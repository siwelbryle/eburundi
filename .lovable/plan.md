## What I'll ship (in order)

### 1. Branding & responsive
- Set EBM logo as favicon (`public/favicon.png` + `<link>` in `__root.tsx`, delete default `favicon.ico`).
- Sweep pages that break on mobile: header search + category strip, product grids, dashboard shells, help/contact layouts. Apply the `grid-cols-[minmax(0,1fr)_auto] + min-w-0 + shrink-0` pattern where rows mix text and widgets.

### 2. Diversified mock catalog (`src/lib/catalog.ts`)
- Expand from 60 → ~80 products with **real, varied Burundi-relevant titles** (kitenge dresses, Isano coffee beans, Bujumbura-brewed honey, solar lamps, phone accessories, textbooks in Kirundi/French, etc.) — no repeating "#N" suffixes.
- Widen price range **8,000 – 950,000 FBu**, varied discounts, varied ratings/reviews.
- 10 sellers already exist; distribute products unevenly so some stores feel bigger. Add a few "buyer testimonials" array used on the home page.

### 3. Contact page (`src/routes/contact.tsx`)
- Phone → `+257 69 393 285`, emails → `eburundimarket@gmail.com` (primary), `siwelbryl@gmail.com` (support).
- Form submits to a new server route `/api/contact` that sends via **Gmail connector** to `siwelbryl@gmail.com`. Zod-validated (name/email/message, length caps). Requires user to connect Gmail — I'll trigger `standard_connectors--connect` for `google_mail`.

### 4. Online-presence indicator
- Supabase Realtime **presence** channel joined in `__root.tsx` when a user is signed in.
- Small green dot + "Online" text next to the user's avatar in `site-header` when tracked. On store/seller pages, show green dot on seller card when that seller's user_id is present in the channel.
- New `use-presence.ts` hook exposing `onlineUserIds: Set<string>`.

### 5. Signup with account-type picker
- `/auth` page: after user fills email/password on sign-up, second step asks **"How will you use EBM?"** → Customer / Seller / Store owner (with descriptions).
- Choice stored in `raw_user_meta_data.requested_role`. `handle_new_user` trigger updated: always grants `customer`; for seller/store_owner it inserts a row into a new `role_requests` table (status='pending') instead of granting.
- New admin page `/admin/role-requests` lists pending requests with Approve/Deny (approve = insert into `user_roles`; deny = updates status).
- On signup + on approve/deny, a server function sends a Gmail notification to `siwelbryl@gmail.com` ("New seller request from X" / "Access denied for X — user notified").

### 6. Help Center AI + multilingual (`src/routes/help.tsx`)
- Language switcher: **English / Français / Kirundi**. Static FAQ content translated in a `HELP_CONTENT` dictionary.
- Embedded AI chat panel using Lovable AI Gateway (`google/gemini-3-flash-preview`) via a `/api/help-chat` streaming server route + `useChat` on the client. System prompt: EBM support assistant, answers in the user's chosen language, cites shipping/returns/selling policies from the FAQ.
- Professional shell: sidebar categories, search bar over FAQ, sticky AI chat card.

## Technical details (internal)

- **Migrations**: new `role_requests` table (user_id, requested_role, status, note, timestamps) with RLS (owner reads own, admins read/update all), GRANTs, trigger update to `handle_new_user`.
- **Gmail sending**: use `standard_connectors` gateway (`connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send`) with base64url RFC2822 body. All sends server-side only. `LOVABLE_API_KEY` + `GOOGLE_MAIL_API_KEY` env.
- **Server routes** (public-callable): `src/routes/api/contact.ts` (rate-limited by IP + captcha-free honeypot field), `src/routes/api/help-chat.ts` (Lovable AI stream), plus `createServerFn`s for role-request admin actions.
- **Presence**: single channel `presence:global`, track `{ user_id, joined_at }`, subscribe once in root, expose via context. Cleanup on unmount / sign-out.
- **Favicon**: derive PNG from existing `ebm-logo.jpg` asset (copy + rename in `public/`).

## Out of scope for this batch
- Moving products into the DB (you chose to keep mock catalog).
- Marketing/bulk emails.
- Full i18n of the entire site (only Help Center is translated per your request).

Reply "go" and I'll build it end to end. If you want to trim (e.g. skip presence or split into two shipments), tell me which parts to keep.