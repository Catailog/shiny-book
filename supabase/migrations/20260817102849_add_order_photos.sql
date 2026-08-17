alter table public.orders
  alter column manuscript_file_url drop not null,
  alter column cover_file_url drop not null,
  add column page_count integer;

create table public.order_photos (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id),
  storage_path text not null,
  display_order integer not null,
  created_at timestamptz not null default now()
);

alter table public.order_photos enable row level security;

grant select, insert, update, delete on public.order_photos to service_role;

create index order_photos_order_id_idx on public.order_photos (order_id);
