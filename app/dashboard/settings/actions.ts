"use server";

import { createClient } from "@supabase/supabase-js";
import { Subscription } from "@/types/subscription";

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

export async function getUserSubscription(token: string): Promise<Subscription | null> {
  const supabase = getServerSupabase(token);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }

  return data as Subscription;
}

export async function cancelSubscription(token: string, subscriptionId: string) {
  if (!process.env.PADDLE_API_KEY) {
    console.error("PADDLE_API_KEY is missing");
    return { error: "PADDLE_API_KEY_MISSING" };
  }

  const isSandbox = process.env.PADDLE_ENV === "sandbox";
  const baseUrl = isSandbox ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";

  try {
    const response = await fetch(`${baseUrl}/subscriptions/${subscriptionId}/cancel`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PADDLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        effective_from: "next_billing_period",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Paddle cancellation error:", errorData);
      return { error: errorData.error?.detail || "Failed to cancel subscription" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error calling Paddle API:", error);
    return { error: "Internal server error" };
  }
}

export async function resumeSubscription(token: string, subscriptionId: string) {
  if (!process.env.PADDLE_API_KEY) {
    console.error("PADDLE_API_KEY is missing");
    return { error: "PADDLE_API_KEY_MISSING" };
  }

  const isSandbox = process.env.PADDLE_ENV === "sandbox";
  const baseUrl = isSandbox ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";

  try {
    const response = await fetch(`${baseUrl}/subscriptions/${subscriptionId}/activate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PADDLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Paddle activation error:", errorData);
      return { error: errorData.error?.detail || "Failed to resume subscription" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error calling Paddle API:", error);
    return { error: "Internal server error" };
  }
}
