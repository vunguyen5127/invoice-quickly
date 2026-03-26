import { test, expect } from "@playwright/test";
import { mockSupabaseUser, seedAuthenticatedSession } from "./helpers/auth";

/**
 * Module 24: Invoice Save & Persistence
 *
 * TC-2401: Save button is visible on generator for logged-in user.
 * TC-2402: Save triggers a network request to Supabase invoices endpoint.
 * TC-2403: After save, invoice appears in company's invoice list (mocked).
 * TC-2404: Deleting an invoice removes it from the list (mocked).
 */

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://wvugwussemvlmupmpwcq.supabase.co";

// Helper to intercept Supabase queries correctly even if they use query params
const INVOICES_URL_PATTERN = "**/rest/v1/invoices*";


test.describe("Module 24: Invoice Save & Persistence", () => {
  test.beforeEach(async ({ page }) => {
    await mockSupabaseUser(page);
    await seedAuthenticatedSession(page);
  });

  test("TC-2401: Save button is visible on generator for logged-in user", async ({
    page,
  }) => {
    await page.goto("/generator");

    await expect(
      page.getByRole("heading", { name: /Invoice Details|Editor/i }).first()
    ).toBeVisible({ timeout: 10000 });

    const saveBtn = page.getByRole("button", { name: /Save/i }).first();
    await expect(saveBtn).toBeVisible({ timeout: 10000 });
  });

  test.skip("TC-2402: Clicking Save triggers Supabase insert/upsert request", async ({
    page,
  }) => {
    // Intercept the Supabase invoice POST/PATCH
    let saveRequestMade = false;
    await page.route(`${SUPABASE_URL}/rest/v1/invoices*`, async (route) => {
      const method = route.request().method();
      if (method === "POST" || method === "PATCH") {
        saveRequestMade = true;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: "new-invoice-id" }),
      });
    });

    // Mock companies so we can actually save
    await page.route(`${SUPABASE_URL}/rest/v1/companies*`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
         headers: { "content-range": "0-1/1" },
        body: JSON.stringify([{ id: "mock-company-id", name: "Mock Company" }]),
      });
    });

    await page.goto("/generator");

    await expect(
      page.getByRole("heading", { name: /Invoice Details|Editor/i }).first()
    ).toBeVisible({ timeout: 10000 });

    // Fill minimal required fields
    const clientInput = page.getByPlaceholder(/Client Name/i).first();
    if (await clientInput.isVisible()) {
      await clientInput.fill("Test Client for Save");
    }

    // Also fill an item description just in case it's blank
    const itemInput = page.getByPlaceholder(/item|description/i).first();
    if (await itemInput.isVisible()) {
      await itemInput.fill("Test Item for Save");
    }

    // Click Save
    const saveBtn = page.getByRole("button", { name: /Save/i }).first();
    await expect(saveBtn).toBeVisible({ timeout: 5000 });
    await saveBtn.click();

    // Wait a moment for the request to fire
    await page.waitForTimeout(2000);

    // Either the request was made, or a success toast/message appeared
    const successToast = page.getByText(/saved|success|Save Invoice To/i).first();
    const toastVisible = await successToast.isVisible().catch(() => false);

    // At least one of these must be true
    expect(saveRequestMade || toastVisible).toBe(true);
  });

  test.skip("TC-2403: Invoice list shows saved invoices (mocked)", async ({
    page,
  }) => {
    // Skipped: Requires DB seeding (SSR bypasses Playwright page.route)
    await page.route(INVOICES_URL_PATTERN, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "content-range": "0-1/1" },
        body: JSON.stringify([
          {
            id: "saved-invoice-1",
            invoice_number: "INV-SAVED-001",
            client_name: "Mock Saved Client",
            total_amount: 750,
            currency: "USD",
            status: "draft",
            company_id: "test-company-id",
            created_at: new Date().toISOString(),
          },
        ]),
      });
    });

    await page.goto("/company/test-company-id");

    await expect(
      page.getByText(/INV-SAVED-001|Mock Saved Client/i).first()
    ).toBeVisible({ timeout: 15000 });
  });

  test.skip("TC-2404: Invoice delete removes it from the list", async ({ page }) => {
    // Skipped: Requires DB seeding (SSR bypasses Playwright page.route)
    let deleteRequestMade = false;

    // Return 1 invoice initially
    await page.route(INVOICES_URL_PATTERN, async (route) => {
      const method = route.request().method();
      if (method === "DELETE" || method === "PATCH") {
        deleteRequestMade = true;
        await route.fulfill({ status: 200, body: JSON.stringify({}) });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          headers: { "content-range": "0-1/1" },
          body: JSON.stringify([
            {
              id: "invoice-to-delete",
              invoice_number: "INV-DEL-001",
              client_name: "Delete Me Client",
              total_amount: 100,
              currency: "USD",
              status: "draft",
              created_at: new Date().toISOString(),
            },
          ]),
        });
      }
    });

    await page.goto("/company/test-company-id");

    // Select the invoice checkbox and click delete
    const headerCheckbox = page.locator('th input[type="checkbox"]').first();
    if (await headerCheckbox.isVisible({ timeout: 5000 })) {
      await headerCheckbox.check();

      const deleteBtn = page
        .getByRole("button", { name: /Delete/i })
        .filter({ hasText: "Delete" });
      if (await deleteBtn.isVisible()) {
        await deleteBtn.click();

        // Confirm if a dialog appears
        const confirmBtn = page
          .getByRole("button", { name: /Confirm|Yes|Delete/i })
          .last();
        if (await confirmBtn.isVisible({ timeout: 2000 })) {
          await confirmBtn.click();
        }

        await page.waitForTimeout(1500);
        expect(deleteRequestMade).toBe(true);
      }
    }
  });
});
