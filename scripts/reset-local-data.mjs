import { createClient } from '@supabase/supabase-js';

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

async function main() {
  console.log('기존 데이터 삭제 중...');

  const tables = [
    'inquiry_messages',
    'inquiries',
    'reviews',
    'order_photos',
    'print_jobs',
    'shipment_jobs',
    'orders',
    'addresses',
    'coupons',
    'announcements',
    'faqs',
  ];

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().not('id', 'is', null);
    if (error) {
      throw new Error(`${table} 삭제 실패: ${error.message}`);
    }
  }

  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    throw new Error(listError.message);
  }

  for (const user of existingUsers.users) {
    await supabase.auth.admin.deleteUser(user.id);
  }

  console.log('기존 데이터 삭제 완료');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
