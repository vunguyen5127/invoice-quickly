-- ==========================================
-- Add invoice status tracking & due_date
-- ==========================================

-- Add status column with default 'draft'
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';

-- Add due_date column (extracted from JSONB data for efficient querying)
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS due_date DATE;

-- Index for filtering/sorting by status
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- Index for overdue detection queries
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

-- Composite index for common query: active invoices by user
CREATE INDEX IF NOT EXISTS idx_invoices_user_status ON invoices(user_id, status) WHERE deleted_at IS NULL;
