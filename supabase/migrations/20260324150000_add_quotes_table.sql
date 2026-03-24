-- ==========================================
-- Add quotes table
-- ==========================================

CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  quote_number TEXT NOT NULL,
  client_name TEXT,
  seller_info JSONB,
  client_info JSONB,
  items JSONB,
  subtotal NUMERIC DEFAULT 0,
  tax NUMERIC DEFAULT 0,
  total_amount NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  data JSONB, -- Full payload for easy hydration
  status TEXT DEFAULT 'draft',
  due_date DATE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL, -- Track if converted to invoice
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Secure quotes table
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own quotes" ON quotes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quotes" ON quotes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quotes" ON quotes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own quotes" ON quotes FOR DELETE USING (auth.uid() = user_id);

-- Read access for public links (similar to invoices)
CREATE POLICY "Anyone with link can view quote" ON quotes FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_due_date ON quotes(due_date);
CREATE INDEX IF NOT EXISTS idx_quotes_user_status ON quotes(user_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_quotes_company_id ON quotes(company_id);

-- Add full text search indexes (same as invoices)
CREATE INDEX IF NOT EXISTS idx_quotes_quote_number ON quotes USING GIN (to_tsvector('english', coalesce(quote_number, '')));
CREATE INDEX IF NOT EXISTS idx_quotes_client_name ON quotes USING GIN (to_tsvector('english', coalesce(client_name, '')));
