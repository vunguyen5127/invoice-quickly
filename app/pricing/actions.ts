"use server";

import { createClient } from "@supabase/supabase-js";
import { getBillingProvider } from "@/utils/billing";
import config from "@/utils/config";

function getServerSupabase(token?: string) {
  const { url, anonKey: key } = config.supabase;
  if (!url || !key) {
    throw new Error("Missing Supabase environment variables");
  }
  
  const options = token ? {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  } : {};

  return createClient(url, key, options);
}

/**
 * Create a checkout session.
 * Pass isTest=true to use the $0 test variant (LEMON_VARIANT_TEST) for QA.
 */
export async function createCheckout(token: string, isYearly: boolean, isTest = false) {
  const effectiveYearly = isTest ? false : isYearly;
  console.log(`[${new Date().toISOString()}] [Checkout/START] provider=${config.billingProvider} isYearly=${effectiveYearly} isTest=${isTest}`);
  
  if (!token || token === "undefined") {
    console.error(`[${new Date().toISOString()}] [Checkout/AUTH] ❌ No valid token`);
    throw new Error("Authentication failed: No valid session token provided.");
  }

  const supabase = getServerSupabase(token);
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error(`[${new Date().toISOString()}] [Checkout/AUTH] ❌ Auth failed: ${authError?.message}`);
    throw new Error(`Authentication failed: ${authError?.message || "Auth session missing!"}`);
  }

  console.log(`[${new Date().toISOString()}] [Checkout/AUTH] ✓ userId=${user.id}`);

  const billing = getBillingProvider();
  const result = await billing.createCheckout({
    userId: user.id,
    userEmail: user.email || "",
    isYearly: effectiveYearly,
    isTest,
  });

  console.log(`[${new Date().toISOString()}] [Checkout/DONE] checkoutUrl=${result.checkoutUrl ?? "(paddle)"}`);
  return result;
}

/** Expose which billing provider is active so the client can decide the checkout flow */
export async function getBillingProviderName() {
  return config.billingProvider;
}
