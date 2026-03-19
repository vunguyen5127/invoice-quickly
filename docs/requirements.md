# Tài liệu Requirements & Phân Tích Cấu Trúc Dự Án (Invoice Quickly)

Tài liệu này tổng hợp toàn bộ cấu trúc dự án `invoice-quickly` cùng danh sách các tính năng (features) và công nghệ được sử dụng, dựa trên phân tích mã nguồn và cấu trúc thư mục.

---

## 1. Công Nghệ Ưu Tiên (Tech Stack)

### Frontend
- **Framework**: Next.js 15+ (sử dụng App Router).
- **Thư viện UI**: React 19, Tailwind CSS v4 (cùng hiệu ứng Glassmorphism hiện đại).
- **Biểu tượng (Icons)**: `lucide-react`.
- **Hỗ trợ Đa ngôn ngữ (i18n)**: Context API kết hợp với danh sách từ điển trong hệ thống (`locales`).
- **Giao diện sáng/tối**: `next-themes` điều khiển Dark Mode linh hoạt.

### Backend & Cơ Sở Dữ Liệu
- **Backend API**: Next.js App Router (Server Actions & Route Handlers).
- **Cơ sở dữ liệu**: Supabase (PostgreSQL) để lưu Invoices, Users, Logs.
- **Xác thực**: Supabase Auth (hỗ trợ Google OAuth).

### Công cụ Xử Lý & Xuất File
- **Xuất PDF**: Trình sinh PDF trực tiếp từ trình duyệt (`jspdf`, `html2canvas`, `html2pdf.js`).
- **Xuất Excel**: Thư viện `exceljs`.
- **Chữ ký điện tử**: `react-signature-canvas`.

### Công cụ Thanh Toán & Gửi Thu
- **Email Service**: Tích hợp SMTP/Brevo via `nodemailer`.
- **Thanh toán (Billing)**: Tích hợp với cổng Paddle (`paddle.ts`).

### Testing & Chất lượng mã nguồn
- **E2E Testing**: Tích hợp kiểm thử tự động với Playwright.
- **Swagger**: Cung cấp tài liệu API tự động qua `swagger-ui-react`.

---

## 2. Cấu Trúc Thư Mục Chính (Project Structure)

Dự án được triển khai theo mô hình thư mục Next.js App Router tiêu chuẩn nhưng được phân rã tính năng rất logic:

- **`app/`**: Chứa toàn bộ các Route, Layout và trang (Pages) của hệ thống.
  - `(marketing)/`, `about/`, `contact/`, `terms/`: Trang Public/Marketing Page cho website chính.
  - `api/`, `api-docs/`: Định nghĩa RESTful API và tài liệu (Swagger).
  - `dashboard/`: Bảng điều khiển chính cho người dùng đã đăng nhập (Thống kê Analytics, Cài đặt).
  - `invoice/`, `generator/`: Tạo và quản lý dữ liệu hoá đơn.
  - `pricing/`: Hiển thị bảng giá cho người dùng.
  - `share/`: Các liên kết (Public links) chia sẻ hóa đơn với khách hàng với phiên bản giới hạn thao tác.
- **`components/`**: Các mảnh Component giao diện có thể tái sử dụng. Nổi bật như: `auth-button.tsx`, `invoice-form.tsx`, `signature-pad-modal.tsx`, `upgrade-modal.tsx`.
- **`contexts/`**: Quản lý State toàn cục như Auth, Multi-language (i18n).
- **`docs/`**: Chứa bài giới thiệu, luồng xử lý hoặc cấu hình kịch bản (VD: markdown monetization).
- **`locales/`**: Chứa hàng chục tệp từ điển ngôn ngữ.
- **`supabase/`**: Thư mục quản lý Database Migrations. Theo dòng thời gian thiết lập các bảng users, invoices, logs, statuses.
- **`tests/`**: Kịch bản kiểm thử Tự động tích hợp sẵn với Playwright.
- **`types/`**: Khai báo kiểu dữ liệu cho TypeScript (invoices, client, company).
- **`utils/`**: Các Utility functions hỗ trợ backend và frontend: `export-excel.ts`, `generate-pdf.ts`, `email-service.ts`, config, vv.

---

## 3. Danh Sách Các Chức Năng Cốt Lõi (Core Features)

### 3.1. Quản Trị Hệ Thống & Người Dùng (Authentication)
- Đăng nhập/Đăng xuất bằng Google OAuth (qua thẻ tài khoản hiện đại ở header).
- Theo dõi phiên bản và thiết bị Đăng nhập (với file `login-logger.ts` lưu xuống bảng `user_login_logs`).
- Cài đặt Thông tin chung và Ảnh đại diện Tài khoản (thông qua bảng cài đặt Dashboard).

### 3.2. Quản Trị Công Ty & Khách Hàng (Company & Clients)
- Lưu cấu hình về Công ty Phát hành xuất Hoá đơn (với logo, tên, địa chỉ, thông tin chung).
- Module Modal nhập liệu dành riêng cho Công ty (`create-company-modal.tsx`, `edit-company-modal.tsx`).
- Lưu lại danh bạ Khách hàng (Nhập thông tin tên, địa chỉ, email một lần dùng dài lâu).

### 3.3. Tạo & Quản Trị Hóa Đơn (Invoice Engine)
- **Tạo Hóa đơn siêu tốc** (Generator mode): Không cần đăng nhập vẫn xem thử được nhưng muốn lưu hay thao tác sâu cần Account.
- Theo dõi vòng đời tình trạng Hóa đơn: Cấu trúc gồm `Draft` (Nháp), `Sent` (Đã Gửi), `Paid` (Đã Trả), `Overdue` (Quá Hạn).
- Chỉnh sửa trực tiếp trên giao diện Form (`invoice-form.tsx`): Nhập line item, Tax, Discount (Số tiền / %), Vận chuyển.
- Ký tên điện tử: Màn hình pop-up cho phép Khách/Chủ ký tay và lưu dạng hình ảnh.
- Quản lý đa tiền tệ toàn cầu (`CURRENCIES`).
- Nút chia sẻ hóa đơn Công khai qua link bảo mật (`share/`).

### 3.4. Thống Kê & Bảng Điều Khiển (Analytics)
- Bảng điều khiển xem toàn diện: Tổng Số Lượng Hóa đơn, Doanh thu trong tháng, số lượng dư nợ.
- Biểu đồ thống kê: Component `BarChart2` báo cáo chi phí tổng quát theo thời gian.

### 3.5. Hệ Thống Tự Động Gửi Email Nhắc Nhở (Cron Jobs Notifications)
- Cơ chế quét nền vào mỗi ngày (`api/cron/invoice-check/route.ts`): Tự động lấy danh sách hóa đơn theo trạng thái và Due Date.
- Hệ thống Email Notify gộp (`email-service.ts`): Báo cáo Admin khi có user mới. Báo cáo Tóm tắt tình trạng nợ cước dành cho Freelancer.

### 3.6. Xuất (Export/Download)
- Mẫu hóa đơn xem trước có thể ấn nút xuất ngay thành:
  - Bản cứng PDF (`generate-pdf.ts`).
  - File máy tính Excel (`export-excel.ts`).

### 3.7. Kế Hoạch Bán Hàng & Phân Quyền (Monetization / Subscription)
- Lớp kiểm soát Quyền năng (Entitlements): Check tài khoản xem đang dùng bản Miễn Phí (Free) hay Cao cấp (Pro/Premium).
- Modal thông minh hiện yêu cầu Nâng cấp Giới hạn khi user xài quá mức cho phép của tài khoản Miễn phí (`upgrade-modal.tsx`).
- Luồng thanh toán mượt mà do Paddle đảm nhận.

### 3.8. Các Tính Năng Bổ Trợ
- Đa dạng ngôn ngữ (Hỗ trợ cực mạnh từ Tiếng Việt, Tiếng Tây Ban Nha, Pháp, Thụy Điển đến Trung, Hàn, Nhật, vv.).
- Giao diện có sẵn Mode Tối / Mode Sáng theo ý thích của người dùng (`theme-toggle.tsx`).
- Hệ thống thông báo cảnh báo/lỗi (Confirm Modal & Success Modal).
