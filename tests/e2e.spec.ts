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
    await expect(page.getByRole('link', { name: "Create Invoice Free" })).toBeVisible();
  });

  test('dashboard redirects to login for unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard');
    // It should load and then redirect to login
    await page.waitForURL(/.*\/login/);
    await expect(page.getByText('Authenticating...')).toBeVisible();
  });

  test('settings redirects to login for unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard/settings');
    await page.waitForURL(/.*\/login/);
  });
});

test.describe('Authenticated Flow via Network Mocking', () => {

  // We mock the session and the companies table data to test the UI logic.
  test.beforeEach(async ({ page }) => {
    // 1. Mock the Auth endpoints to simulate a signed-in state
    
    // If the browser checks session via explicit API call:
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

    // 2. Mock the fetching of companies
    await page.route(`${SUPABASE_URL}/rest/v1/companies?select=*`, async route => {
      // Simulate retrieving companies from Supabase
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
    });

    // Mock fetching invoices for the dashboard summary
    await page.route(`${SUPABASE_URL}/rest/v1/invoices?*`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    // We must inject a fake session into localStorage so the Supabase client thinks we're logged in.
    // The key format varies by Supabase client ID, but normally looks like "sb-[ref]-auth-token"
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

    // Before navigation, inject into localStorage. Playwright requires a page to be on the origin first.
    await page.goto('/'); // go to origin to allow setting localStorage
    await page.evaluate(({ key, value }) => {
      localStorage.setItem(key, JSON.stringify(value));
    }, { key: storageKey, value: fakeSession });
  });

  test('dashboard shows mocked user companies', async ({ page }) => {
    // Navigate to dashboard now that auth is faked
    await page.goto('/dashboard');
    
    // We should be on dashboard and see our mocked company
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText('Mock Test Company')).toBeVisible();
  });

  test('can interact with Theme Toggle in Settings', async ({ page }) => {
    await page.goto('/dashboard/settings');
    
    // Click Settings heading
    await expect(page.getByRole('heading', { name: "Settings" })).toBeVisible();

    // Verify Theme buttons exist
    const darkButton = page.locator('button', { hasText: 'Dark' });
    const lightButton = page.locator('button', { hasText: 'Light' });
    
    await expect(darkButton).toBeVisible();
    await expect(lightButton).toBeVisible();
    
    // Simple interactions (We don't test actual visual changes strictly here without visual diffing)
    await darkButton.click();
    await lightButton.click();
  });
});
