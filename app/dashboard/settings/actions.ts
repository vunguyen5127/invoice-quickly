"use server";

import { createClient } from "@supabase/supabase-js";
import { Subscription } from "@/types/subscription";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import config from "@/utils/config";

function getServerSupabase(token: string) {
  const { url, anonKey } = config.supabase;
  if (!url || !anonKey) {
    throw new Error("Missing Supabase environment variables");
  }
  return createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
}

export async function getUserSubscription(token: string): Promise<Subscription | null> {
  noStore();
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
  if (!config.paddle.apiKey) {
    console.error("PADDLE_API_KEY is missing");
    return { error: "PADDLE_API_KEY_MISSING" };
  }

  const isSandbox = config.paddle.env === "sandbox";
  const baseUrl = isSandbox ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";

  try {
    // First, check if there's already a scheduled change
    const getResponse = await fetch(`${baseUrl}/subscriptions/${subscriptionId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${config.paddle.apiKey}`,
      },
    });

    let currentSubData: any = null;
    if (getResponse.ok) {
      currentSubData = await getResponse.json();
      if (currentSubData.data?.scheduled_change) {
        // If it's already scheduled for cancellation, just return success
        if (currentSubData.data.scheduled_change.action === 'cancel') {
          return { success: true };
        }
      }
    }

    const response = await fetch(`${baseUrl}/subscriptions/${subscriptionId}/cancel`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.paddle.apiKey}`,
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

    // Update database immediately if possible to avoid waiting for webhook
    const supabase = getServerSupabase(token);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("subscriptions")
        .update({ 
          // We don't change the status to 'canceled' yet because it's scheduled for end of period
          // But we record the scheduled change
          cancel_at: currentSubData?.data?.scheduled_change?.effective_at || new Date().toISOString(),
          updated_at: new Date().toISOString() 
        })
        .eq("user_id", user.id);
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error calling Paddle API:", error);
    return { error: "Internal server error" };
  }
}

export async function resumeSubscription(token: string, subscriptionId: string) {
  if (!config.paddle.apiKey) {
    console.error("PADDLE_API_KEY is missing");
    return { error: "PADDLE_API_KEY_MISSING" };
  }

  const isSandbox = config.paddle.env === "sandbox";
  const baseUrl = isSandbox ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";

  try {
    // 1. Get current status to decide which endpoint to use
    const getResponse = await fetch(`${baseUrl}/subscriptions/${subscriptionId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${config.paddle.apiKey}`,
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
          "Authorization": `Bearer ${config.paddle.apiKey}`,
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
          "Authorization": `Bearer ${config.paddle.apiKey}`,
          "Content-Type": "application/json",
        },
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Paddle resume error:", errorData);
      return { error: errorData.error?.detail || "Failed to resume subscription" };
    }

    // Update database immediately if possible to avoid waiting for webhook
    const supabase = getServerSupabase(token);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("subscriptions")
        .update({ 
          status: 'active',
          cancel_at: null,
          updated_at: new Date().toISOString() 
        })
        .eq("user_id", user.id);
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error calling Paddle API:", error);
    return { error: "Internal server error" };
  }
}
