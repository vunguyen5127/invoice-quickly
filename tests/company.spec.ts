import { test, expect } from '@playwright/test';

// This test focuses on navigation and UI elements related to companies.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wvugwussemvlmupmpwcq.supabase.co';

test.describe('Company and Invoice Management UI', () => {

  test.beforeEach(async ({ page }) => {
    // Inject a fake session into localStorage
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

  test('Dashboard Displays Correctly and Opens Create Company Modal', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Heading should be "Businesses"
    await expect(page.getByRole('heading', { name: /Businesses/i })).toBeVisible();
    
    // Click "Create Company" button
    const createBtn = page.getByRole('button', { name: /Create Company/i });
    await expect(createBtn).toBeVisible();
    await createBtn.click();
    
    // Verify the modal opens
    await expect(page.getByText('Add New Company')).toBeVisible();
    await expect(page.getByPlaceholder('Acme Corp')).toBeVisible();
  });

  test('Mobile Share Button is Visible on Generator Page', async ({ page }) => {
    // Force mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/generator');
    
    // Using the new aria-label for consistent selection
    const shareButton = page.getByLabel('Share');
    await expect(shareButton).toBeVisible();
  });
});
