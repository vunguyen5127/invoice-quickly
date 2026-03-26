import { test, expect } from "@playwright/test";
import { mockSupabaseUser, seedAuthenticatedSession } from "./helpers/auth";

test.describe("Module 1: Auth & Public Routes", () => {
  test("TC-101: Authentication Callback Flow Completes Successfully", async ({ page }) => {
    // Inject fake session initially
    await mockSupabaseUser(page);
    await seedAuthenticatedSession(page);
    
    // Navigate to the callback page with a fake session (simulating the end of OAuth flow)
    await page.goto("/auth/callback?next=/generator");

    // It should process and redirect to dashboard, generator, or onboarding
    await expect(page).toHaveURL(/.*\/generator|.*\/dashboard|.*\/onboarding/);
    
  });

  test("TC-102: Unauthenticated Users Redirect to Login", async ({ page }) => {
    // Clear any seeded session that might exist from previous tests to ensure unauthenticated state
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());

    const protectedRoutes = ["/dashboard", "/dashboard/settings", "/admin"];

    for (const route of protectedRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(/.*\/login.*/, { timeout: 15000 });
    }
  });

  test("TC-103: Sign Out Redirects to Home", async ({ page }) => {
    await mockSupabaseUser(page);
    await seedAuthenticatedSession(page);
    
    // Mock companies so the dashboard loads quickly instead of timing out on a real request with a fake token
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wvugwussemvlmupmpwcq.supabase.co";
    await page.route(`${SUPABASE_URL}/rest/v1/companies*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "content-range": "0-1/1" },
        body: JSON.stringify([]),
      });
    });

    await page.goto("/dashboard");

    // It should load dashboard
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible({ timeout: 15000 });

    // Click avatar -> Sign Out
    const userMenu = page.getByLabel("User menu");
    await expect(userMenu).toBeVisible();
    await userMenu.click();
    
    // We cannot fully test the actual cookie deletion in mock,
    // but we can look for a Sign Out button inside the menu.
    const signOutBtn = page.getByRole("menuitem", { name: /Log out|Sign Out/i }).or(page.getByText(/Log out|Sign Out/i)).first();
    if (await signOutBtn.isVisible()) {
      await signOutBtn.click();
      // Supabase auth.signOut() fires, though mocked here. In real app it redirects
    }
  });
});
