"use server";

import { createClient } from "@supabase/supabase-js";
import { PADDLE_CONFIG } from "@/utils/paddle";
import { isTester } from "@/utils/tester";

function getServerSupabase(token: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
}

export async function createCheckoutTransaction(token: string, isYearly: boolean) {
  const supabase = getServerSupabase(token);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  if (!isTester(user.email)) {
    throw new Error("Subscriptions are currently in private beta.");
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
        "Authorization": `Bearer ${process.env.PADDLE_API_KEY}`,
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
