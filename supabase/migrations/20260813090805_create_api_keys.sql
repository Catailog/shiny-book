create table public.api_keys (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  key_hash text not null unique,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

alter table public.api_keys enable row level security;
