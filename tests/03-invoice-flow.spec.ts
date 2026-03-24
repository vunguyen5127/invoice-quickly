import { test, expect } from '@playwright/test';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wvugwussemvlmupmpwcq.supabase.co';

test.describe("Module 6: Invoice Creation Flow", () => {
  test("TC-601: Creates an Invoice with All Optional Fields", async ({ page }) => {
    await page.goto('/generator');

    // Basic details
    await page.getByPlaceholder(/Company Name/i).first().fill('My Global Corp\n123 Business Way\njohn@globalcorp.com');
    await page.getByPlaceholder(/Client Name/i).first().fill('Mega Client Inc.\n456 Tech Park\nbilling@megaclient.com');
    
    // Line items
    const descInputs = page.getByPlaceholder(/Description of item\/service\.\.\./i);
    await descInputs.nth(0).fill('Web Development');
    
    const rateInputs = page.getByPlaceholder('0.00');
    await rateInputs.nth(0).fill('100');

    // Add another item
    await page.getByRole('button', { name: /Add Item/i }).click();
    await descInputs.nth(1).fill('SEO Optimization');
    await rateInputs.nth(1).fill('50');

    // Discounts & Taxes
    const settingsSection = page.locator('div:has(> h3:has-text("Settings"))');
    const amountInputs = settingsSection.getByPlaceholder('0');
    await amountInputs.nth(0).fill('5');  // Discount
    await amountInputs.nth(1).fill('10'); // Tax
    await amountInputs.nth(2).fill('15'); // Shipping

    // Previews Check
    await expect(page.getByText('My Global Corp').first()).toBeVisible();
    await expect(page.getByText('Mega Client Inc.').first()).toBeVisible();
    await expect(page.getByText('Web Development').first()).toBeVisible();
    await expect(page.getByText('SEO Optimization').first()).toBeVisible();
  });

  test("TC-602: Download PDF Button Exists", async ({ page }) => {
    await page.goto('/generator');
    const downloadBtn = page.getByRole('button', { name: /Download/i });
    await expect(downloadBtn).toBeVisible();
  });
});

test.describe("Module 8: Generator (No Login)", () => {
  test("TC-801: Generate invoice works for anonymous users", async ({ page }) => {
    await page.goto('/');
    const createBtn = page.getByRole('link', { name: /Create.*Free/i }).first();
    await expect(createBtn).toBeVisible({ timeout: 15000 });
    await createBtn.click();
    
    await page.waitForURL(/.*\/generator/);
    await expect(page.getByRole('heading', { name: /Invoice Details/i })).toBeVisible();
    await page.getByPlaceholder(/Client Name/i).fill('Test Client');
  });
});
