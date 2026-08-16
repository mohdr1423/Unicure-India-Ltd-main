
CREATE TABLE public.site_content_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  snapshot jsonb NOT NULL,
  published_at timestamptz NOT NULL DEFAULT now(),
  published_by uuid,
  note text
);

CREATE INDEX site_content_versions_key_time_idx
  ON public.site_content_versions (key, published_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content_versions TO authenticated;
GRANT ALL ON public.site_content_versions TO service_role;

ALTER TABLE public.site_content_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view versions"
  ON public.site_content_versions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert versions"
  ON public.site_content_versions FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
