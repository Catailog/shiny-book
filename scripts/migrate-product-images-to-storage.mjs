import { createClient } from '@supabase/supabase-js';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY 환경변수가 필요합니다. --env-file=.env.local로 실행하세요.',
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PRODUCT_IMAGE_FILES = [
  'hardcover-photobook.png',
  'softcover-photobook.png',
  'premium-photo-album.png',
  'travel-journal.png',
  'wedding-album.png',
  'babys-first-year.png',
];

for (const fileName of PRODUCT_IMAGE_FILES) {
  const slug = fileName.replace(/\.png$/, '');
  const filePath = path.join(process.cwd(), 'public', 'images', 'products', fileName);
  const fileBuffer = await readFile(filePath);

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(fileName, fileBuffer, { contentType: 'image/png', upsert: true });

  if (uploadError) {
    console.error(`업로드 실패 (${fileName}): ${uploadError.message}`);
    process.exit(1);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('product-images').getPublicUrl(fileName);

  const { error: updateError } = await supabase
    .from('products')
    .update({ image_url: publicUrl })
    .eq('slug', slug);

  if (updateError) {
    console.error(`상품 업데이트 실패 (${slug}): ${updateError.message}`);
    process.exit(1);
  }

  console.log(`완료: ${slug} -> ${publicUrl}`);
}
