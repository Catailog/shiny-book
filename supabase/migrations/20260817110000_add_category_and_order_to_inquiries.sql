alter table public.inquiries
  add column category text not null default 'general';

alter table public.inquiries
  add constraint inquiries_category_check check (category in ('general', 'order'));

alter table public.inquiries
  add column order_id uuid references public.orders (id);

create index inquiries_order_id_idx on public.inquiries (order_id);
