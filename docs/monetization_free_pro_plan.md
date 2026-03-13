# Monetization Plan: Free + Pro

Last updated: 2026-03-13

Payment gateway: Paddle

## Goal

Implement a simple 2-tier pricing model for Invoice-Quickly:

- `Free`
- `Pro`

Keep rollout lean, reduce complexity, and maximize conversion.

Use Paddle as the only payment gateway for checkout, subscriptions, and billing lifecycle events.

## Pricing Suggestion

- `Free`: 0 USD
- `Pro`: 10 USD/month or 99 USD/year

Notes:

- Keep annual discount around 20% to improve cash flow.
- Test pricing later with A/B experiments (phase 2).

## Plan Features

### Free

- Ads enabled
- Max 1 company
- Max 50 invoices per month
- Basic invoice creation/edit/download
- Public invoice share (current behavior)
- No recurring invoices
- No auto payment reminders
- No advanced branding

### Pro

- No ads
- Unlimited companies
- Unlimited invoices
- Advanced branding (logo, colors, footer)
- Recurring invoices
- Auto due/overdue reminders
- Advanced CSV export
- Priority support

## Entitlements (Source of Truth)

Use plan-based capability checks with these fields:

- `plan`: `free | pro`
- `max_companies`: `1 | unlimited`
- `max_invoices_per_month`: `50 | unlimited`
- `ads_enabled`: `true | false`
- `can_use_recurring`: `false | true`
- `can_use_auto_reminders`: `false | true`
- `can_use_advanced_branding`: `false | true`
- `can_use_advanced_export`: `false | true`

## Suggested Paywall Triggers

1. User on Free clicks `Create Company` for company #2.
2. User on Free reaches monthly invoice limit.
3. User on Free tries to enable `Recurring`.
4. User on Free tries to disable ads.

For each trigger:

- Show upgrade modal with clear value proposition.
- Keep primary CTA: `Upgrade to Pro`.
- Keep secondary CTA: `Maybe later`.

## Paddle Setup (Source of Truth)

Define one product in Paddle with 2 prices:

- `Pro Monthly` (10 USD/month)
- `Pro Yearly` (96 USD/year)

Environment variables:

- `PADDLE_ENV` (`sandbox | production`)
- `PADDLE_API_KEY`
- `PADDLE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`
- `PADDLE_PRICE_ID_PRO_MONTHLY`
- `PADDLE_PRICE_ID_PRO_YEARLY`

Store these IDs in server environment only (except public client token).

## Checkout + Webhook Flow

1. User clicks `Upgrade to Pro`.
2. App calls server action/API to create Paddle checkout for selected price.
3. User completes checkout in Paddle.
4. Paddle sends webhook events to app webhook endpoint.
5. Webhook verifies signature, updates subscription status/period in database.
6. Entitlement helper reads latest status and enables/disables Pro capabilities.

Recommended webhook events to handle:

- `transaction.completed`
- `subscription.created`
- `subscription.updated`
- `subscription.canceled`
- `subscription.past_due`
- `subscription.resumed`

## UX Copy Suggestions

### Upgrade modal (company limit)

Title:

- `Unlock Multiple Companies with Pro`

Body:

- `Free plan supports 1 company. Upgrade to Pro to manage unlimited companies and invoices.`

CTA:

- Primary: `Upgrade to Pro`
- Secondary: `Maybe later`

### Upgrade modal (invoice limit)

Title:

- `You reached your monthly invoice limit`

Body:

- `Free plan includes up to 30 invoices/month. Upgrade to Pro for unlimited invoices and no ads.`

CTA:

- Primary: `Upgrade to Pro`
- Secondary: `Back to dashboard`

## Metrics to Track

Track conversion funnel events:

- `view_pricing`
- `view_upgrade_modal`
- `click_upgrade`
- `start_checkout`
- `paddle_checkout_opened`
- `paddle_checkout_completed`
- `paddle_webhook_processed`
- `subscription_activated`
- `subscription_canceled`

Track trigger-level conversion:

- Trigger: company limit
- Trigger: invoice limit
- Trigger: recurring feature
- Trigger: no-ads feature

## Rollout Strategy

### Phase 1 (MVP)

- Add Free/Pro plan model
- Add entitlement checks for company count, invoice/month, ads
- Add pricing page and upgrade modal
- Integrate Paddle checkout (monthly/yearly)
- Add Paddle webhook endpoint and signature validation
- Keep billing state machine simple (`active | canceled | past_due`)

### Phase 2

- Recurring invoices
- Auto reminders
- Advanced branding/export
- Improve conversion copy and experiments

## Risks and Mitigation

### Risk: Free users feel blocked too early

Mitigation:

- Keep Free useful (1 company + 30 invoices/month is practical)
- Only trigger paywall at clear upgrade moments

### Risk: Low upgrade conversion

Mitigation:

- Emphasize "No ads + unlimited companies/invoices"
- Offer annual discount
- Add trial later if needed

### Risk: Webhook mismatch or delayed sync

Mitigation:

- Treat Paddle webhook as billing source of truth
- Make webhook processing idempotent by event ID
- Log failed webhook processing for retry
- Add lightweight admin billing status view for debugging

### Risk: Complexity in entitlement checks

Mitigation:

- Centralize checks in one server-side helper
- Avoid scattered plan logic in UI components

## Implementation Notes (Later)

When implementation starts, do in this order:

1. Database schema for user subscription/plan.
2. Central entitlement helper.
3. Add Paddle config and price ID mapping.
4. Add pricing/upgrade UI with monthly/yearly selector.
5. Create checkout endpoint/server action for Paddle.
6. Add Paddle webhook endpoint + signature verification.
7. Guard company creation and invoice creation.
8. Add ads visibility by entitlement.
9. Add analytics events.

This document is planning-only and intentionally implementation-agnostic for now.
