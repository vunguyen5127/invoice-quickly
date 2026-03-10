import { test, expect } from '@playwright/test';

// The project uses Google OAuth exclusively.
// To end-to-end test authenticated routes in a CI environment without a real user interactively
// entering their Google credentials, we use Playwright's network interception to mock Supabase API calls.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wvugwussemvlmupmpwcq.supabase.co';

test.describe('Public Routes & Unauthenticated Flow', () => {
  test('home page loads correctly', async ({ page }) => {
    await page.goto('/');
    // Check if the landing page hero text exists
    await expect(page.getByText('Create Professional Invoices')).toBeVisible();
    
    // Using a more robust selector for the CTA link
    await expect(page.locator('a:has-text("Create Invoice Free")').first()).toBeVisible();
  });

  test('privacy policy and terms of service load', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
    
    await page.goto('/terms');
    await expect(page.getByRole('heading', { name: 'Terms of Service' })).toBeVisible();
  });

  test('dashboard redirects to login for unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard');
    // It should load and then redirect to login
    await page.waitForURL(/.*\/login/);
    await expect(page.getByRole('heading', { name: 'Authenticating...' })).toBeVisible();
  });
});

test.describe('Authenticated Flow via Network Mocking', () => {

  // We mock the session and the companies table data to test the UI logic.
  test.beforeEach(async ({ page }) => {
    // 1. Mock the Auth endpoints to simulate a signed-in state
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

    // We must inject a fake session into localStorage so the Supabase client thinks we're logged in.
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

    // Before navigation, inject into localStorage. 
    await page.goto('/'); 
    await page.evaluate(({ key, value }) => {
      localStorage.setItem(key, JSON.stringify(value));
    }, { key: storageKey, value: fakeSession });
  });

  test('header shows authenticated links and hides settings', async ({ page }) => {
    await page.goto('/');
    // Check for "My Invoices" link which shows up when logged in
    const myInvoices = page.getByRole('link', { name: /My Invoices/i }).or(page.getByRole('link', { name: /Danh sách Invoice/i }));
    await expect(myInvoices.first()).toBeVisible();
    
    // Settings should NOT be visible in the header
    await expect(page.getByRole('link', { name: /Settings/i })).not.toBeVisible();
    
    // Check user menu (avatar) button using its aria-label
    const userMenu = page.getByLabel('User menu');
    await expect(userMenu).toBeVisible();
    await userMenu.click();
    
    // Verify settings is not in the dropdown either
    await expect(page.getByRole('menuitem', { name: /Settings/i })).not.toBeVisible();
    await expect(page.getByText('test@example.com')).toBeVisible();
  });

  test('auth callback flow completes successfully', async ({ page }) => {
    // Navigate to the callback page with a fake session (simulating the end of OAuth flow)
    await page.goto('/auth/callback?next=/generator');
    
    // It should process and redirect to /generator as specified in the 'next' param
    await page.waitForURL(/.*\/generator/);
    await expect(page).toHaveURL(/.*\/generator/);
  });
});
