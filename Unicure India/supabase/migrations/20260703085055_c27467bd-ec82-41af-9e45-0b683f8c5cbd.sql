
CREATE OR REPLACE FUNCTION public.email_is_admin(_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users u
    JOIN public.user_roles r ON r.user_id = u.id
    WHERE lower(u.email) = lower(_email)
      AND r.role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.email_is_admin(text) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.email_is_admin(text) TO service_role;
