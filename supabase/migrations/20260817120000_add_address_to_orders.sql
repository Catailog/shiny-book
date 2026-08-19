alter table public.orders
  add column address_id uuid references public.addresses (id);

create index orders_address_id_idx on public.orders (address_id);
