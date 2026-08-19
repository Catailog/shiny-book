create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  consumer_id uuid not null references auth.users (id),
  label text not null,
  recipient_name text not null,
  phone text not null,
  postal_code text not null,
  address_line1 text not null,
  address_line2 text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.addresses enable row level security;

grant select, insert, update, delete on public.addresses to service_role;

create index addresses_consumer_id_idx on public.addresses (consumer_id);
