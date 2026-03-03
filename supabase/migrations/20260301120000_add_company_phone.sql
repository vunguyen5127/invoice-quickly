-- Add phone column to companies table
ALTER TABLE companies ADD COLUMN IF NOT EXISTS phone TEXT;
