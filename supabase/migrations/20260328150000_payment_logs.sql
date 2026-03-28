-- payment_logs: stores all billing & webhook events for debugging
create table if not exists payment_logs (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  request_id      text,                    -- random ID to group events from the same webhook call
  level           text not null default 'info',  -- 'info' | 'error' | 'warn'
  tag             text,                    -- IN | AUTH | PARSE | DB | OUT | FATAL | Checkout
  message         text not null,
  data            jsonb,                   -- any structured payload
  user_id         text,                    -- extracted user id if available
  event_name      text,                    -- e.g. subscription_created
);

-- Index for quick filtering
create index if not exists payment_logs_created_at_idx      on payment_logs (created_at desc);
create index if not exists payment_logs_request_id_idx      on payment_logs (request_id);
create index if not exists payment_logs_user_id_idx         on payment_logs (user_id);
create index if not exists payment_logs_subscription_id_idx on payment_logs (subscription_id);

-- Only service-role can write; nobody can read via anon
alter table payment_logs enable row level security;

-- Deny all public access (service role bypasses RLS)
create policy "deny_all" on payment_logs
  for all using (false);
