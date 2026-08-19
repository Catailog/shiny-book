import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY 환경변수가 필요합니다. --env-file 옵션으로 실행하세요.',
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: products, error } = await supabase.from('products').select('id, image_url');

  if (error) {
    console.error(error.message);
    process.exit(1);
  }

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    if (!product.image_url) {
      skipped++;
      continue;
    }

    const storagePathMatch = product.image_url.match(/\/storage\/v1\/object\/.+$/);
    if (!storagePathMatch) {
      console.log(`[SKIP] storage URL 형식이 아님: ${product.id} -> ${product.image_url}`);
      skipped++;
      continue;
    }

    const newUrl = `${supabaseUrl}${storagePathMatch[0]}`;
    if (newUrl === product.image_url) {
      skipped++;
      continue;
    }

    const { error: updateError } = await supabase
      .from('products')
      .update({ image_url: newUrl })
      .eq('id', product.id);

    if (updateError) {
      console.error(`[FAIL] ${product.id}: ${updateError.message}`);
      continue;
    }

    updated++;
    console.log(`[OK] ${product.id} -> ${newUrl}`);
  }

  console.log(`\n총 ${products.length}개 중 ${updated}개 업데이트, ${skipped}개 건너뜀`);
}

main();
