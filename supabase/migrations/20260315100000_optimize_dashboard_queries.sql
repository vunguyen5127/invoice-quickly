-- Database optimizations for dashboard performance

-- Index for companies lookup by user
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON public.companies(user_id);

-- Index for invoices count by company and soft delete filter
CREATE INDEX IF NOT EXISTS idx_invoices_company_id_deleted_at ON public.invoices(company_id, deleted_at);

-- General index for user_id on invoices as it's frequently used in RLS
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
