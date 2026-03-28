import { NextRequest, NextResponse } from "next/server";
import { getBillingProvider } from "@/utils/billing";
import { paymentLogger } from "@/utils/payment-logger";
import { getServiceSupabase } from "@/utils/supabase/client";

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).slice(2, 8).toUpperCase();

  try {
    const rawBody = await request.text();
    const signatureHeader = request.headers.get("x-signature") || "";
    const eventName = (() => {
      try { return JSON.parse(rawBody)?.meta?.event_name ?? "unknown"; } catch { return "unknown"; }
    })();

    const billing = getBillingProvider();

    if (!billing.verifyWebhook(rawBody, signatureHeader)) {
      paymentLogger.error({
        requestId, tag: "Webhook/AUTH", eventName,
        message: "Signature verification FAILED",
      });
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = billing.parseWebhookEvent(rawBody);

    if (!event) {
      // Silently ignore unhandled events — no log needed
      return NextResponse.json({ received: true });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = getServiceSupabase() as any;
    const mappedStatus = billing.mapStatus(event.status);

    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("subscription_id", event.providerSubscriptionId)
      .single();

    if (existingSub) {
      const updateData: Record<string, unknown> = {
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

      if (error) {
        paymentLogger.error({
          requestId, tag: "Webhook/DB", eventName, userId: existingSub.user_id,
          subscriptionId: event.providerSubscriptionId,
          message: "Update failed",
          data: { message: error.message, code: error.code },
        });
      } else {
        paymentLogger.info({
          requestId, tag: "Webhook/DB", eventName, userId: existingSub.user_id,
          subscriptionId: event.providerSubscriptionId,
          message: `✅ Updated → ${event.plan}/${mappedStatus}`,
        });
      }
    } else if (event.userId) {
      const { error } = await supabase
        .from("subscriptions")
        .upsert({
          user_id: event.userId,
          provider: "lemon",
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

      if (error) {
        paymentLogger.error({
          requestId, tag: "Webhook/DB", eventName, userId: event.userId,
          subscriptionId: event.providerSubscriptionId,
          message: "Upsert failed",
          data: { message: error.message, code: error.code },
        });
      } else {
        paymentLogger.info({
          requestId, tag: "Webhook/DB", eventName, userId: event.userId,
          subscriptionId: event.providerSubscriptionId,
          message: `✅ Created → ${event.plan}/${mappedStatus}`,
        });
      }
    } else {
      paymentLogger.error({
        requestId, tag: "Webhook/DB", eventName,
        message: "No user_id in custom_data",
        data: { subscriptionId: event.providerSubscriptionId },
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    paymentLogger.error({
      requestId, tag: "Webhook/FATAL",
      message: "Unhandled exception",
      data: err instanceof Error ? { message: err.message } : { raw: String(err) },
    });
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
