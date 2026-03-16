# Monetization Plan: Free + Pro (Sustainable & Protected)

Last updated: 2026-03-16
Payment gateway: Paddle

## Goal

Implement a simple 2-tier pricing model for Invoice-Quickly. The focus is on profitability and system stability by using strict limits for Free users and a protected "Unlimited" Pro tier.

- `Free`: Casual/occasional users.
- `Pro`: Professional freelancers and small businesses.

## Pricing

| Plan | Monthly | Yearly (Save ~17%) |
| :--- | :--- | :--- |
| **Free** | $0 | $0 |
| **Pro** | $9 | $89 |

## Plan Features

### Free ($0)
- Max 1 company
- **Max 15 invoices per month** (Total downloads/shares)
- Ads enabled
- Basic templates
- "Powered by Invoice-Quickly" badge in footer
- No advanced branding

### Pro ($9/mo)
- **Unlimited companies** (Fair Use: 10)
- **Unlimited invoices** (Fair Use: 500/mo)
- **No ads**
- **White-label option** (Remove "Powered by" badge)
- Advanced branding (Upload logo, custom colors, footer text)
- Recurring invoices (Phase 2)
- Payment reminders (Phase 2)
- Priority support

## Fair Use Policy (Protection against Abuse)

To ensure system stability and fair access for all users, the "Unlimited" features in the Pro tier are subject to a **Fair Use Policy**:
- **Soft Limit on Companies**: Up to 10 companies per account. This prevents bot-driven automated account creation while accommodating the most prolific power users.
- **Monthly Invoice Cap**: Up to 500 invoices per month. This protects against automated scripts or abnormal usage that could strain database and storage resources.
- *Users exceeding these limits will be contacted for custom Enterprise pricing or to ensure their usage is legitimate.*

## Why this is sustainable?

1.  **Stop Losses on Free**: By limiting Free to 15 invoices/mo, we ensure that users who get significant value from the tool contribute to its maintenance.
2.  **Safety on Pro**: The Fair Use Policy (10/500) covers 99.9% of human users. It acts as a safety valve against malicious scripts or "infinite" growth that could crash the system or balloon costs unexpectedly.
3.  **Low Storage Cost**: Our optimized WebP handling keeps logo/signature storage extremely efficient, even for Pro users with 10 companies.

## Entitlements (System Source of Truth)

- `plan`: `free | pro`
- `max_companies`: `1 | 10`
- `monthly_invoice_limit`: `15 | 500`
- `ads_enabled`: `true | false`
- `can_remove_branding`: `false | true`
- `can_use_advanced_branding`: `false | true`
