import { test, expect } from "@playwright/test";
import { mockSupabaseUser, seedAuthenticatedSession } from "./helpers/auth";

test.describe("Regression Coverage", () => {
  test("Public Pages Load Successfully", async ({ page }) => {
    const pages = ["/", "/about", "/contact", "/privacy", "/privacy-policy", "/terms", "/generator"];

    for (const route of pages) {
      await page.goto(route);
      await expect(page.locator("main, body").first()).toBeVisible();
    }

    await page.goto("/robots.txt");
    await expect(page.locator("body")).toContainText("User-Agent");

    await page.goto("/sitemap.xml");
    await expect(page.locator("body")).toContainText("urlset");
  });

  test("Generator Supports Basic Invoice Creation Flow", async ({ page }) => {
    await page.goto("/generator");

    await page
      .getByPlaceholder(/Client Name/i)
      .first()
      .fill("Regression Client");

    await page
      .getByPlaceholder(/Description of item\/service/i)
      .first()
      .fill("Monthly support");

    await page.getByPlaceholder("0").first().fill("250");

    await expect(
      page
        .getByRole("button", { name: /Save/i })
        .or(page.getByRole("button", { name: /Download/i }))
        .first(),
    ).toBeVisible();

    await expect(page.getByText(/Regression Client/i).first()).toBeVisible();
  });

  test("Protected Pages Redirect Unauthenticated Users", async ({ page }) => {
    const protectedRoutes = ["/dashboard", "/dashboard/settings", "/admin"];

    for (const route of protectedRoutes) {
      await page.goto(route);
      await page.waitForURL(/\/login/);
      await expect(page).toHaveURL(/\/login/);
    }
  });

  test("Authenticated Session Accesses Dashboard and Settings", async ({ page }) => {
    await mockSupabaseUser(page);
    await seedAuthenticatedSession(page);

    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: /Businesses/i })).toBeVisible();

    await page.goto("/dashboard/settings");
    await expect(page.getByRole("heading", { name: /Settings/i })).toBeVisible();
  });
});
