alter table public.orders
  add column consumer_id uuid references auth.users (id);

alter table public.orders
  alter column client_id drop not null;

alter table public.orders
  add constraint orders_owner_check
  check (
    (client_id is not null and consumer_id is null)
    or (client_id is null and consumer_id is not null)
  );

create index orders_consumer_id_idx on public.orders (consumer_id);
