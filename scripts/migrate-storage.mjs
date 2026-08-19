import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'node:path';

const localEnv = dotenv.config({ path: path.resolve(process.cwd(), '.env.local') }).parsed || {};
const prodEnv = dotenv.config({ path: path.resolve(process.cwd(), '.env.production') }).parsed || {};

const LOCAL_URL = localEnv.LOCAL_SUPABASE_URL || localEnv.NEXT_PUBLIC_SUPABASE_URL;
const LOCAL_SERVICE_KEY = localEnv.LOCAL_SUPABASE_SECRET_KEY || localEnv.SUPABASE_SECRET_KEY;

const PROD_URL = prodEnv.NEXT_PUBLIC_SUPABASE_URL;
const PROD_SERVICE_KEY = prodEnv.SUPABASE_SECRET_KEY;

if (!LOCAL_URL || !LOCAL_SERVICE_KEY || !PROD_URL || !PROD_SERVICE_KEY) {
  console.error('[ERROR] 환경변수를 확인해 주세요.');
  process.exit(1);
}

const SKIP_EXISTING = !process.argv.includes('--overwrite');
const CONCURRENCY_LIMIT = 10; // 동시 처리 개수

const localSupabase = createClient(LOCAL_URL, LOCAL_SERVICE_KEY);
const prodSupabase = createClient(PROD_URL, PROD_SERVICE_KEY);

const BUCKETS = ['product-images', 'order-uploads'];

const report = {
  total: 0,
  success: 0,
  skipped: 0,
  failures: []
};

async function ensureBucketExists(bucketName) {
  const { data: buckets } = await prodSupabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === bucketName);

  if (!exists) {
    console.log(`[INFO] 프로덕션에 [${bucketName}] 버킷 생성`);
    await prodSupabase.storage.createBucket(bucketName, {
      public: bucketName === 'product-images',
    });
  }
}

// 개별 파일 이전 처리 작업
async function processSingleFile(bucket, item, itemPath, prodFileSet) {
  report.total++;

  if (SKIP_EXISTING && prodFileSet.has(item.name)) {
    report.skipped++;
    console.log(`[SKIP] ${bucket}/${itemPath}`);
    return;
  }

  const { data: fileData, error: downloadError } = await localSupabase.storage
    .from(bucket)
    .download(itemPath);

  if (downloadError) {
    report.failures.push({ bucket, path: itemPath, stage: '다운로드', message: downloadError.message });
    console.log(`[FAIL] ${bucket}/${itemPath}`);
    return;
  }

  const { error: uploadError } = await prodSupabase.storage
    .from(bucket)
    .upload(itemPath, fileData, {
      upsert: true,
      contentType: item.metadata?.mimetype,
    });

  if (uploadError) {
    report.failures.push({ bucket, path: itemPath, stage: '업로드', message: uploadError.message });
    console.log(`[FAIL] ${bucket}/${itemPath}`);
  } else {
    report.success++;
    console.log(`[OK] ${bucket}/${itemPath}`);
  }
}

async function processPath(bucket, pathStr = '') {
  const { data: localItems, error } = await localSupabase.storage.from(bucket).list(pathStr, { limit: 1000 });

  if (error || !localItems) return;

  let prodFileSet = new Set();
  if (SKIP_EXISTING) {
    const { data: prodItems } = await prodSupabase.storage.from(bucket).list(pathStr, { limit: 1000 });
    prodFileSet = new Set(prodItems?.map((item) => item.name) || []);
  }

  const files = [];

  for (const item of localItems) {
    if (item.name === '.emptyFolderPlaceholder') continue;

    const itemPath = pathStr ? `${pathStr}/${item.name}` : item.name;

    if (!item.id || !item.metadata) {
      await processPath(bucket, itemPath);
      continue;
    }

    files.push({ item, itemPath });
  }

  // 파일들을 CONCURRENCY_LIMIT 단위로 분할하여 병렬 실행
  for (let i = 0; i < files.length; i += CONCURRENCY_LIMIT) {
    const chunk = files.slice(i, i + CONCURRENCY_LIMIT);
    await Promise.all(
      chunk.map(({ item, itemPath }) => processSingleFile(bucket, item, itemPath, prodFileSet))
    );
  }
}

async function main() {
  console.log(`[MODE] 중복 처리: ${SKIP_EXISTING ? '건너뛰기' : '덮어쓰기'} | 동시 처리: ${CONCURRENCY_LIMIT}개씩`);

  for (const bucket of BUCKETS) {
    console.log(`\n[START] [${bucket}] 이전 작업 시작...`);
    await ensureBucketExists(bucket);
    await processPath(bucket);
  }

  console.log('\n========================================');
  console.log(`[최종 결과] 총 파일: ${report.total}개 | 신규 이전: ${report.success}개 | 건너뜀: ${report.skipped}개 | 실패: ${report.failures.length}개`);
  console.log('========================================');

  if (report.failures.length > 0) {
    console.log('\n[실패 목록]');
    report.failures.forEach((f, idx) => {
      console.log(`${idx + 1}. [${f.bucket}] ${f.path} (${f.stage} 실패: ${f.message})`);
    });
  } else {
    console.log('\n모든 파일 처리가 완료되었습니다.');
  }
}

main();