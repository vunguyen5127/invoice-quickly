# Tài Liệu Requirements & Phân Tích Cấu Trúc Dự Án — Invoice Quickly

> **Phiên bản tài liệu**: v2.0  
> **Cập nhật lần cuối**: 2026-03-21  
> **Trạng thái**: Đang phát triển (Active Development)

Tài liệu này tổng hợp toàn bộ cấu trúc dự án `invoice-quickly` cùng danh sách các tính năng (features), công nghệ được sử dụng, môi trường biến cấu hình, và lộ trình phát triển, dựa trên phân tích mã nguồn và cấu trúc thư mục thực tế.

---

## Mục Lục

1. [Tech Stack](#1-công-nghệ-ưu-tiên-tech-stack)
2. [Cấu Trúc Thư Mục](#2-cấu-trúc-thư-mục-chính-project-structure)
3. [Chức Năng Cốt Lõi](#3-danh-sách-các-chức-năng-cốt-lõi-core-features)
4. [Biến Môi Trường](#4-biến-môi-trường-environment-variables)
5. [Database Schema](#5-database-schema)
6. [API Endpoints](#6-api-endpoints)
7. [Luồng Người Dùng](#7-luồng-người-dùng-user-flows)
8. [Phân Quyền & Gói Dịch Vụ](#8-phân-quyền--gói-dịch-vụ-plans--entitlements)
9. [Lộ Trình Phát Triển](#9-lộ-trình-phát-triển-roadmap)

---

## 1. Công Nghệ Ưu Tiên (Tech Stack)

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|---------|
| Next.js | 16.1.6 | Framework chính – App Router |
| React | 19.2.3 | UI Library |
| Tailwind CSS | v4 | Styling (Glassmorphism, Dark Mode) |
| `lucide-react` | ^0.575.0 | Hệ thống icon |
| `next-themes` | ^0.4.6 | Dark/Light Mode toggle |
| `recharts` | ^3.8.0 | Biểu đồ thống kê (Analytics) |
| `date-fns` | ^4.1.0 | Xử lý ngày tháng |

### Backend & Cơ Sở Dữ Liệu
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|---------|
| Supabase JS | ^2.98.0 | Database client & Auth |
| PostgreSQL | (via Supabase) | Lưu trữ Invoices, Users, Logs |
| `pg` | ^8.19.0 | Direct DB connection (migrations) |
| Supabase Auth | — | Google OAuth, Session Management |

### Công cụ Xử Lý & Xuất File
| Công nghệ | Mục đích |
|-----------|---------|
| `jspdf` ^4.2.0 | Sinh PDF từ trình duyệt |
| `html2canvas` ^1.4.1 | Chụp màn hình HTML |
| `html2pdf.js` ^0.14.0 | Chuyển HTML → PDF |
| `html-to-image` ^1.11.13 | Xuất ảnh từ HTML |
| `exceljs` ^4.4.0 | Xuất file Excel |
| `react-signature-canvas` ^1.1.0-alpha.2 | Ký tên điện tử |

### Thanh Toán & Email
| Công nghệ | Mục đích |
|-----------|---------|
| Paddle | Billing & Subscription (paddle.ts) |
| `nodemailer` ^8.0.2 | Gửi email SMTP (via Brevo) |
| `uuid` ^13.0.0 | Tạo ID duy nhất |

### Testing & Chất Lượng
| Công nghệ | Mục đích |
|-----------|---------|
| Playwright ^1.58.2 | E2E Testing |
| ESLint ^9 + `eslint-plugin-unused-imports` | Code quality |
| `next-swagger-doc` + `swagger-ui-react` | Tài liệu API tự động |

### Công Cụ Hỗ Trợ Development
| Công nghệ | Mục đích |
|-----------|---------|
| TypeScript ^5 | Type safety toàn bộ dự án |
| `@tailwindcss/postcss` | PostCSS integration |
| Git Hooks (custom) | Pre-commit hooks (scripts/install-git-hooks.mjs) |

---

## 2. Cấu Trúc Thư Mục Chính (Project Structure)

```
invoice-quickly/
├── app/                        # Next.js App Router
│   ├── (marketing)/            # Landing pages (public)
│   ├── about/                  # Trang Giới thiệu
│   ├── actions/                # Shared Server Actions
│   ├── admin/                  # Trang quản trị nội bộ
│   ├── api/
│   │   ├── cron/               # Cron job: kiểm tra hóa đơn hàng ngày
│   │   ├── docs/               # Swagger API schema
│   │   └── paddle/             # Webhook Paddle (billing events)
│   ├── api-docs/               # Trang giao diện Swagger UI
│   ├── auth/                   # Callback xác thực OAuth
│   ├── company/                # Quản lý thông tin Công ty
│   ├── contact/                # Trang liên hệ
│   ├── dashboard/
│   │   ├── analytics/          # Trang Analytics & thống kê
│   │   ├── settings/           # Cài đặt tài khoản người dùng
│   │   └── page.tsx            # Dashboard chính (danh sách hóa đơn)
│   ├── generator/              # Tạo hóa đơn không cần đăng nhập
│   ├── invoice/                # Xem / Chỉnh sửa hóa đơn
│   ├── login/                  # Trang đăng nhập
│   ├── pricing/                # Bảng giá & gói dịch vụ
│   ├── privacy-policy/         # Chính sách bảo mật
│   ├── refund-policy/          # Chính sách hoàn tiền
│   ├── share/                  # Xem hóa đơn chia sẻ công khai
│   ├── terms/                  # Điều khoản dịch vụ
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   ├── manifest.ts             # PWA manifest
│   ├── opengraph-image.tsx     # OG image metadata
│   ├── robots.ts               # SEO robots
│   └── sitemap.ts              # SEO sitemap
│
├── components/                 # Reusable UI Components
│   ├── paddle/                 # Paddle billing components
│   ├── analytics-skeleton.tsx
│   ├── auth-button.tsx         # Login / Logout button
│   ├── breadcrumbs.tsx
│   ├── client-metadata.tsx
│   ├── confirm-modal.tsx
│   ├── copy-email-button.tsx
│   ├── create-company-modal.tsx
│   ├── create-invoice-skeleton.tsx
│   ├── dashboard-skeleton.tsx
│   ├── edit-company-modal.tsx
│   ├── invoice-form.tsx        # Form tạo/sửa hóa đơn (~44KB)
│   ├── invoice-preview.tsx     # Preview hóa đơn
│   ├── language-toggle.tsx
│   ├── log-user-session.tsx
│   ├── marketing-components.tsx
│   ├── marketing-template.tsx
│   ├── plan-badge.tsx
│   ├── signature-pad-modal.tsx
│   ├── site-footer.tsx
│   ├── site-header.tsx
│   ├── success-modal.tsx
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   ├── tooltip.tsx
│   └── upgrade-modal.tsx
│
├── contexts/                   # Global State (Auth, i18n)
├── data/                       # Static data (currencies, etc.)
├── docs/                       # Tài liệu dự án
├── lib/                        # Shared libraries / helpers
├── locales/                    # File từ điển đa ngôn ngữ
├── scripts/                    # Utility scripts (migration, git hooks)
├── supabase/                   # DB Migrations
├── tests/                      # Playwright E2E tests
├── types/                      # TypeScript type definitions
└── utils/                      # Utility functions
    ├── config.ts               # App configuration (URL, env vars)
    ├── email-service.ts        # Email sending logic
    ├── entitlements.ts         # Kiểm tra quyền Free/Pro
    ├── export-excel.ts         # Xuất Excel
    ├── generate-pdf.ts         # Xuất PDF
    ├── image-utils.ts          # Xử lý ảnh
    ├── login-logger.ts         # Ghi log phiên đăng nhập
    ├── paddle.ts               # Paddle billing integration
    ├── supabase/               # Supabase client (server/client)
    ├── tester.ts               # Testing utilities
    └── url.ts                  # Centralized URL/host config
```

---

## 3. Danh Sách Các Chức Năng Cốt Lõi (Core Features)

### 3.1. Xác Thực & Quản Lý Người Dùng
- Đăng nhập / Đăng xuất qua **Google OAuth** (Supabase Auth).
- Tự động redirect sau auth callback (`/auth/`).
- Ghi log phiên đăng nhập theo thiết bị (`login-logger.ts` → bảng `user_login_logs`).
- Cài đặt hồ sơ: Tên hiển thị, ảnh đại diện (dashboard settings).

### 3.2. Quản Trị Công Ty & Khách Hàng
- Cấu hình thông tin Công ty phát hành hóa đơn: logo, tên, địa chỉ, thông tin liên lạc.
- Modal CRUD công ty: `create-company-modal.tsx`, `edit-company-modal.tsx`.
- Lưu danh bạ khách hàng: tên, địa chỉ, email để tái sử dụng.
- Trang quản lý công ty riêng biệt (`/company/`).

### 3.3. Tạo & Quản Trị Hóa Đơn (Invoice Engine)
- **Generator Mode** (`/generator/`): Dùng thử không cần đăng nhập; cần tài khoản để lưu.
- **Vòng đời hóa đơn**: `Draft` → `Sent` → `Paid` / `Overdue`.
- **Invoice Form** (`invoice-form.tsx`): Nhập line items, Tax, Discount (số tiền / %), phí vận chuyển.
- **Ký tên điện tử**: Pop-up cho phép ký tay, lưu ảnh chữ ký (`signature-pad-modal.tsx`).
- **Đa tiền tệ**: Hỗ trợ nhiều đơn vị tiền tệ toàn cầu.
- **Chia sẻ công khai**: Link bảo mật dạng `/share/[id]` để khách hàng xem hóa đơn.
- **Invoice Preview**: Xem trước hóa đơn dạng in (`invoice-preview.tsx`).
- **Danh sách hóa đơn**: Bộ lọc, tìm kiếm trên Dashboard.

### 3.4. Thống Kê & Phân Tích (Analytics)
- Dashboard tổng quan: Tổng hóa đơn, Doanh thu tháng, Số dư nợ quá hạn.
- Biểu đồ doanh thu theo thời gian (Recharts `BarChart`).
- Các KPI cards với hiệu ứng Glassmorphism.
- Trang Analytics riêng (`/dashboard/analytics/`).
- Export dữ liệu biểu đồ ra CSV.

### 3.5. Tự Động Gửi Email & Cron Jobs
- **Cron Job** hàng ngày (`/api/cron/invoice-check/`): Quét hóa đơn theo trạng thái & Due Date.
- **Email Notifications** (qua `email-service.ts` + Brevo SMTP):
  - Thông báo Admin khi có user mới đăng ký.
  - Email tóm tắt tình trạng nợ gửi cho Freelancer.
  - Email nhắc nhở thanh toán gửi đến client.

### 3.6. Xuất File (Export / Download)
- Xuất hóa đơn dạng **PDF** (`generate-pdf.ts` + jspdf/html2canvas).
- Xuất dữ liệu dạng **Excel** (`export-excel.ts` + exceljs).
- Xuất ảnh từ HTML (`html-to-image`).

### 3.7. Monetization & Phân Quyền
- **Gói dịch vụ**: `Free` và `Pro/Premium`.
- **Kiểm soát entitlement** (`entitlements.ts`): Giới hạn số hóa đơn, tính năng theo gói.
- **Upgrade Modal** (`upgrade-modal.tsx`): Hiện khi user vượt giới hạn Free.
- **Paddle Integration**: Xử lý thanh toán, webhook sự kiện billing (`/api/paddle/`).
- **Plan Badge**: Hiển thị gói hiện tại của user.

### 3.8. SEO & Marketing
- Sitemap tự động (`/app/sitemap.ts`).
- Robots.txt (`/app/robots.ts`).
- OpenGraph image (`/app/opengraph-image.tsx`).
- PWA Manifest (`/app/manifest.ts`).
- Trang Marketing: Landing page, About, Contact, Pricing, Terms, Privacy Policy, Refund Policy.

### 3.9. Các Tính Năng Hỗ Trợ
- **Đa ngôn ngữ**: Tiếng Việt, Anh, Tây Ban Nha, Pháp, Thụy Điển, Trung, Hàn, Nhật, v.v.
- **Dark / Light Mode** (`theme-toggle.tsx` + `next-themes`).
- **Admin Panel** (`/admin/`): Trang nội bộ quản trị hệ thống.
- **API Documentation**: Swagger UI tại `/api-docs/`.
- **Toast / Modal thông báo**: `confirm-modal.tsx`, `success-modal.tsx`.
- **Breadcrumbs**: Điều hướng phân cấp (`breadcrumbs.tsx`).
- **Skeleton Loading**: UX placeholder khi tải dữ liệu.

---

## 4. Biến Môi Trường (Environment Variables)

> File cấu hình: `.env.local`

| Biến | Bắt buộc | Mô tả |
|------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL của Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Public anon key của Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role key (server-side only) |
| `NEXT_PUBLIC_SITE_URL` | ✅ | URL chính của ứng dụng (VD: `https://invoice-quickly.com`) |
| `SMTP_HOST` | ✅ | Host SMTP (VD: smtp-relay.brevo.com) |
| `SMTP_PORT` | ✅ | Port SMTP (VD: 587) |
| `SMTP_USER` | ✅ | Username SMTP |
| `SMTP_PASS` | ✅ | Password / API key SMTP |
| `SMTP_FROM` | ✅ | Email người gửi |
| `PADDLE_API_KEY` | ✅ | API key Paddle |
| `PADDLE_WEBHOOK_SECRET` | ✅ | Secret xác thực webhook Paddle |
| `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` | ✅ | Client token Paddle (frontend) |
| `CRON_SECRET` | ✅ | Secret bảo vệ cron API endpoint |
| `ADMIN_SECRET` | ⚠️ | Secret truy cập Admin panel |

---

## 5. Database Schema

> Migrations tại: `supabase/migrations/`

| Bảng | Mô tả chính |
|------|-----------|
| `users` | Thông tin hồ sơ người dùng (sync từ Supabase Auth) |
| `invoices` | Dữ liệu hóa đơn: items, tax, discount, trạng thái, due date |
| `clients` | Danh bạ khách hàng của từng user |
| `companies` | Thông tin công ty phát hành hóa đơn |
| `user_login_logs` | Lịch sử phiên đăng nhập (IP, device, timestamp) |
| `subscriptions` | Thông tin gói dịch vụ (Paddle sync) |

---

## 6. API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/cron/invoice-check` | Cron job kiểm tra hóa đơn (protected by `CRON_SECRET`) |
| POST | `/api/paddle/webhook` | Nhận webhook events từ Paddle |
| GET | `/api/docs` | Schema Swagger JSON |
| GET | `/share/[id]` | Xem hóa đơn công khai (public, read-only) |

---

## 7. Luồng Người Dùng (User Flows)

### Luồng Tạo Hóa Đơn (Đã Đăng Nhập)
```
Login → Dashboard → "Tạo Hóa Đơn" → Invoice Form → Preview → [Lưu / Xuất PDF / Gửi Email / Chia Sẻ Link]
```

### Luồng Dùng Thử (Không Đăng Nhập)
```
Landing Page → Generator → Điền thông tin → Preview → Prompt đăng nhập để lưu
```

### Luồng Nâng Cấp Pro
```
Dùng tính năng Pro → Upgrade Modal → Pricing Page → Paddle Checkout → Webhook → Kích hoạt Pro
```

### Luồng Cron Job Email
```
Vercel Cron (hàng ngày) → /api/cron/invoice-check → Lấy hóa đơn quá hạn → Gửi email nhắc nhở
```

---

## 8. Phân Quyền & Gói Dịch Vụ (Plans & Entitlements)

| Tính năng | Free | Pro |
|-----------|------|-----|
| Số hóa đơn | Giới hạn | Không giới hạn |
| Xuất PDF | ✅ | ✅ |
| Xuất Excel | ❌ | ✅ |
| Chia sẻ link công khai | ✅ | ✅ |
| Analytics nâng cao | ❌ | ✅ |
| Email nhắc nhở tự động | ❌ | ✅ |
| Chữ ký điện tử | ✅ | ✅ |
| Quản lý đa công ty | ❌ | ✅ |

> Chi tiết giới hạn xem tại: `utils/entitlements.ts`

---

## 9. Lộ Trình Phát Triển (Roadmap)

### ✅ Đã Hoàn Thành
- [x] Hệ thống xác thực Google OAuth
- [x] CRUD Hóa đơn đầy đủ
- [x] Xuất PDF và Excel
- [x] Chia sẻ hóa đơn qua link công khai
- [x] Email cron job nhắc nhở
- [x] Tích hợp Paddle (thanh toán)
- [x] Analytics Dashboard
- [x] Đa ngôn ngữ
- [x] Dark/Light Mode
- [x] SEO cơ bản (sitemap, robots, OG)
- [x] E2E Testing với Playwright
- [x] API Documentation (Swagger)

### 🚧 Đang Triển Khai / Cần Nghiên Cứu
- [ ] Tối ưu hóa hiệu suất PDF export (client-side bottleneck)
- [ ] Offline support / PWA caching
- [ ] Bulk actions cho hóa đơn (xóa nhiều, thay đổi trạng thái hàng loạt)
- [ ] Template hóa đơn tùy chỉnh (nhiều mẫu thiết kế)
- [ ] Thống kê nâng cao: so sánh tháng-qua-tháng, dự báo doanh thu

### 💡 Tính Năng Đề Xuất Tương Lai
- [ ] Nhắc nhở hóa đơn qua SMS / WhatsApp
- [ ] Tích hợp thanh toán trực tiếp (Stripe, PayPal link trong hóa đơn)
- [ ] Import hóa đơn từ CSV / Excel
- [ ] Mobile App (React Native hoặc PWA cải tiến)
- [ ] Webhooks outbound (cho tích hợp bên thứ ba)
- [ ] Recurring invoices (hóa đơn định kỳ tự động)

---

## Scripts Hữu Ích

```bash
# Development
npm run dev                    # Chạy dev server

# Database
npm run db:migrate             # Áp dụng migrations DB

# Testing
npm run test:e2e               # Chạy E2E tests
npm run test:e2e:headed        # Chạy với browser hiện thị
npm run test:e2e:ui            # Chạy với Playwright UI

# Khác
npm run hooks:install          # Cài đặt git hooks
npm run lint                   # Kiểm tra code quality
```

---

*Tài liệu này phản ánh trạng thái hiện tại của codebase và sẽ được cập nhật theo từng chu kỳ phát triển.*
