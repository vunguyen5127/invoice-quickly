UPDATED PROJECT SPEC – Multi Company Support

STACK:
- NextJS 14 (App Router)
- TailwindCSS
- Supabase (Postgres + Auth)
- Vercel
- @react-pdf/renderer

GOAL:
- User có thể tạo invoice không cần login
- Nếu login:
    - User có thể tạo nhiều công ty
    - Mỗi công ty có nhiều invoices
    - Quản lý invoice theo từng công ty


========================================
DATABASE DESIGN (UPDATED)
========================================

Table: companies
- id (uuid, primary key)
- user_id (uuid, fk → auth.users)
- name (text)
- email (text)
- address (text)
- logo_url (text, nullable)
- created_at (timestamp default now())

----------------------------------------

Table: invoices
- id (uuid, primary key)
- company_id (uuid, fk → companies.id)
- user_id (uuid, fk → auth.users)
- invoice_number (text)
- client_info (jsonb)
- items (jsonb)
- subtotal (numeric)
- tax (numeric)
- total (numeric)
- currency (text)
- issue_date (date)
- due_date (date)
- created_at (timestamp default now())

----------------------------------------

RLS POLICIES:

companies:
User can SELECT/INSERT/UPDATE/DELETE
WHERE user_id = auth.uid()

invoices:
User can SELECT/INSERT/UPDATE/DELETE
WHERE user_id = auth.uid()


========================================
ROUTE STRUCTURE (UPDATED)
========================================

/                     → Landing
/generator            → Public invoice generator
/login                → Login
/dashboard            → Company selector page (protected)
/company/[id]         → Company dashboard (protected)
/company/[id]/new     → Create invoice under company
/invoice/[id]         → View invoice (protected)


========================================
USER FLOW
========================================

ANONYMOUS USER:
- Go to /generator
- Create invoice
- Download PDF
- Cannot save permanently

----------------------------------------

LOGGED IN USER:

STEP 1:
Go to /dashboard

If no companies:
→ Show "Create Your First Company"

If has companies:
→ Show list of companies

----------------------------------------

COMPANY DASHBOARD (/company/[id])

Show:
- Company info card (name, email, address)
- Button: Create Invoice
- List of invoices under this company

Columns:
- Invoice number
- Client name
- Total
- Date
- View
- Delete

----------------------------------------

CREATE INVOICE UNDER COMPANY

Route:
/company/[id]/new

Behavior:
- Seller info auto-filled from company
- User only enters:
    - Client info
    - Items
    - Tax
    - Dates

Save:
- Insert invoice with company_id + user_id


========================================
GENERATOR PAGE (PUBLIC)
========================================

Same as before but:

- No company
- Seller info manually entered
- Not stored unless user logs in


========================================
UX LOGIC
========================================

If logged in user opens /generator:

Option:
"Save this as Company Invoice"

→ Ask user:
Select company OR Create new company

----------------------------------------

LOCAL STORAGE

For anonymous:
- Save draft locally

For logged in:
- Allow saving to DB


========================================
DASHBOARD STRUCTURE
========================================

/dashboard

Display:
- List of companies
- Button: Create Company

Each company card:
- Company name
- Total invoices count
- Total revenue (sum invoices.total)
- View button


========================================
OPTIONAL (PHASE 2)
========================================

- Default company selector in navbar
- Switch company dropdown
- Company-level stats
- Custom logo per company
- Company settings page


========================================
IMPORTANT MVP LIMITS
========================================

DO NOT BUILD:
- Team access
- Multi-user per company
- Subscription
- Stripe billing
- Complex accounting

Keep it:
User → Multiple companies → Multiple invoices


========================================
FOLDER STRUCTURE (APP ROUTER)
========================================

app/
  layout.tsx
  page.tsx
  generator/page.tsx
  login/page.tsx
  dashboard/page.tsx
  company/
      [id]/
          page.tsx
          new/page.tsx
  invoice/
      [id]/page.tsx


END UPDATED SPEC