create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id),
  consumer_id uuid not null references auth.users (id),
  rating int not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.reviews
  add constraint reviews_order_id_unique unique (order_id);

alter table public.reviews
  add constraint reviews_rating_check check (rating >= 1 and rating <= 5);

alter table public.reviews enable row level security;

grant select, insert, update, delete on public.reviews to service_role;

create index reviews_consumer_id_idx on public.reviews (consumer_id);
