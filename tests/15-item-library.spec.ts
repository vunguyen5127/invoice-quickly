import { expect, test } from '@playwright/test';
import { mockSupabaseUser, seedAuthenticatedSession } from "./helpers/auth";

test.describe('Module: Item Library Management UI', () => {

  test.beforeEach(async ({ page }) => {
    await mockSupabaseUser(page);
    await seedAuthenticatedSession(page);
  });

  test('Items Page Displays Correctly and Opens Bulk Add Modal', async ({ page }) => {
    await page.goto('/dashboard/items');
    
    // Heading
    await expect(page.getByRole('heading', { name: /^Library$/i })).toBeVisible();
    
    // Add Button (replaces old New Item button)
    const createBtn = page.getByRole('button', { name: /^Add$/i }).first();
    await expect(createBtn).toBeVisible();
    await createBtn.click();
    
    // Bulk Add Items Modal should open
    const modalHeading = page.getByRole('heading', { name: /Bulk Add Items/i }).last();
    await expect(modalHeading).toBeVisible();
    
    // Form fields should be visible
    await expect(page.getByPlaceholder('Item name or description').first()).toBeVisible();
    await expect(page.getByPlaceholder('0.00').first()).toBeVisible();
    
    // Cancel button should close modal
    await page.getByRole('button', { name: /Cancel/i }).click();
    await expect(modalHeading).toBeHidden();
  });

  test('Items Empty State shows correctly', async ({ page }) => {
    await page.goto('/dashboard/items');
    
    // Empty state should be visible since getItems mock token will fail and return []
    await expect(page.getByText('Your library is empty')).toBeVisible();
    await expect(page.getByText('Save your frequently billed products or services to speed up invoice creation.')).toBeVisible();
    
    // Empty state has Add Items button (bulk add)
    const emptyStateBtn = page.getByRole('button', { name: /Add Items/i }).last();
    await expect(emptyStateBtn).toBeVisible();
    await emptyStateBtn.click();
    
    // Should open the bulk add modal
    await expect(page.getByRole('heading', { name: /Bulk Add Items/i }).last()).toBeVisible();
  });
});
