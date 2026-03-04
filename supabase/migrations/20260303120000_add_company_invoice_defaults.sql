-- Migration: Add invoice defaults to companies table
-- Date: 2026-03-03
-- Description: Adds default_currency, default_notes, default_terms, show_notes, show_terms
--              so each company can pre-populate new invoices automatically.

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS default_currency text    NOT NULL DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS default_notes    text    NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS default_terms    text    NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS show_notes       boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_terms       boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN companies.default_currency IS 'Default currency for new invoices (e.g. USD, EUR, GBP)';
COMMENT ON COLUMN companies.default_notes    IS 'Default notes/memo pre-filled on new invoices';
COMMENT ON COLUMN companies.default_terms    IS 'Default terms & conditions pre-filled on new invoices';
COMMENT ON COLUMN companies.show_notes       IS 'Whether Notes section is shown by default on new invoices';
COMMENT ON COLUMN companies.show_terms       IS 'Whether Terms & Conditions section is shown by default on new invoices';
