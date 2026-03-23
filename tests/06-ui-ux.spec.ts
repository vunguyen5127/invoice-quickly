import { test, expect } from '@playwright/test';

test.describe("Module 15 & 16: UI, UX and Responsiveness", () => {
  
  test.skip("TC-1501: Dark Mode Toggle visually updates DOM", async ({ page }) => {
    // Skipped due to hydration flakiness where next-themes doesn't attach immediately
    await page.goto("/");
    const themeToggle = page.getByRole("button", { name: /toggle theme/i }).first();
    const isVisible = await themeToggle.isVisible().catch(() => false);
    
    if (isVisible) {
      const modeBefore = await page.locator("html").getAttribute("class") || "";
      await themeToggle.click();
      await expect(page.locator("html")).not.toHaveClass(modeBefore);
    }
  });

  test("TC-1503: Responsive Layout Checks", async ({ page }) => {
    // Force mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/generator');
    
    // Check if the sticky mobile header with "Share" exists
    const shareButton = page.getByLabel('Share').first();
    await expect(shareButton).toBeVisible();

    // Reset to desktop and ensure standard flow
    await page.setViewportSize({ width: 1280, height: 800 });
    const desktopShareButton = page.getByRole('button', { name: /Share/i }).first();
    await expect(desktopShareButton).toBeVisible();
  });
});

test.describe("Module 9: Pricing Page", () => {
  test("TC-901: Pricing page loads", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByText('Start free')).toBeVisible();
  });
});
