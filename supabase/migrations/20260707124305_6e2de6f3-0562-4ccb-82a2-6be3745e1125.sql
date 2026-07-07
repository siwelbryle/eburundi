
-- Seed an admin account so the owner can sign in immediately.
DO $$
DECLARE
  admin_email text := 'admin@eburundi.market';
  admin_pass  text := 'Admin@eBurundi2026!';
  admin_id    uuid;
  existing_id uuid;
BEGIN
  SELECT id INTO existing_id FROM auth.users WHERE email = admin_email;

  IF existing_id IS NULL THEN
    admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change,
      email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      admin_id, 'authenticated', 'authenticated', admin_email,
      crypt(admin_pass, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"eBurundi Admin"}',
      now(), now(), '', '', '', ''
    );
    INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (gen_random_uuid(), admin_id, admin_id::text, json_build_object('sub', admin_id::text, 'email', admin_email)::jsonb, 'email', now(), now(), now());
  ELSE
    admin_id := existing_id;
    UPDATE auth.users
      SET encrypted_password = crypt(admin_pass, gen_salt('bf')),
          email_confirmed_at = COALESCE(email_confirmed_at, now()),
          updated_at = now()
      WHERE id = admin_id;
  END IF;

  INSERT INTO public.profiles (id, email, full_name)
    VALUES (admin_id, admin_email, 'eBurundi Admin')
    ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role) VALUES (admin_id, 'super_admin') ON CONFLICT DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (admin_id, 'admin')       ON CONFLICT DO NOTHING;
END $$;
