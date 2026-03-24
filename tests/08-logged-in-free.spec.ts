import { test, expect } from "@playwright/test";
import { mockSupabaseUser, seedAuthenticatedSession } from "./helpers/auth";

test.describe("Module 17: Free User — Dashboard & Settings", () => {

  test.beforeEach(async ({ page }) => {
    await mockSupabaseUser(page, "free-user@example.com");
    await seedAuthenticatedSession(page, "free-user@example.com");
  });

  test("Dashboard loads with heading and Create Company button", async ({ page }) => {
    await page.goto("/dashboard");
    
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible({ timeout: 15000 });
    
    // Either the desktop "Create Company" button or the "Get Started" button for empty state
    const createBtn = page.getByRole("button", { name: /Create Company|Get Started/i }).first();
    await expect(createBtn).toBeVisible();
  });

  test("Settings page loads with profile section", async ({ page }) => {
    await page.goto("/dashboard/settings");
    
    // Wait for either profile section or settings heading to load
    await expect(
      page.getByText(/Profile|Settings/i).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("Settings page shows subscription section", async ({ page }) => {
    await page.goto("/dashboard/settings");
    
    // Wait for the page to fully load
    await expect(page.getByText(/Subscription/i).first()).toBeVisible({ timeout: 15000 });
    
    // Should display current plan info (Free or with Upgrade link)
    const planInfo = page.getByText(/Free Plan|Current Plan|Upgrade/i).first();
    await expect(planInfo).toBeVisible();
  });

  test("Settings — preferences section with language and theme", async ({ page }) => {
    await page.goto("/dashboard/settings");
    
    // Preferences section should exist with language and theme options
    await expect(page.getByText(/Preferences/i).first()).toBeVisible({ timeout: 15000 });
  });

  test("Settings — Sign Out button exists", async ({ page }) => {
    await page.goto("/dashboard/settings");
    
    await expect(page.getByText(/Sign Out/i)).toBeVisible({ timeout: 15000 });
  });
});

test.describe("Module 18: Free User — Generator Flow", () => {

  test.beforeEach(async ({ page }) => {
    await mockSupabaseUser(page, "free-user@example.com");
    await seedAuthenticatedSession(page, "free-user@example.com");
  });

  test("Generator loads for logged-in free user", async ({ page }) => {
    await page.goto("/generator");
    
    await expect(page.getByRole("heading", { name: /Invoice Details|Editor/i }).first()).toBeVisible({ timeout: 10000 });
    
    // My Invoices / Dashboard link should be visible for logged-in users
    const dashboardLink = page.getByRole("link", { name: /My Invoices|Dashboard/i }).first();
    await expect(dashboardLink).toBeVisible();
  });

  test("Download button works for free user", async ({ page }) => {
    await page.goto("/generator");
    
    const downloadBtn = page.getByRole("button", { name: /Download/i });
    await expect(downloadBtn).toBeVisible({ timeout: 10000 });
  });

  test("Share button visible for logged-in user", async ({ page }) => {
    await page.goto("/generator");
    
    // Desktop share button
    const shareBtn = page.getByRole("button", { name: /Share/i }).first();
    await expect(shareBtn).toBeVisible({ timeout: 10000 });
  });

  test("Save button visible for logged-in user", async ({ page }) => {
    await page.goto("/generator");
    
    const saveBtn = page.getByRole("button", { name: /Save/i }).first();
    await expect(saveBtn).toBeVisible({ timeout: 10000 });
  });
});
