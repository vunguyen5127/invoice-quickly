import { test, expect } from '@playwright/test';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wvugwussemvlmupmpwcq.supabase.co';

test.describe('Company and Invoice Management', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Mock the Auth endpoints
    await page.route(`${SUPABASE_URL}/auth/v1/user`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'test-user-id',
          aud: 'authenticated',
          role: 'authenticated',
          email: 'test@example.com',
          user_metadata: { name: 'Test User' }
        })
      });
    });

    // 2. Mock companies GET
    await page.route('**/rest/v1/companies?select=*', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'mock-company-1',
              user_id: 'test-user-id',
              name: 'Mock Test Company',
              address: '123 Test St',
              email: 'hello@mock.com',
              phone: '555-0000',
              logo_url: null,
              signature_url: null,
              created_at: new Date().toISOString()
            }
          ])
        });
      }
    });

    // 3. Mock companies GET by ID
    await page.route('**/rest/v1/companies?id=eq.mock-company-1&select=*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          id: 'mock-company-1',
          user_id: 'test-user-id',
          name: 'Mock Test Company',
          address: '123 Test St',
          email: 'hello@mock.com',
          phone: '555-0000',
          logo_url: null,
          signature_url: null,
          created_at: new Date().toISOString()
        }])
      });
    });

    // 4. Mock invoices for the company
    await page.route('**/rest/v1/invoices?company_id=eq.mock-company-1*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    // We must inject a fake session into localStorage
    const supabaseUrlParts = SUPABASE_URL.split('//')[1]?.split('.')[0]; 
    const storageKey = `sb-${supabaseUrlParts}-auth-token`;
    
    const fakeSession = {
      provider_token: null,
      provider_refresh_token: null,
      access_token: 'fake-access-token',
      expires_in: 3600,
      expires_at: Math.floor(Date.now()/1000) + 3600,
      refresh_token: 'fake-refresh-token',
      token_type: 'bearer',
      user: {
        id: 'test-user-id',
        aud: 'authenticated',
        role: 'authenticated',
        email: 'test@example.com',
        app_metadata: { provider: 'google' },
        user_metadata: { name: 'Test User' },
        created_at: new Date().toISOString(),
      }
    };

    await page.goto('/');
    await page.evaluate(({ key, value }) => {
      localStorage.setItem(key, JSON.stringify(value));
    }, { key: storageKey, value: fakeSession });
  });

  test('can navigate to company details from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check if the mock company exists
    await expect(page.getByText('Mock Test Company')).toBeVisible();

    // Click on the company card (it's a link using the company name)
    await page.click('text=Mock Test Company');

    // Wait for URL to change to the company page
    await page.waitForURL(/\/company\/mock-company-1/);
    
    // Check if the company info is displayed on the company detail page
    await expect(page.getByRole('heading', { name: "Mock Test Company" })).toBeVisible();
    await expect(page.getByText('hello@mock.com')).toBeVisible();
    await expect(page.getByRole('link', { name: "Create Invoice" })).toBeVisible();
  });

  test('can open Create Invoice page', async ({ page }) => {
    // Mock the new invoice generation endpoint
    await page.route('**/rest/v1/invoices?select=invoice_number&company_id=eq.mock-company-1*', async route => {
       await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
       });
    });

    await page.goto('/company/mock-company-1/new');
    
    // Check if the invoice form is present
    await expect(page.locator('input[placeholder="Invoice Name"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Invoice Number"]')).toHaveValue(/INV-\d{4}-001/);
    await expect(page.getByText('Mock Test Company, 123 Test St, hello@mock.com, 555-0000')).toBeVisible();
  });
});
