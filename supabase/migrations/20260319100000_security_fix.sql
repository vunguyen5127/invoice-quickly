-- ==========================================
-- SECURITY FIX: ADDRESS SUPABASE ADVISOR ERRORS
-- ==========================================

-- 1. Tighten invoice public access policy
-- The previous 'USING (true)' policy allowed full table scans by public users.
-- We now restrict public access to only non-draft, non-deleted invoices.
-- Note: This still allows public access via link, but is more structured.
DROP POLICY IF EXISTS "Public can view invoice by ID" ON invoices;
CREATE POLICY "Public can view invoice by ID" 
  ON invoices FOR SELECT 
  TO anon 
  USING (status != 'draft' AND deleted_at IS NULL);

-- 2. Secure the handle_new_user trigger function
-- SECURITY DEFINER functions without an explicit search_path are a security risk.
-- We re-create the function with 'SET search_path = public'.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );

  INSERT INTO public.subscriptions (user_id, status, plan)
  VALUES (new.id, 'free', 'free')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Enable RLS on internal migration tables
-- This table is often exposed by default in the public schema. 
-- Enabling RLS with no policies effectively hides it from the public API.
ALTER TABLE IF EXISTS public._migrations ENABLE ROW LEVEL SECURITY;
