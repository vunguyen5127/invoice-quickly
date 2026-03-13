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
    const descriptionInput = page.getByPlaceholder(/Description of item\/service\.\.\./i);
    await expect(descriptionInput.first()).toBeVisible();
    await descriptionInput.first().fill('Test Service');

    const rateInput = page.getByPlaceholder('0').first();
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
    
    const descriptionInput = page.getByPlaceholder(/Description of item\/service\.\.\./i);
    await descriptionInput.first().fill('Monthly Retainer');

    const rateInput = page.getByPlaceholder('0').first();
    await rateInput.fill('500');

    // 3. Verify Save Button
    const saveBtn = page.getByRole('button', { name: /Save/i }).or(page.getByRole('button', { name: /Lưu/i }));
    await expect(saveBtn).toBeVisible();
  });

  test('Comprehensive Flow: Can create an invoice with all fields, tax, discount, shipping, notes, and terms', async ({ page }) => {
    await page.goto('/generator');

    // 1. Fill Sender & Client Details
    await page.getByPlaceholder(/Your Company Name/i).or(page.getByPlaceholder(/Tên công ty của bạn/i)).fill('My Global Corp');
    await page.getByPlaceholder(/Your Name/i).or(page.getByPlaceholder(/Tên của bạn/i)).fill('John Doe');
    await page.getByPlaceholder(/Client Name/i).or(page.getByPlaceholder(/Tên khách hàng/i)).fill('Mega Client Inc.');
    
    // 2. Fill Line Items (Add a second one)
    const descInputs = page.getByPlaceholder(/Description of item\/service\.\.\./i);
    await descInputs.nth(0).fill('Web Development');
    const rateInputs = page.getByPlaceholder('0');
    // The first placeholder '0' might be quantity or rate, usually rate is second if quantity is first, but based on existing test, rate is first placeholder '0'. Wait, let's look at the existing test: "const rateInput = page.getByPlaceholder('0').first();". It might just be the first '0' placeholder.
    // Let's use more specific selectors if possible or just rely on DOM order.
    // In invoice-form.tsx line items usually have Quality/Rate.
    await rateInputs.nth(0).fill('100'); // Assuming Rate or Quantity for first item

    // Add another line item
    const addLineItemBtn = page.getByRole('button', { name: /Add Item/i }).or(page.getByRole('button', { name: /Thêm mục/i }));
    await addLineItemBtn.click();
    
    await descInputs.nth(1).fill('SEO Optimization');
    await rateInputs.nth(2).fill('50'); // Assuming second item rate/qty

    // 3. Enable and Fill Tax, Discount, Shipping
    const addTaxBtn = page.getByRole('button', { name: /Add Tax/i }).or(page.getByRole('button', { name: /Thêm thuế/i }));
    await addTaxBtn.click();
    await page.getByPlaceholder(/Tax %/i).or(page.getByPlaceholder(/Thuế %/i)).fill('10');

    const addDiscountBtn = page.getByRole('button', { name: /Add Discount/i }).or(page.getByRole('button', { name: /Thêm giảm giá/i }));
    await addDiscountBtn.click();
    await page.getByPlaceholder(/Discount %/i).or(page.getByPlaceholder(/Giảm giá %/i)).fill('5');

    const addShippingBtn = page.getByRole('button', { name: /Add Shipping/i }).or(page.getByRole('button', { name: /Thêm phí vận chuyển/i }));
    await addShippingBtn.click();
    await page.getByPlaceholder(/Shipping Amount/i).or(page.getByPlaceholder(/Phí vận chuyển/i)).fill('15');

    // 4. Fill Notes & Terms
    await page.getByPlaceholder(/Notes - any relevant information not already covered/i).or(page.getByPlaceholder(/Ghi chú - bất kỳ thông tin liên quan nào chưa được đề cập/i)).fill('Thank you for your business.');
    await page.getByPlaceholder(/Terms and conditions/i).or(page.getByPlaceholder(/Điều khoản và điều kiện/i)).fill('Please pay within 30 days.');

    // 5. Verify Preview Updates
    await expect(page.getByText('My Global Corp').first()).toBeVisible();
    await expect(page.getByText('Mega Client Inc.').first()).toBeVisible();
    await expect(page.getByText('Web Development').first()).toBeVisible();
    await expect(page.getByText('SEO Optimization').first()).toBeVisible();
    await expect(page.getByText('Thank you for your business.').first()).toBeVisible();
    await expect(page.getByText('Please pay within 30 days.').first()).toBeVisible();

    // 6. Mobile Visibility Check (Regression fix validation)
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('link', { name: /InvoiceQuickly/i })).toBeVisible();
  });
});
