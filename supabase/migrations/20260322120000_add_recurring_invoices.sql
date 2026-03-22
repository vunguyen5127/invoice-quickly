-- ==========================================
-- Add recurring invoice support
-- ==========================================

-- is_recurring: marks the invoice as a recurring template
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false;

-- recurring_interval: weekly | monthly | quarterly | yearly
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS recurring_interval TEXT;

-- next_invoice_date: the date when the next invoice should be auto-created
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS next_invoice_date DATE;

-- Index for efficient cron job queries
CREATE INDEX IF NOT EXISTS idx_invoices_recurring
  ON invoices(next_invoice_date)
  WHERE is_recurring = true AND deleted_at IS NULL;
