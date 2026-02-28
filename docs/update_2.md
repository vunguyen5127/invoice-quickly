REFactor INVOICE EDITOR LAYOUT – REMOVE HEAVY GRID & NESTED CARDS

Context:
Current invoice editor layout uses:
- Multiple nested cards
- Large grid gaps
- Vertical divider between "From" and "To"
- Heavy padding + shadow stacking

Problem:
- Layout feels bulky
- Too much empty space
- Sections look disconnected
- Feels like 2019 SaaS style
- Grid consumes unnecessary space

Goal:
Make layout cleaner, more modern, minimal SaaS style (Stripe / Linear vibe).
Reduce visual noise and unnecessary containers.
Do NOT redesign functionality — only refactor layout & spacing.


========================================
1. REMOVE NESTED CARD STRUCTURE
========================================

Current:
Main container
  → Card: Invoice Details
  → Card: From
  → Card: To

Update to:

Single clean main container (white background, no heavy shadow)

Sections inside should:
- NOT use separate card backgrounds
- NOT use box shadow
- NOT use extra border radius
- Use spacing + divider lines instead


========================================
2. REMOVE VERTICAL DIVIDER BETWEEN FROM / TO
========================================

Instead of:
Two separate cards with vertical border

Use:
Single section titled: "Billing Information"

Inside:
2-column grid layout

Left column:
- From (Your Details)

Right column:
- To (Client Details)

No vertical divider line.
Use spacing (gap-6 or gap-8) only.


========================================
3. REDUCE EXCESSIVE SPACING
========================================

Adjust spacing:

- Section padding: reduce from ~24px → 16px
- Grid gap: reduce from ~24px → 16px
- Remove unnecessary empty margin on right side
- Keep consistent spacing scale (4 / 8 / 16 / 24 system)

Avoid large empty whitespace areas.


========================================
4. SIMPLIFY INVOICE DETAILS SECTION
========================================

Keep:

Invoice Details
──────────────

Under it:
Single horizontal row:
Invoice Number | Issue Date | Due Date

No card box.
Just clean section with subtle bottom divider.


========================================
5. TYPOGRAPHY HIERARCHY IMPROVEMENT
========================================

Section Titles:
- Slightly larger font
- Font weight 600–700
- Add subtle bottom border (1px neutral gray)

Labels:
- Slightly smaller
- Medium weight

Avoid too many borders around inputs.
Use softer input styling.


========================================
6. OVERALL VISUAL STYLE
========================================

- Minimalist SaaS aesthetic
- Very subtle or no shadows
- Light neutral background (#f9fafb or similar)
- Main content white
- Consistent border radius
- No heavy container stacking

Make layout feel lighter and more breathable.


========================================
7. KEEP RESPONSIVENESS
========================================

Desktop:
- Editor left
- Preview right

Mobile:
- Stack vertically
- Keep clean section spacing


========================================
IMPORTANT
========================================

Do NOT:
- Add new features
- Change logic
- Change form structure

Only refactor layout & spacing to:
- Remove grid heaviness
- Remove nested card look
- Make it feel modern and minimal

END REQUEST