
CREATE TABLE public.media_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  storage_path TEXT NOT NULL UNIQUE,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_tags TO authenticated;
GRANT ALL ON public.media_tags TO service_role;

ALTER TABLE public.media_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage media tags"
  ON public.media_tags FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_media_tags_updated_at
  BEFORE UPDATE ON public.media_tags
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX media_tags_tags_gin ON public.media_tags USING GIN (tags);
