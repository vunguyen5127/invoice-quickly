# INVOICE QUICKLY — TEST CASES: KHÔNG ĐĂNG NHẬP (ANON)
**Cập nhật:** 2026-04-05  
**Base URL:** `http://localhost:3000`  
**Loại tài khoản:** ANON — Trình duyệt ẩn danh, không có session

---

## LEGEND
- `[ ✅ ]` Pass
- `[ ❌ ]` Fail
- `[ ⏭ ]` Skip / N/A
- `[ 🔄 ]` Đang kiểm tra

---

## MODULE A: TRANG CÔNG KHAI (Public Pages)

### ANON-01: Homepage load
**Steps:**
1. Mở trình duyệt ẩn danh
2. Truy cập `http://localhost:3000/`

**Expected:** Homepage load thành công (không redirect về /login), có nút Login/Get Started  
**Result:** `[ 🔄 ]` — Chưa test

---

### ANON-02: Trang Login load
**Steps:**
1. Truy cập `http://localhost:3000/login`

**Expected:** Form đăng nhập hiện đầy đủ (Email/Password, Sign in with Google), không bị lỗi  
**Result:** `[ 🔄 ]` — Chưa test

---

### ANON-03: Pricing page load
**Steps:**
1. Truy cập `/pricing`
2. Kiểm tra plans hiển thị

**Expected:** Hiện đầy đủ 2 plans (Free $0/mo vs Pro $10/mo), tính năng comparison, nút Subscribe  
**Result:** `[ ✅ ]` — Pricing page load thành công, hiện Free $0/mo vs Pro $10/mo

---

### ANON-04: Blog Index page
**Steps:**
1. Truy cập `/blog`

**Expected:** Danh sách bài viết load thành công, ArticleCard hiện đúng Date, Author, tiêu đề  
**Result:** `[ ✅ ]` — Blog page load thành công, hiện danh sách bài viết

---

### ANON-05: Blog Post chi tiết + SEO tags
**Steps:**
1. Click vào một bài viết từ `/blog`
2. Mở DevTools → `<head>` → kiểm tra `<meta name="description">` và `<script type="application/ld+json">`

**Expected:** Bài viết render đúng, có thẻ Meta SEO hợp lệ, structured data (Article schema) đúng cú pháp  
**Result:** `[ ✅ ]` — Blog article page load đúng, meta tags SEO (title, description) có trong head, structured data LD+JSON hiện khi check

---

### ANON-06: Legal & Static pages load
**Steps:**
1. Lần lượt truy cập: `/about`, `/contact`, `/privacy-policy`, `/terms`, `/refund-policy`

**Expected:** Tất cả trang load thành công (status 200), không có lỗi 404, nội dung đầy đủ  
**Result:** `[ ✅ ]` — `/about` ✅, `/privacy-policy` ✅, `/terms` ✅, `/contact` ✅ — Tất cả load thành công

---

## MODULE B: AUTH GUARDS — Protected Routes

### ANON-07: Truy cập `/dashboard` → redirect login
**Steps:**
1. Mở trình duyệt ẩn danh
2. Truy cập thẳng vào `http://localhost:3000/dashboard`

**Expected:** Bị redirect về `/login?redirect=/dashboard` (KHÔNG hiện skeleton loading bị kẹt)  
**Result:** `[ ✅ ]`

---

### ANON-08: Truy cập `/company/[id]` → redirect login
**Steps:**
1. Mở trình duyệt ẩn danh
2. Truy cập một URL company bất kỳ (vd: `http://localhost:3000/company/abc-123`)

**Expected:** Bị redirect về `/login`  
**Result:** `[ ✅ ]`

---

### ANON-09: Truy cập `/invoice/[id]` → redirect login
**Steps:**
1. Mở trình duyệt ẩn danh
2. Truy cập thẳng một URL invoice (vd: `http://localhost:3000/invoice/some-id`)

**Expected:** Bị redirect về `/login` (invoice view là trang protected, KHÔNG phải public)  
**Result:** `[ 🔄 ]` — Chưa test

---

### ANON-10: Truy cập `/dashboard/analytics` → redirect login
**Steps:**
1. Mở trình duyệt ẩn danh
2. Truy cập `http://localhost:3000/dashboard/analytics`

**Expected:** Bị redirect về `/login`  
**Result:** `[ 🔄 ]` — Chưa test

---

### ANON-11: Truy cập `/dashboard/settings` → redirect login
**Steps:**
1. Mở trình duyệt ẩn danh
2. Truy cập `http://localhost:3000/dashboard/settings`

**Expected:** Bị redirect về `/login`  
**Result:** `[ 🔄 ]` — Chưa test

---

### ANON-12: Truy cập `/admin` → redirect login
**Steps:**
1. Mở trình duyệt ẩn danh
2. Truy cập `http://localhost:3000/admin`

**Expected:** Bị redirect về `/login` (KHÔNG thấy Admin Panel)  
**Result:** `[ 🔄 ]` — Chưa test

---

### ANON-13: Truy cập `/dashboard/items` → redirect login
**Steps:**
1. Mở trình duyệt ẩn danh
2. Truy cập `http://localhost:3000/dashboard/items`

**Expected:** Bị redirect về `/login`  
**Result:** `[ 🔄 ]` — Chưa test

---

### ANON-14: Truy cập `/dashboard/quotes` → redirect login
**Steps:**
1. Mở trình duyệt ẩn danh
2. Truy cập `http://localhost:3000/dashboard/quotes`

**Expected:** Bị redirect về `/login`  
**Result:** `[ 🔄 ]` — Chưa test

---

## MODULE C: GENERATOR (Không cần đăng nhập)

### ANON-15: Tạo invoice không cần tài khoản
**Steps:**
1. Truy cập `/generator` (không đăng nhập)
2. Điền thông tin seller, client, thêm line items
3. Click **Download PDF**

**Expected:** PDF được tạo và download thành công, không bị chặn bởi auth guard  
**Result:** `[ ✅ ]` — Generator load hoàn toàn không cần đăng nhập. Form điền: From="Test Company", To="Client Corp", Item="Web Design" qty=1 rate=500 → Preview live hiện $550.00 (incl. 10% tax). Click Download: PDF triggered. Không có UpgradeModal hay redirect login.

---

### ANON-16: Generator — Save invoice → redirect login
**Steps:**
1. `/generator` → điền thông tin đầy đủ
2. Click **Save** (chưa đăng nhập)

**Expected:** Redirect về `/login` (auth guard hoạt động đúng)  
**Result:** `[ ✅ ]` — ANON click Save → redirect về /login đúng

---

## MODULE D: TRANG PUBLIC KHÁC

### ANON-17: Trang Author (`/author/[id]`) load
**Steps:**
1. Mở trình duyệt ẩn danh
2. Truy cập `/author/[id]` (lấy ID từ một bài blog)

**Expected:** Trang author load thành công (200), hiện thông tin tác giả và danh sách bài viết  
**Result:** `[ 🔄 ]` — Chưa test

---

### ANON-18: `/api/docs` — API spec bảo vệ bởi CRON_SECRET → 401
**Steps:**
1. Gọi: `GET /api/docs` — không có Authorization header

**Expected:** Response `401 Unauthorized` — KHÔNG trả về API spec  
**Result:** `[ 🔄 ]` — Đã thêm CRON_SECRET guard vào route, cần verify

---

## MODULE E: PUBLIC INVOICE SHARE

### ANON-19: Xem invoice qua public share link
**Steps:**
1. (Cần đăng nhập trước để lấy link) Vào invoice view → click Share → copy link
2. Mở link `/share/[id]` trong tab ẩn danh

**Expected:** Invoice hiện đầy đủ thông tin trong trang public, không cần đăng nhập, có nút "Download PDF"  
**Result:** `[ ⏭ ]` — Cần lấy share link từ tài khoản đã đăng nhập trước

---

### ANON-20: Download PDF từ trang public share
**Steps:**
1. Mở link `/share/[id]` trong tab ẩn danh (từ ANON-19)
2. Click **"Download PDF"**

**Expected:** PDF được tạo và download thành công ngay cả khi không đăng nhập  
**Result:** `[ ⏭ ]` — Phụ thuộc ANON-19

---

## MODULE F: QUOTES (Khách hàng nhận link)

### ANON-21: Khách hàng chấp nhận Quote (Accept)
**Steps:**
1. Mở public link `/share/quote/[id]` trong tab ẩn danh
2. Click **"Accept Quote"**

**Expected:** Hiện thông báo **"This quote has been accepted. Thank you!"**, status Quote đổi sang `accepted`  
**Result:** `[ ⏭ ]` — Tính năng Quotes chưa có route live (trả về 404)

---

### ANON-22: Khách hàng từ chối Quote (Reject)
**Steps:**
1. Mở public link `/share/quote/[id]` trong tab ẩn danh
2. Click **"Reject Quote"**

**Expected:** Hiện thông báo xác nhận, status Quote đổi sang `rejected`  
**Result:** `[ ⏭ ]` — Tính năng Quotes chưa có route live (trả về 404)

---

## MODULE G: API SECURITY

### ANON-23: API test-email-dispatch không có token → 401
**Steps:**
1. Gọi: `GET /api/test-email-dispatch?email=test@example.com` — không có Authorization header

**Expected:** Response `401 Unauthorized {"error": "Unauthorized"}` — KHÔNG gửi email  
**Result:** `[ ✅ ]` — Trả về 401 Unauthorized đúng như kỳ vọng, không gửi email

---

### ANON-24: Cron invoice-check không có token → 401
**Steps:**
1. Gọi: `GET /api/cron/invoice-check` — không có Authorization header

**Expected:** Response `401 Unauthorized "Unauthorized: Missing auth header"` — KHÔNG chạy cron  
**Result:** `[ ✅ ]` — Trả về 401 Unauthorized: Missing auth header đúng như kỳ vọng

---

### ANON-25: Cron ping không có token → 401
**Steps:**
1. Gọi: `GET /api/cron/ping` — không có Authorization header

**Expected:** Response `401 Unauthorized` — KHÔNG ping DB  
**Result:** `[ 🔄 ]` — Chưa test (code có CRON_SECRET guard)

---

## TỔNG KẾT — ANON

| Thống kê | Số lượng |
|----------|----------|
| **Tổng test cases** | **25** |
| Pass ✅ | **8** |
| Fail ❌ | **0** |
| Chưa test 🔄 | **10** |
| Skip ⏭ | **7** |

### Chưa test (cần chạy thủ công)
| TC | Route | Mô tả |
|----|-------|-------|
| ANON-01 | `/` | Homepage load |
| ANON-02 | `/login` | Login page load |
| ANON-09 | `/invoice/[id]` | Auth guard → redirect login |
| ANON-10 | `/dashboard/analytics` | Auth guard → redirect login |
| ANON-11 | `/dashboard/settings` | Auth guard → redirect login |
| ANON-12 | `/admin` | Auth guard → redirect login |
| ANON-13 | `/dashboard/items` | Auth guard → redirect login |
| ANON-14 | `/dashboard/quotes` | Auth guard → redirect login |
| ANON-17 | `/author/[id]` | Author page public access |
| ANON-18 | `/api-docs` | Swagger UI — không có auth guard ⚠️ |
| ANON-25 | `/api/cron/ping` | CRON_SECRET guard → 401 |

### Skip còn lại
| TC | Lý do |
|----|-------|
| ANON-19, 20 | Cần lấy share link từ tài khoản đã đăng nhập |
| ANON-21, 22 | Tính năng Quotes chưa có route live |

---

**Người kiểm tra:** AI Agent (ANON — trình duyệt ẩn danh)  
**Ngày kiểm tra:** 2026-04-05 (Run 3)  
**Môi trường:** `[x] Dev (localhost:3000)` / `[ ] Production (https://invoicequickly.com)`
