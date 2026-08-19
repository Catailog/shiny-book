import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY 환경변수가 필요합니다. --env-file=.env.local로 실행하세요.',
  );
  process.exit(1);
}

const email = process.env.ADMIN_SEED_EMAIL ?? 'admin@shinybook.local';
const password = process.env.ADMIN_SEED_PASSWORD ?? 'LocalAdmin1234!';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();

if (listError) {
  console.error(listError.message);
  process.exit(1);
}

if (existingUsers.users.some((user) => user.email === email)) {
  console.log(`이미 존재하는 계정입니다: ${email}`);
  process.exit(0);
}

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  app_metadata: { role: 'admin' },
});

if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`관리자 계정 생성 완료: ${data.user.email}`);
