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

export async function createCheckout(token: string, isYearly: boolean) {
  console.log(`[Billing] createCheckout: provider=${config.billingProvider}, token length=${token?.length}`);
  
  if (!token || token === "undefined") {
    throw new Error("Authentication failed: No valid session token provided.");
  }

  const supabase = getServerSupabase(token);
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error(`Authentication failed: ${authError?.message || "Auth session missing!"}`);
  }

  const billing = getBillingProvider();
  return billing.createCheckout({
    userId: user.id,
    userEmail: user.email || "",
    isYearly,
  });
}

/** Expose which billing provider is active so the client can decide the checkout flow */
export async function getBillingProviderName() {
  return config.billingProvider;
}
