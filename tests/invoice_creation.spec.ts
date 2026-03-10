import { test, expect } from '@playwright/test';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wvugwussemvlmupmpwcq.supabase.co';

test.describe('Invoice Creation Flows', () => {

  test('Free User Flow: Can create and prepare an invoice for download', async ({ page }) => {
    // 1. Visit landing page and go to generator
    await page.goto('/');
    await page.locator('a:has-text("Create Invoice Free")').first().click();
    await page.waitForURL(/.*\/generator/);

    // Ensure the form is loaded
    await expect(page.getByRole('heading', { name: /Invoice Details/i }).or(page.getByRole('heading', { name: /Chi tiết Invoice/i }))).toBeVisible();

    // 2. Fill Client Details
    await page.getByPlaceholder(/Client Name/i).or(page.getByPlaceholder(/Tên khách hàng/i)).fill('Test Client');
    await page.getByPlaceholder(/Client Email/i).or(page.getByPlaceholder(/Email khách hàng/i)).fill('client@test.com');

    // 3. Fill Line Item
    const descriptionInput = page.getByPlaceholder('e.g. Seller Growth Plan (Monthly)');
    await expect(descriptionInput.first()).toBeVisible();
    await descriptionInput.first().fill('Test Service');

    const rateInput = page.getByPlaceholder('0.00').first();
    await expect(rateInput).toBeVisible();
    await rateInput.fill('100');

    // 4. Verify Preview
    await expect(page.getByRole('heading', { name: /Live Preview/i }).or(page.getByRole('heading', { name: /Xem trước/i }))).toBeVisible();

    // 5. Check Action Buttons based on Viewport
    const isMobile = page.viewportSize()!.width < 640;
    
    if (isMobile) {
      // Mobile sticky bar
      const shareBtn = page.getByLabel('Share');
      await expect(shareBtn).toBeVisible();
      
      const downloadBtn = page.getByRole('button', { name: /Download/i }).or(page.getByRole('button', { name: /Tải xuống/i }));
      await expect(downloadBtn).toBeVisible();
    } else {
      // Desktop header buttons
      const shareBtn = page.getByRole('button', { name: /Share/i }).or(page.getByRole('button', { name: /Chia sẻ/i }));
      await expect(shareBtn).toBeVisible();
      
      const downloadBtn = page.getByRole('button', { name: /Download/i }).or(page.getByRole('button', { name: /Tải xuống/i }));
      await expect(downloadBtn).toBeVisible();
    }
  });

  test('Authenticated Flow: Can create and save an invoice from a company', async ({ page }) => {
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
    await page.getByPlaceholder(/Client Name/i).or(page.getByPlaceholder(/Tên khách hàng/i)).fill('Authenticated Client');
    
    const descriptionInput = page.getByPlaceholder('e.g. Seller Growth Plan (Monthly)');
    await descriptionInput.first().fill('Monthly Retainer');

    const rateInput = page.getByPlaceholder('0.00').first();
    await rateInput.fill('500');

    // 3. Verify Save Button
    const saveBtn = page.getByRole('button', { name: /Save/i }).or(page.getByRole('button', { name: /Lưu/i }));
    await expect(saveBtn).toBeVisible();
  });
});
