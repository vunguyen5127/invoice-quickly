/**
 * Paddle server-side configuration and helpers.
 * Used by the webhook endpoint and checkout actions.
 */

import crypto from "crypto";

export const PADDLE_CONFIG = {
  env: process.env.PADDLE_ENV || "sandbox",
  apiKey: process.env.PADDLE_API_KEY || "",
  webhookSecret: process.env.PADDLE_WEBHOOK_SECRET || "",
  clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "",
  prices: {
    proMonthly: process.env.PADDLE_PRICE_PRO_MONTHLY || "",
    proYearly: process.env.PADDLE_PRICE_PRO_YEARLY || "",
  },
};

/**
 * Verify Paddle webhook signature (using ts_body + h1 scheme).
 * Reference: https://developer.paddle.com/webhooks/verify-webhook-signatures
 */
export function verifyPaddleWebhookSignature(
  rawBody: string,
  signatureHeader: string
): boolean {
  if (!PADDLE_CONFIG.webhookSecret) {
    console.error("PADDLE_WEBHOOK_SECRET is not configured");
    return false;
  }

  try {
    // Parse signature header: ts=...; h1=...
    const parts: Record<string, string> = {};
    signatureHeader.split(";").forEach((part) => {
      const [key, value] = part.trim().split("=");
      if (key && value) parts[key] = value;
    });

    const ts = parts["ts"];
    const h1 = parts["h1"];
    if (!ts || !h1) return false;

    // Build signed payload
    const signedPayload = `${ts}:${rawBody}`;

    const expectedSignature = crypto
      .createHmac("sha256", PADDLE_CONFIG.webhookSecret)
      .update(signedPayload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(h1),
      Buffer.from(expectedSignature)
    );
  } catch (err) {
    console.error("Webhook signature verification error:", err);
    return false;
  }
}

/**
 * Map a Paddle price ID to our plan name.
 */
export function getPlanFromPriceId(priceId: string): "pro" | "free" {
  if (
    priceId === PADDLE_CONFIG.prices.proMonthly ||
    priceId === PADDLE_CONFIG.prices.proYearly
  ) {
    return "pro";
  }
  return "free";
}
