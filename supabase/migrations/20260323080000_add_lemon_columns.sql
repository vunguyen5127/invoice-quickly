-- ==========================================
-- Refactor: Add provider column, rename paddle-specific columns
-- ==========================================

-- Step 1: Add provider column
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS provider TEXT NOT NULL DEFAULT 'paddle';

-- Step 2: Rename paddle-specific columns to generic names
ALTER TABLE subscriptions
  RENAME COLUMN paddle_subscription_id TO subscription_id;

ALTER TABLE subscriptions
  RENAME COLUMN paddle_customer_id TO customer_id;
