alter table public.api_keys
  drop constraint api_keys_role_check;

alter table public.api_keys
  add constraint api_keys_role_check check (role in ('consumer', 'admin', 'vendor'));
