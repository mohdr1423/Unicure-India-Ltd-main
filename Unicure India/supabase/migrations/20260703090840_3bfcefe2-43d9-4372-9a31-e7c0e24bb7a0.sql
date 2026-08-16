-- 1. Table
CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  draft jsonb NOT NULL DEFAULT '{}'::jsonb,
  published jsonb NOT NULL DEFAULT '{}'::jsonb,
  published_at timestamptz,
  published_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Grants
GRANT SELECT ON public.site_content TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;

-- 3. RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read site_content"
  ON public.site_content FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert site_content"
  ON public.site_content FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site_content"
  ON public.site_content FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site_content"
  ON public.site_content FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. Public view exposing only published content (anon reads)
CREATE OR REPLACE VIEW public.site_content_published
WITH (security_invoker = true)
AS SELECT key, published, published_at FROM public.site_content
   WHERE published_at IS NOT NULL;

GRANT SELECT ON public.site_content_published TO anon, authenticated;

-- Table needs anon SELECT for the security_invoker view to work, but only for rows we allow.
CREATE POLICY "Anyone can read published site_content"
  ON public.site_content FOR SELECT TO anon
  USING (published_at IS NOT NULL);

-- 5. updated_at trigger
CREATE TRIGGER site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Seed defaults so live site keeps rendering
INSERT INTO public.site_content (key, draft, published, published_at) VALUES
(
  'branding',
  '{"site_name":"Unicure India","tagline":"Limited","company_name":"Unicure India Ltd","primary_color":"#0b3b8f","accent_color":"#2b8ac9","phone":"0120-4786786","email":"unicure@unicureindia.com","address":"C-21, 22 & 23 Sector-3, Noida-201301, U.P., India"}'::jsonb,
  '{"site_name":"Unicure India","tagline":"Limited","company_name":"Unicure India Ltd","primary_color":"#0b3b8f","accent_color":"#2b8ac9","phone":"0120-4786786","email":"unicure@unicureindia.com","address":"C-21, 22 & 23 Sector-3, Noida-201301, U.P., India"}'::jsonb,
  now()
),
(
  'nav',
  '{"items":[{"label":"Home","to":"/"},{"label":"About","to":"/about"},{"label":"Leadership","to":"/leadership"},{"label":"Manufacturing","to":"/manufacturing"},{"label":"Products","to":"/products"},{"label":"Quality & R&D","to":"/quality"},{"label":"Exports","to":"/exports"},{"label":"Co-Mfg","to":"/contract-manufacturing"},{"label":"Contact","to":"/contact"}],"cta_label":"Get a Quote","cta_to":"/contact"}'::jsonb,
  '{"items":[{"label":"Home","to":"/"},{"label":"About","to":"/about"},{"label":"Leadership","to":"/leadership"},{"label":"Manufacturing","to":"/manufacturing"},{"label":"Products","to":"/products"},{"label":"Quality & R&D","to":"/quality"},{"label":"Exports","to":"/exports"},{"label":"Co-Mfg","to":"/contract-manufacturing"},{"label":"Contact","to":"/contact"}],"cta_label":"Get a Quote","cta_to":"/contact"}'::jsonb,
  now()
),
(
  'footer',
  '{"tagline":"WHO-GMP certified pharmaceutical manufacturing delivering trusted healthcare products to 20+ countries worldwide.","since":"Since 1984","columns":[{"title":"Company","links":[{"label":"About Us","to":"/about"},{"label":"MD''s Message","to":"/md-message"},{"label":"Leadership","to":"/leadership"},{"label":"Manufacturing","to":"/manufacturing"},{"label":"Quality & R&D","to":"/quality"},{"label":"Products","to":"/products"},{"label":"Careers","to":"/careers"}]},{"title":"Business","links":[{"label":"Export Sales","to":"/exports"},{"label":"Co-Manufacturing","to":"/contract-manufacturing"},{"label":"Institutional Clients","to":"/clients"},{"label":"Certifications","to":"/certifications"},{"label":"Downloads","to":"/downloads"},{"label":"Media","to":"/news"}]}],"social":[{"label":"LinkedIn","url":"#","icon":"linkedin"},{"label":"Twitter","url":"#","icon":"twitter"},{"label":"Facebook","url":"#","icon":"facebook"}],"legal":[{"label":"Privacy Policy","url":"#"},{"label":"Terms of Service","url":"#"},{"label":"Sitemap","url":"#"}],"copyright":"Unicure India. All rights reserved."}'::jsonb,
  '{"tagline":"WHO-GMP certified pharmaceutical manufacturing delivering trusted healthcare products to 20+ countries worldwide.","since":"Since 1984","columns":[{"title":"Company","links":[{"label":"About Us","to":"/about"},{"label":"MD''s Message","to":"/md-message"},{"label":"Leadership","to":"/leadership"},{"label":"Manufacturing","to":"/manufacturing"},{"label":"Quality & R&D","to":"/quality"},{"label":"Products","to":"/products"},{"label":"Careers","to":"/careers"}]},{"title":"Business","links":[{"label":"Export Sales","to":"/exports"},{"label":"Co-Manufacturing","to":"/contract-manufacturing"},{"label":"Institutional Clients","to":"/clients"},{"label":"Certifications","to":"/certifications"},{"label":"Downloads","to":"/downloads"},{"label":"Media","to":"/news"}]}],"social":[{"label":"LinkedIn","url":"#","icon":"linkedin"},{"label":"Twitter","url":"#","icon":"twitter"},{"label":"Facebook","url":"#","icon":"facebook"}],"legal":[{"label":"Privacy Policy","url":"#"},{"label":"Terms of Service","url":"#"},{"label":"Sitemap","url":"#"}],"copyright":"Unicure India. All rights reserved."}'::jsonb,
  now()
);
