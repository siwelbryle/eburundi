
-- 1. Order payment fields
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'lumicash',
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_ref text,
  ADD COLUMN IF NOT EXISTS payment_phone text,
  ADD COLUMN IF NOT EXISTS admin_note text;

DO $$ BEGIN
  ALTER TABLE public.orders ADD CONSTRAINT orders_payment_method_check
    CHECK (payment_method IN ('lumicash','card','cod'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.orders ADD CONSTRAINT orders_payment_status_check
    CHECK (payment_status IN ('pending','awaiting_confirmation','paid','failed','refunded'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Grants (Data API access) — this was missing everywhere
GRANT SELECT ON public.products, public.stores, public.categories, public.banners, public.brands TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products, public.stores, public.categories, public.banners, public.brands, public.coupons TO authenticated;
GRANT ALL ON public.products, public.stores, public.categories, public.banners, public.brands, public.coupons TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders, public.order_items, public.cart_items, public.wishlist_items, public.addresses, public.reviews, public.notifications TO authenticated;
GRANT ALL ON public.orders, public.order_items, public.cart_items, public.wishlist_items, public.addresses, public.reviews, public.notifications TO service_role;

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

GRANT SELECT, INSERT, UPDATE ON public.role_requests TO authenticated;
GRANT ALL ON public.role_requests TO service_role;

GRANT SELECT ON public.coupons TO anon;
GRANT ALL ON public.site_settings TO service_role;
GRANT SELECT ON public.site_settings TO authenticated;

-- allow signed-in users to read public settings (merchant number displayed at checkout)
DROP POLICY IF EXISTS "settings public read" ON public.site_settings;
CREATE POLICY "settings public read" ON public.site_settings
  FOR SELECT TO authenticated
  USING (key IN ('lumicash_merchant_number','lumicash_merchant_name','support_email','support_phone'));

-- 3. Seed site settings
INSERT INTO public.site_settings(key, value) VALUES
  ('lumicash_merchant_number', to_jsonb('+257 69 393 285'::text)),
  ('lumicash_merchant_name',   to_jsonb('EBM - eBurundi Market'::text)),
  ('support_email',            to_jsonb('siwelbryl@gmail.com'::text)),
  ('support_phone',            to_jsonb('+257 69 393 285'::text))
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
