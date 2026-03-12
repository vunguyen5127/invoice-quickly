# Playwright Testing Guide

## Muc tieu

Thiet lap regression tests de giam loi moi khi push code.

## Lenh su dung

- Cai browser Playwright (lan dau):
  - `npm run test:e2e:install`
- Chay full e2e local:
  - `npm run test:e2e`
- Chay voi UI mode:
  - `npm run test:e2e:ui`
- Chay co browser hien thi:
  - `npm run test:e2e:headed`

## Tu dong truoc moi lan push

Cai pre-push hook:

- `npm run hooks:install`

Sau khi cai, moi lan `git push` se tu dong chay `npm run test:e2e`.
Neu fail, push se bi chan de tranh day loi len remote.

## CI tu dong

Workflow da duoc them:

- `.github/workflows/playwright.yml`

Nghia la moi `push` va `pull_request` deu chay Playwright tren GitHub Actions.

## Pham vi test hien tai

- Public pages + SEO endpoints (`robots.txt`, `sitemap.xml`)
- Generator flow co ban
- Redirect khi chua login
- Dashboard/Settings voi session gia lap
- Cac test cu trong `tests/*.spec.ts` van duoc giu va chay cung

## Mo rong tiep

Khi them tinh nang moi, them test theo nhom:

- `tests/regression-<feature>.spec.ts`

Uu tien test theo user journey:

1. Tao invoice
2. Save invoice
3. View/Edit/Delete invoice
4. Company management
5. Share public invoice
