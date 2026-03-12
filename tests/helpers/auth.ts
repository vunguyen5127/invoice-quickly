import { Page } from "@playwright/test";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wvugwussemvlmupmpwcq.supabase.co";

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

export async function seedAuthenticatedSession(page: Page, email = "test@example.com") {
  const supabaseUrlParts = SUPABASE_URL.split("//")[1]?.split(".")[0];
  const storageKey = `sb-${supabaseUrlParts}-auth-token`;

  const fakeSession = {
    provider_token: null,
    provider_refresh_token: null,
    access_token: "fake-access-token",
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
