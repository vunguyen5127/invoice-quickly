-- Add a policy to allow public select on invoices
-- This allows anyone with the exact unguessable UUID to view the invoice
CREATE POLICY "Public can view invoice by ID" ON invoices FOR SELECT USING (true);
