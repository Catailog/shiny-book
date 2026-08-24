import { createClient } from '@supabase/supabase-js';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY 환경변수가 필요합니다. --env-file=.env.local로 실행하세요.',
  );
  process.exit(1);
}

const BUCKET = 'order-uploads';
const POOL_PREFIX = '_test-fixtures/pool/';
const SOURCE_DIR = path.join(process.cwd(), '.claude', '.temp', 'random_images');
const UPLOAD_CONCURRENCY = 20;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function uploadFile(fileName) {
  const buffer = await readFile(path.join(SOURCE_DIR, fileName));
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(`${POOL_PREFIX}${fileName}`, buffer, { contentType: 'image/jpeg', upsert: true });

  if (error) {
    throw new Error(`${fileName} 업로드 실패: ${error.message}`);
  }
}

async function main() {
  const fileNames = await readdir(SOURCE_DIR);
  console.log(`${fileNames.length}장을 ${BUCKET}/${POOL_PREFIX}에 업로드합니다...`);

  for (let start = 0; start < fileNames.length; start += UPLOAD_CONCURRENCY) {
    const batch = fileNames.slice(start, start + UPLOAD_CONCURRENCY);
    await Promise.all(batch.map(uploadFile));
    console.log(`${Math.min(start + UPLOAD_CONCURRENCY, fileNames.length)}/${fileNames.length}`);
  }

  console.log('테스트 이미지 풀 업로드 완료');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
