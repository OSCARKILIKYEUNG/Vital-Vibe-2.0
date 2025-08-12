-- Create buckets manually in Supabase Storage:
-- 1) meal-images
-- 2) workout-uploads
-- Then run these policies to allow authenticated users to read/write their own paths.

create policy "Public read" on storage.objects
  for select using (bucket_id in ('meal-images','workout-uploads'));

create policy "Users can upload to own folder" on storage.objects
  for insert with check (
    auth.role() = 'authenticated' and
    bucket_id in ('meal-images','workout-uploads') and
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can manage own files" on storage.objects
  for all using (
    auth.role() = 'authenticated' and
    bucket_id in ('meal-images','workout-uploads') and
    (storage.foldername(name))[1] = auth.uid()::text
  );