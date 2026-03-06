-- Create user_login_logs table
CREATE TABLE IF NOT EXISTS user_login_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  provider TEXT,
  ip_address TEXT,
  user_agent TEXT,
  logged_in_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_login_logs_logged_in_at ON user_login_logs(logged_in_at DESC);
CREATE INDEX idx_login_logs_user_id ON user_login_logs(user_id);

-- Enable RLS
ALTER TABLE user_login_logs ENABLE ROW LEVEL SECURITY;

-- Allow any authenticated user to insert (for logging their own login)
CREATE POLICY "Users can insert their own login logs"
  ON user_login_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Only allow the admin to read all logs
CREATE POLICY "Admin can read all login logs"
  ON user_login_logs FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'vunguyencapital@gmail.com');
