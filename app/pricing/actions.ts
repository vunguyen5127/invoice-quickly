"use server";

import { createClient } from "@supabase/supabase-js";
import { PADDLE_CONFIG } from "@/utils/paddle";

import config from "@/utils/config";

function getServerSupabase(token?: string) {
  const { url, anonKey: key } = config.supabase;
  if (!url || !key) {
    throw new Error("Missing Supabase environment variables");
  }
  
  // If token is provided, we set it in the headers to ensure the client is authenticated
  const options = token ? {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  } : {};

  return createClient(url, key, options);
}

export async function createCheckoutTransaction(token: string, isYearly: boolean) {
  console.log(`[Paddle] createCheckoutTransaction: token received (length: ${token?.length})`);
  
  if (!token || token === "undefined") {
    console.error("[Paddle] Invalid token received");
    throw new Error("Authentication failed: No valid session token provided.");
  }

  // Set the token in the client for this request
  const supabase = getServerSupabase(token);
  
  // Now getUser() should work with the token from headers
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("[Paddle] Supabase Auth Error Object:", JSON.stringify(authError, null, 2));
    console.log(`[Paddle] Supabase URL in use: ${config.supabase.url}`);
    throw new Error(`Authentication failed: ${authError?.message || "Auth session missing!"}`);
  }


  const priceId = isYearly ? PADDLE_CONFIG.prices.proYearly : PADDLE_CONFIG.prices.proMonthly;

  if (!priceId) {
    throw new Error("Price ID not configured");
  }

  const isSandbox = PADDLE_CONFIG.env === "sandbox";
  const baseUrl = isSandbox ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";

  try {
    const response = await fetch(`${baseUrl}/transactions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.paddle.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            price_id: priceId,
            quantity: 1,
          },
        ],
        custom_data: {
          user_id: user.id,
        },
        collection_mode: "automatic",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Paddle transaction creation error:", errorData);
      throw new Error(errorData.error?.detail || "Failed to create checkout");
    }

    const { data } = await response.json();
    return { transactionId: data.id };
  } catch (error) {
    console.error("Error calling Paddle API:", error);
    throw error;
  }
}
