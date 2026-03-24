import { Page } from "@playwright/test";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wvugwussemvlmupmpwcq.supabase.co";

/**
 * Mock Supabase /auth/v1/user to return a fake authenticated user.
 */
export async function mockSupabaseUser(page: Page, email = "test@example.com") {
  await page.route(`${SUPABASE_URL}/auth/v1/user`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "test-user-id",
        aud: "authenticated",
        role: "authenticated",
        email,
        user_metadata: { name: "Test User" },
      }),
    });
  });
}

/**
 * Seed localStorage with a fake Supabase session so the app thinks we're logged in.
 */
export async function seedAuthenticatedSession(page: Page, email = "test@example.com") {
  const supabaseUrlParts = SUPABASE_URL.split("//")[1]?.split(".")[0];
  const storageKey = `sb-${supabaseUrlParts}-auth-token`;

  const fakeSession = {
    provider_token: null,
    provider_refresh_token: null,
    access_token: "fake.access.token",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: "fake-refresh-token",
    token_type: "bearer",
    user: {
      id: "test-user-id",
      aud: "authenticated",
      role: "authenticated",
      email,
      app_metadata: { provider: "google" },
      user_metadata: { name: "Test User" },
      created_at: new Date().toISOString(),
    },
  };

  await page.goto("/");
  await page.evaluate(
    ({ key, value }) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    { key: storageKey, value: fakeSession },
  );
}

/**
 * Mock Supabase user + intercept subscriptions query to return a Pro subscription.
 * This makes the app think the user is on the Pro plan.
 */
export async function mockProUser(page: Page, email = "pro@example.com") {
  // 1. Mock the auth user endpoint
  await page.route(`${SUPABASE_URL}/auth/v1/user`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "test-user-id",
        aud: "authenticated",
        role: "authenticated",
        email,
        user_metadata: { name: "Pro User" },
      }),
    });
  });

  // 2. Intercept subscriptions query to return pro plan
  await page.route(`${SUPABASE_URL}/rest/v1/subscriptions*`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: "sub-test-1",
        user_id: "test-user-id",
        provider: "lemon",
        subscription_id: "sub_test_123",
        customer_id: "cus_test_123",
        status: "active",
        plan: "pro",
        price_id: "price_test",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancel_at: null,
        card_brand: "visa",
        card_last4: "4242",
        next_billed_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });
  });

  // 3. Intercept companies endpoint to return empty (mock data scenario)
  await page.route(`${SUPABASE_URL}/rest/v1/companies*`, async (route) => {
    // Check if it's a count-only request
    const url = route.request().url();
    if (url.includes("head=true") || route.request().headers()["prefer"]?.includes("count=exact")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "content-range": "0-0/0" },
        body: JSON.stringify([]),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "content-range": "0-0/0" },
        body: JSON.stringify([]),
      });
    }
  });
}

/**
 * Seed localStorage with a Pro user session.
 */
export async function seedProSession(page: Page, email = "pro@example.com") {
  const supabaseUrlParts = SUPABASE_URL.split("//")[1]?.split(".")[0];
  const storageKey = `sb-${supabaseUrlParts}-auth-token`;

  const fakeSession = {
    provider_token: null,
    provider_refresh_token: null,
    access_token: "fake.pro.access.token",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: "fake-pro-refresh-token",
    token_type: "bearer",
    user: {
      id: "test-user-id",
      aud: "authenticated",
      role: "authenticated",
      email,
      app_metadata: { provider: "google" },
      user_metadata: { name: "Pro User" },
      created_at: new Date().toISOString(),
    },
  };

  await page.goto("/");
  await page.evaluate(
    ({ key, value }) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    { key: storageKey, value: fakeSession },
  );
}
