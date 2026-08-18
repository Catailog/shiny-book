insert into public.coupons (code, discount_type, discount_value, max_uses, is_active)
values ('TEST10', 'percentage', 10, null, true)
on conflict (code) do nothing;
