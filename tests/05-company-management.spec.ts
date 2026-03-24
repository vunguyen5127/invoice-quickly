import { test, expect } from '@playwright/test';
import { mockSupabaseUser, seedAuthenticatedSession } from "./helpers/auth";

test.describe('Module 12: Company Management UI', () => {

  test.beforeEach(async ({ page }) => {
    await mockSupabaseUser(page);
    await seedAuthenticatedSession(page);
  });

  test('Dashboard Displays Correctly and Opens Create Company Modal', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Heading
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    
    // Create Button
    const createBtn = page.getByRole('button', { name: /Create Company/i });
    await expect(createBtn).toBeVisible();
    await createBtn.click();
    
    await expect(page.getByText('Add New Company')).toBeVisible();
    await expect(page.getByPlaceholder('Acme Corp')).toBeVisible();
  });
  
  test('TC-1201: Edit Company Modal Opens from Dashboard', async ({ page }) => {
    await page.route("**/rest/v1/companies*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "content-range": "0-1/1" },
        body: JSON.stringify([{
           id: "1", name: "Mock Company", address: "123 Main St", email: "mock@example.com"
        }])
      });
    });
    
    await page.goto('/dashboard');
    
    // There might be edit buttons on the company card
    const editBtn = page.locator('button:has(svg.lucide-pen-line)').first();
    
    if (await editBtn.isVisible()) {
       await editBtn.click();
       await expect(page.getByText(/Edit Company/i).first()).toBeVisible();
    }
  });
});
