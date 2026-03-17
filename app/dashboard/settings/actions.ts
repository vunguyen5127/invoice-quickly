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

  const isSandbox = process.env.NEXT_PUBLIC_PADDLE_ENV === "sandbox";
  const baseUrl = isSandbox ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";

  try {
    // First, check if there's already a scheduled change
    const getResponse = await fetch(`${baseUrl}/subscriptions/${subscriptionId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.PADDLE_API_KEY}`,
      },
    });

    if (getResponse.ok) {
      const subData = await getResponse.json();
      if (subData.data?.scheduled_change) {
        // If it's already scheduled for cancellation, just return success
        if (subData.data.scheduled_change.action === 'cancel') {
          return { success: true };
        }
        // If there's another type of change, we might need to overwrite it or error
        // But for now, we'll try the cancel call anyway or return a specific error
      }
    }

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
      
      // Handle the case where there's a pending change
      if (errorData.error?.code === 'subscription_update_has_pending_scheduled_change') {
        return { error: "There is already a pending change on your subscription. Please wait for it to process or contact support." };
      }
      
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

  const isSandbox = process.env.NEXT_PUBLIC_PADDLE_ENV === "sandbox";
  const baseUrl = isSandbox ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";

  try {
    // 1. Get current status to decide which endpoint to use
    const getResponse = await fetch(`${baseUrl}/subscriptions/${subscriptionId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.PADDLE_API_KEY}`,
      },
    });

    if (!getResponse.ok) {
      return { error: "Failed to fetch subscription status from Paddle" };
    }

    const subData = await getResponse.json();
    const status = subData.data?.status;

    let response;
    if (status === 'active') {
      // If active (with scheduled cancellation), we remove the scheduled change
      response = await fetch(`${baseUrl}/subscriptions/${subscriptionId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${process.env.PADDLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduled_change: null,
        }),
      });
    } else {
      // If canceled or past_due, we use the activate endpoint
      response = await fetch(`${baseUrl}/subscriptions/${subscriptionId}/activate`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.PADDLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Paddle resume error:", errorData);
      return { error: errorData.error?.detail || "Failed to resume subscription" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error calling Paddle API:", error);
    return { error: "Internal server error" };
  }
}
