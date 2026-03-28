-- Add subscription_id column to existing payment_logs table
alter table payment_logs
  add column if not exists subscription_id text;

-- Index for filtering by subscription
create index if not exists payment_logs_subscription_id_idx on payment_logs (subscription_id);
