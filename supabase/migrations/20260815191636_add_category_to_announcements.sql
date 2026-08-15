alter table public.announcements
  add column category text not null default 'notice';

alter table public.announcements
  add constraint announcements_category_check check (category in ('notice', 'event', 'winner'));
