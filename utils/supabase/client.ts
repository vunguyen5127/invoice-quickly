import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log("Initializing Supabase client...");
console.log("URL:", supabaseUrl ? "Present" : "Missing");
console.log("Key:", supabaseAnonKey ? "Present" : "Missing");

// Throw error if keys are missing but allow the app to compile
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL and Anon Key are missing. Please add them to your .env.local file.")
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

if (!supabase) {
  console.error("Supabase client failed to initialize: export is null");
}
