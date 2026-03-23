/**
 * Billing Provider Factory
 * 
 * Returns the correct billing provider based on `BILLING_PROVIDER` env var.
 * Usage:
 *   import { getBillingProvider } from "@/utils/billing";
 *   const billing = getBillingProvider();
 */

import config from "@/utils/config";
import type { BillingProvider, BillingProviderName } from "./types";
import { PaddleBillingProvider } from "./paddle";
import { LemonBillingProvider } from "./lemon";

let _instance: BillingProvider | null = null;

export function getBillingProvider(): BillingProvider {
  if (_instance) return _instance;

  const provider: BillingProviderName = config.billingProvider;

  switch (provider) {
    case "lemon":
      _instance = new LemonBillingProvider();
      break;
    case "paddle":
    default:
      _instance = new PaddleBillingProvider();
      break;
  }

  return _instance;
}

/** Re-export types for convenience */
export type { BillingProvider, BillingProviderName, CheckoutParams, CheckoutResult, ParsedSubscriptionEvent } from "./types";
