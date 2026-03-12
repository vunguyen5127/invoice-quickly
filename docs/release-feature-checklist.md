# Release Feature Checklist

Last updated: 2026-03-13

## Feature Matrix

| Feature | Route/UI | DB/BE lien quan | Muc hoan thien | Ghi chu |
|---|---|---|---|---|
| Landing + SEO | `/` | metadata, JSON-LD | Production-ready | Co schema WebApplication/FAQ/Breadcrumb, CTA ro |
| Public Invoice Generator | `/generator` | localStorage + PDF util | Production-ready | Dung duoc khong can login |
| Live invoice preview | `/generator`, `/company/[id]/new`, `/invoice/[id]/edit` | `components/invoice-preview.tsx` | Production-ready | Preview realtime, layout A4 |
| PDF download | Nhieu trang editor/view/share | `utils/generate-pdf.ts` | Production-ready | Co tren ca public/private flow |
| Auth Google OAuth | `/login`, `/auth/callback` | Supabase Auth | Production-ready | Co redirect `next`, logout, auth listener |
| Save invoice (logged-in) | `/generator` (modal chon company) | `invoices` + action save | Production-ready | Guest bi chan save va mo modal chuyen doi |
| View invoice rieng | `/invoice/[id]` | `getInvoiceById` | Production-ready | Co download/share/delete |
| Edit invoice | `/invoice/[id]/edit` | update action | Production-ready | Save update va quay lai company/dashboard |
| Public share link | `/share/[id]` | policy public select | MVP-ready | Hoat dong nhung policy dang `USING (true)` (can can nhac bao mat) |
| Multi-company dashboard | `/dashboard` | `companies` + join invoices | Production-ready | Create/edit/delete company |
| Company invoice list | `/company/[id]` | `getCompanyInvoices` | Production-ready | Search/sort/pagination/duplicate |
| Create invoice theo company | `/company/[id]/new` | `getCompanyById`, `getNextInvoiceNumber` | Production-ready | Auto-fill default company |
| Company defaults (currency/tax/terms...) | modal create/edit company | cot defaults trong `companies` | Production-ready | Ap dung khi tao invoice moi |
| Soft delete invoice | list/view actions | `invoices.deleted_at` | Production-ready | Khong xoa cung |
| Theme toggle | header/settings | `next-themes` | Production-ready | Light/dark/system |
| i18n da ngon ngu | global + editor | `locales/*`, context | Production-ready | 22 ngon ngu |
| Settings page | `/dashboard/settings` | session user | MVP-ready | Profile + preferences + logout |
| Admin login logs | `/admin` | `user_login_logs` + RLS | MVP-ready | Co thong ke, phan trang |
| Logging session tu dong | app root | `log-user-session.tsx` | Production-ready | Ghi log dang nhap co throttle 12h |
| Legal pages | `/privacy`, `/privacy-policy`, `/terms`, `/about`, `/contact` | static pages | Production-ready | Du cho public launch |
| Sitemap/robots | `/sitemap.xml`, `/robots.txt` | metadata routes | Production-ready | Co disallow route nhay cam |
| E2E tests | Playwright | `tests/*.spec.ts` | MVP-ready | Co test public/auth/company co ban |

## Go-Live Checklist (Recommended)

1. Siet lai policy public invoice share:
	- Khong dung `USING (true)`.
	- Chuyen sang co co che `is_public` hoac share token.
2. Bo sung test e2e full flow:
	- save -> view -> edit -> share -> soft delete.
3. Ra soat UX mobile:
	- sticky action bar.
	- guest save modal.
4. Chay full quality gate truoc deploy:
	- lint.
	- type-check.
	- e2e smoke.

## Suggested Next View (for Sprint Planning)

- Must-have: Bao mat share policy, regression test cho luong invoice chinh.
- Nice-to-have: Hoan thien settings/admin UX va test coverage rong hon.
- Risk: Public read policy qua rong neu de `USING (true)` trong production.
