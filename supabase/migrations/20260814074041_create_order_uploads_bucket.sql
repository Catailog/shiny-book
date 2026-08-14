insert into storage.buckets (id, name, public)
values ('order-uploads', 'order-uploads', false)
on conflict (id) do nothing;

create policy "consumers can upload own order files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'order-uploads'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "consumers can read own order files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'order-uploads'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
);

create policy "consumers can delete own order files"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'order-uploads'
  and (storage.foldername(name))[1] = auth.uid()::text
);
