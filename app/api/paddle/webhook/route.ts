import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyPaddleWebhookSignature, getPlanFromPriceId } from "@/utils/paddle";

function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing Supabase service role environment variables");
  }
  return createClient(url, serviceKey);
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signatureHeader = request.headers.get("paddle-signature") || "";

    console.log(`[Paddle Webhook] Incoming request: ${signatureHeader ? "Has signature" : "No signature"}`);
    
    // Verify signature
    if (!verifyPaddleWebhookSignature(rawBody, signatureHeader)) {
      console.error("[Paddle Webhook] Signature verification failed");
      console.log("[Paddle Webhook] Header:", signatureHeader);
      // Don't log full rawBody for security, but maybe its length
      console.log(`[Paddle Webhook] Body length: ${rawBody.length}`);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventType: string = event.event_type;
    const data = event.data;

    console.log(`[Paddle Webhook] Received event: ${eventType}`, data?.id);

    const supabase = getServiceSupabase();

    switch (eventType) {
      case "subscription.created":
      case "subscription.activated":
      case "subscription.updated":
      case "subscription.resumed": {
        await handleSubscriptionUpdate(supabase, data);
        break;
      }
      case "subscription.canceled": {
        await handleSubscriptionCanceled(supabase, data);
        break;
      }
      case "subscription.past_due": {
        await handleSubscriptionPastDue(supabase, data);
        break;
      }
      case "transaction.completed": {
        console.log(`Transaction completed: ${data?.id}`);
        break;
      }
      default:
        console.log(`Unhandled Paddle event: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Paddle webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleSubscriptionUpdate(supabase: any, data: any) {
  const paddleSubscriptionId = data.id;
  const customerId = data.customer_id;
  const status = data.status; // active, trialing, paused, canceled, past_due
  const priceId = data.items?.[0]?.price?.id || "";
  const currentPeriodStart = data.current_billing_period?.starts_at;
  const currentPeriodEnd = data.current_billing_period?.ends_at;

  // Find user by paddle_customer_id or paddle_subscription_id
  // First, try to find existing subscription
  const { data: existingSub } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("paddle_subscription_id", paddleSubscriptionId)
    .single();

  if (existingSub) {
    // Update existing subscription
    const plan = getPlanFromPriceId(priceId);
    const mappedStatus = mapPaddleStatus(status);
    
    // Extract payment method details
    const card = data.payment_method?.details?.card;
    const cardBrand = card?.type || card?.brand;
    const cardLast4 = card?.last4;
    const nextBilledAt = data.next_billed_at || data.current_billing_period?.ends_at;

    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: mappedStatus,
        plan,
        price_id: priceId,
        paddle_customer_id: customerId,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        cancel_at: null,
        card_brand: cardBrand,
        card_last4: cardLast4,
        next_billed_at: nextBilledAt,
        updated_at: new Date().toISOString(),
      })
      .eq("paddle_subscription_id", paddleSubscriptionId);

    if (error) console.error("Error updating subscription:", error);
    else console.log(`Subscription updated: ${paddleSubscriptionId} → ${plan}/${mappedStatus}`);
  } else {
    // New subscription — find user by custom_data.user_id from the subscription
    const userId = data.custom_data?.user_id;
    if (!userId) {
      console.error("No user_id in custom_data for new subscription:", paddleSubscriptionId);
      return;
    }

    const plan = getPlanFromPriceId(priceId);
    const mappedStatus = mapPaddleStatus(status);
    
    // Extract payment method details
    const card = data.payment_method?.details?.card;
    const cardBrand = card?.type || card?.brand;
    const cardLast4 = card?.last4;
    const nextBilledAt = data.next_billed_at || data.current_billing_period?.ends_at;

    const { error } = await supabase
      .from("subscriptions")
      .upsert({
        user_id: userId,
        paddle_subscription_id: paddleSubscriptionId,
        paddle_customer_id: customerId,
        status: mappedStatus,
        plan,
        price_id: priceId,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        card_brand: cardBrand,
        card_last4: cardLast4,
        next_billed_at: nextBilledAt,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (error) console.error("Error upserting subscription:", error);
    else console.log(`Subscription created: ${paddleSubscriptionId} → ${plan}/${mappedStatus}`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleSubscriptionCanceled(supabase: any, data: any) {
  const paddleSubscriptionId = data.id;
  const cancelAt = data.scheduled_change?.effective_at || data.canceled_at;

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      cancel_at: cancelAt,
      updated_at: new Date().toISOString(),
    })
    .eq("paddle_subscription_id", paddleSubscriptionId);

  if (error) console.error("Error canceling subscription:", error);
  else console.log(`Subscription canceled: ${paddleSubscriptionId}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleSubscriptionPastDue(supabase: any, data: any) {
  const paddleSubscriptionId = data.id;

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "past_due",
      updated_at: new Date().toISOString(),
    })
    .eq("paddle_subscription_id", paddleSubscriptionId);

  if (error) console.error("Error marking subscription past_due:", error);
  else console.log(`Subscription past_due: ${paddleSubscriptionId}`);
}

function mapPaddleStatus(paddleStatus: string): string {
  switch (paddleStatus) {
    case "active":
    case "trialing":
      return "active";
    case "canceled":
      return "canceled";
    case "past_due":
      return "past_due";
    case "paused":
      return "canceled";
    default:
      return "free";
  }
}
