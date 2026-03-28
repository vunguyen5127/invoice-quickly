/**
 * Billing Provider Abstraction Layer
 * 
 * Shared types and interface for payment providers (Paddle, Lemon Squeezy).
 * Switch provider via BILLING_PROVIDER env var.
 */

export type BillingProviderName = "paddle" | "lemon";

export interface CheckoutParams {
  userId: string;
  userEmail: string;
  isYearly: boolean;
  isTest?: boolean;
}

export interface CheckoutResult {
  /** For overlay checkouts (Paddle) */
  transactionId?: string;
  /** For redirect checkouts (Lemon Squeezy) */
  checkoutUrl?: string;
}

export interface WebhookVerification {
  isValid: boolean;
}

export interface ParsedSubscriptionEvent {
  providerSubscriptionId: string;
  providerCustomerId: string;
  userId?: string;            // from custom_data
  status: string;             // provider-specific, will be mapped
  plan: "pro" | "free";
  priceId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAt?: string | null;
  cardBrand?: string | null;
  cardLast4?: string | null;
  nextBilledAt?: string | null;
  action: "create" | "update" | "cancel" | "past_due" | "ignore";
}

export interface BillingProvider {
  readonly name: BillingProviderName;

  /** Create a checkout session / transaction */
  createCheckout(params: CheckoutParams): Promise<CheckoutResult>;

  /** Cancel a subscription (effective at end of period) */
  cancelSubscription(subscriptionId: string): Promise<{ success?: boolean; error?: string }>;

  /** Resume a canceled (but still active) subscription */
  resumeSubscription(subscriptionId: string): Promise<{ success?: boolean; error?: string }>;

  /** Verify a webhook signature */
  verifyWebhook(rawBody: string, signatureHeader: string): boolean;

  /** Parse a raw webhook event into our common format */
  parseWebhookEvent(rawBody: string): ParsedSubscriptionEvent | null;

  /** Map provider-specific status to our internal status */
  mapStatus(providerStatus: string): string;
}
