import { NextRequest, NextResponse } from "next/server";
import { getBillingProvider } from "@/utils/billing";
import { getServiceSupabase } from "@/utils/supabase/client";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signatureHeader = request.headers.get("paddle-signature") || "";

    console.log(`[Paddle Webhook] Incoming request: ${signatureHeader ? "Has signature" : "No signature"}`);

    const billing = getBillingProvider();

    if (!billing.verifyWebhook(rawBody, signatureHeader)) {
      console.error("[Paddle Webhook] Signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = billing.parseWebhookEvent(rawBody);

    if (!event) {
      // Could be a transaction.completed or other unhandled event
      const parsed = JSON.parse(rawBody);
      console.log(`[Paddle Webhook] Unhandled event: ${parsed.event_type}`);
      return NextResponse.json({ received: true });
    }

    console.log(`[Paddle Webhook] Event action: ${event.action}, subscription: ${event.providerSubscriptionId}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = getServiceSupabase() as any;
    const mappedStatus = billing.mapStatus(event.status);

    // Try to find existing subscription by subscription_id
    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("subscription_id", event.providerSubscriptionId)
      .single();

    if (existingSub) {
      // Update existing
      const updateData: Record<string, any> = {
        status: event.action === "cancel" ? "canceled" : mappedStatus,
        plan: event.plan,
        price_id: event.priceId,
        customer_id: event.providerCustomerId,
        current_period_start: event.currentPeriodStart,
        current_period_end: event.currentPeriodEnd,
        cancel_at: event.action === "cancel" ? (event.cancelAt || new Date().toISOString()) : event.cancelAt,
        card_brand: event.cardBrand,
        card_last4: event.cardLast4,
        next_billed_at: event.action === "cancel" ? null : event.nextBilledAt,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("subscriptions")
        .update(updateData)
        .eq("subscription_id", event.providerSubscriptionId);

      if (error) console.error("Error updating subscription:", error);
      else console.log(`Subscription updated: ${event.providerSubscriptionId} → ${event.plan}/${mappedStatus}`);
    } else if (event.userId) {
      // New subscription
      const { error } = await supabase
        .from("subscriptions")
        .upsert({
          user_id: event.userId,
          provider: "paddle",
          subscription_id: event.providerSubscriptionId,
          customer_id: event.providerCustomerId,
          status: mappedStatus,
          plan: event.plan,
          price_id: event.priceId,
          current_period_start: event.currentPeriodStart,
          current_period_end: event.currentPeriodEnd,
          cancel_at: event.cancelAt,
          card_brand: event.cardBrand,
          card_last4: event.cardLast4,
          next_billed_at: event.nextBilledAt,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

      if (error) console.error("Error upserting subscription:", error);
      else console.log(`Subscription created: ${event.providerSubscriptionId} → ${event.plan}/${mappedStatus}`);
    } else {
      console.error("No user_id in custom_data for new subscription:", event.providerSubscriptionId);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Paddle webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
