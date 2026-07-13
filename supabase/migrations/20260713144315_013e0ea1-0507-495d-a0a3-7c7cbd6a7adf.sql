DROP POLICY IF EXISTS "settings read" ON public.site_settings;
CREATE POLICY "settings admin read" ON public.site_settings FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
REVOKE SELECT ON public.site_settings FROM anon;