create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  consumer_id uuid not null references auth.users (id),
  title text not null,
  content text not null,
  answer text,
  answered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

grant select, insert, update, delete on public.inquiries to service_role;

create index inquiries_consumer_id_idx on public.inquiries (consumer_id);
