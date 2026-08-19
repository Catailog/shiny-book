import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY 환경변수가 필요합니다. --env-file=.env.local로 실행하세요.',
  );
  process.exit(1);
}

const BUCKET = 'order-uploads';
const TEMPLATE_PATH = '_test-fixtures/sample.webp';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const placeholder = await sharp({
  create: {
    width: 1000,
    height: 1400,
    channels: 3,
    background: { r: 210, g: 210, b: 210 },
  },
})
  .webp({ quality: 80 })
  .toBuffer();

const { error } = await supabase.storage
  .from(BUCKET)
  .upload(TEMPLATE_PATH, placeholder, { contentType: 'image/webp', upsert: true });

if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`테스트 이미지 템플릿 업로드 완료: ${BUCKET}/${TEMPLATE_PATH}`);
