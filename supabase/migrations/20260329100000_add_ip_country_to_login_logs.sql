-- Add ip_address and country columns to user_login_logs
alter table user_login_logs
  add column if not exists ip_address text,
  add column if not exists country    text;
