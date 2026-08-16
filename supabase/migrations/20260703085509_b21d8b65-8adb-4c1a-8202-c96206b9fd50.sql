
CREATE TYPE public.admin_auth_event AS ENUM (
  'login_success',
  'login_failed',
  'non_admin_blocked',
  'password_reset_requested',
  'password_reset_role_check_failed'
);

CREATE TABLE public.admin_auth_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event admin_auth_event NOT NULL,
  email text,
  user_id uuid,
  success boolean NOT NULL,
  reason text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX admin_auth_audit_created_at_idx ON public.admin_auth_audit (created_at DESC);
CREATE INDEX admin_auth_audit_event_idx ON public.admin_auth_audit (event);
CREATE INDEX admin_auth_audit_email_idx ON public.admin_auth_audit (lower(email));

GRANT SELECT ON public.admin_auth_audit TO authenticated;
GRANT ALL ON public.admin_auth_audit TO service_role;

ALTER TABLE public.admin_auth_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit log"
  ON public.admin_auth_audit
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
