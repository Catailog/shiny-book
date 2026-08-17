alter table public.orders
  add column product_id uuid references public.products (id);

create index orders_product_id_idx on public.orders (product_id);
