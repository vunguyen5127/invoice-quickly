-- Migration: Add default tax and discount to companies table
-- Date: 2026-03-05
-- Description: Adds default_tax and default_discount 
--              so each company can pre-populate these on new invoices.

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS default_tax      numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS default_discount numeric NOT NULL DEFAULT 0;

COMMENT ON COLUMN companies.default_tax      IS 'Default tax rate percentage pre-filled on new invoices';
COMMENT ON COLUMN companies.default_discount IS 'Default fixed discount amount pre-filled on new invoices';
