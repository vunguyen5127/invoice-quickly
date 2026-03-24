import { test, expect } from '@playwright/test';
import { mockSupabaseUser, seedAuthenticatedSession } from './helpers/auth';

test.describe('Module: Quotes & Estimates Feature', () => {

  test.beforeEach(async ({ page }) => {
    // For this e2e test to succeed completely, the local environment must have a 
    // real Supabase connection because we test Server Actions directly.
    // However, we mock auth to simulate a logged in user dynamically.
    await mockSupabaseUser(page);
    await seedAuthenticatedSession(page);
  });

  test('TC-1601: Full quote lifecycle - create, accept, and convert to invoice', async ({ page }) => {
    // 1. Navigate to Quotes Dashboard
    await page.goto('/dashboard/quotes');
    
    // Check heading
    await expect(page.getByRole('heading', { name: /Quotes & Estimates/i })).toBeVisible({ timeout: 15000 });

    // 2. Create New Quote
    await page.getByRole('button', { name: /New Quote/i }).click();
    await expect(page.getByRole('heading', { name: /Create New Quote/i })).toBeVisible();

    // Fill in quote details
    await page.fill('input[placeholder="e.g., John Doe"]', `E2E Test Client ${Date.now()}`);
    
    // Add Item
    await page.getByRole('button', { name: /Add Item/i }).click();
    
    // Wait for item row to appear and fill it
    await page.waitForSelector('textarea[placeholder="Description of item/service..."]');
    await page.fill('textarea[placeholder="Description of item/service..."]', 'Website Design Quote');
    await page.fill('input[type="number"].text-center', '1');
    
    const rateInputs = await page.locator('input[type="number"].text-right');
    await rateInputs.first().fill('1500');

    // 3. Save Quote
    // Note: This requires a working database connection in the test environment
    const saveBtn = page.getByRole('button', { name: /Save Quote/i });
    await saveBtn.click();

    // The URL should change from /quote/new to /quote/[id]
    await page.waitForURL(/\/quote\/[a-zA-Z0-9-]{36}/, { timeout: 15000 });
    
    // Expect heading to change to Edit
    await expect(page.getByRole('heading', { name: /Edit Quote/i })).toBeVisible();

    // Extract quote ID from URL
    const quoteUrl = page.url();
    const quoteId = quoteUrl.split('/').pop() as string;
    expect(quoteId).toBeTruthy();

    // 4. Visit Public Share Page (Simulation of customer)
    await page.goto(`/share/quote/${quoteId}`);

    // Ensure we are on the share page
    await expect(page.getByRole('heading', { name: /Quote #/i })).toBeVisible({ timeout: 15000 });

    // 5. Accept Quote
    const acceptBtn = page.getByRole('button', { name: 'Accept Quote' });
    await expect(acceptBtn).toBeVisible();
    await acceptBtn.click();
    
    // Wait for success banner
    await expect(page.getByText('This quote has been accepted. Thank you!')).toBeVisible({ timeout: 10000 });

    // 6. Convert to Invoice
    // Go back to the quote editor as the business owner
    await page.goto(`/quote/${quoteId}`);
    
    // Wait for the Convert to Invoice button
    const convertBtn = page.getByRole('button', { name: /Convert to Invoice/i });
    await expect(convertBtn).toBeVisible({ timeout: 15000 });
    await convertBtn.click();

    // Verify redirection to invoice editor
    await page.waitForURL(/\/invoice\/[a-zA-Z0-9-]{36}/, { timeout: 20000 });
    await expect(page.getByRole('heading', { name: /Edit Invoice/i })).toBeVisible();
    
    // The invoice should have the item we created
    await expect(page.locator('textarea', { hasText: 'Website Design Quote' })).toBeVisible();
  });
});
    

    

