# INVOICE QUICKLY — MANUAL TEST CASES
**Cập nhật:** 2026-04-04  
**Base URL:** `http://localhost:3000` (hoặc production URL)  
**Phiên bản:** v0.2 — Full Coverage, Security-patched

---

## LEGEND
- `[ ✅ ]` Pass
- `[ ❌ ]` Fail
- `[ ⏭ ]` Skip / N/A
- `[ 🔄 ]` Đang kiểm tra

**Loại tài khoản sử dụng:**
- **FREE** = Tài khoản bình thường mới đăng ký (không phải test email, không có sub)
- **PRO** = Tài khoản có subscription active (dùng test email: `vunguyen5127@gmail.com` hoặc `vunguyencapital@gmail.com`)
- **ANON** = Không đăng nhập (trình duyệt ẩn danh)

---

## MODULE 1: AUTHENTICATION

### TC-101: Đăng nhập Google OAuth
**Loại TK:** ANON  
**Steps:**
1. Mở `/login`
2. Click **"Sign in with Google"**
3. Chọn tài khoản Google trong popup
4. Confirm redirect về `/dashboard`

**Expected:** Redirect về `/dashboard`, header hiện tên/email user, không có dải skeleton bị kẹt  
**Result:** `[ ]`

---

### TC-102: Người dùng chưa đăng nhập truy cập trang protected
**Loại TK:** ANON  
**Steps:**
1. Mở trình duyệt ẩn danh
2. Truy cập thẳng vào `http://localhost:3000/dashboard`

**Expected:** Bị redirect về `/login?redirect=/dashboard` (KHÔNG hiện skeleton loading bị kẹt)  
**Result:** `[ ✅ ]`

---

### TC-103: Đăng xuất
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Đăng nhập thành công, ở trang `/dashboard`
2. Vào **Settings** → Click nút **Sign Out** (màu đỏ, bottom of Settings page)

**Expected:** Redirect về trang chủ `/`, header hiện nút Login, không còn session  
**Result:** `[ ]`

---

### TC-104: Truy cập `/admin` bằng tài khoản thường
**Loại TK:** FREE  
**Steps:**
1. Đăng nhập bằng tài khoản thường (non-admin email)
2. Truy cập `http://localhost:3000/admin`

**Expected:** Bị redirect ngay về `/dashboard`, không thấy được nội dung Admin Panel  
**Result:** `[ ]`

---

### TC-105: Người dùng chưa đăng nhập truy cập `/company/[id]`
**Loại TK:** ANON  
**Steps:**
1. Mở trình duyệt ẩn danh
2. Truy cập một URL company bất kỳ (vd: `http://localhost:3000/company/abc-123`)

**Expected:** Bị redirect về `/login`  
**Result:** `[ ]`

---

## MODULE 2: DASHBOARD (TRANG CHÍNH)

### TC-201: Dashboard load thành công
**Loại TK:** FREE  
**Steps:**
1. Đăng nhập → trang `/dashboard` load

**Expected:** Danh sách company hiện ra (hoặc empty state "No companies yet"), heading "Dashboard" xuất hiện, nút "Create Company" có thể thấy  
**Result:** `[ ]`

---

### TC-202: Filter theo period trên Analytics mini
**Loại TK:** PRO  
**Steps:**
1. Dashboard → khu vực Stats (Total Outstanding, Overdue, etc.)
2. Thử đổi filter period (Day / Week / Month / Year) nếu có

**Expected:** Số liệu cập nhật theo period được chọn  
**Result:** `[ ]`

---

### TC-203: Dashboard pin company
**Loại TK:** FREE hoặc PRO (có ≥2 companies)  
**Steps:**
1. Dashboard với ít nhất 2 companies
2. Hover vào một company card → click icon ghim (📌)

**Expected:** Company bị ghim xuất hiện lên đầu danh sách, icon ghim đổi màu active  
**Result:** `[ ]`

---

## MODULE 3: COMPANY MANAGEMENT

### TC-301: Tạo Company đầu tiên (Free user)
**Loại TK:** FREE (chưa có company)  
**Steps:**
1. Dashboard → click **"Create Company"**
2. Điền: Name, Email, Address (bắt buộc)
3. (Tuỳ chọn) Upload logo
4. Click **Save**

**Expected:** Company được tạo, hiện trong dashboard, không bị lỗi  
**Result:** `[ ]`

---

### TC-302: Tạo Company thứ 2 (Free user bị chặn)
**Loại TK:** FREE (đã có 1 company)  
**Steps:**
1. Dashboard → click **"Create Company"** lần 2
2. Điền thông tin hợp lệ → Save

**Expected:** **UpgradeModal** hiện lên với trigger `"company_limit"` (KHÔNG tạo được company thứ 2)  
**Result:** `[ ]`

---

### TC-303: Tạo Company (Pro user - nhiều hơn 1)
**Loại TK:** PRO  
**Steps:**
1. Dashboard → click **"Create Company"** → tạo đến company thứ 3

**Expected:** Tất cả company được tạo thành công, không bị modal chặn  
**Result:** `[ ]`

---

### TC-304: Edit Company (tên, địa chỉ, currency mặc định)
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Dashboard → click icon **Edit** (✏️) trên company
2. Đổi Name, Address, Default Currency → Save

**Expected:** Thông tin company cập nhật, hiện trên card ngay sau khi Save  
**Result:** `[ ]`

---

### TC-305: Edit Company — Upload Logo
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Edit Company modal → click Upload Logo
2. Chọn ảnh PNG/JPG (< 2MB)
3. Save

**Expected:** Logo xuất hiện trên company card và trên invoice khi tạo mới  
**Result:** `[ ]`

---

### TC-306: Edit Company — Signature Pad
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Edit Company modal → cuộn xuống phần **Signature**
2. Ký tên bằng chuột/cảm ứng trong ô signature pad
3. Save

**Expected:** Chữ ký được lưu, xuất hiện trên invoice PDF khi tạo mới  
**Result:** `[ ]`

---

### TC-307: Delete Company
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Dashboard → click icon **Delete** (🗑️) trên company
2. Xác nhận trong **ConfirmModal**

**Expected:** Company bị xoá khỏi danh sách, tất cả invoices liên quan cũng bị xoá (soft delete)  
**Result:** `[ ]`

---

## MODULE 4: INVOICE CREATION & EDITING

### TC-401: Tạo invoice đầy đủ
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Company page → click **"Create Invoice"**
2. Điền: Client Name, Email, Address
3. Thêm 2 line items (Description, Qty, Rate)
4. Thêm Tax 10%
5. Thêm Discount 5% (theo %)
6. Set Due Date (một ngày trong tương lai)
7. Click **Save**

**Expected:** Invoice lưu thành công, tổng tính đúng (subtotal - discount + tax), redirect về company page  
**Result:** `[ ]`

---

### TC-402: Invoice number tự động tăng
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Company đã có invoice `INV-2026-001`
2. Tạo invoice mới → kiểm tra field **Invoice Number**

**Expected:** Invoice number được pre-fill là `INV-2026-002` (số kế tiếp, không trùng)  
**Result:** `[ ]`

---

### TC-403: Edit invoice (không phải Paid)
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Company page → click icon Edit (✏️) trên invoice có status ≠ Paid
2. Đổi client name, thêm 1 line item
3. Click Save

**Expected:** Invoice cập nhật thành công, số tiền tổng cộng được tính lại đúng  
**Result:** `[ ]`

---

### TC-404: Edit Paid invoice bị chặn
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Company page → tìm invoice có status = **Paid**
2. Nhìn vào cột Actions

**Expected:** Nút Edit (✏️) bị mờ/disabled, **không thể click vào** để chỉnh sửa  
**Result:** `[ ]`

---

### TC-405: Duplicate (nhân bản) invoice
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Company page → click icon **Duplicate** (Copy 📋) trên một invoice
2. Trang `/company/[id]/new?duplicate=[invoiceId]` mở ra

**Expected:** Form tạo invoice mới được pre-fill với dữ liệu của invoice cũ, invoice number được tự động tăng lên số mới  
**Result:** `[ ]`

---

### TC-406: Xem invoice (View page)
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Company page → click icon **View** (👁️) trên invoice

**Expected:** Trang `/invoice/[id]` hiện đầy đủ thông tin invoice theo format in ấn, có các nút: Download, Edit, Share  
**Result:** `[ ]`

---

### TC-407: Delete invoice đơn lẻ
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Company page → click icon **Delete** (🗑️) trên invoice
2. Xác nhận trong **ConfirmModal**

**Expected:** Invoice bị xoá khỏi danh sách, không còn hiện nữa  
**Result:** `[ ]`

---

## MODULE 5: INVOICE STATUS & BULK OPERATIONS

### TC-501: Đổi status invoice đơn lẻ
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Company page (desktop) → click badge **Status** của invoice
2. Chọn status mới từ dropdown (vd: Draft → Sent)

**Expected:** Badge status đổi màu ngay lập tức, không cần reload  
**Result:** `[ ]`

---

### TC-502: Bulk select — Chọn tất cả invoices
**Loại TK:** FREE hoặc PRO (có ≥3 invoices, trên desktop)  
**Steps:**
1. Company page (desktop, width > 640px)
2. Click **checkbox ở header row** (select all)

**Expected:** Tất cả invoices trên trang hiện tại được chọn, thanh toolbar **"X selected | Mark as Paid | Delete"** xuất hiện phía trên bảng  
**Result:** `[ ]`

---

### TC-503: Bulk Mark as Paid
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Chọn 2-3 invoices có status ≠ Paid
2. Click **"Mark as Paid"** trong bulk toolbar

**Expected:** Tất cả invoices đã chọn chuyển sang status **Paid** (badge xanh), toolbar biến mất, danh sách refresh  
**Result:** `[ ]`

---

### TC-504: Bulk Delete
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Chọn 2-3 invoices
2. Click **"Delete"** trong bulk toolbar

**Expected:** Tất cả invoices bị chọn bị xoá khỏi danh sách, refresh tự động  
**Result:** `[ ]`

---

### TC-505: Invoice đã Paid không bị downgrade qua bulk
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Có ít nhất 1 invoice đang **Paid** và 1 invoice khác (**Draft/Sent**)
2. Chọn cả hai → click **"Mark as Paid"**

**Expected:** Invoices chưa Paid được đánh dấu Paid. Invoices đã Paid **không bị thay đổi** (không rollback)  
**Result:** `[ ]`

---

## MODULE 6: PDF & SHARING

### TC-601: Download PDF
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Trang `/invoice/[id]` hoặc invoice editor
2. Click **Download PDF**

**Expected:** File PDF được tạo và download về máy, chất lượng tốt, hiện đầy đủ thông tin invoice (logo, signature nếu có)  
**Result:** `[ ]`

---

### TC-602: Share invoice (Public link)
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Trang `/invoice/[id]` → click nút **Share**
2. Copy public link được tạo ra
3. Mở link trong tab ẩn danh (không đăng nhập)

**Expected:** Invoice hiện đầy đủ trong trang public (`/share/[id]`), không cần đăng nhập, có nút "Download PDF"  
**Result:** `[ ]`

---

### TC-603: Download PDF từ trang public share
**Loại TK:** ANON  
**Steps:**
1. Mở link share `/share/[id]` trong tab ẩn danh
2. Click **"Download PDF"**

**Expected:** PDF được tạo và download thành công ngay cả khi không đăng nhập  
**Result:** `[ ]`

---

## MODULE 7: FREE USER LIMITS & GUARDS

### TC-701: Free user bấm Recurring toggle
**Loại TK:** FREE  
**Steps:**
1. Vào `/company/[id]/new` (tạo invoice mới)
2. Scroll xuống section **Recurring**
3. Bật toggle **"Recurring Invoice"**

**Expected:** **UpgradeModal** hiện lên ngay với trigger `"recurring"`, Recurring toggle KHÔNG được bật  
**Result:** `[ ]`

---

### TC-702: Free user bấm Recurring trên trang Edit
**Loại TK:** FREE  
**Steps:**
1. Mở một invoice có sẵn → click Edit
2. Scroll xuống → bật toggle **"Recurring Invoice"**

**Expected:** **UpgradeModal** hiện lên, toggle vẫn ở trạng thái off  
**Result:** `[ ]`

---

### TC-703: Free user click Export Excel
**Loại TK:** FREE  
**Steps:**
1. Đăng nhập Free user → vào Company page
2. Click nút **"Export Excel"** (màu xanh lá, desktop only)

**Expected:** **UpgradeModal** hiện lên với trigger `"csv_export"`, file xlsx KHÔNG được download  
**Result:** `[ ]`

---

### TC-704: Free user tạo invoice thứ 51 trong tháng
**Chuẩn bị:** User cần đã tạo đủ 50 invoices/quotes trong tháng hiện tại  
**Loại TK:** FREE  
**Steps:**
1. Cố tạo thêm 1 invoice và click **Save**

**Expected:** Lỗi **UpgradeModal** với trigger `"invoice_limit"` hiện lên, invoice KHÔNG được lưu  
**Result:** `[ ]`

---

### TC-705: Pro user dùng Recurring bình thường
**Loại TK:** PRO  
**Steps:**
1. Tạo invoice mới → bật Recurring → chọn interval = Monthly → set next date

**Expected:** Toggle bật thành công, không hiện modal, có field chọn interval và ngày  
**Result:** `[ ]`

---

### TC-706: Pro user Export Excel
**Loại TK:** PRO  
**Steps:**
1. Company page → click **"Export Excel"**

**Expected:** File `.xlsx` được download về, có đầy đủ cột dữ liệu (Invoice #, Client, Amount, Status, etc.)  
**Result:** `[ ]`

---

## MODULE 8: SEARCH, FILTER & SORT

### TC-801: Tìm kiếm invoice theo client name
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Company page (có nhiều invoices) → gõ tên client vào ô **Search**

**Expected:** Danh sách tự động lọc sau ~0.5s debounce, chỉ hiện invoices match với search term  
**Result:** `[ ]`

---

### TC-802: Tìm kiếm invoice theo invoice number
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Gõ vào ô search một phần invoice number (vd: "INV-001")

**Expected:** Invoice tương ứng hiện ra  
**Result:** `[ ]`

---

### TC-803: Filter invoice theo status (single)
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Company page → click dropdown **"All Status"**
2. Tích chọn **"Paid"**

**Expected:** Chỉ hiện invoices có status = Paid, badge dropdown đổi màu xanh  
**Result:** `[ ]`

---

### TC-804: Filter invoice theo status (multi-select)
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Dropdown status → tích chọn **"Paid"** + **"Overdue"** cùng lúc

**Expected:** Hiện đồng thời các invoices Paid và Overdue, dropdown hiện "2 selected"  
**Result:** `[ ]`

---

### TC-805: Filter Overdue
**Loại TK:** FREE hoặc PRO (có invoice quá hạn)  
**Steps:**
1. Dropdown status → chọn **"Overdue"**

**Expected:** Chỉ hiện invoices chưa paid có due_date < ngày hôm nay  
**Result:** `[ ]`

---

### TC-806: Clear filter
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Sau khi đã filter → mở dropdown → click **"Clear filters"**

**Expected:** Filter reset về "All Status", hiện toàn bộ invoices  
**Result:** `[ ]`

---

### TC-807: Sort theo Invoice Number
**Loại TK:** FREE hoặc PRO (desktop)  
**Steps:**
1. Company page → click header column **"Invoice Number"**

**Expected:** Danh sách sắp xếp theo invoice number asc; click lần 2 → desc  
**Result:** `[ ]`

---

### TC-808: Sort theo Amount
**Loại TK:** FREE hoặc PRO (desktop)  
**Steps:**
1. Click header column **"Amount"**

**Expected:** Sắp xếp theo total_amount, toggle asc/desc  
**Result:** `[ ]`

---

### TC-809: Phân trang (Pagination)
**Loại TK:** FREE hoặc PRO (có > 10 invoices)  
**Steps:**
1. Company page với nhiều invoices → click nút **Next Page** (→)

**Expected:** Trang 2 load đúng, số trang hiện ở thanh phân trang, "Showing X to Y of Z"  
**Result:** `[ ]`

---

### TC-810: Đổi số items per page
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Dropdown **"Show: 10"** → đổi sang **20** hoặc **50**

**Expected:** Danh sách hiện nhiều items hơn, pagination cập nhật  
**Result:** `[ ]`

---

## MODULE 9: GENERATOR (KHÔNG CẦN ĐĂNG NHẬP)

### TC-901: Tạo invoice không cần tài khoản
**Loại TK:** ANON  
**Steps:**
1. Truy cập `/generator` (không đăng nhập)
2. Điền thông tin seller, client, thêm line items
3. Click **Download PDF**

**Expected:** PDF được tạo và download thành công, không bị chặn bởi auth guard  
**Result:** `[ ]`

---

### TC-902: Generator — Save invoice (cần đăng nhập)
**Loại TK:** FREE  
**Steps:**
1. `/generator` → điền thông tin
2. Click **Save**

**Expected:** Prompt đăng nhập nếu chưa đăng nhập, hoặc save thẳng và redirect về dashboard nếu đã đăng nhập  
**Result:** `[ ]`

---

### TC-903: Generator — Share button
**Loại TK:** FREE hoặc PRO (đã đăng nhập)  
**Steps:**
1. `/generator` → click **Share**

**Expected:** Tạo và copy link public share, hiện thông báo "Copied!"  
**Result:** `[ ]`

---

## MODULE 10: QUOTES & ESTIMATES

### TC-1001: Tạo Quote mới
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Dashboard → **Quotes** → Click **"New Quote"**
2. Điền thông tin Client, thêm Items, Tax, Rate
3. Click **"Save Quote"**

**Expected:** Quote lưu thành công, URL chuyển sang `/quote/[id]`, status là **Draft**  
**Result:** `[ ]`

---

### TC-1002: Share Quote (Public link)
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Từ trang edit Quote → click **Share** → copy public link

**Expected:** Link dạng `/share/quote/[id]` được tạo, có thể mở trong tab ẩn danh  
**Result:** `[ ]`

---

### TC-1003: Khách hàng chấp nhận Quote (Accept)
**Loại TK:** ANON (khách hàng nhận link)  
**Steps:**
1. Mở public link `/share/quote/[id]` trong tab ẩn danh
2. Click **"Accept Quote"**

**Expected:** Hiện thông báo xác nhận **"This quote has been accepted. Thank you!"**, status Quote đổi sang `accepted`  
**Result:** `[ ]`

---

### TC-1004: Khách hàng từ chối Quote (Reject)
**Loại TK:** ANON (khách hàng nhận link)  
**Steps:**
1. Mở public link `/share/quote/[id]` trong tab ẩn danh
2. Click **"Reject Quote"**

**Expected:** Hiện thông báo xác nhận, status Quote đổi sang `rejected`  
**Result:** `[ ]`

---

### TC-1005: Chuyển đổi Quote → Invoice (Pro only)
**Loại TK:** PRO  
**Steps:**
1. Mở trang edit Quote (status đã accepted)
2. Click **"Convert to Invoice"** trên header
3. Xác nhận

**Expected:** Redirect sang trang Invoice vừa tạo với toàn bộ data từ Quote, status Quote đổi sang `invoiced`  
**Result:** `[ ]`

---

### TC-1006: Free user cố Convert Quote → Invoice
**Loại TK:** FREE  
**Steps:**
1. Mở trang edit Quote → click **"Convert to Invoice"**

**Expected:** **UpgradeModal** hiện lên, không tạo được invoice  
**Result:** `[ ]`

---

## MODULE 11: ITEMS & CLIENTS LIBRARY

### TC-1101: Library Empty State
**Loại TK:** FREE (tài khoản mới)  
**Steps:**
1. Dashboard → **Library** (tab Items)
2. Kiểm tra empty state
3. Chuyển sang tab **Clients** → kiểm tra empty state

**Expected:** Cả 2 tab hiện thông báo "library is empty" với CTA button  
**Result:** `[ ]`

---

### TC-1102: Tạo Item mới
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Library → tab **Items** → click **"Add Item"**
2. Điền Name, Description, Default Rate
3. Save

**Expected:** Item xuất hiện trong bảng Items với đầy đủ thông tin  
**Result:** `[ ]`

---

### TC-1103: Bulk Add Items
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Library → Items → click **"Bulk Add Items"** (nếu có)
2. Nhập nhiều dòng theo format yêu cầu

**Expected:** Nhiều items được tạo trong một lần, hiện trong danh sách  
**Result:** `[ ]`

---

### TC-1104: Tạo Client mới
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Library → tab **Clients** → click **"New Client"**
2. Điền Name, Email, Address
3. Save

**Expected:** Client xuất hiện trong bảng Clients  
**Result:** `[ ]`

---

### TC-1105: Edit Item / Client
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Bấm nút **Edit** trên 1 item/client → đổi giá trị → Save

**Expected:** Thông tin được cập nhật ngay trong bảng  
**Result:** `[ ]`

---

### TC-1106: Delete Item / Client
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Bấm nút **Delete** trên 1 item/client → Xác nhận

**Expected:** Item/Client bị xoá khỏi danh sách  
**Result:** `[ ]`

---

### TC-1107: Free user bị giới hạn số lượng Items/Clients
**Loại TK:** FREE (đã có 10 items / 5 clients)  
**Steps:**
1. Cố tạo thêm item/client vượt giới hạn
   
**Expected:** **UpgradeModal** hiện lên, không thể thêm mới  
**Result:** `[ ]`

---

### TC-1108: Autocomplete Client trong Invoice form
**Loại TK:** FREE hoặc PRO (đã có clients)  
**Steps:**
1. Tạo invoice mới → click vào field **Client Name**
2. Gõ một vài ký tự

**Expected:** Dropdown gợi ý clients từ thư viện xuất hiện, chọn 1 → tự động điền email, address  
**Result:** `[ ]`

---

## MODULE 12: ANALYTICS

### TC-1201: Analytics page load
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Dashboard → **Analytics** (`/dashboard/analytics`)
2. Kiểm tra KPI cards và biểu đồ

**Expected:** Hiện đúng số liệu thực (Outstanding, Overdue, Paid this month), biểu đồ render đúng  
**Result:** `[ ]`

---

### TC-1202: Filter Analytics theo Company
**Loại TK:** PRO (có ≥2 companies)  
**Steps:**
1. Analytics → chọn một company cụ thể từ dropdown

**Expected:** KPI cards và biểu đồ cập nhật chỉ dữ liệu của company đó  
**Result:** `[ ]`

---

### TC-1203: Filter Analytics theo Period
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Analytics → thử đổi filter: **Day / Week / Month / Year**

**Expected:** Biểu đồ cập nhật đúng theo khung thời gian, trục X thay đổi tương ứng (giờ / ngày / tháng)  
**Result:** `[ ]`

---

## MODULE 13: SETTINGS

### TC-1301: Settings page load (Free user)
**Loại TK:** FREE  
**Steps:**
1. Dashboard → **Settings** (`/dashboard/settings`)

**Expected:** Hiện Profile, Plan = **Free Plan**, Preferences (Language, Theme), Sign Out button  
**Result:** `[ ]`

---

### TC-1302: Settings — Đổi ngôn ngữ
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Settings → dropdown Language → chọn **Tiếng Việt** (hoặc ngôn ngữ khác)

**Expected:** Toàn bộ labels trong UI thay đổi sang ngôn ngữ đã chọn, persist sau khi reload  
**Result:** `[ ]`

---

### TC-1303: Settings — Đổi Dark/Light mode
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Settings → **Theme** → click chuyển đổi Light ↔ Dark ↔ System

**Expected:** Giao diện đổi màu ngay lập tức, persist sau khi reload trang  
**Result:** `[ ]`

---

### TC-1304: Settings — Subscription info (Pro user)
**Loại TK:** PRO  
**Steps:**
1. Settings → phần **Subscription**

**Expected:** Hiện plan **Pro**, status, ngày gia hạn tiếp theo (Renews on), card last 4 digits (nếu có)  
**Result:** `[ ]`

---

### TC-1305: Settings — Cancel Subscription
**Loại TK:** PRO (sandbox mode)  
**Steps:**
1. Settings → Subscription → click **"Cancel"** button (màu đỏ nhạt)
2. Xác nhận trong ConfirmModal

**Expected:** Status đổi sang **"Cancels Soon"**, nút Cancel biến mất, nút **"Resume"** xuất hiện  
**Result:** `[ ]`

---

### TC-1306: Settings — Resume Subscription
**Loại TK:** PRO (đã cancel, chưa hết kỳ)  
**Steps:**
1. Settings → Subscription → click **"Resume"** button

**Expected:** Status quay về **Active**, nút Resume biến mất, nút Cancel xuất hiện lại  
**Result:** `[ ]`

---

### TC-1307: Settings — Admin Panel link (chỉ admin)
**Loại TK:** PRO (admin email: `vunguyencapital@gmail.com`)  
**Steps:**
1. Settings → phần cuối (Account section)
2. Kiểm tra có hiện link **"Admin Panel"** không

**Expected:** Link Admin Panel chỉ xuất hiện với admin email, click vào → redirect đến `/admin`  
**Result:** `[ ]`

---

## MODULE 14: PRICING & CHECKOUT

### TC-1401: Pricing page load
**Loại TK:** ANON hoặc FREE  
**Steps:**
1. Truy cập `/pricing`
2. Kiểm tra plans hiển thị

**Expected:** Hiện đầy đủ 2 plans (Free vs Pro), tính năng comparison, nút Subscribe  
**Result:** `[ ]`

---

### TC-1402: Click Checkout (Test mode)
**Loại TK:** FREE  
**Steps:**
1. `/pricing` → click **"Subscribe to Pro"** (Monthly hoặc Yearly)

**Expected:** Cổng thanh toán (Lemon Squeezy hoặc Paddle sandbox) xuất hiện dưới dạng modal hoặc redirect  
**Result:** `[ ]`

---

### TC-1403: Hoàn tất thanh toán (Test card)
**Loại TK:** FREE  
**Steps:**
1. Dùng test card thanh toán thành công
2. Hoàn tất và quay về app

**Expected:** Account chuyển lên Pro (Settings hiện "Pro Plan"), limits tăng lên, UpgradeModals không còn xuất hiện khi dùng tính năng Pro  
**Result:** `[ ]`

---

## MODULE 15: UI/UX

### TC-1501: Dark mode (header toggle)
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Click icon theme toggle (🌙/☀️) ở header
2. Reload lại trang

**Expected:** Dark/Light mode bật và persist sau reload  
**Result:** `[ ]`

---

### TC-1502: Language switch (header toggle)
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Header → chọn ngôn ngữ khác (vd: Tiếng Việt)
2. Kiểm tra các label hiện trên form và navigation

**Expected:** UI chuyển sang ngôn ngữ được chọn, persist sau reload  
**Result:** `[ ]`

---

### TC-1503: Responsive mobile layout — Dashboard
**Loại TK:** FREE  
**Steps:**
1. Mở DevTools → Responsive mode → chọn iPhone (375px) hoặc dùng điện thoại thật
2. Kiểm tra trang Dashboard (`/dashboard`)

**Expected:** Companies hiện dạng card mobile, navigation bottom-bar hoạt động, không overflow ngang  
**Result:** `[ ]`

---

### TC-1504: Responsive mobile layout — Company page
**Loại TK:** FREE hoặc PRO  
**Steps:**
1. Mobile (375px) → mở Company page

**Expected:** Invoices hiện dạng **card** (không phải table), Floating Action Button (➕) xuất hiện ở góc dưới phải  
**Result:** `[ ]`

---

### TC-1505: Tooltip hiển thị
**Loại TK:** FREE hoặc PRO (desktop)  
**Steps:**
1. Company page (desktop) → hover chuột vào các nút action (✏️, 📋, 👁️, 🗑️)

**Expected:** Tooltip text xuất hiện sau ~200ms, đúng nội dung  
**Result:** `[ ]`

---

## MODULE 16: BLOG & SEO

### TC-1601: Blog Index page
**Loại TK:** ANON  
**Steps:**
1. Truy cập `/blog`

**Expected:** Danh sách bài viết load thành công, ArticleCard hiện đúng Date, Author, tiêu đề  
**Result:** `[ ]`

---

### TC-1602: Blog Post chi tiết + SEO tags
**Loại TK:** ANON  
**Steps:**
1. Click vào một bài viết từ `/blog`
2. Mở DevTools → `<head>` → kiểm tra `<meta name="description">` và `<script type="application/ld+json">`

**Expected:** Bài viết render đúng, có thẻ Meta SEO hợp lệ, structured data (Article schema) đúng cú pháp  
**Result:** `[ ]`

---

## MODULE 17: LEGAL & STATIC PAGES

### TC-1701: Legal pages load
**Loại TK:** ANON  
**Steps:**
1. Lần lượt truy cập: `/about`, `/contact`, `/privacy-policy`, `/terms`, `/refund-policy`

**Expected:** Tất cả trang load thành công (status 200), không có lỗi 404, nội dung đầy đủ  
**Result:** `[ ]`

---

## MODULE 18: ADMIN PANEL

### TC-1801: Truy cập Admin Panel (admin email)
**Loại TK:** PRO (email: `vunguyencapital@gmail.com` hoặc `vunguyen5127@gmail.com`)  
**Steps:**
1. Đăng nhập bằng admin email
2. Truy cập `/admin`

**Expected:** Admin Panel hiện thành công với 2 tabs: **Login Logs** và **Payment Logs**  
**Result:** `[ ]`

---

### TC-1802: Xem Login Logs
**Loại TK:** Admin  
**Steps:**
1. `/admin` → Tab **"Login Logs"**
2. Kiểm tra bảng logs (email, IP, country, browser, thời gian)

**Expected:** Logs hiện đầy đủ, phân trang hoạt động, số liệu tổng ("Total Logins", "Today's Logins") đúng  
**Result:** `[ ]`

---

### TC-1803: Xem Payment Logs (expand row)
**Loại TK:** Admin  
**Steps:**
1. `/admin` → Tab **"Payment Logs"**
2. Click vào một row có dữ liệu JSON để expand

**Expected:** Row expanded hiện JSON data, level badge (info/error/warn) đúng màu  
**Result:** `[ ]`

---

### TC-1804: Run Invoice Cron
**Loại TK:** Admin  
**Steps:**
1. `/admin` → click nút **"Run Invoice Cron"**
2. Chờ kết quả

**Expected:** Thông báo **Success** (màu xanh) hiện với số emails sent, invoices found. Nếu không có invoice nào, vẫn báo Success với số 0  
**Result:** `[ ]`

---

### TC-1805: Test Email Dispatch
**Loại TK:** Admin  
**Steps:**
1. `/admin` → nhập một email hợp lệ vào ô "Test email..."
2. Click **"Test Email"**

**Expected:** Thông báo **Success** "Test email sent to [email]!" và email thực sự được nhận trong hộp thư  
**Result:** `[ ]`

---

## MODULE 19: SECURITY CHECKS

### TC-1901: API test-email-dispatch không có token
**Loại TK:** ANON (curl hoặc browser)  
**Steps:**
1. Truy cập: `GET /api/test-email-dispatch?email=test@example.com` **không** có Authorization header

**Expected:** Response `401 Unauthorized {"error": "Unauthorized"}` — KHÔNG gửi email  
**Result:** `[ ]`

---

### TC-1902: Cron API không có token
**Loại TK:** ANON  
**Steps:**
1. `GET /api/cron/invoice-check` không có Authorization header

**Expected:** Response `401 Unauthorized "Unauthorized: Missing auth header"` — KHÔNG chạy cron  
**Result:** `[ ]`

---

### TC-1903: Không thể xem Quote của người khác
**Loại TK:** FREE (User B cố đọc quote của User A)  
**Steps:**
1. User A tạo một Quote, lấy ID
2. User B đăng nhập → truy cập trang quote đó

**Expected:** Trang hiện lỗi "Quote not found" hoặc trả về empty (không lộ dữ liệu của User A)  
**Result:** `[ ]`

---

---

## TỔNG KẾT CHUNG

| Thống kê | Số lượng |
|----------|----------|
| **Tổng test cases** | **76** |
| Pass ✅ | ___ |
| Fail ❌ | ___ |
| Skip ⏭ | ___ |

**Ghi chú lỗi phát sinh:**
1. 
2. 
3. 

**Người kiểm tra:** _______________  
**Ngày kiểm tra:** _______________  
**Môi trường:** `[ ] Dev (localhost:3000)` / `[ ] Production`
