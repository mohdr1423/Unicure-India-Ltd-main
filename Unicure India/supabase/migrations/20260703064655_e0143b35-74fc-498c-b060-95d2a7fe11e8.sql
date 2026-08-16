
CREATE POLICY "Admins manage public-uploads objects"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'public-uploads' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'public-uploads' AND public.has_role(auth.uid(), 'admin'));
