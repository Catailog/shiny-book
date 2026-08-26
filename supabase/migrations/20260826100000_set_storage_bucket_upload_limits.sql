update storage.buckets
set file_size_limit = 5242880,
  allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp']
where id in ('order-uploads', 'product-images');
