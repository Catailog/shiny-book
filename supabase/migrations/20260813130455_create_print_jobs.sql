create table public.print_jobs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id),
  status text not null default 'received',
  manuscript_file_url text not null,
  cover_file_url text not null,
  quantity int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.print_jobs
  add constraint print_jobs_status_check check (status in ('received', 'printing', 'done'));

alter table public.print_jobs
  add constraint print_jobs_quantity_check check (quantity > 0);

alter table public.print_jobs enable row level security;

create index print_jobs_order_id_idx on public.print_jobs (order_id);

grant select, insert, update, delete on public.print_jobs to service_role;
