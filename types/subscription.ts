export type PlanType = 'free' | 'pro';
export type SubscriptionStatus = 'free' | 'active' | 'canceled' | 'past_due';

export interface Subscription {
  id: string;
  user_id: string;
  paddle_subscription_id: string | null;
  paddle_customer_id: string | null;
  status: SubscriptionStatus;
  plan: PlanType;
  price_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at: string | null;
  card_brand: string | null;
  card_last4: string | null;
  next_billed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Entitlements {
  plan: PlanType;
  status: SubscriptionStatus;
  maxCompanies: number | null;       // null = unlimited
  maxInvoicesPerMonth: number | null; // null = unlimited
  adsEnabled: boolean;
  canUseRecurring: boolean;
  canUseAutoReminders: boolean;
  canUseAdvancedBranding: boolean;
  canUseAdvancedExport: boolean;
}

export const FREE_ENTITLEMENTS: Entitlements = {
  plan: 'free',
  status: 'free',
  maxCompanies: 1,
  maxInvoicesPerMonth: 15,
  adsEnabled: true,
  canUseRecurring: false,
  canUseAutoReminders: false,
  canUseAdvancedBranding: false,
  canUseAdvancedExport: false,
};

export const PRO_ENTITLEMENTS: Entitlements = {
  plan: 'pro',
  status: 'active',
  maxCompanies: 10,
  maxInvoicesPerMonth: 500,
  adsEnabled: false,
  canUseRecurring: true,
  canUseAutoReminders: true,
  canUseAdvancedBranding: true,
  canUseAdvancedExport: true,
};
