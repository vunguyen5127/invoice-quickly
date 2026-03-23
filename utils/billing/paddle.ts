/**
 * Paddle Billing Provider Implementation
 */

import crypto from "crypto";
import config from "@/utils/config";
import type { BillingProvider, CheckoutParams, CheckoutResult, ParsedSubscriptionEvent } from "./types";

const PADDLE_CONFIG = config.paddle;

export class PaddleBillingProvider implements BillingProvider {
  readonly name = "paddle" as const;

  private get baseUrl() {
    return PADDLE_CONFIG.env === "sandbox"
      ? "https://sandbox-api.paddle.com"
      : "https://api.paddle.com";
  }

  async createCheckout(params: CheckoutParams): Promise<CheckoutResult> {
    const priceId = params.isYearly
      ? PADDLE_CONFIG.prices.proYearly
      : PADDLE_CONFIG.prices.proMonthly;

    if (!priceId) throw new Error("Price ID not configured");

    const response = await fetch(`${this.baseUrl}/transactions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PADDLE_CONFIG.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [{ price_id: priceId, quantity: 1 }],
        custom_data: { user_id: params.userId },
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
  }

  async cancelSubscription(subscriptionId: string): Promise<{ success?: boolean; error?: string }> {
    try {
      // Check for existing scheduled change
      const getResponse = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${PADDLE_CONFIG.apiKey}` },
      });

      if (getResponse.ok) {
        const currentSubData = await getResponse.json();
        if (currentSubData.data?.scheduled_change?.action === "cancel") {
          return { success: true };
        }
      }

      const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PADDLE_CONFIG.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ effective_from: "next_billing_period" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error?.code === "subscription_update_has_pending_scheduled_change") {
          return { error: "There is already a pending change on your subscription." };
        }
        return { error: errorData.error?.detail || "Failed to cancel subscription" };
      }

      return { success: true };
    } catch (error) {
      console.error("Error calling Paddle API:", error);
      return { error: "Internal server error" };
    }
  }

  async resumeSubscription(subscriptionId: string): Promise<{ success?: boolean; error?: string }> {
    try {
      const getResponse = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${PADDLE_CONFIG.apiKey}` },
      });

      if (!getResponse.ok) {
        return { error: "Failed to fetch subscription status from Paddle" };
      }

      const subData = await getResponse.json();
      const status = subData.data?.status;

      let response;
      if (status === "active") {
        // Remove scheduled cancellation
        response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${PADDLE_CONFIG.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ scheduled_change: null }),
        });
      } else {
        // Reactivate
        response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}/activate`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${PADDLE_CONFIG.apiKey}`,
            "Content-Type": "application/json",
          },
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.error?.detail || "Failed to resume subscription" };
      }

      return { success: true };
    } catch (error) {
      console.error("Error calling Paddle API:", error);
      return { error: "Internal server error" };
    }
  }

  verifyWebhook(rawBody: string, signatureHeader: string): boolean {
    if (!PADDLE_CONFIG.webhookSecret) {
      console.error("PADDLE_WEBHOOK_SECRET is not configured");
      return false;
    }

    try {
      const parts: Record<string, string> = {};
      signatureHeader.split(";").forEach((part) => {
        const [key, value] = part.trim().split("=");
        if (key && value) parts[key] = value;
      });

      const ts = parts["ts"];
      const h1 = parts["h1"];
      if (!ts || !h1) return false;

      const signedPayload = `${ts}:${rawBody}`;
      const expectedSignature = crypto
        .createHmac("sha256", PADDLE_CONFIG.webhookSecret)
        .update(signedPayload)
        .digest("hex");

      return crypto.timingSafeEqual(Buffer.from(h1), Buffer.from(expectedSignature));
    } catch (err) {
      console.error("Webhook signature verification error:", err);
      return false;
    }
  }

  parseWebhookEvent(rawBody: string): ParsedSubscriptionEvent | null {
    try {
      const event = JSON.parse(rawBody);
      const eventType: string = event.event_type;
      const data = event.data;

      let action: ParsedSubscriptionEvent["action"] = "ignore";
      switch (eventType) {
        case "subscription.created":
        case "subscription.activated":
          action = "create";
          break;
        case "subscription.updated":
        case "subscription.resumed":
          action = "update";
          break;
        case "subscription.canceled":
          action = "cancel";
          break;
        case "subscription.past_due":
          action = "past_due";
          break;
        default:
          return null;
      }

      const priceId = data.items?.[0]?.price?.id || "";
      const card = data.payment_method?.details?.card;

      let cancelAt: string | null = null;
      if (data.scheduled_change?.action === "cancel") {
        cancelAt = data.scheduled_change.effective_at;
      } else if (data.status === "canceled") {
        cancelAt = data.canceled_at || new Date().toISOString();
      }

      return {
        providerSubscriptionId: data.id,
        providerCustomerId: data.customer_id,
        userId: data.custom_data?.user_id,
        status: data.status,
        plan: this.getPlanFromPriceId(priceId),
        priceId,
        currentPeriodStart: data.current_billing_period?.starts_at,
        currentPeriodEnd: data.current_billing_period?.ends_at,
        cancelAt,
        cardBrand: card?.type || card?.brand || null,
        cardLast4: card?.last4 || null,
        nextBilledAt: data.next_billed_at || data.current_billing_period?.ends_at || null,
        action,
      };
    } catch (err) {
      console.error("Error parsing Paddle webhook:", err);
      return null;
    }
  }

  mapStatus(paddleStatus: string): string {
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

  private getPlanFromPriceId(priceId: string): "pro" | "free" {
    if (
      priceId === PADDLE_CONFIG.prices.proMonthly ||
      priceId === PADDLE_CONFIG.prices.proYearly
    ) {
      return "pro";
    }
    return "free";
  }
}
