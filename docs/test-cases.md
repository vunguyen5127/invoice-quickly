# INVOICE QUICKLY — MANUAL TEST CASES
Cập nhật: 2026-03-23  
Base URL: http://localhost:3000 (hoặc production URL)

---

## LEGEND
- ✅ Pass
- ❌ Fail  
- ⏭ Skip/N/A

---

## MODULE 1: AUTH

### TC-101: Đăng nhập Google OAuth
**Steps:**
1. Mở `/login`
2. Click "Sign in with Google"
3. Chọn tài khoản Google
4. Xác nhận redirect về `/dashboard`

**Expected:** Redirect về dashboard, thấy tên email ở header  
**Result:** [ ]

---

### TC-102: Chưa đăng nhập truy cập trang protected
**Steps:**
1. Logout hoặc mở ẩn danh
2. Truy cập `/dashboard`

**Expected:** Redirect về `/login?redirect=/dashboard`  
**Result:** [ ]

---

### TC-103: Đăng xuất
**Steps:**
1. Đăng nhập xong
2. Click avatar → Sign Out

**Expected:** Redirect về trang chủ `/`, header hiện nút Login  
**Result:** [ ]

---

## MODULE 2: FREE USER — COMPANY LIMITS

### TC-201: Tạo Company đầu tiên đến thứ 3 (Free user)
**Steps:**
1. Đăng nhập bằng tài khoản FREE (KHÔNG phải 2 email test)
2. Dashboard → click "Create Company" → điền Name, Email, Address → Save
3. Lặp lại để tạo company thứ 2 và thứ 3

**Expected:** Cả 3 company được tạo thành công, hiện trong danh sách  
**Result:** [ ]

---

### TC-202: Tạo Company thứ 4 (Free user bị chặn)
**Steps:**
1. Đã có 3 companies (từ TC-201)
2. Thử tạo company thứ 4

**Expected:** UpgradeModal hiện ra với "company_limit" message  
**Result:** [ ]

---

## MODULE 3: FREE USER — INVOICE LIMITS

### TC-301: Tạo invoice bình thường (< 50/tháng)
**Steps:**
1. Vào Company → "Create Invoice"
2. Điền Client Name, thêm ít nhất 1 line item có description
3. Click Save

**Expected:** Invoice được lưu, redirect về danh sách company  
**Result:** [ ]

---

### TC-302: Tạo invoice thứ 51 trong tháng (Free user bị chặn)
**Chuẩn bị:** Cần tạo đúng 50 invoices trong tháng này (dùng script hoặc test thủ công)  
**Steps:**
1. Thử tạo invoice thứ 51
2. Click Save

**Expected:** UpgradeModal hiện ra với "invoice_limit" message (KHÔNG phải generic alert)  
**Result:** [ ]

---

## MODULE 4: FREE USER — RECURRING GUARD

### TC-401: Free user bấm Recurring toggle
**Steps:**
1. Vào /company/[id]/new (tạo invoice mới)
2. Scroll xuống section Recurring
3. Bật toggle "Recurring Invoice"

**Expected:** UpgradeModal hiện lên với "recurring" message  
**Result:** [ ]

---

### TC-402: Free user bấm Recurring trên trang Edit
**Steps:**
1. Mở một invoice có sẵn → Edit
2. Bật toggle "Recurring Invoice"

**Expected:** UpgradeModal hiện lên  
**Result:** [ ]

---

### TC-403: Pro user dùng Recurring bình thường
**Steps:**
1. Đăng nhập bằng 1 trong 2 test emails
2. Tạo invoice → bật Recurring → chọn interval = Monthly → chọn ngày

**Expected:** Recurring toggle bật được, không hiện modal  
**Result:** [ ]

---

## MODULE 5: EXCEL EXPORT GUARD

### TC-501: Free user bấm Export Excel
**Steps:**
1. Đăng nhập Free user
2. Vào Company dashboard
3. Click nút "Export Excel"

**Expected:** UpgradeModal hiện ra với "csv_export" message  
**Result:** [ ]

---

### TC-502: Pro user Export Excel
**Steps:**
1. Đăng nhập test email (Pro)
2. Click "Export Excel"

**Expected:** File .xlsx được download về, có đầy đủ 11 columns  
**Result:** [ ]

---

## MODULE 6: INVOICE CREATION FLOW

### TC-601: Tạo invoice đầy đủ
**Steps:**
1. Tạo invoice mới
2. Điền: Client name, address, email
3. Thêm 2 line items
4. Thêm Tax 10%
5. Thêm Discount 5%
6. Set due date
7. Click Save

**Expected:** Invoice lưu được, tổng tính đúng  
**Result:** [ ]

---

### TC-602: Download PDF
**Steps:**
1. Mở invoice vừa tạo
2. Click Download PDF

**Expected:** PDF được tạo, chất lượng tốt (PNG không phải JPEG)  
**Result:** [ ]

---

### TC-603: Share link public
**Steps:**
1. Mở invoice
2. Click Share → copy link
3. Mở link trong tab ẩn danh

**Expected:** Invoice hiện đầy đủ, không cần đăng nhập  
**Result:** [ ]

---

### TC-604: Duplicate invoice
**Steps:**
1. Company page → click Copy icon trên một invoice
2. Kiểm tra trang /new được pre-filled với data

**Expected:** Invoice mới có data copied, invoice number mới  
**Result:** [ ]

---

## MODULE 7: INVOICE STATUS & BULK ACTIONS

### TC-701: Đổi status invoice đơn lẻ
**Steps:**
1. Company page → click vào dropdown status của một invoice
2. Đổi từ Draft → Sent

**Expected:** Status cập nhật ngay, badge đổi màu  
**Result:** [ ]

---

### TC-702: Bulk select invoices
**Steps:**
1. Company page (desktop)
2. Tick checkbox ở header → chọn all
3. Kiểm tra toolbar xuất hiện bên dưới header

**Expected:** Toolbar "X selected + Mark as Paid + Delete" hiện ra  
**Result:** [ ]

---

### TC-703: Bulk Mark as Paid
**Steps:**
1. Chọn 2-3 invoices chưa paid
2. Click "Mark as Paid"

**Expected:** Tất cả chuyển thành Paid, toolbar ẩn, danh sách refresh  
**Result:** [ ]

---

### TC-704: Bulk Delete
**Steps:**
1. Chọn 2-3 invoices
2. Click "Delete"

**Expected:** Invoices bị xóa, danh sách refresh  
**Result:** [ ]

---

### TC-705: Không thể đổi status của Paid invoice qua bulk
**Steps:**
1. Chọn 1+ invoice đang là Paid + 1 invoice khác
2. Click "Mark as Paid"

**Expected:** Invoices đã Paid giữ nguyên (không bị downgrade)  
**Result:** [ ]

---

## MODULE 8: GENERATOR (NO LOGIN)

### TC-801: Tạo invoice không cần tài khoản
**Steps:**
1. Truy cập `/generator` (không đăng nhập)
2. Điền thông tin
3. Download PDF

**Expected:** PDF tạo được, không bị chặn  
**Result:** [ ]

---

## MODULE 9: PRICING PAGE & CHECKOUT

### TC-901: Click Checkout Button (Lemon Squeezy Test Mode)
**Steps:**
1. Mở `/pricing`
2. Bấm nút "Upgrade to Pro" (Gói Monthly hoặc Yearly)

**Expected:** Redirect mở cổng thanh toán Lemon Squeezy (Test Mode)  
**Result:** [ ]

---

### TC-902: Nâng cấp thành công (Test card)
**Steps:**
1. Trên cổng thanh toán Test, nhập thẻ giả (Ví dụ thẻ 4242... của Stripe/Lemon)
2. Hoàn tất thanh toán

**Expected:** Quay về `/dashboard`, Webhook hoạt động, account chuyển sang trạng thái Pro (Vô hạn company).  
**Result:** [ ]

---

## MODULE 10: ANALYTICS

### TC-1001: Analytics page load
**Steps:**
1. Dashboard → Analytics
2. Kiểm tra KPI cards và charts

**Expected:** Không hiện số 0 giả hoặc % hardcode, data từ real invoices  
**Result:** [ ]

---

### TC-1002: Filter theo company
**Steps:**
1. Analytics → chọn specific company từ dropdown

**Expected:** Charts cập nhật theo company được chọn  
**Result:** [ ]

---

## MODULE 11: SETTINGS

### TC-1101: Settings page load (Free user)
**Steps:**
1. Dashboard → Settings
2. Kiểm tra plan hiện tại

**Expected:** Hiện "Free Plan" với giới hạn: 1 company, 50 invoices/tháng  
**Result:** [ ]

---


---

## MODULE 12: COMPANY MANAGEMENT

### TC-1201: Edit Company
**Steps:**
1. Dashboard → click icon Edit trên một company
2. Đổi name, address → Save

**Expected:** Thông tin company cập nhật ngay trong danh sách  
**Result:** [ ]

---

### TC-1202: Delete Company
**Steps:**
1. Dashboard → click icon Delete trên một company
2. Xác nhận trong ConfirmModal

**Expected:** Company bị xóa khỏi danh sách, tất cả invoices liên quan cũng bị xóa  
**Result:** [ ]

---

## MODULE 13: INVOICE MANAGEMENT

### TC-1301: Xem invoice (view page)
**Steps:**
1. Company page → click vào một invoice để xem
2. Kiểm tra trang `/invoice/[id]`

**Expected:** Hiện đầy đủ thông tin invoice, có nút Download, Edit, Share  
**Result:** [ ]

---

### TC-1302: Edit invoice và lưu
**Steps:**
1. Mở invoice → click Edit
2. Đổi client name, thêm 1 line item
3. Click Save

**Expected:** Invoice cập nhật, redirect về trang xem invoice hoặc company  
**Result:** [ ]

---

### TC-1303: Delete invoice đơn lẻ
**Steps:**
1. Company page → click icon Delete trên một invoice
2. Xác nhận trong ConfirmModal

**Expected:** Invoice bị xóa, không còn trong danh sách  
**Result:** [ ]

---

### TC-1304: Invoice number tự động tăng
**Steps:**
1. Tạo invoice mới cho một company (đã có invoice INV-001)
2. Kiểm tra invoice number được pre-fill

**Expected:** Invoice number tự động là INV-002 (số tiếp theo)  
**Result:** [ ]

---

## MODULE 14: SEARCH, FILTER & SORT

### TC-1401: Tìm kiếm invoice theo client name
**Steps:**
1. Company page → gõ tên client vào ô search

**Expected:** Danh sách invoice lọc theo client name realtime  
**Result:** [ ]

---

### TC-1402: Filter invoice theo status
**Steps:**
1. Company page → chọn filter "Paid"

**Expected:** Chỉ hiện invoices có status = Paid  
**Result:** [ ]

---

### TC-1403: Sort invoice theo column
**Steps:**
1. Company page (desktop) → click header "Amount" hoặc "Date"

**Expected:** Danh sách sắp xếp theo column đó (asc/desc toggle)  
**Result:** [ ]

---

## MODULE 15: UI/UX

### TC-1501: Dark mode toggle
**Steps:**
1. Click icon theme toggle (sun/moon) ở header
2. Reload lại trang

**Expected:** Dark mode bật/tắt và persist sau khi reload  
**Result:** [ ]

---

### TC-1502: Language switch
**Steps:**
1. Header → chọn ngôn ngữ khác (vd: Tiếng Việt)
2. Kiểm tra labels trong form thay đổi

**Expected:** UI hiện labels đúng ngôn ngữ được chọn  
**Result:** [ ]

---

### TC-1503: Responsive mobile layout
**Steps:**
1. Mở DevTools → chọn iPhone SE (375px) hoặc dùng điện thoại thật
2. Kiểm tra: Dashboard, Company page, Invoice form

**Expected:** Layout hiển thị đúng, không bị overflow, mobile toolbar hoạt động  
**Result:** [ ]

---

## MODULE 16: SETTINGS & SUBSCRIPTION

### TC-1601: Settings — Subscription info (Pro user)
**Steps:**
1. Đăng nhập test email (Pro)
2. Dashboard → Settings

**Expected:** Hiện thông tin subscription: plan, next billing date, card last 4  
**Result:** [ ]

---

## MODULE 17: ITEM LIBRARY

### TC-1701: Truy cập và hiển thị Empty State
**Steps:**
1. Dashboard → Items
2. Kiểm tra nếu chưa có item nào, trang sẽ báo "Your library is empty"
3. Click nút "Create Item" từ Empty State

**Expected:** Form "New Item" modal hiện ra  
**Result:** [ ]

---

### TC-1702: Tạo Item mới và hiển thị trong danh sách
**Steps:**
1. Trong modal "New Item", điền Name, Description, Rate
2. Click Save

**Expected:** Modal đóng, Item xuất hiện trong danh sách Item Library  
**Result:** [ ]

---

## MODULE 18: QUOTES & ESTIMATES

### TC-1801: Tạo báo giá (Quote) mới
**Steps:**
1. Dashboard → Quotes → Click "New Quote"
2. Điền thông tin Client, thêm Item, Rate, Tax...
3. Click "Save Quote"

**Expected:** Quote lưu thành công, URL chuyển sang `/quote/[id]` và trạng thái là Draft  
**Result:** [ ]

---

### TC-1802: Khách hàng chấp nhận Quote
**Steps:**
1. Từ trang edit Quote (đã lưu), click nút Share và copy public link
2. Mở link trên tab ẩn danh, click "Accept Quote"

**Expected:** Hiển thị thông báo "This quote has been accepted. Thank you!"  
**Result:** [ ]

---

### TC-1803: Chuyển đổi Quote sang Invoice
**Steps:**
1. Trở lại trang edit Quote sau khi khách đã accept
2. Click nút "Convert to Invoice" trên thanh Header

**Expected:** Redirect sang trang tạo/edit Invoice với toàn bộ dữ liệu từ Quote giữ nguyên  
**Result:** [ ]

---

## MODULE 19: BLOG & SEO SYSTEM

### TC-1901: Hiển thị Blog Index
**Steps:**
1. Truy cập `/blog`
2. Kiểm tra danh sách bài viết

**Expected:** Các bài viết load thành công, component ArticleCard hiển thị đúng Date/Author  
**Result:** [ ]

---

### TC-1902: Hiển thị Blog Post (Chi tiết bài viết)
**Steps:**
1. Click vào một bài viết từ `/blog`
2. Mở cửa sổ DevTools → Check phần `<head>` để xem SEO tags (ld+json)

**Expected:** Bài viết render đúng cấu trúc Markdown/MDX, có thẻ Meta SEO hợp lệ  
**Result:** [ ]

---

## MODULE 20: LEGAL & STATIC PAGES

### TC-2001: Hiển thị trang Chính sách & Liên hệ
**Steps:**
1. Lần lượt truy cập `/about`, `/contact`, `/privacy-policy`, `/terms`, `/refund-policy`

**Expected:** Tất cả trang load thành công định dạng tài liệu Text, không lỗi 404  
**Result:** [ ]

---

## TỔNG KẾT CHUNG
- Tổng bài kiểm tra (Total Test Cases): 48
- Số bài Pass: ___
- Số bài Fail: ___
- Ghi chú lỗi phát sinh:
  1. 
  2. 
  3. 
