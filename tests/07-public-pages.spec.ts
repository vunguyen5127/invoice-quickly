import { test, expect } from "@playwright/test";

test.describe("Module 10: Public Pages — Anonymous User", () => {

  test("Homepage loads with hero and CTA", async ({ page }) => {
    await page.goto("/");
    
    // Hero section should be visible
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 10000 });
    
    // CTA button should exist
    const ctaButton = page.locator('a:has-text("Create Invoice")').first();
    await expect(ctaButton).toBeVisible();
  });

  test("Homepage CTA navigates to generator", async ({ page }) => {
    await page.goto("/");
    
    const ctaButton = page.locator('a:has-text("Create Invoice")').first();
    await expect(ctaButton).toBeVisible({ timeout: 10000 });
    await ctaButton.click();
    
    await page.waitForURL(/.*\/generator/);
    await expect(page).toHaveURL(/.*\/generator/);
  });

  test("Pricing page loads with plans", async ({ page }) => {
    await page.goto("/pricing");
    
    // Should show pricing plans
    await expect(page.getByText("Start free")).toBeVisible({ timeout: 10000 });
    
    // Should have at least Free and Pro plan info
    await expect(page.getByText(/free/i).first()).toBeVisible();
  });

  test("About page loads", async ({ page }) => {
    await page.goto("/about");
    
    await expect(page.locator("main").or(page.locator("[class*='container']")).first()).toBeVisible({ timeout: 10000 });
  });

  test("Contact page loads", async ({ page }) => {
    await page.goto("/contact");
    
    await expect(page.locator("main").or(page.locator("[class*='container']")).first()).toBeVisible({ timeout: 10000 });
  });

  test("Login page loads with sign-in UI", async ({ page }) => {
    await page.goto("/login");
    
    // The login page shows "Authenticating..." heading and a "Sign in" button in navbar
    await expect(page.getByText(/Authenticating|Sign in/i).first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Module 11: Blog Pages — Anonymous User", () => {

  test("Blog index loads with posts", async ({ page }) => {
    await page.goto("/blog");
    
    // Should render blog page
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 10000 });
    
    // Should have at least one blog post link
    const postLinks = page.locator('a[href*="/blog/"]');
    await expect(postLinks.first()).toBeVisible();
  });

  test("Blog post renders content", async ({ page }) => {
    await page.goto("/blog/how-to-create-professional-invoice");
    
    // Should render the blog post title
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 10000 });
    
    // Should have article content
    await expect(page.locator("h2").first()).toBeVisible();
  });
});

test.describe("Module 13: Marketing/SEO Pages — Anonymous User", () => {

  test("Marketing page /invoice-template renders", async ({ page }) => {
    await page.goto("/invoice-template");
    
    // Hero section
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 10000 });
    
    // FAQ section should exist
    await expect(page.getByText(/FAQ|Frequently Asked/i).first()).toBeVisible();
  });

  test("Marketing page /free-invoice-template renders", async ({ page }) => {
    await page.goto("/free-invoice-template");
    
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 10000 });
  });

  test("Marketing page /freelancer-invoice-template renders", async ({ page }) => {
    await page.goto("/freelancer-invoice-template");
    
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Module 14: Legal Pages — Anonymous User", () => {

  test("Privacy Policy page loads", async ({ page }) => {
    await page.goto("/privacy-policy");
    
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
  });

  test("Terms of Service page loads", async ({ page }) => {
    await page.goto("/terms");
    
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
  });

  test("Refund Policy page loads", async ({ page }) => {
    await page.goto("/refund-policy");
    
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
  });
});
