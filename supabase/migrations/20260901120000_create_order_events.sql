create table public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  event_type text not null,
  from_status text,
  to_status text,
  actor text not null default 'system',
  source text not null,
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.order_events
  add constraint order_events_event_type_check
  check (
    event_type in (
      'order.created',
      'order.status_changed',
      'webhook.received',
      'notification.sent',
      'admin.note'
    )
  );

alter table public.order_events
  add constraint order_events_source_check
  check (source in ('consumer', 'admin', 'system', 'webhook'));

alter table public.order_events enable row level security;

-- Append-only audit trail: the server writes through the service role and never
-- updates or deletes a row, so only select/insert are granted.
grant select, insert on public.order_events to service_role;

create index order_events_order_id_created_at_idx on public.order_events (order_id, created_at);
