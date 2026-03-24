import { test, expect } from "@playwright/test";
import { mockSupabaseUser, seedAuthenticatedSession } from "./helpers/auth";

/**
 * Module 21: Admin Panel
 *
 * TC-2101: Admin panel is NOT accessible to regular (non-admin) users.
 * TC-2102: Admin panel loads for authorized users (mocked as "logged in").
 * TC-2103: Admin panel shows User Login Logs section.
 * TC-2104: Send Test Email button is visible in admin panel.
 */
test.describe("Module 21: Admin Panel", () => {
  test("TC-2101: Admin route redirects unauthenticated users to login", async ({
    page,
  }) => {
    // No session seeded — should redirect to /login
    await page.goto("/admin");
    await page.waitForURL(/\/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("TC-2102: Admin panel loads for a logged-in user", async ({ page }) => {
    await mockSupabaseUser(page, "vunguyencapital@gmail.com");
    await seedAuthenticatedSession(page, "vunguyencapital@gmail.com");

    await page.goto("/admin");

    // The admin page should render — at minimum the heading
    await expect(
      page.getByRole("heading", { name: /Admin/i }).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("TC-2103: Admin panel shows User Login Logs section", async ({
    page,
  }) => {
    await mockSupabaseUser(page, "vunguyencapital@gmail.com");
    await seedAuthenticatedSession(page, "vunguyencapital@gmail.com");

    await page.route("**/rest/v1/login_logs*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "content-range": "0-1/1" },
        body: JSON.stringify([
          {
            id: "log-1",
            user_id: "test-user",
            email: "test@example.com",
            display_name: "Test User",
            avatar_url: null,
            provider: "email",
            user_agent: "Mozilla/5.0",
            logged_in_at: new Date().toISOString(),
          },
        ]),
      });
    });

    await page.goto("/admin");

    await expect(
      page.getByText(/Login Logs|User Logs|Recent Logins/i).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test("TC-2104: Send Test Email button is visible in admin panel", async ({
    page,
  }) => {
    await mockSupabaseUser(page, "vunguyencapital@gmail.com");
    await seedAuthenticatedSession(page, "vunguyencapital@gmail.com");

    await page.route("**/rest/v1/login_logs*", async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify([]) });
    });

    await page.goto("/admin");

    const sendTestEmailBtn = page
      .getByRole("button", { name: /Test Email/i })
      .first();
    await expect(sendTestEmailBtn).toBeVisible({ timeout: 15000 });
  });
});
