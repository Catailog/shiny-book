create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null,
  discount_value int not null,
  max_uses int,
  used_count int not null default 0,
  is_active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.coupons
  add constraint coupons_discount_type_check check (discount_type in ('fixed', 'percentage'));

alter table public.coupons
  add constraint coupons_discount_value_check check (discount_value > 0);

alter table public.coupons
  add constraint coupons_percentage_range_check
  check (discount_type <> 'percentage' or discount_value <= 100);

alter table public.coupons
  add constraint coupons_max_uses_check check (max_uses is null or max_uses > 0);

alter table public.coupons
  add constraint coupons_used_count_check check (used_count >= 0 and (max_uses is null or used_count <= max_uses));

alter table public.coupons enable row level security;

grant select, insert, update, delete on public.coupons to service_role;

alter table public.orders
  add column coupon_id uuid references public.coupons (id);

create index orders_coupon_id_idx on public.orders (coupon_id);
