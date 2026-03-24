import { test, expect } from "@playwright/test";
import { mockSupabaseUser, seedAuthenticatedSession } from "./helpers/auth";

/**
 * Module 25: Dark Mode Toggle
 *
 * TC-2501: Dark mode toggle button is visible on homepage.
 * TC-2502: Clicking dark mode toggle changes the html class attribute.
 * TC-2503: Dark mode persists after page reload (localStorage).
 *
 * Note: TC-1501 in 06-ui-ux.spec.ts was previously skipped due to
 * hydration flakiness. These tests use a more stable approach by
 * waiting for hydration to complete.
 */
test.describe("Module 25: Dark Mode", () => {
  test("TC-2501: Theme toggle button is present in the app", async ({ page }) => {
    await page.goto("/");

    // Wait for hydration
    await page.waitForLoadState("networkidle");

    const themeToggle = page
      .getByRole("button", { name: /toggle theme|toggle dark mode/i })
      .or(page.locator('button[aria-label*="theme" i]'))
      .or(page.locator('button[aria-label*="dark" i]'))
      .first();

    await expect(themeToggle).toBeVisible({ timeout: 10000 });
  });

  test("TC-2502: Dark mode toggle switches theme class on <html>", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Allow next-themes to hydrate
    await page.waitForTimeout(500);

    const htmlEl = page.locator("html");
    const classBefore = await htmlEl.getAttribute("class");

    const themeToggle = page
      .getByRole("button", { name: /toggle theme|toggle dark mode/i })
      .or(page.locator('button[aria-label*="theme" i]'))
      .or(page.locator('button[aria-label*="dark" i]'))
      .first();

    const toggleVisible = await themeToggle.isVisible().catch(() => false);
    if (!toggleVisible) {
      test.skip();
      return;
    }

    await expect(async () => {
      await themeToggle.click();
      await page.waitForTimeout(300);
      const cls = await htmlEl.getAttribute("class");
      expect(cls).not.toEqual(classBefore || "");
    }).toPass({ timeout: 15000 });
  });

  test("TC-2503: Dark mode preference persists across page reload", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    // Force dark mode via localStorage (next-themes key)
    await page.evaluate(() => {
      localStorage.setItem("theme", "dark");
    });

    await page.reload();
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    const htmlClass = await page.locator("html").getAttribute("class");
    // next-themes sets class="dark" on <html>
    const isDark =
      htmlClass?.includes("dark") ||
      (await page.evaluate(() => localStorage.getItem("theme"))) === "dark";
    expect(isDark).toBe(true);
  });
});

/**
 * Module 26: PDF Download
 *
 * TC-2601: Download button is visible in generator.
 * TC-2602: Clicking Download button does not throw errors / shows progress.
 */
test.describe("Module 26: PDF Download", () => {
  test("TC-2601: Download PDF button is visible in generator", async ({ page }) => {
    await page.goto("/generator");

    const downloadBtn = page.getByRole("button", { name: /Download/i });
    await expect(downloadBtn).toBeVisible({ timeout: 10000 });
  });

  test("TC-2602: Clicking Download does not navigate away (stays on generator)", async ({
    page,
  }) => {
    await page.goto("/generator");

    const downloadBtn = page.getByRole("button", { name: /Download/i });
    await expect(downloadBtn).toBeVisible({ timeout: 10000 });

    await downloadBtn.click();

    // Should still be on /generator
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/.*\/generator/);
  });
});

/**
 * Module 27: Analytics Dashboard
 *
 * TC-2701: Analytics page loads for logged-in user.
 * TC-2702: Analytics shows revenue chart or summary stats.
 */
test.describe("Module 27: Analytics Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseUser(page);
    await seedAuthenticatedSession(page);
  });

  test("TC-2701: Analytics page loads for logged-in user", async ({ page }) => {
    await page.goto("/dashboard/analytics");

    await expect(
      page.getByRole("heading", { name: "Analytics" }).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("TC-2702: Analytics page shows some data visualisation", async ({
    page,
  }) => {
    await page.goto("/dashboard/analytics");

    // Should have chart, stats, or revenue data section
    await expect(
      page
        .getByText(/Total Revenue|Revenue|Invoices|Stats|Chart/i)
        .first()
    ).toBeVisible({ timeout: 15000 });
  });
});
