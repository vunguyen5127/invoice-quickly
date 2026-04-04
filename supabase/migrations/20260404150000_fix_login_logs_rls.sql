-- ==========================================
-- FIX: login_logs RLS — remove hardcoded admin email
-- Replace the hardcoded-email SELECT policy with service_role only access.
-- getLoginLogs() in login-logger.ts was using anon client → always returned []
-- Now admin-actions.ts getPaymentLogs uses service role, so we align login logs too.
-- ==========================================

-- Drop old policy that had hardcoded email
DROP POLICY IF EXISTS "Admin can read all login logs" ON user_login_logs;

-- New policy: only the service_role (admin-actions.ts via getServiceSupabase) can read
-- Regular authenticated users and anon cannot read any login logs.
-- Note: service_role bypasses RLS entirely, so no SELECT policy is needed for it.
-- This effectively means NO authenticated user can SELECT unless they use service_role.
-- The INSERT policy (auth.uid() = user_id) remains unchanged.
