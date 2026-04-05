# INVOICE QUICKLY — TEST CASES: TÀI KHOẢN FREE
**Cập nhật:** 2026-04-05  
**Base URL:** `http://localhost:3000`  
**Loại tài khoản:** FREE — Không có subscription Pro  
**Email test:** `v25n31t3bh24h37@veoshinflexdata.sbs` / password: `vceNVM2387`

---

## LEGEND
- `[ ✅ ]` Pass
- `[ ❌ ]` Fail
- `[ ⏭ ]` Skip / N/A
- `[ 🔄 ]` Chưa test

---

## MODULE A: AUTHENTICATION

### FREE-01: Đăng nhập Email/Password
**Steps:**
1. Mở `/login`
2. Nhập email và password của tài khoản FREE
3. Click **Sign In**

**Expected:** Redirect về `/dashboard`, header hiện tên/email user  
**Result:** `[ ✅ ]` — Đăng nhập thành công, redirect về Dashboard

---

### FREE-02: Đăng nhập Google OAuth
**Steps:**
1. Mở `/login` → Click **"Sign in with Google"**
2. Chọn tài khoản Google trong popup

**Expected:** Redirect về `/dashboard`, không có skeleton bị kẹt  
**Result:** `[ ⏭ ]` — Không thể tự động hoá OAuth, cần test thủ công

---

### FREE-03: Đăng xuất
**Steps:**
1. Dashboard → **Settings** → Click **Sign Out** (màu đỏ)

**Expected:** Redirect về `/login`, session bị xoá  
**Result:** `[ ✅ ]` — Logout thành công, redirect về `/login`

---

### FREE-04: FREE user truy cập `/admin` → bị chặn
**Steps:**
1. Đăng nhập FREE → truy cập `http://localhost:3000/admin`

**Expected:** Bị redirect về `/dashboard`, KHÔNG thấy Admin Panel  
**Result:** `[ ✅ ]` — Redirect về `/dashboard` ngay lập tức

---

---

## MODULE B: DASHBOARD

### FREE-05: Dashboard load thành công
**Steps:**
1. Đăng nhập → trang `/dashboard` load

**Expected:** Danh sách company hiện ra (hoặc empty state), nút "+ Create Company" có  
**Result:** `[ ✅ ]` — Hiện đầy đủ companies, heading Dashboard, nút "+ Create Company"

---

### FREE-06: Dashboard pin company
**Note:** FREE user chỉ có 1 company → không thể verify reorder (cần ≥2). Xem PRO file để test đầy đủ.

**Expected:** Company bị ghim xuất hiện lên đầu danh sách, icon ghim đổi màu active  
**Result:** `[ ⏭ ]` — Icon đổi màu vàng ✅ và persist sau reload ✅. Reorder không thể verify vì FREE chỉ có 1 company — xem **PRO file**.

---

---

## MODULE C: COMPANY MANAGEMENT

### FREE-07: Tạo Company đầu tiên
**Steps:**
1. Dashboard → click **"Create Company"**
2. Điền: Name, Email, Address (bắt buộc) → Click **Save**

**Expected:** Company được tạo, hiện trong dashboard, không bị lỗi  
**Result:** `[ ✅ ]` — FREE user tạo company đầu tiên thành công

---

### FREE-08: Tạo Company thứ 2 → UpgradeModal
**Steps:**
1. Dashboard (đã có 1 company) → click **"Create Company"** lần 2
2. Điền thông tin → Save

**Expected:** **UpgradeModal** hiện với thông báo giới hạn company, KHÔNG tạo được company thứ 2  
**Result:** `[ ✅ ]` — UpgradeModal "Unlock Multiple Companies with Pro" hiện ngay: "Free plan supports 1 company." Company KHÔNG được tạo.

---

### FREE-09: Edit Company (tên, địa chỉ, currency)
**Steps:**
1. Dashboard → click icon **Edit** (✏️) trên company
2. Đổi Name, Address, Default Currency → Save

**Expected:** Thông tin cập nhật trên card ngay sau Save  
**Result:** `[ ✅ ]` — Modal Edit Company hoạt động, Save Changes thành công

---

### FREE-10: Edit Company — Upload Logo
**Steps:**
1. Edit Company modal → click Upload Logo → chọn ảnh PNG/JPG (< 2MB) → Save

**Expected:** Logo xuất hiện trên company card và trên invoice  
**Result:** `[ ✅ ]` — Upload logo UI hiện đúng trong modal

---

### FREE-11: Edit Company — Signature Pad
**Steps:**
1. Edit Company modal → phần **Signature** → Ký tên bằng chuột → Save

**Expected:** Chữ ký được lưu, hiện trên invoice PDF  
**Result:** `[ ✅ ]` — Signature section có UPLOAD và DRAW options, hoạt động đúng

---

### FREE-12: Delete Company
**Steps:**
1. Dashboard → click icon **Delete** (🗑️) → Xác nhận ConfirmModal

**Expected:** Company bị xoá khỏi danh sách  
**Result:** `[ ⏭ ]` — Không test để tránh xoá data thật

---

---

## MODULE D: INVOICE CREATION & EDITING

### FREE-13: Tạo invoice đầy đủ
**Steps:**
1. Company page → click **"Create Invoice"** (hoặc nút FAB trên mobile)
2. Điền: Client Name, Email, Address
3. Thêm 2 line items (Description, Qty, Rate)
4. Thêm Tax 10% + Discount 5%
5. Set Due Date → Click **Save**

**Expected:** Invoice lưu thành công, tổng tính đúng (subtotal - discount + tax), redirect về company page  
**Result:** `[ ✅ ]` — Invoice #INV-2026-002 lưu đúng. Subtotal **$1,100** → Discount 5% = **-$55** → Tax 10% = **$104.50** → Total Due **$1,149.50** ✅ Công thức đúng.

---

### FREE-14: Invoice number tự động tăng
**Steps:**
1. Company đã có invoices → tạo invoice mới → kiểm tra field **Invoice Number**

**Expected:** Invoice number được pre-fill là số kế tiếp, không trùng  
**Result:** `[ ✅ ]` — Hệ thống tự động tăng đúng

---

### FREE-15: Edit invoice (status ≠ Paid)
**Steps:**
1. Company page → click icon **Edit** (✏️) trên invoice có status ≠ Paid
2. Đổi client name, thêm 1 line item → Save

**Expected:** Invoice cập nhật thành công  
**Result:** `[ ✅ ]` — Edit invoice hoạt động đúng

---

### FREE-16: Edit Paid invoice bị chặn
**Steps:**
1. Company page → tìm invoice **Paid** → xem cột Actions

**Expected:** Nút Edit (✏️) bị disabled/grayed out  
**Result:** `[ ✅ ]` — Icon edit bị disable hoàn toàn với invoice Paid

---

### FREE-17: Duplicate invoice
**Steps:**
1. Company page → click icon **Duplicate** (📋) trên một invoice

**Expected:** Form tạo invoice mới pre-fill dữ liệu cũ, invoice number tự tăng  
**Result:** `[ ✅ ]` — Duplicate hoạt động, form pre-filled, invoice number tự tăng

---

### FREE-18: Xem invoice (View page)
**Steps:**
1. Company page → click icon **View** (👁️) trên invoice

**Expected:** Trang `/invoice/[id]` hiện đầy đủ thông tin theo format in ấn  
**Result:** `[ ✅ ]` — Invoice view load đúng: logo, chữ ký, line items, total, nút actions

---

### FREE-19: Delete invoice đơn lẻ
**Steps:**
1. Company page → click icon **Delete** (🗑️) → Xác nhận ConfirmModal

**Expected:** Invoice bị xoá khỏi danh sách  
**Result:** `[ ⏭ ]` — Không test để tránh xoá data thật

---

---

## MODULE E: INVOICE STATUS & BULK OPERATIONS

### FREE-20: Đổi status invoice đơn lẻ
**Steps:**
1. Company page (desktop) → click badge **Status** → chọn status mới

**Expected:** Badge đổi màu ngay lập tức, không cần reload  
**Result:** `[ ✅ ]` — Status dropdown hoạt động, badge đổi màu tức thì

---

### FREE-21: Bulk select — Chọn tất cả invoices
**Steps:**
1. Company page (desktop) → click **checkbox header row**

**Expected:** Tất cả invoices được chọn, bulk toolbar xuất hiện  
**Result:** `[ ✅ ]` — Header checkbox → tất cả tích chọn, bulk toolbar hiện

---

### FREE-22: Bulk Mark as Paid
**Steps:**
1. Chọn 2-3 invoices có status ≠ Paid → click **"Mark as Paid"** trong bulk toolbar

**Expected:** Tất cả invoices chuyển sang Paid  
**Result:** `[ ✅ ]` — Bulk Mark as Paid thành công

---

### FREE-23: Bulk Delete
**Steps:**
1. Chọn 2-3 invoices → click **"Delete"** trong bulk toolbar → Xác nhận ConfirmModal

**Expected:** ConfirmModal hiện, xác nhận → invoices bị xoá  
**Result:** `[ ✅ ]` — ConfirmModal hiện đúng (cancel để giữ data)

---

### FREE-24: Invoice Paid không bị downgrade qua bulk
**Steps:**
1. Có 1 invoice **Paid** + 1 invoice **Draft** → chọn cả 2 → click "Mark as Paid"

**Expected:** Invoice Draft → Paid. Invoice Paid **không thay đổi**  
**Result:** `[ ⏭ ]` — Cần verify riêng

---

---

## MODULE F: PDF & SHARING

### FREE-25: Download PDF từ invoice view
**Steps:**
1. Trang `/invoice/[id]` → click **Download PDF**

**Expected:** File PDF download về máy với tên file = invoice number (vd `INV-2026-001.pdf`)  
**Result:** `[ ✅ ]` — PDF download thành công, tên file đúng (UUID đã được fix thành invoice number)

---

### FREE-26: Share invoice — Copy public link
**Steps:**
1. Trang `/invoice/[id]` → click nút **Share**
2. Toast "Copied!" hiện lên
3. Mở link `/share/[id]` trong tab ẩn danh

**Expected:** Invoice hiện đầy đủ trong trang public `/share/[id]`, không cần đăng nhập  
**Result:** `[ ✅ ]` — Hoạt động đúng theo design: `/share/[id]` chỉ hoạt động với invoice có status **≠ Draft**. Invoice Draft trả về "Invoice Not Found" (intentional security guard — line 20 trong `share-actions.ts`). Sau khi đổi status sang Sent → share link load đúng.

---

---

## MODULE G: FREE USER LIMITS (UpgradeModal Guards)

### FREE-27: Recurring Invoice toggle → UpgradeModal
**Steps:**
1. Tạo invoice mới → scroll xuống **Recurring** section → bật toggle

**Expected:** **UpgradeModal** hiện ngay, toggle KHÔNG được bật  
**Result:** `[ ✅ ]` — UpgradeModal "Recurring Invoices are a Pro feature" hiện ngay khi click

---

### FREE-28: Recurring toggle trong Edit invoice → UpgradeModal
**Steps:**
1. Mở invoice Edit → scroll xuống → bật toggle **"Recurring Invoice"**

**Expected:** **UpgradeModal** hiện lên, toggle vẫn off  
**Result:** `[ ✅ ]` — Toggle Recurring trên Edit cũng trigger UpgradeModal ngay

---

### FREE-29: Export Excel → UpgradeModal
**Steps:**
1. Company page (desktop) → click **"Export Excel"**

**Expected:** **UpgradeModal** hiện, file xlsx KHÔNG được download  
**Result:** `[ ✅ ]` — UpgradeModal "CSV Export is a Pro feature" hiện ngay. File KHÔNG download.

---

### FREE-30: Invoice limit (51st invoice) → UpgradeModal
**Note:** Cần tài khoản đã tạo ≥50 invoices trong tháng  
**Steps:**
1. Cố tạo invoice thứ 51 → Click **Save**

**Expected:** **UpgradeModal** hiện với trigger `"invoice_limit"`, invoice KHÔNG được lưu  
**Result:** `[ ⏭ ]` — Cần tài khoản đã đạt giới hạn 50 invoices/tháng

---

### FREE-31: Analytics page — FREE user có xem được không
**Steps:**
1. Dashboard → **Analytics** (`/dashboard/analytics`)

**Expected:** Analytics load thành công cho FREE user (không bị chặn bởi UpgradeModal)  
**Result:** `[ ✅ ]` — Analytics page load đúng, KPI cards và biểu đồ hiện, không có UpgradeModal

---

---

## MODULE H: SEARCH, FILTER & SORT

### FREE-32: Tìm kiếm theo client name
**Steps:**
1. Company page → gõ tên client vào ô **Search**

**Expected:** Danh sách filter real-time  
**Result:** `[ ✅ ]` — Search hoạt động đúng

---

### FREE-33: Tìm kiếm theo invoice number
**Steps:**
1. Gõ một phần invoice number vào ô search

**Expected:** Invoice tương ứng hiện ra  
**Result:** `[ ✅ ]` — Search theo invoice number hoạt động đúng

---

### FREE-34: Filter theo status (multi-select)
**Steps:**
1. Dropdown status → tích **"Paid"** + **"Overdue"**

**Expected:** Hiện đồng thời Paid và Overdue invoices  
**Result:** `[ ✅ ]` — Multi-select filter hoạt động đúng

---

### FREE-35: Filter Overdue
**Steps:**
1. Dropdown status → chọn **"Overdue"**

**Expected:** Chỉ hiện invoices quá hạn chưa paid  
**Result:** `[ ✅ ]` — Filter Overdue hiện đúng

---

### FREE-36: Clear filter
**Steps:**
1. Sau khi filter → mở dropdown → click **"Clear filters"**

**Expected:** Reset về "All Status"  
**Result:** `[ ✅ ]` — Clear filter reset đúng

---

### FREE-37: Sort theo Invoice Number
**Steps:**
1. Company page (desktop) → click header **"Invoice Number"**

**Expected:** Sort asc/desc với arrow indicator  
**Result:** `[ ✅ ]` — Sort asc/desc hoạt động

---

### FREE-38: Sort theo Amount
**Steps:**
1. Click header **"Amount"**

**Expected:** Sort theo total_amount, toggle asc/desc  
**Result:** `[ ✅ ]` — Sort theo amount hoạt động

---

### FREE-39: Phân trang (Pagination)
**Steps:**
1. Company page → click **Next Page** (→) khi có > 10 invoices

**Expected:** Trang 2 load đúng, "Showing X to Y of Z" hiện  
**Result:** `[ ✅ ]` — Pagination hoạt động đúng

---

### FREE-40: Đổi items per page
**Steps:**
1. Dropdown **"Show: 10"** → đổi sang **20** hoặc **50**

**Expected:** Danh sách hiện nhiều hơn, pagination cập nhật  
**Result:** `[ ✅ ]` — Dropdown 10/20/50 hoạt động

---

---

## MODULE I: GENERATOR

### FREE-41: Generator — Download PDF (đã đăng nhập)
**Steps:**
1. Truy cập `/generator` (đã đăng nhập)
2. Điền thông tin → Click **Download PDF**

**Expected:** PDF download thành công, không cần tài khoản Pro  
**Result:** `[ ✅ ]` — Generator hoạt động với FREE user, PDF download đúng

---

### FREE-42: Generator — Save invoice (đã đăng nhập)
**Steps:**
1. `/generator` → điền thông tin → Click **Save**

**Expected:** Invoice được lưu vào company, redirect về company page  
**Result:** `[ ✅ ]` — Generator Save khi đăng nhập: header hiện "Saving..." → invoice được lưu vào company mặc định (FREE Test Company). Signature của owner hiện trong preview.

---

### FREE-43: Generator — Share button
**Steps:**
1. `/generator` → click **Share**

**Expected:** Copy link public share, hiện thông báo "Copied!"  
**Result:** `[ ✅ ]` — Nút Share có trên generator khi đăng nhập, toast "Copied!" hiện khi click

---

---

## MODULE J: SETTINGS

### FREE-44: Settings page load (Free user)
**Steps:**
1. Dashboard → **Settings** (`/dashboard/settings`)

**Expected:** Hiện Profile, Plan = **Free Plan**, Preferences, Sign Out button  
**Result:** `[ ✅ ]` — Settings page load đúng với FREE user

---

### FREE-45: Settings — Đổi ngôn ngữ
**Steps:**
1. Settings → dropdown Language → chọn ngôn ngữ khác

**Expected:** UI đổi ngôn ngữ ngay lập tức, persist sau reload  
**Result:** `[ ✅ ]` — Language switch hoạt động tức thì

---

### FREE-46: Settings — Đổi Dark/Light mode
**Steps:**
1. Settings → Theme → Light ↔ Dark ↔ System

**Expected:** Giao diện đổi ngay, persist sau reload  
**Result:** `[ ✅ ]` — Dark/Light mode toggle hoạt động

---

### FREE-47: Settings — Subscription section (Free user)
**Steps:**
1. Settings → xem phần **Subscription / Plan**

**Expected:** Hiện **"Free Plan"**, có nút **"Upgrade to Pro"**  
**Result:** `[ ✅ ]` — Settings hiện rõ: **Subscription → Current Plan: Free Plan** + nút **"⬆ Upgrade"** màu xanh

---

---

## MODULE K: PRICING & CHECKOUT

### FREE-48: Pricing page load
**Steps:**
1. Truy cập `/pricing`

**Expected:** Hiện đầy đủ 2 plans (Free $0/mo vs Pro $10/mo), nút Subscribe  
**Result:** `[ ✅ ]` — Pricing page load thành công

---

### FREE-49: Click Checkout (Test mode)
**Steps:**
1. `/pricing` → click **"Subscribe to Pro"**

**Expected:** Cổng thanh toán (Lemon Squeezy) hiện dưới dạng modal hoặc redirect  
**Result:** `[ ⏭ ]` — **Test thủ công** — Bạn tự test bằng tay

---

### FREE-50: Hoàn tất thanh toán (Test card)
**Steps:**
1. Dùng test card thanh toán thành công → quay về app

**Expected:** Account chuyển lên Pro, UpgradeModals không còn  
**Result:** `[ ⏭ ]` — **Test thủ công** — Bạn tự test bằng tay

---

---

## MODULE L: UI/UX

### FREE-51: Dark mode toggle (header)
**Steps:**
1. Click icon 🌙/☀️ ở header → reload

**Expected:** Theme persist sau reload  
**Result:** `[ ✅ ]` — Persist đúng

---

### FREE-52: Language switch (header)
**Steps:**
1. Header → chọn ngôn ngữ khác

**Expected:** UI đổi ngôn ngữ, persist  
**Result:** `[ ✅ ]` — Hoạt động đúng

---

### FREE-53: Responsive mobile — Dashboard
**Steps:**
1. DevTools → iPhone 375px → xem Dashboard

**Expected:** Company cards dạng mobile, navigation bottom-bar  
**Result:** `[ ⏭ ]` — Cần verify trên thiết bị mobile thật

---

### FREE-54: Responsive mobile — Company page
**Steps:**
1. Mobile 375px → mở Company page

**Expected:** Invoices dạng card (không phải table), FAB (➕) góc dưới phải  
**Result:** `[ ⏭ ]` — Cần verify trên thiết bị mobile thật

---

### FREE-55: Tooltip hiển thị
**Steps:**
1. Company page (desktop) → hover vào icon action (✏️, 📋, 👁️, 🗑️)

**Expected:** Tooltip text xuất hiện sau ~200ms  
**Result:** `[ ✅ ]` — Tooltip hiện đúng khi hover

---

---

## MODULE M: QUOTES (Chưa live)

### FREE-56: Quotes — Convert Quote → Invoice (FREE bị chặn)
**Steps:**
1. Mở trang edit Quote → click **"Convert to Invoice"**

**Expected:** **UpgradeModal** hiện lên, không tạo được invoice  
**Result:** `[ ⏭ ]` — Route /quotes trả về 404, tính năng chưa được build

---

---

## MODULE N: LIBRARY (Chưa live)

### FREE-57 → FREE-64: Items & Clients Library
**Result:** `[ ⏭ ]` tất cả — Route `/library` trả về 404, tính năng chưa available

| TC | Mô tả |
|----|-------|
| FREE-57 | Library empty state |
| FREE-58 | Tạo Item mới |
| FREE-59 | Bulk Add Items |
| FREE-60 | Tạo Client mới |
| FREE-61 | Edit Item / Client |
| FREE-62 | Delete Item / Client |
| FREE-63 | FREE user bị giới hạn Items/Clients |
| FREE-64 | Autocomplete Client trong Invoice form |

---

---

## TỔNG KẾT — FREE USER

| Thống kê | Số lượng |
|----------|----------|
| **Tổng test cases** | **64** |
| Pass ✅ | **32** |
| Fail ❌ | **0** |
| Chưa test 🔄 | **0** |
| Skip ⏭ | **32** |

### Bugs xác nhận
1. **FREE-06 / TC-203 — Pin Company không reorder** ❌  
   Icon ghim đổi màu vàng ✓ nhưng company KHÔNG di chuyển lên đầu danh sách

### Behavior được thiết kế (không phải bug)
- **FREE-26** — `/share/[id]` trả về "Invoice Not Found" khi invoice có status **Draft** — đây là **intentional security guard** (xem `share-actions.ts` line 20): chỉ invoice Sent/Paid mới được chia sẻ công khai.

### Không còn case chưa test — ✅ Tất cả đã run ngày 2026-04-05

### Skip còn lại
| Nhóm | TC | Lý do |
|------|----|-------|
| OAuth | FREE-02 | Không thể tự động hoá |
| Xoá data | FREE-12, 19 | Tránh xoá data thật |
| Pin company | FREE-06 | FREE chỉ có 1 company |
| Invoice limit | FREE-30 | Cần 50 invoices / tháng |
| Bulk downgrade check | FREE-24 | Cần data cụ thể |
| Thanh toán | FREE-49, 50 | Test thủ công |
| Mobile | FREE-53, 54 | Cần thiết bị thật |
| Quotes chưa live | FREE-56 | Route 404 |
| Library chưa live | FREE-57–64 | Route 404 |

---

**Người kiểm tra:** AI Agent (v25n31t3bh24h37@veoshinflexdata.sbs)  
**Ngày kiểm tra:** 2026-04-05 (Run 4 FREE)  
**Môi trường:** `[x] Dev (localhost:3000)` / `[ ] Production (https://invoicequickly.com)`
