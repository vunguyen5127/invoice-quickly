-- ==========================================
-- SUBSCRIPTIONS TABLE (Paddle billing state)
-- ==========================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  paddle_subscription_id TEXT UNIQUE,
  paddle_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'free',          -- free | active | canceled | past_due
  plan TEXT NOT NULL DEFAULT 'free',            -- free | pro
  price_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Secure subscriptions table
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Allow service role (webhooks) full access via default; RLS only restricts anon/authenticated.
-- No INSERT/UPDATE/DELETE policies for authenticated users — only server-side (service role) can mutate.

-- ==========================================
-- Auto-create free subscription on user signup
-- ==========================================

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
  VALUES (new.id, 'free', 'free');

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- Backfill: create free subscriptions for existing users
-- ==========================================

INSERT INTO subscriptions (user_id, status, plan)
SELECT id, 'free', 'free'
FROM users
WHERE id NOT IN (SELECT user_id FROM subscriptions)
ON CONFLICT (user_id) DO NOTHING;
