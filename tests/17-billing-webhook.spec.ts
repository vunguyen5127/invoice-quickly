import config from "@/utils/config";
import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// We need the service role key to query auth schema and bypass RLS on subscriptions
const SUPABASE_URL = config.supabase.url;
const SUPABASE_SERVICE_KEY = config.supabase.serviceRole;
const LEMON_SECRET = config.lemon.webhookSecret || "dummy-dev-secret";

test.describe("Module 27: Webhook & Billing Lifecycle E2E", () => {
  // We need a stable user ID to associate the mock subscription with.
  let targetUserId = "";

  test.beforeAll(async () => {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.warn("Skipping DB setup: Missing SUPABASE_SERVICE_ROLE_KEY");
      return;
    }
    
    // Connect to Supabase using Admin privileges
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    
    // Use the email requested by user, fetched dynamically from ADMIN_ALERT_EMAIL config
    const testEmail = config.mailer.adminEmail;
    
    // 1. Try to list users to find existing
    const { data: userList, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error("Failed to list users", listError);
      return;
    }
    let user = userList?.users.find((u) => u.email === testEmail);
    if (!user) {
      console.error("User not found", testEmail);
      return;
    }
    targetUserId = user.id;

    // 3. Clean up any existing test subscription for this user before the test runs
    await supabase.from("subscriptions").delete().eq("user_id", targetUserId);
  });

  // Helper function to sign the payload the exact same way Lemon Squeezy does
  function signPayload(payloadStr: string) {
    return crypto.createHmac("sha256", LEMON_SECRET).update(payloadStr).digest("hex");
  }

  test("TC-2701: Full Lemon Squeezy Webhook Lifecycle (Create -> Cancel -> Resume -> Expire)", async ({ request }) => {
    // Skip if DB credentials are not loaded
    test.skip(!SUPABASE_URL || !targetUserId, "Missing DB credentials or user creation failed");
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const mockSubscriptionId = `sub_e2e_${Date.now()}`;
    const webhookEndpoint = "/api/lemon/webhook"; // Playwright's `request` hits baseURL (localhost:3000) automatically

    const createdDate = new Date().toISOString();
    const renewsDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // ============================================
    // STEP 1: EVENT - SUBSCRIPTION CREATED (Auto-Renew On)
    // ============================================
    const createPayload = {
      meta: { event_name: "subscription_created", custom_data: { user_id: targetUserId } },
      data: {
        id: mockSubscriptionId,
        attributes: {
          customer_id: "cus_e2e_123",
          status: "active",
          variant_id: "pro_monthly",
          created_at: createdDate,
          renews_at: renewsDate,
          ends_at: null,
          cancelled: false,
          card_brand: "visa",
          card_last_four: "4242"
        }
      }
    };

    let payloadStr = JSON.stringify(createPayload);
    let signature = signPayload(payloadStr);

    let res = await request.post(webhookEndpoint, {
      data: payloadStr,
      headers: { "x-signature": signature, "Content-Type": "application/json" }
    });
    expect(res.status()).toBe(200);

    // Verify DB
    let { data: sub1 } = await supabase.from("subscriptions").select("*").eq("subscription_id", mockSubscriptionId).single();
    expect(sub1).toBeTruthy();
    expect(sub1.status).toBe("active");
    expect(sub1.cancel_at).toBeNull();
    // Validate custom DB mapping
    expect(sub1.current_period_start).toBe(createdDate);
    expect(sub1.current_period_end).toBe(renewsDate);
    
    // ============================================
    // STEP 2: EVENT - SUBSCRIPTION CANCELED (Pending Expiration)
    // ============================================
    // When a user cancels via API, Lemon Squeezy sends `subscription_updated` with `cancelled: true`.
    const cancelPayload = {
      meta: { event_name: "subscription_updated", custom_data: { user_id: targetUserId } },
      data: {
        id: mockSubscriptionId,
        attributes: {
          customer_id: "cus_e2e_123",
          status: "active",
          variant_id: "pro_monthly",
          created_at: createdDate,
          renews_at: renewsDate,
          ends_at: renewsDate,
          cancelled: true, // Key signal of a pending cancellation
        }
      }
    };
    
    payloadStr = JSON.stringify(cancelPayload);
    signature = signPayload(payloadStr);

    res = await request.post(webhookEndpoint, {
      data: payloadStr,
      headers: { "x-signature": signature, "Content-Type": "application/json" }
    });
    expect(res.status()).toBe(200);

    // Verify DB
    let { data: sub2 } = await supabase.from("subscriptions").select("*").eq("subscription_id", mockSubscriptionId).single();
    expect(sub2.status).toBe("active"); // Still active! Just pending expiration.
    expect(sub2.cancel_at).toBe(renewsDate); // Set to ends_at
    
    // ============================================
    // STEP 3: EVENT - SUBSCRIPTION RESUMED
    // ============================================
    const resumePayload = {
      meta: { event_name: "subscription_resumed", custom_data: { user_id: targetUserId } },
      data: {
        id: mockSubscriptionId,
        attributes: {
          customer_id: "cus_e2e_123",
          status: "active",
          variant_id: "pro_monthly",
          created_at: createdDate,
          renews_at: renewsDate,
          ends_at: null,
          cancelled: false, // Flag revoked
        }
      }
    };
    
    payloadStr = JSON.stringify(resumePayload);
    signature = signPayload(payloadStr);

    res = await request.post(webhookEndpoint, {
      data: payloadStr,
      headers: { "x-signature": signature, "Content-Type": "application/json" }
    });
    expect(res.status()).toBe(200);

    // Verify DB
    let { data: sub3 } = await supabase.from("subscriptions").select("*").eq("subscription_id", mockSubscriptionId).single();
    expect(sub3.status).toBe("active"); 
    expect(sub3.cancel_at).toBeNull(); // Cancel at is cleared!
    
    // ============================================
    // STEP 4: EVENT - SUBSCRIPTION FULLY EXPIRED
    // ============================================
    // When the end date hits, Lemon Squeezy sends subscription_expired.
    const expiredPayload = {
      meta: { event_name: "subscription_expired", custom_data: { user_id: targetUserId } },
      data: {
        id: mockSubscriptionId,
        attributes: {
          customer_id: "cus_e2e_123",
          status: "expired",
          variant_id: "pro_monthly",
        }
      }
    };
    
    payloadStr = JSON.stringify(expiredPayload);
    signature = signPayload(payloadStr);

    res = await request.post(webhookEndpoint, {
      data: payloadStr,
      headers: { "x-signature": signature, "Content-Type": "application/json" }
    });
    expect(res.status()).toBe(200);

    // Verify DB
    let { data: sub4 } = await supabase.from("subscriptions").select("*").eq("subscription_id", mockSubscriptionId).single();
    // In db, mapStatus("expired") -> "canceled"
    expect(sub4.status).toBe("canceled");
  });
});
