-- Add pg_trgm extension if not exists
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Indexes for fast full-text/ilike search in getCompanyInvoices
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number_trgm ON public.invoices USING GIN (invoice_number gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_invoices_client_name_trgm ON public.invoices USING GIN (client_name gin_trgm_ops);
