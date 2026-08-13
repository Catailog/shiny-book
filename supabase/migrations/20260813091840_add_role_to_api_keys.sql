alter table public.api_keys
  add column role text not null default 'consumer';

alter table public.api_keys
  add constraint api_keys_role_check check (role in ('consumer', 'admin'));
