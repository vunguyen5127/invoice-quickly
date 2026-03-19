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
