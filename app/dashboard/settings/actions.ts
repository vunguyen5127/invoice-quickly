"use server";

import { createClient } from "@supabase/supabase-js";
import { Subscription } from "@/types/subscription";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import config from "@/utils/config";
import { getBillingProvider } from "@/utils/billing";

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
  const billing = getBillingProvider();
  const result = await billing.cancelSubscription(subscriptionId);

  if ("error" in result && result.error) {
    return result;
  }

  // Update database immediately
  const supabase = getServerSupabase(token);
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase
      .from("subscriptions")
      .update({ 
        cancel_at: new Date().toISOString(),
        updated_at: new Date().toISOString() 
      })
      .eq("user_id", user.id);
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function resumeSubscription(token: string, subscriptionId: string) {
  const billing = getBillingProvider();
  const result = await billing.resumeSubscription(subscriptionId);

  if ("error" in result && result.error) {
    return result;
  }

  // Update database immediately
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
}
