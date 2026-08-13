create table public.shipment_jobs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id),
  status text not null default 'received',
  tracking_number text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.shipment_jobs
  add constraint shipment_jobs_status_check check (status in ('received', 'in_transit', 'delivered'));

alter table public.shipment_jobs enable row level security;

create index shipment_jobs_order_id_idx on public.shipment_jobs (order_id);

grant select, insert, update, delete on public.shipment_jobs to service_role;
