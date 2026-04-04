# PAYMENT TESTING — LEMON SQUEEZY
**Cập nhật:** 2026-04-04  
**Base URL:** `http://localhost:3000`  
**Provider:** Lemon Squeezy (Test Mode)

---

## SETUP TRƯỚC KHI TEST

### ✅ Checklist môi trường

| Biến môi trường | Giá trị cần có |
|-----------------|----------------|
| `BILLING_PROVIDER` | `lemon` |
| `LEMONSQUEEZY_API_KEY` | API Key từ LS Dashboard |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Secret từ Webhook setting |
| `LEMONSQUEEZY_STORE_ID` | Store ID từ LS |
| `LEMON_VARIANT_MONTHLY` | Variant ID gói Pro Monthly |
| `LEMON_VARIANT_YEARLY` | Variant ID gói Pro Yearly |
| `LEMON_VARIANT_TEST` | Variant ID gói Test ($0) |

### 📣 Tools cần thiết
- **ngrok** (tunnel localhost để Lemon Squeezy gọi webhook): `ngrok http 3000`
- **Lemon Squeezy Dashboard**: https://app.lemonsqueezy.com
- **Supabase Dashboard**: Xem realtime table changes
- **Test card Lemon Squeezy**: Số thẻ `4242 4242 4242 4242` (bất kỳ exp/CVV hợp lệ)

### 🔧 Setup Webhook
1. LS Dashboard → Settings → **Webhooks** → Add endpoint
2. URL: `https://[ngrok-id].ngrok.io/api/lemon/webhook`
3. Events cần bật:
   - `subscription_created`
   - `subscription_updated`
   - `subscription_cancelled`
   - `subscription_resumed`
   - `subscription_expired`
   - `subscription_payment_success`
   - `subscription_payment_failed`
4. Copy **Signing Secret** → paste vào `.env.local` → `LEMONSQUEEZY_WEBHOOK_SECRET`

---

## MODULE A: CHECKOUT FLOW

### TC-A01: Pricing page load đúng với Lemon provider
**Steps:**
1. Mở `/pricing`
2. Mở DevTools → Network tab
3. Quan sát khi page load gọi server action `getBillingProviderName`

**Expected:**
- Page hiển thị đúng: Free card + Pro card
- Toggle Monthly/Yearly hoạt động
- Giá Monthly = $10, Yearly = $99
- Nút "Subscribe to Pro" hiện với icon ArrowRight

**Verify:**
- Không thấy lỗi Paddle (vì đang dùng Lemon), Paddle không load script
- `billingProvider` trong state = `"lemon"`

**Result:** `[ ]`

---

### TC-A02: Click Subscribe khi CHƯA đăng nhập
**Steps:**
1. Mở `/pricing` trong tab ẩn danh (không đăng nhập)
2. Click **"Subscribe to Pro"** (Monthly)

**Expected:**
- Redirect về `/login?redirect=/pricing`
- Không gọi API Lemon Squeezy
- Không có lỗi JS

**Result:** `[ ]`

---

### TC-A03: Subscribe to Pro Monthly (Lemon redirect checkout)
**Loại TK:** FREE (tài khoản bình thường)  
**Steps:**
1. Đăng nhập vào tài khoản FREE
2. Mở `/pricing` → chọn **Monthly** (toggle Monthly)
3. Click **"Subscribe to Pro"**
4. Quan sát: button chuyển sang spinner loading

**Expected:**
- Server action `createCheckout` được gọi
- Console log xuất hiện: `[Checkout/AUTH] ✓ userId=...`
- **Browser redirect** sang URL Lemon Squeezy có dạng: `https://[store].lemonsqueezy.com/checkout/...`
- Checkout page của Lemon Squeezy load đúng, hiện thông tin sản phẩm Monthly

**Verify:**
- URL checkout có `?checkout[email]=user@email.com` được prefill
- Không có redirect tới trang nào khác trước khi đến LS

**Result:** `[ ]`

---

### TC-A04: Subscribe to Pro Yearly (Lemon redirect checkout)
**Loại TK:** FREE  
**Steps:**
1. `/pricing` → chọn **Yearly** toggle (hiện badge "-17%")
2. Confirm giá hiện "$99/year" 
3. Click **"Subscribe to Pro"**

**Expected:**
- Redirect đến checkout Lemon Squeezy với variant Yearly (khác variant Monthly)
- Checkout page hiện số tiền $99

**Verify trong Lemon dashboard:**
- Tạo checkout log với `variant_id = LEMON_VARIANT_YEARLY`

**Result:** `[ ]`

---

### TC-A05: Hoàn tất thanh toán với Test Card
**Loại TK:** FREE  
**Pre-condition:** TC-A03 đã redirect sang LS checkout page  
**Steps:**
1. Tại Lemon checkout page:
   - Email: (tự điền từ user session)
   - Card number: `4242 4242 4242 4242`
   - Expiry: `12/28`
   - CVC: `123`
   - Name: `Test User`
2. Click **"Pay"**

**Expected (< 30 giây):**
- LS xử lý payment thành công
- Redirect về: `http://localhost:3000/dashboard?upgraded=1`
- Dashboard load với param `?upgraded=1` (có thể có toast/banner thông báo)

**Verify trong DB (Supabase → `subscriptions` table):**
```
user_id   → [UUID của user]
provider  → "lemon"
status    → "active"
plan      → "pro"
subscription_id → [LS sub ID dạng số]
customer_id → [LS customer ID]
price_id  → [variant ID]
current_period_start → [timestamp]
current_period_end   → [timestamp ~30 ngày sau]
next_billed_at       → [timestamp ~30 ngày sau]
```

**Verify trong `payment_logs` table (Supabase):**
- Có 1+ rows với `event_name = "subscription_created"`, `level = "info"`, `message = "✅ Created → pro/active"`

**Verify UI gặp user:**
- Settings → Subscription → **"Pro Plan" / "Active"**
- Recurring toggle không còn hiện UpgradeModal
- Export Excel không còn hiện UpgradeModal

**Result:** `[ ]`

---

### TC-A06: Webhook nhận được sau khi thanh toán
**Steps:**
1. Sau khi TC-A05 hoàn tất, vào `/admin` → tab **Payment Logs**

**Expected:**
- Có log với:
  - `event_name = "subscription_created"`
  - `level = "info"`
  - `tag = "Webhook/DB"`
  - `message` chứa: `✅ Created → pro/active`
- Click vào row để expand → thấy JSON data chi tiết

**Result:** `[ ]`

---

## MODULE B: WEBHOOK EVENT HANDLING

> ⚠️ Phần này kiểm tra webhook trực tiếp — cần ngrok đang chạy để LS gọi được về localhost

### TC-B01: Webhook `subscription_created` — New subscription
**Scenario:** User vừa thanh toán lần đầu  
**Steps:**
1. Dùng LS Dashboard → Test webhooks (hoặc sau khi TC-A05)
2. Send event: `subscription_created` với body thật từ LS

**Expected endpoint response:** `200 {"received": true}`

**Expected DB (subscriptions table):**
- Row mới tạo với đúng `user_id` từ `custom_data`
- `status = "active"`, `plan = "pro"`

**Expected payment_logs:**
- `level = "info"`, `message = "✅ Created → pro/active"`

**Result:** `[ ]`

---

### TC-B02: Webhook `subscription_updated` — Renew billing cycle
**Scenario:** Lemon tự gia hạn subscription sang tháng tiếp theo  
**Steps:**
1. Simulate event `subscription_updated` với attribute `renews_at` mới (tháng tiếp theo)

**Expected DB:**
- `current_period_end` cập nhật sang tháng mới
- `next_billed_at` cập nhật
- `status` vẫn là `"active"`

**Expected payment_logs:**
- `level = "info"`, `event_name = "subscription_updated"`

**Result:** `[ ]`

---

### TC-B03: Webhook `subscription_payment_success` — Monthly invoice paid
**Scenario:** User được charge thành công hàng tháng  
**Steps:**
1. Simulate `subscription_payment_success` event
2. Body của event này có `data.id` = invoice ID (KHÔNG phải sub ID), `attrs.subscription_id` = sub ID

**Expected DB:**
- `subscriptions` table: `status = "active"` (không đổi)
- `plan` KHÔNG bị override (payment event skip plan/price_id update)
- `updated_at` cập nhật
- `card_brand` và `card_last4` được cập nhật nếu có trong response

**Expected payment_logs:**
- `message = "✅ Updated → payment/active"`

**Result:** `[ ]`

---

### TC-B04: Webhook `subscription_payment_failed` — Payment failure
**Scenario:** Thẻ hết hạn hoặc không đủ tiền  
**Steps:**
1. Simulate `subscription_payment_failed` event

**Expected DB:**
- `status` cập nhật → `"past_due"`
- `plan` vẫn là `"pro"` (user vẫn có Pro trong grace period)

**Expected payment_logs:**
- `level = "error"` (hoặc `warn`)
- `event_name = "subscription_payment_failed"`

**Verify UI:**
- User vẫn access được Pro features (grace period)
- Settings Subscription hiện badge **"past_due"**

**Result:** `[ ]`

---

### TC-B05: Webhook `subscription_cancelled` — User cancel
**Scenario:** User cancel từ Settings, Lemon gửi event confirm  
**Steps:**
1. Simulate `subscription_cancelled` event với `attrs.cancelled = true`, `attrs.ends_at = [future date]`

**Expected DB:**
- `status = "canceled"`
- `cancel_at` được set = `attrs.ends_at` (ngày hết hạn thực sự)
- `next_billed_at = null`

**Expected payment_logs:**
- `level = "info"`, `event_name = "subscription_cancelled"`
- `message = "✅ Updated → pro/canceled"` ... hoặc similar

**Verify UI:**
- Settings → badge "Cancels Soon" hoặc "Canceled"
- User vẫn access Pro features đến `current_period_end`

**Result:** `[ ]`

---

### TC-B06: Webhook `subscription_resumed` — User resume
**Scenario:** User bấm Resume trước khi kỳ thanh toán kết thúc  
**Steps:**
1. Simulate `subscription_resumed` event

**Expected DB:**
- `status = "active"`
- `cancel_at = null`
- `next_billed_at` cập nhật lại ngày gia hạn

**Expected payment_logs:**
- `event_name = "subscription_resumed"`, `level = "info"`

**Verify UI:**
- Settings → badge **"Active"**
- Nút Cancel quay trở lại, nút Resume biến mất

**Result:** `[ ]`

---

### TC-B07: Webhook `subscription_expired` — Hết kỳ sau cancel
**Scenario:** User đã cancel, đến ngày ends_at thì LS gửi expired  
**Steps:**
1. Simulate `subscription_expired` event

**Expected DB:**
- `status = "canceled"` (mapStatus("expired") → "canceled")
- `cancel_at` được set

**Verify UI:**
- User bị hạ về Free, các tính năng Pro bị chặn
- UpgradeModal hiện lại khi dùng Pro features

**Result:** `[ ]`

---

### TC-B08: Webhook với Signature sai — Bị từ chối
**Steps:**
1. Dùng curl hoặc Postman, POST tới `/api/lemon/webhook`
2. Body là một JSON Lemon event hợp lệ
3. Header `X-Signature`: để trống hoặc đặt giá trị random

**Expected response:** `401 {"error": "Invalid signature"}`

**Expected payment_logs:**
- `level = "error"`, `tag = "Webhook/AUTH"`, `message = "Signature verification FAILED"`

**DB:** Không có thay đổi gì trong `subscriptions` table

**Result:** `[ ]`

---

### TC-B09: Webhook event không được handle — Silently ignored
**Steps:**
1. POST `/api/lemon/webhook` với event_name = `order_created` hoặc bất kỳ event chưa được map
2. Signature hợp lệ (ký đúng)

**Expected response:** `200 {"received": true}`

**Expected payment_logs:** **Không có** log nào được tạo (silent ignore)

**Result:** `[ ]`

---

### TC-B10: Payment event cho subscription chưa tồn tại — Race condition
**Scenario:** `subscription_payment_success` đến trước `subscription_created` (race condition)  
**Steps:**
1. Xoá subscription record trong DB
2. Simulate `subscription_payment_success` event

**Expected response:** `200 {"received": true}`

**Expected payment_logs:**
- `level = "warn"`, message chứa `"Payment event received but no existing subscription found — skipping"`

**DB:** Không có upsert mới (payment event không tạo subscription mới)

**Result:** `[ ]`

---

### TC-B11: Webhook thiếu `user_id` trong custom_data
**Scenario:** Checkout không truyền được `custom_data.user_id`  
**Steps:**
1. Send `subscription_created` event nhưng `meta.custom_data` = `{}` (không có `user_id`)

**Expected payment_logs:**
- `level = "error"`, `message = "No user_id in custom_data"`

**DB:** Không có subscription được tạo

**Result:** `[ ]`

---

## MODULE C: SUBSCRIPTION MANAGEMENT (FROM UI)

### TC-C01: Cancel Subscription từ Settings
**Loại TK:** PRO (active)  
**Steps:**
1. Settings → Subscription → click **"Cancel"** (nút đỏ nhạt)  
2. ConfirmModal xuất hiện → click **"Cancel Subscription"**
3. App gọi `cancelSubscription(subscriptionId)` → gọi API `DELETE /api/v1/subscriptions/{id}`

**Expected:**
- API Lemon trả `200`, server action thành công
- DB: `subscriptions.cancel_at = NOW()`, `status = "active"` (vẫn active cho đến hết kỳ)
- UI Settings: badge đổi thành **"Cancels Soon"**, nút **"Resume"** xuất hiện, nút **"Cancel"** biến mất
- Billing date label đổi từ "Renews on" → **"Expires on"**

**Result:** `[ ]`

---

### TC-C02: Resume Subscription từ Settings (trước khi hết kỳ)
**Loại TK:** PRO (canceled, còn trong kỳ)  
**Steps:**
1. Settings → Subscription → click **"Resume"**

**Expected:**
- API Lemon `PATCH /subscriptions/{id}` với `{cancelled: false}` trả `200`
- DB: `cancel_at = null`, `status = "active"`
- UI: badge → **"Active"**, nút Cancel quay lại, nút Resume biến mất

**Result:** `[ ]`

---

### TC-C03: Settings — Billing info hiển thị đúng
**Loại TK:** PRO (active)  
**Steps:**
1. Settings → Subscription section

**Expected hiển thị:**
- Plan: **"Pro Plan"**
- Status badge: **"Active"** (màu xanh lá)
- Row "Renews on": ngày đúng (format: "April 15, 2026")

**Result:** `[ ]`

---

### TC-C04: Settings — Subscription info sau khi cancel
**Loại TK:** PRO (vừa cancel, đang trong grace period)  
**Steps:**
1. Settings → Subscription section

**Expected:**
- Plan: **"Pro Plan"**
- Status badge: **"Cancels Soon"** (màu vàng/amber)
- Row label đổi → **"Expires on"**: ngày `cancel_at` hoặc `current_period_end`

**Result:** `[ ]`

---

## MODULE D: POST-UPGRADE VERIFICATION

### TC-D01: Sau upgrade — UpgradeModal biến mất
**Loại TK:** Vừa nâng PRO (từ FREE)  
**Steps:**
1. Vào `/company/[id]/new`
2. Bật toggle **Recurring** 
3. Click **Export Excel**
4. Thử tạo Company thứ 2

**Expected:** Tất cả actions trên đều HOẠT ĐỘNG được, không có UpgradeModal nào xuất hiện

**Result:** `[ ]`

---

### TC-D02: Sau upgrade — Company limit tăng lên 10
**Loại TK:** PRO  
**Steps:**
1. Dashboard → tạo company thứ 2, thứ 3 (lên tới ~3)

**Expected:** Tạo thành công không bị chặn (limit = 10 companies cho Pro)

**Result:** `[ ]`

---

### TC-D03: Sau upgrade — Invoice limit tăng lên 500
**Loại TK:** PRO  
**Steps:**
1. Verify trong Settings hoặc nhìn vào entitlements logic

**Expected:** `maxInvoicesPerMonth = 500` (không phải 50)

**Result:** `[ ]`

---

### TC-D04: Sau cancel hết kỳ — Hạ về Free
**Scenario:** User đã cancel, `current_period_end` đã qua  
**Loại TK:** User vừa hết kỳ Pro  
**Steps:**
1. Simulate webhook `subscription_expired` (TC-B07)  
   hoặc chỉnh `current_period_end` trong DB về quá khứ
2. Refresh `entitlements` (reload dashboard)

**Expected:**
- Settings: Plan = **"Free Plan"**
- Recurring toggle → UpgradeModal
- Export Excel → UpgradeModal
- Company limit giảm về 1

**Result:** `[ ]`

---

## MODULE E: EDGE CASES & ERROR HANDLING

### TC-E01: Checkout thất bại — API key sai
**Steps:**
1. Tạm thời set `LEMONSQUEEZY_API_KEY` = `invalid_key`
2. Restart dev server
3. Click "Subscribe to Pro"

**Expected:** Alert hiện error message (không crash app, không white screen)

**Result:** `[ ]`

---

### TC-E02: Checkout thất bại — Variant ID chưa cấu hình
**Steps:**
1. Xoá `LEMON_VARIANT_MONTHLY` khỏi `.env.local`
2. Restart dev server → click Subscribe

**Expected:** Error: "Lemon Squeezy variant ID not configured"

**Result:** `[ ]`

---

### TC-E03: Network timeout khi gọi LS API
**Steps:**
1. Dùng DevTools → Network → Throttle về "Offline"
2. Click "Subscribe to Pro"

**Expected:** Alert thông báo lỗi, nút không bị stuck loading mãi

**Result:** `[ ]`

---

### TC-E04: Double-click Subscribe (race condition)
**Steps:**
1. Click "Subscribe to Pro" 2 lần rất nhanh

**Expected:** Chỉ 1 checkout được tạo ra (button disabled sau click đầu tiên)

**Result:** `[ ]`

---

## TỔNG KẾT PAYMENT TESTS

| Group | Số TC | Trạng thái |
|-------|-------|------------|
| **A: Checkout Flow** | 6 | |
| **B: Webhook Events** | 11 | |
| **C: Subscription Management** | 4 | |
| **D: Post-Upgrade Verification** | 4 | |
| **E: Edge Cases** | 4 | |
| **TỔNG** | **29** | |

---

## CHECKLIST THEO DÕI WEBHOOK (Realtime Debug)

Khi test webhook, mở 3 cửa sổ song song:

| Cửa sổ | Nội dung theo dõi |
|--------|-------------------|
| **Terminal 1** | `npm run dev` — xem Server logs (Checkout/AUTH, Webhook events) |
| **Terminal 2** | `ngrok http 3000` — xem request vào webhook |
| **Supabase Dashboard** | Table Editor → `payment_logs` (filter mới nhất) + `subscriptions` |

**Ký hiệu log cần tìm trong console:**
```
✅ Created → pro/active          ← subscription_created thành công
✅ Updated → payment/active      ← payment_success thành công
✅ Updated → pro/canceled        ← subscription_cancelled thành công
❌ Signature verification FAILED ← webhook bị từ chối (đúng)
```

---

*Payment Test Suite — Invoice Quickly × Lemon Squeezy — 2026-04-04*
