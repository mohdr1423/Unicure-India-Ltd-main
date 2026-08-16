
CREATE TYPE public.admin_request_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.admin_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  status public.admin_request_status NOT NULL DEFAULT 'pending',
  note TEXT,
  decided_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  decided_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.admin_requests TO authenticated;
GRANT ALL ON public.admin_requests TO service_role;

ALTER TABLE public.admin_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own requests"
  ON public.admin_requests FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users create own requests"
  ON public.admin_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins read all requests"
  ON public.admin_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update requests"
  ON public.admin_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_admin_requests_updated_at
  BEFORE UPDATE ON public.admin_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
