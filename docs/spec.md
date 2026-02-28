PROJECT NAME: Invoice Quickly

STACK:
- NextJS 14 (App Router)
- TailwindCSS
- Supabase (Postgres + Auth)
- Vercel deployment
- @react-pdf/renderer for PDF export

GOAL:
- Landing page SEO optimized
- Create invoice WITHOUT login
- If user wants to save & see history → require login
- Clean modern UI
- MVP lean, no subscription yet


========================================
ROUTE STRUCTURE
========================================

/                     → Landing page
/generator            → Invoice generator (public)
/login                → Login page
/dashboard            → User dashboard (protected)
/invoice/[id]         → View saved invoice (protected)
/api/save             → Save invoice (auth required)
/api/export           → Generate PDF


========================================
LANDING PAGE (/)
========================================

Hero Section:
- H1: Free Invoice Generator – Create & Download PDF Instantly
- Subtext: No signup required. Generate professional invoices in seconds.
- CTA Button → /generator

Features Section:
- No signup required
- Instant PDF download
- Multi-currency support
- Save invoices with account
- Clean modern design

How It Works Section:
1. Enter details
2. Preview invoice
3. Download PDF
4. Optional: Save with account

SEO Content Section:
~800–1200 words including:
- What is an invoice
- How to create invoice
- What to include in invoice
- Benefits of using online invoice generator


========================================
GENERATOR PAGE (/generator)
========================================

Layout:
- 2 column layout (desktop)
  Left → Form
  Right → Live Preview

Mobile:
- Form on top
- Preview below

----------------------------------------
FORM FIELDS
----------------------------------------

Seller Info:
- Business Name
- Email
- Address

Client Info:
- Client Name
- Email
- Address

Invoice Info:
- Invoice Number (auto-generate)
- Issue Date
- Due Date
- Currency (dropdown)
- Tax %

Line Items (dynamic add/remove):
- Description
- Quantity
- Unit Price
- Line Total (auto calc)

----------------------------------------
CALCULATION LOGIC
----------------------------------------

subtotal = sum(quantity * unit_price)
taxAmount = subtotal * (taxPercent / 100)
total = subtotal + taxAmount

Live update preview when typing.

----------------------------------------
BUTTONS
----------------------------------------

- Download PDF
  → Works without login
  → Calls /api/export

- Save Invoice
  IF user NOT logged in:
      redirect to /login
      preserve form data in localStorage
  IF logged in:
      call /api/save
      redirect to /dashboard


========================================
AUTH SYSTEM
========================================

Use Supabase Auth:
- Email + Password
- Google OAuth

Login Flow:
- After login → redirect back to previous page
- If came from Save action → auto save draft

Middleware:
- Protect /dashboard
- Protect /invoice/[id]


========================================
DATABASE DESIGN (Supabase)
========================================

Table: invoices

Columns:
- id (uuid, primary key)
- user_id (uuid, foreign key)
- invoice_number (text)
- seller_info (jsonb)
- client_info (jsonb)
- items (jsonb)
- subtotal (numeric)
- tax (numeric)
- total (numeric)
- currency (text)
- created_at (timestamp, default now())

Row Level Security:
Policy:
User can only select/update/delete where user_id = auth.uid()


========================================
DASHBOARD (/dashboard)
========================================

Protected route.

Display table:
- Invoice Number
- Client Name
- Total
- Currency
- Created Date
- View Button
- Delete Button

Optional:
- Duplicate button


========================================
INVOICE VIEW PAGE (/invoice/[id])
========================================

- Show invoice preview
- Download PDF button
- Delete button
- Back to dashboard


========================================
PDF GENERATION
========================================

Use @react-pdf/renderer.

PDF includes:
- Seller info
- Client info
- Items table
- Subtotal
- Tax
- Total
- Footer

Future monetization hook:
- If not logged in → include watermark:
  "Created with Invoice Quickly"


========================================
STATE MANAGEMENT
========================================

- Use React state for form
- Save draft in localStorage
- Restore draft on page load


========================================
ENV VARIABLES
========================================

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=


========================================
DEPLOYMENT
========================================

1. Push to GitHub
2. Connect to Vercel
3. Add env variables
4. Deploy
5. Attach custom domain


========================================
MVP LIMITS (IMPORTANT)
========================================

DO NOT IMPLEMENT:
- Subscription
- Stripe billing
- Teams
- Multi-language
- Analytics
- Complex tax logic

Keep it minimal, clean, fast.


========================================
UX REQUIREMENTS
========================================

- Clean minimalist design
- Mobile responsive
- Fast loading
- No unnecessary animations
- Dark/Light theme toggle


========================================
MONETIZATION READY (PHASE 2)
========================================

Future:
- Remove watermark for logged-in users
- Premium plan:
    - Custom logo
    - Unlimited saves
    - No watermark

Do NOT build premium logic yet.


END OF SPEC