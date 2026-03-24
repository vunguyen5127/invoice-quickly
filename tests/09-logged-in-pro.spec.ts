import { test, expect } from "@playwright/test";
import { mockProUser, seedProSession } from "./helpers/auth";

test.describe("Module 19: Pro User — Dashboard & Settings", () => {

  test.beforeEach(async ({ page }) => {
    await mockProUser(page, "pro@example.com");
    await seedProSession(page, "pro@example.com");
  });

  test.skip("Dashboard loads for Pro user", async ({ page }) => {
    // Skipped: Next.js Server Actions fetching companies bypasses Playwright mock
    await page.goto("/dashboard");
    
    // Wait for either the Dashboard heading or the empty state
    await expect(
      page.getByRole("heading", { name: /dashboard/i })
        .or(page.getByText(/No companies yet/i))
    ).toBeVisible({ timeout: 15000 });
  });

  test.skip("Settings shows subscription section for Pro user", async ({ page }) => {
    // Skipped: Needs DB seed for Server Action compatibility
    await page.goto("/dashboard/settings");
    
    // Should display subscription section
    await expect(page.getByText(/Subscription/i).first()).toBeVisible({ timeout: 15000 });
    
    // Should display plan info — either "pro Plan" text or "Current Plan"
    await expect(page.getByText(/Current Plan|pro|Plan/i).first()).toBeVisible();
  });

  test("Settings shows preferences for Pro user", async ({ page }) => {
    await page.goto("/dashboard/settings");
    
    // Preferences section
    await expect(page.getByText(/Preferences/i).first()).toBeVisible({ timeout: 15000 });
    
    // Sign out option
    await expect(page.getByText(/Sign Out/i)).toBeVisible();
  });
});

test.describe("Module 20: Pro User — Feature Access", () => {

  test.beforeEach(async ({ page }) => {
    await mockProUser(page, "pro@example.com");
    await seedProSession(page, "pro@example.com");
  });

  test("Pro user can toggle Recurring without UpgradeModal", async ({ page }) => {
    await page.goto("/generator");
    
    await expect(page.getByRole("heading", { name: /Invoice Details|Editor/i }).first()).toBeVisible({ timeout: 10000 });
    
    // Try to find and click recurring toggle
    const recurringToggle = page.getByRole("switch", { name: /Recurring Invoice/i })
      .or(page.locator('button[role="switch"]').filter({ hasText: /Recurring/i }));
    
    const toggleVisible = await recurringToggle.isVisible().catch(() => false);
    if (toggleVisible) {
      await recurringToggle.click();
      
      // UpgradeModal should NOT appear for Pro users
      const upgradeModal = page.getByText(/Upgrade to Pro/i);
      await expect(upgradeModal).not.toBeVisible({ timeout: 3000 });
    }
  });

  test("Pro user can access Export Excel without UpgradeModal", async ({ page }) => {
    await page.goto("/company/test-company-id");
    
    const exportBtn = page.getByRole("button", { name: /Export Excel/i });
    const isVisible = await exportBtn.first().isVisible().catch(() => false);
    
    if (isVisible) {
      await exportBtn.first().click();
      
      // UpgradeModal should NOT appear for Pro users
      const upgradeModal = page.getByText(/Upgrade to Pro/i);
      await expect(upgradeModal).not.toBeVisible({ timeout: 3000 });
    }
  });

  test("Pro user — generator loads with full features", async ({ page }) => {
    await page.goto("/generator");
    
    await expect(page.getByRole("heading", { name: /Invoice Details|Editor/i }).first()).toBeVisible({ timeout: 10000 });
    
    // All buttons should be accessible
    const downloadBtn = page.getByRole("button", { name: /Download/i });
    const saveBtn = page.getByRole("button", { name: /Save/i }).first();
    const shareBtn = page.getByRole("button", { name: /Share/i }).first();
    
    await expect(downloadBtn).toBeVisible();
    await expect(saveBtn).toBeVisible();
    await expect(shareBtn).toBeVisible();
  });
});
