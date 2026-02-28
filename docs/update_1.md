UPDATE EXISTING INVOICE EDITOR UI

Context:
We already have a working invoice editor page with:
- Left side: Form (Invoice Details, From, To, Line Items, Totals & Notes)
- Right side: Live Preview
- Header with Logo + Sign In + Save + Download PDF

Goal:
Improve UX, visual hierarchy, SaaS feel, and monetization readiness.
DO NOT rebuild from scratch.
Refactor and polish existing UI.


========================================
1. IMPROVE VISUAL HIERARCHY
========================================

- Reduce visual heaviness of left form.
- Make section titles more distinct:
    - Increase font weight
    - Slightly larger font size
    - Add subtle divider below section title
- Reduce border contrast on form inputs (so it looks cleaner).
- Add slightly different background tone between major form sections.

- Increase emphasis on "Total Due" in preview:
    - 15% larger font
    - Slightly darker text
    - Light background highlight box


========================================
2. MAKE LOWER SECTIONS COLLAPSIBLE
========================================

Convert the following sections into accordion style:
- Notes
- Terms & Conditions
- Signature

Default state:
- Collapsed
- Expand on click

Reason:
Reduce vertical scrolling and cognitive overload.


========================================
3. IMPROVE LINE ITEMS UX
========================================

Enhance usability:
- Press Enter → auto add new row
- Auto focus next input on Tab
- Add subtle hover effect on row
- Improve delete icon visibility on hover only
- Make rate input right-aligned

Optional:
Add subtle row highlight when editing.


========================================
4. LOGO UPLOAD IMPROVEMENT
========================================

- Increase logo upload box size
- Show preview immediately after upload
- Add "Remove logo" button
- Rounded corners slightly larger


========================================
5. SAVE FLOW UX IMPROVEMENT
========================================

If user NOT logged in:
- Save button should:
    - Still visible
    - On click → open modal
    - Modal text:
        "Create a free account to save and manage your invoices."
    - Buttons:
        [Sign In]
        [Create Account]

Do NOT disable Save button.
Use conversion-driven modal.


========================================
6. WATERMARK LOGIC (MONETIZATION READY)
========================================

If user NOT logged in:
- Add subtle watermark in preview bottom area:
    "Created with InvoiceQuickly"

Opacity low (20%)
Small font
Not intrusive

If logged in:
- Remove watermark


========================================
7. HEADER IMPROVEMENT
========================================

Header should include:

Left:
- Logo
- If logged in:
    - Company dropdown selector (future-ready)
    - "+ New Company" option inside dropdown

Right:
- Dark/Light toggle
- Save button
- Download PDF button
- Profile avatar if logged in
- Sign In if not logged in

Make header slightly elevated with subtle shadow.


========================================
8. PREVIEW AREA IMPROVEMENT
========================================

- Reduce dotted background opacity by 30%
- Add subtle shadow around invoice paper
- Slight scale animation on preview update (very subtle, 100ms)


========================================
9. RESPONSIVE BEHAVIOR
========================================

Mobile:
- Form first
- Sticky bottom bar:
    - Save
    - Download PDF
- Preview collapsible below form

Tablet:
- Keep split layout if width allows


========================================
10. DESIGN STYLE GUIDELINES
========================================

- Keep minimalist SaaS aesthetic
- Avoid heavy gradients
- Use neutral gray palette
- Accent color: blue (primary actions)
- Border radius: consistent (medium rounded)
- Clean typography hierarchy
- No excessive animations


========================================
IMPORTANT
========================================

Do NOT:
- Add subscription logic
- Add billing
- Add complex analytics
- Overcomplicate layout

Focus on:
- Polished SaaS look
- Better UX
- Conversion readiness
- Multi-company future-ready structure

END OF UPDATE REQUEST