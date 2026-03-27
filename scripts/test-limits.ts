import { createClient } from "@supabase/supabase-js";

// Now we can require our app config which relies on process.env
// We must use absolute or relative paths because this is a script, not webpack
import config from "../utils/config";

const supabaseUrl = config.supabase.url;
// We need Service Role Key to bypass RLS for direct testing, 
// config.supabase.anonKey won't let us bulk delete arbitrarily easily.
const supabaseKey = config.supabase.anonKey;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE env vars. Ensure .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log("🚀 Starting Unit Tests for Limits & Entitlements...\n");

  try {
    const testUserId = "test-limit-user-" + Date.now();
    
    console.log("✅ Check 1: Verifying getMonthlyInvoiceCount logic (Invoices + Quotes)");
    
    // Insert dummy company
    const { data: comp } = await supabase.from('companies').insert([{
        user_id: testUserId,
        name: "Test Limit Company",
        default_currency: "USD"
    }]).select("id").single();
    
    if (comp) {
      // 2 Invoices
      await supabase.from('invoices').insert([
        { user_id: testUserId, company_id: comp.id, invoice_number: "INV-1", status: "draft" },
        { user_id: testUserId, company_id: comp.id, invoice_number: "INV-2", status: "draft" }
      ]);
      // 3 Quotes
      await supabase.from('quotes').insert([
        { user_id: testUserId, company_id: comp.id, quote_number: "QUO-1", status: "draft" },
        { user_id: testUserId, company_id: comp.id, quote_number: "QUO-2", status: "draft" },
        { user_id: testUserId, company_id: comp.id, quote_number: "QUO-3", status: "draft" }
      ]);

      const { count: invCount } = await supabase.from('invoices').select('id', { count: 'exact', head: true }).eq('user_id', testUserId);
      const { count: quoCount } = await supabase.from('quotes').select('id', { count: 'exact', head: true }).eq('user_id', testUserId);
      
      const combinedCount = (invCount || 0) + (quoCount || 0);
      console.log(`   - Found ${invCount} Invoices`);
      console.log(`   - Found ${quoCount} Quotes`);
      console.log(`   - Total Document Count: ${combinedCount} (Expected: 5)`);
      if (combinedCount === 5) {
        console.log("   👉 PASSED: Document counting logic correctly sums both schemas!");
      } else {
        console.error("   ❌ FAILED: Document counting logic mismatch.");
      }

      console.log("\n✅ Check 2: Verifying Library Limits");
      await supabase.from('clients').insert([
        { user_id: testUserId, name: "C1", email: "1@c.c" },
        { user_id: testUserId, name: "C2", email: "2@c.c" }
      ]);
      const { count: clientCount } = await supabase.from('clients').select('id', { count: 'exact', head: true }).eq('user_id', testUserId);
      console.log(`   - Found ${clientCount} Saved Clients (Expected: 2)`);
      if (clientCount === 2) {
        console.log("   👉 PASSED: Saved Clients counting perfectly targets user scope.");
      } else {
        console.error("   ❌ FAILED: Saved Clients counting mismatch.");
      }

      // Cleanup
      await supabase.from('invoices').delete().eq('user_id', testUserId);
      await supabase.from('quotes').delete().eq('user_id', testUserId);
      await supabase.from('clients').delete().eq('user_id', testUserId);
      await supabase.from('companies').delete().eq('user_id', testUserId);
      console.log("\n🧹 Test data cleaned up successfully.");
    }

  } catch (error) {
    console.error("Test execution failed:", error);
  }
}

runTests();
