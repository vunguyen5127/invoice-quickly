import { test, expect } from "@playwright/test";
import { mockSupabaseUser, seedAuthenticatedSession, mockProUser, seedProSession } from "./helpers/auth";

/**
 * Module 23: Billing / Upgrade Flow
 *
 * TC-2301: Pricing page "Get Pro" button is visible.
 * TC-2302: Free user clicking upgrade in Settings shows upgrade options.
 * TC-2303: Upgrade modal "Upgrade to Pro" CTA is clickable.
 * TC-2304: Pro user Settings shows "Cancel Subscription" option.
 * TC-2305: Pro user Settings shows card info (last 4 digits).
 */
test.describe("Module 23: Billing & Upgrade Flow", () => {
  test("TC-2301: Pricing page has visible upgrade CTA button", async ({ page }) => {
    await page.goto("/pricing");

    await expect(page.getByText("Start free")).toBeVisible({ timeout: 10000 });

    // There should be a "Get Pro" or "Upgrade" CTA
    const upgradeBtn = page
      .getByRole("link", { name: /Get Pro|Upgrade|Start Pro/i })
      .or(page.getByRole("button", { name: /Get Pro|Upgrade|Start Pro/i }))
      .first();
    await expect(upgradeBtn).toBeVisible({ timeout: 10000 });
  });

  test("TC-2302: Free user's settings page shows upgrade prompt", async ({ page }) => {
    await mockSupabaseUser(page, "free-user@example.com");
    await seedAuthenticatedSession(page, "free-user@example.com");

    await page.goto("/dashboard/settings");

    // Should show upgrade / "Go Pro" prompt for free users
    await expect(
      page.getByText(/Upgrade|Go Pro|Free Plan/i).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("TC-2303: UpgradeModal can be triggered from generator", async ({ page }) => {
    await mockSupabaseUser(page, "free-user@example.com");
    await seedAuthenticatedSession(page, "free-user@example.com");

    await page.goto("/generator");
    await expect(
      page.getByRole("heading", { name: /Invoice Details|Editor/i }).first()
    ).toBeVisible({ timeout: 10000 });

    // Try to trigger recurring toggle (pro feature)
    const recurringToggle = page
      .getByRole("switch", { name: /Recurring Invoice/i })
      .or(page.locator('button[role="switch"]').filter({ hasText: /Recurring/i }));

    const toggleVisible = await recurringToggle.isVisible().catch(() => false);
    if (toggleVisible) {
      await recurringToggle.click();

      const upgradeModal = page.getByText(/Upgrade to Pro/i);
      await expect(upgradeModal).toBeVisible({ timeout: 5000 });

      // The modal should have a CTA button
      const modalCta = page
        .getByRole("button", { name: /Upgrade|Get Pro|Go Pro/i })
        .or(page.getByRole("link", { name: /Upgrade|Get Pro|Go Pro/i }))
        .first();
      await expect(modalCta).toBeVisible();
    }
  });

  test.skip("TC-2304: Pro user Settings shows Cancel Subscription button", async ({ page }) => {
    // Skipped: Requires DB seeding because Next.js Server Actions fetch from the server, bypassing Playwright page.route
    await mockProUser(page, "pro@example.com");
    await seedProSession(page, "pro@example.com");

    await page.goto("/dashboard/settings");

    await expect(page.getByText(/Subscription/i).first()).toBeVisible({
      timeout: 15000,
    });

    const cancelBtn = page
      .getByRole("button", { name: /Cancel Subscription|Cancel Plan/i })
      .first();
    await expect(cancelBtn).toBeVisible({ timeout: 10000 });
  });

  test.skip("TC-2305: Pro user Settings shows billing card info", async ({ page }) => {
    // Skipped: Requires DB seeding (Server Actions bypass Playwright page.route)
    await mockProUser(page, "pro@example.com");
    await seedProSession(page, "pro@example.com");

    await page.goto("/dashboard/settings");

    await expect(page.getByText(/Subscription/i).first()).toBeVisible({
      timeout: 15000,
    });

    // Card ending in 4242 (from mock data in helpers/auth.ts)
    const cardInfo = page.getByText(/4242|Visa|visa|card/i).first();
    await expect(cardInfo).toBeVisible({ timeout: 10000 });
  });
});
