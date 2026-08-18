create table public.inquiry_messages (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries (id) on delete cascade,
  author_type text not null,
  author_id uuid,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.inquiry_messages
  add constraint inquiry_messages_author_type_check check (author_type in ('consumer', 'admin'));

alter table public.inquiry_messages enable row level security;

grant select, insert, update, delete on public.inquiry_messages to service_role;

create index inquiry_messages_inquiry_id_idx on public.inquiry_messages (inquiry_id);

insert into public.inquiry_messages (inquiry_id, author_type, author_id, content, created_at, updated_at)
select id, 'consumer', consumer_id, content, created_at, created_at
from public.inquiries;

insert into public.inquiry_messages (inquiry_id, author_type, content, created_at, updated_at)
select id, 'admin', answer, coalesce(answered_at, updated_at), coalesce(answered_at, updated_at)
from public.inquiries
where answer is not null;

alter table public.inquiries
  drop column content,
  drop column answer;
