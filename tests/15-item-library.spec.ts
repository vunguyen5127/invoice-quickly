import { test, expect } from '@playwright/test';
import { mockSupabaseUser, seedAuthenticatedSession } from "./helpers/auth";

test.describe('Module: Item Library Management UI', () => {

  test.beforeEach(async ({ page }) => {
    await mockSupabaseUser(page);
    await seedAuthenticatedSession(page);
  });

  test('Items Page Displays Correctly and Opens Create Item Modal', async ({ page }) => {
    await page.goto('/dashboard/items');
    
    // Heading
    await expect(page.getByRole('heading', { name: /Item Library/i })).toBeVisible();
    
    // New Item Button
    const createBtn = page.getByRole('button', { name: /New Item/i }).first();
    await expect(createBtn).toBeVisible();
    await createBtn.click();
    
    // Create Item Modal should open
    const modalHeading = page.getByRole('heading', { name: /New Item/i }).last();
    await expect(modalHeading).toBeVisible();
    
    // Form fields should be visible
    await expect(page.getByPlaceholder('Homepage design, 3 revisions')).toBeVisible();
    await expect(page.getByPlaceholder('0.00')).toBeVisible();
    
    // Cancel button should close modal
    await page.getByRole('button', { name: /Cancel/i }).click();
    await expect(modalHeading).toBeHidden();
  });

  test('Items Empty State shows correctly', async ({ page }) => {
    await page.goto('/dashboard/items');
    
    // Empty state should be visible since getItems mock token will fail and return []
    await expect(page.getByText('Your library is empty')).toBeVisible();
    await expect(page.getByText('Save your frequently billed products or services to speed up invoice creation.')).toBeVisible();
    
    // Empty state has its own Create Item button
    const emptyStateBtn = page.getByRole('button', { name: /Create Item/i });
    await expect(emptyStateBtn).toBeVisible();
    await emptyStateBtn.click();
    
    // Should open the modal
    await expect(page.getByRole('heading', { name: /New Item/i }).last()).toBeVisible();
  });
});
