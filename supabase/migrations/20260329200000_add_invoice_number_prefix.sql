-- Add invoice_number_prefix column to companies table
-- The system appends auto-incrementing numbers: 001, 002, ...
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS invoice_number_prefix TEXT DEFAULT '';
