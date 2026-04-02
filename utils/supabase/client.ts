import { createClient } from '@supabase/supabase-js'
import config from "@/utils/config";

const { url, anonKey } = config.supabase;

// Throw error if keys are missing but allow the app to compile
if (!url || !anonKey) {
  console.warn("Supabase URL and Anon Key are missing. Please add them to your .env.local file.")
}

export const supabase = url && anonKey 
  ? createClient(url, anonKey)
  : null

if (!supabase) {
  console.error("Supabase client failed to initialize: export is null");
}

/**
 * Service-role Supabase client — singleton, server-side only.
 * Bypasses RLS. Never expose to the browser.
 */
let _serviceClient: any = null;

export function getServiceSupabase(): any {
  if (_serviceClient) return _serviceClient;
  const { url, serviceRole } = config.supabase;
  if (!url || !serviceRole) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }
  _serviceClient = createClient(url, serviceRole);
  return _serviceClient;
}

export function getServerSupabase(token: string): any {
  const { url, anonKey } = config.supabase;

  if (!url || !anonKey) {
    console.error("Server-side Supabase initialization failed: Missing env vars");
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
}
