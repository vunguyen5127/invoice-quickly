import { test, expect } from '@playwright/test';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wvugwussemvlmupmpwcq.supabase.co';

test.describe('Invoice Creation Flows', () => {

  test('Free User Flow: Creates and Prepares an Invoice for Download', async ({ page }) => {
    // 1. Visit landing page and go to generator
    await page.goto('/');
    await page.locator('a:has-text("Create Invoice Free")').first().click();
    await page.waitForURL(/.*\/generator/);

    // Ensure the form is loaded
    await expect(page.getByRole('heading', { name: /Invoice Details/i })).toBeVisible();

    // 2. Fill Client Details
    await page.getByPlaceholder(/Client Name/i).fill('Test Client');
    await page.getByPlaceholder(/Client Email/i).fill('client@test.com');

    // 3. Fill Line Item
    const descriptionInput = page.getByPlaceholder(/Description of item\/service\.\.\./i);
    await expect(descriptionInput.first()).toBeVisible();
    await descriptionInput.first().fill('Test Service');

    const rateInput = page.getByPlaceholder('0').first();
    await expect(rateInput).toBeVisible();
    await rateInput.fill('100');

    // 4. Verify Preview
    await expect(page.getByRole('heading', { name: /Live Preview/i })).toBeVisible();

    // 5. Check Action Buttons based on Viewport
    const isMobile = page.viewportSize()!.width < 640;
    
    if (isMobile) {
      // Mobile sticky bar
      const shareBtn = page.getByLabel('Share');
      await expect(shareBtn).toBeVisible();
      
      const downloadBtn = page.getByRole('button', { name: /Download/i });
      await expect(downloadBtn).toBeVisible();
    } else {
      // Desktop header buttons
      const shareBtn = page.getByRole('button', { name: /Share/i });
      await expect(shareBtn).toBeVisible();
      
      const downloadBtn = page.getByRole('button', { name: /Download/i });
      await expect(downloadBtn).toBeVisible();
    }
  });

  test('Authenticated Flow: Creates and Saves an Invoice from a Company', async ({ page }) => {
    // 1. Setup fake session
    const supabaseUrlParts = SUPABASE_URL.split('//')[1]?.split('.')[0]; 
    const storageKey = `sb-${supabaseUrlParts}-auth-token`;
    const fakeSession = {
      provider_token: null, provider_refresh_token: null,
      access_token: 'fake-access-token', expires_in: 3600,
      expires_at: Math.floor(Date.now()/1000) + 3600,
      refresh_token: 'fake-refresh-token', token_type: 'bearer',
      user: {
        id: 'test-user-id', aud: 'authenticated', role: 'authenticated',
        email: 'test@example.com', app_metadata: { provider: 'google' },
        user_metadata: { name: 'Test User' }, created_at: new Date().toISOString(),
      }
    };

    await page.goto('/');
    await page.evaluate(({ key, value }) => {
      localStorage.setItem(key, JSON.stringify(value));
    }, { key: storageKey, value: fakeSession });

    await page.goto('/generator');
    
    // 2. Fill Invoice Details
    await page.getByPlaceholder(/Client Name/i).fill('Authenticated Client');
    
    const descriptionInput = page.getByPlaceholder(/Description of item\/service\.\.\./i);
    await descriptionInput.first().fill('Monthly Retainer');

    const rateInput = page.getByPlaceholder('0').first();
    await rateInput.fill('500');

    // 3. Verify Save Button
    const saveBtn = page.getByRole('button', { name: /Save/i });
    await expect(saveBtn).toBeVisible();
  });

  test('Comprehensive Flow: Creates an Invoice with All Optional Fields', async ({ page }) => {
    await page.goto('/generator');

    // 1. Fill Sender & Client Details
    await page.getByPlaceholder(/Company Name/i).first().fill('My Global Corp\n123 Business Way\njohn@globalcorp.com');
    await page.getByPlaceholder(/Client Name/i).first().fill('Mega Client Inc.\n456 Tech Park\nbilling@megaclient.com');
    
    // 2. Fill Line Items (Add a second one)
    const descInputs = page.getByPlaceholder(/Description of item\/service\.\.\./i);
    await descInputs.nth(0).fill('Web Development');
    
    // Use '0.00' placeholder for Rate
    const rateInputs = page.getByPlaceholder('0.00');
    await rateInputs.nth(0).fill('100');

    // Add another line item
    const addLineItemBtn = page.getByRole('button', { name: /Add Item/i });
    await addLineItemBtn.click();
    
    await descInputs.nth(1).fill('SEO Optimization');
    // For the second item, rateInputs should now have 2 elements
    await rateInputs.nth(1).fill('50');

    // 3. Fill Discount, Tax, Shipping
    // These have '0' as placeholder but are in the Settings section
    // Use more specific locators to target them
    const settingsSection = page.locator('div:has(> h3:has-text("Settings"))');
    const amountInputs = settingsSection.getByPlaceholder('0');
    await amountInputs.nth(0).fill('5');  // Discount
    await amountInputs.nth(1).fill('10'); // Tax
    await amountInputs.nth(2).fill('15'); // Shipping

    // 4. Fill Notes & Terms
    // Enable them first if they are not enabled
    const checkboxes = page.getByRole('checkbox');
    if (!(await checkboxes.nth(0).isChecked())) await checkboxes.nth(0).check();
    if (!(await checkboxes.nth(1).isChecked())) await checkboxes.nth(1).check();

    // Now fill the textareas. Since they might have pre-filled demo data, we clear and fill.
    // In the Settings section, we have 2 textareas for Notes and Terms.
    const textareas = page.locator('div.border.bg-white\\/50 textarea');
    await textareas.nth(0).fill('Thank you for your business.');
    await textareas.nth(1).fill('Please pay within 30 days.');

    // 5. Verify Preview Updates
    await expect(page.getByText('My Global Corp').first()).toBeVisible();
    await expect(page.getByText('Mega Client Inc.').first()).toBeVisible();
    await expect(page.getByText('Web Development').first()).toBeVisible();
    await expect(page.getByText('SEO Optimization').first()).toBeVisible();
    await expect(page.getByText('Thank you for your business.').first()).toBeVisible();
    await expect(page.getByText('Please pay within 30 days.').first()).toBeVisible();

    // 6. Mobile Visibility Check (Regression fix validation)
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('link', { name: /Invoice-?Quickly/i }).first()).toBeVisible();
  });
});
