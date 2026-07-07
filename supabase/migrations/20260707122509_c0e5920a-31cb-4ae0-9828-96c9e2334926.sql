
-- Fix: restrict profiles SELECT to the owner only (removes public exposure of emails/phones)
DROP POLICY IF EXISTS "profiles read" ON public.profiles;

CREATE POLICY "Users can read own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Fix: restrict coupons SELECT to authenticated users; admins retain full write access
DROP POLICY IF EXISTS "coupons read" ON public.coupons;

CREATE POLICY "Authenticated users can read active coupons"
ON public.coupons
FOR SELECT
TO authenticated
USING (is_active = true);

REVOKE SELECT ON public.profiles FROM anon;
REVOKE SELECT ON public.coupons FROM anon;
