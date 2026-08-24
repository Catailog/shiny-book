alter table public.inquiries alter column consumer_id drop not null;
alter table public.reviews alter column consumer_id drop not null;
alter table public.addresses alter column consumer_id drop not null;

alter table public.reviews add column is_anonymous boolean not null default false;
