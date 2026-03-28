/**
 * Lemon Squeezy Billing Provider Implementation
 */

import crypto from "crypto";
import config from "@/utils/config";
import type { BillingProvider, CheckoutParams, CheckoutResult, ParsedSubscriptionEvent } from "./types";

const LEMON_CONFIG = config.lemon;
const LEMON_API_BASE = "https://api.lemonsqueezy.com/v1";

export class LemonBillingProvider implements BillingProvider {
  readonly name = "lemon" as const;

  private get headers() {
    return {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${LEMON_CONFIG.apiKey}`,
    };
  }

  async createCheckout(params: CheckoutParams): Promise<CheckoutResult> {
    const variantId = params.isTest
      ? LEMON_CONFIG.variants.test
      : (params.isYearly ? LEMON_CONFIG.variants.proYearly : LEMON_CONFIG.variants.proMonthly);

    if (!variantId) throw new Error("Lemon Squeezy variant ID not configured");

    const response = await fetch(`${LEMON_API_BASE}/checkouts`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              custom: { user_id: params.userId },
              email: params.userEmail,
            },
            product_options: {
              redirect_url: `${config.siteUrl}/dashboard?upgraded=1`,
            },
          },
          relationships: {
            store: { data: { type: "stores", id: LEMON_CONFIG.storeId } },
            variant: { data: { type: "variants", id: variantId } },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Lemon Squeezy checkout creation error:", errorData);
      throw new Error(errorData.errors?.[0]?.detail || "Failed to create checkout");
    }

    const result = await response.json();
    return { checkoutUrl: result.data.attributes.url };
  }

  async cancelSubscription(subscriptionId: string): Promise<{ success?: boolean; error?: string }> {
    try {
      const response = await fetch(`${LEMON_API_BASE}/subscriptions/${subscriptionId}`, {
        method: "DELETE",
        headers: this.headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Lemon Squeezy cancellation error:", errorData);
        return { error: errorData.errors?.[0]?.detail || "Failed to cancel subscription" };
      }

      return { success: true };
    } catch (error) {
      console.error("Error calling Lemon Squeezy API:", error);
      return { error: "Internal server error" };
    }
  }

  async resumeSubscription(subscriptionId: string): Promise<{ success?: boolean; error?: string }> {
    try {
      const response = await fetch(`${LEMON_API_BASE}/subscriptions/${subscriptionId}`, {
        method: "PATCH",
        headers: this.headers,
        body: JSON.stringify({
          data: {
            type: "subscriptions",
            id: subscriptionId,
            attributes: { cancelled: false },
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Lemon Squeezy resume error:", errorData);
        return { error: errorData.errors?.[0]?.detail || "Failed to resume subscription" };
      }

      return { success: true };
    } catch (error) {
      console.error("Error calling Lemon Squeezy API:", error);
      return { error: "Internal server error" };
    }
  }

  verifyWebhook(rawBody: string, signatureHeader: string): boolean {
    if (!LEMON_CONFIG.webhookSecret) {
      console.error("LEMONSQUEEZY_WEBHOOK_SECRET is not configured");
      return false;
    }

    try {
      const hmac = crypto
        .createHmac("sha256", LEMON_CONFIG.webhookSecret)
        .update(rawBody)
        .digest("hex");

      return crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(hmac));
    } catch (err) {
      console.error("Lemon webhook signature verification error:", err);
      return false;
    }
  }

  parseWebhookEvent(rawBody: string): ParsedSubscriptionEvent | null {
    try {
      const event = JSON.parse(rawBody);
      const eventName: string = event.meta?.event_name;
      const data = event.data;
      const attrs = data?.attributes;

      let action: ParsedSubscriptionEvent["action"] = "ignore";
      switch (eventName) {
        case "subscription_created":
          action = "create";
          break;
        case "subscription_updated":
        case "subscription_resumed":
        case "subscription_payment_success":
          action = "update";
          break;
        case "subscription_cancelled":
        case "subscription_expired":
          action = "cancel";
          break;
        case "subscription_payment_failed":
          action = "past_due";
          break;
        default:
          return null;
      }

      const variantId = String(attrs?.variant_id || "");
      const userId = event.meta?.custom_data?.user_id;

      let cancelAt: string | null = null;
      if (attrs?.cancelled) {
        cancelAt = attrs.ends_at || new Date().toISOString();
      }

      // Lemon Squeezy card info from subscription
      const cardBrand = attrs?.card_brand || null;
      const cardLast4 = attrs?.card_last_four || null;

      return {
        providerSubscriptionId: String(data.id),
        providerCustomerId: String(attrs?.customer_id || ""),
        userId,
        status: attrs?.status || "active",
        plan: this.getPlanFromVariantId(variantId),
        priceId: variantId,
        currentPeriodStart: attrs?.created_at || null,
        currentPeriodEnd: attrs?.renews_at || attrs?.ends_at || null,
        cancelAt,
        cardBrand,
        cardLast4,
        nextBilledAt: attrs?.renews_at || null,
        action,
      };
    } catch (err) {
      console.error("Error parsing Lemon Squeezy webhook:", err);
      return null;
    }
  }

  mapStatus(lemonStatus: string): string {
    switch (lemonStatus) {
      case "active":
      case "on_trial":
        return "active";
      case "cancelled":
        return "canceled";
      case "past_due":
      case "unpaid":
        return "past_due";
      case "expired":
      case "paused":
        return "canceled";
      default:
        return "free";
    }
  }

  private getPlanFromVariantId(variantId: string): "pro" | "free" {
    if (
      variantId === LEMON_CONFIG.variants.proMonthly ||
      variantId === LEMON_CONFIG.variants.proYearly
    ) {
      return "pro";
    }
    return "free";
  }
}
