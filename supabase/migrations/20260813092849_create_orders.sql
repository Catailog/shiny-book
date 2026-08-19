create table public.orders (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.api_keys (id),
  status text not null default 'awaiting_payment',
  title text not null,
  manuscript_file_url text not null,
  cover_file_url text not null,
  quantity int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders
  add constraint orders_status_check
  check (status in ('awaiting_payment', 'paid', 'printing', 'binding', 'shipping', 'completed'));

alter table public.orders
  add constraint orders_quantity_check check (quantity > 0);

alter table public.orders enable row level security;

create index orders_client_id_idx on public.orders (client_id);
