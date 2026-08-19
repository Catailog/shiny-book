alter table public.orders
  add column amount int not null;

alter table public.orders
  add constraint orders_amount_check check (amount > 0);
