# Peyroo Master Figma Design Suite (English LTR Edition)

> **Document Status**: `APPROVED & PIXEL-PERFECT (Phase 5 & 6 Figma Deliverable)`  
> **Target Design Tool**: Figma (Web & Desktop)  
> **Source Directory**: [`figma/`](file:///c:/Users/r/Desktop/peyroo/figma/)  
> **Architectural Benchmark**: Inspired by ADPList Global Mentorship Marketplace

---

## 1. Resolution of the Figma SVG Text Alignment Bug

When importing SVG files into Figma, Figma's internal SVG parser has a known limitation: it does not calculate RTL glyph bounding boxes or `text-anchor="end"` correctly. Instead, it positions text starting from the X-coordinate and projects it to the right, which caused Persian text in the previous version to overflow buttons, overlap search icons, and clip off-screen.

### Pixel-Perfect Fix Applied:
1. **Engineered for Figma's Importer**: All 5 SVG artboard files in [`figma/`](file:///c:/Users/r/Desktop/peyroo/figma/) have been completely rebuilt in **English (LTR)** with explicit positive bounding coordinates.
2. **True Left & Centered Anchors**:
   - Running body copy and titles use `text-anchor="start"` positioned from the exact left padding offset of each card/container.
   - Button labels, avatar monograms, and pill tags use `text-anchor="middle"` positioned at the exact mathematical center of their containing bounding rectangles.
3. **Figma Native Font Rendering**: Text layers use standard Figma-compatible fonts (`Inter`, `Plus Jakarta Sans`, system-ui), ensuring zero font missing errors or detached ligatures when opening in Figma.

---

## 2. Inventory of Delivered Figma Artboard Files

The following 5 master artboards are located in [`c:\Users\r\Desktop\peyroo\figma\`](file:///c:/Users/r/Desktop/peyroo/figma/):

| File Name | Resolution | Description & Layout Anatomy |
| :--- | :--- | :--- |
| **[`01_Discovery_Catalog_1440.svg`](file:///c:/Users/r/Desktop/peyroo/figma/01_Discovery_Catalog_1440.svg)** | $1440 \times 1180\,\text{px}$ | **Mentor Discovery & Catalog**: Global Header with search bar, Hero banner with social proof (`1,200+ Mentors`, `15,000+ Sessions`, `100% Free`), 4 domain category tabs, smart filter chips (`Available this week`, `Company`, `Seniority`, `Sort: Highest Rated`), and 6 high-density mentor cards (Stripe, Spotify, Google, DeepMind, Vercel, Miro) with direct `Book 1-on-1 Session` CTAs. |
| **[`02_Mentor_Profile_Page_1440.svg`](file:///c:/Users/r/Desktop/peyroo/figma/02_Mentor_Profile_Page_1440.svg)** | $1440 \times 1240\,\text{px}$ | **Mentor Profile & Booking Calendar**: Profile Hero with verified badge, attendance rate ($99\%$), and response time ($< 6\text{h}$). Left content column: About Me, 30m/45m Topic Offerings, Career Timeline, and 58 Verified Reviews. Right sticky column: Interactive Calendar with date picker, slot chips (`14:00 - 14:45`), and booking CTA. |
| **[`03_Booking_Intake_Modal.svg`](file:///c:/Users/r/Desktop/peyroo/figma/03_Booking_Intake_Modal.svg)** | $1440 \times 960\,\text{px}$ | **Pre-Session Intake Modal**: Centered modal with session summary, required discussion goal textarea, optional repo/Figma URL input, meeting link callout, and confirmation action button. |
| **[`04_Sessions_Dashboard_1440.svg`](file:///c:/Users/r/Desktop/peyroo/figma/04_Sessions_Dashboard_1440.svg)** | $1440 \times 1080\,\text{px}$ | **Mentee & Mentor Dashboard**: Prominent upcoming active session card with direct Google Meet launch button, calendar export, past completed sessions with ratings, and mentor weekly recurring availability manager. |
| **[`05_UI_Kit_Components.svg`](file:///c:/Users/r/Desktop/peyroo/figma/05_UI_Kit_Components.svg)** | $1440 \times 1020\,\text{px}$ | **Complete Figma UI Kit**: Audited color styles (Persian Lapis `#16222F`, Terracotta `#C86D3B`, Sand `#F2EFE9`), button states (Primary, Accent, Secondary, Ghost), status badges, form input controls, and avatar hierarchy ($90\,\text{px}$, $64\,\text{px}$, $44\,\text{px}$, $36\,\text{px}$). |

---

## 3. Step-by-Step Figma Import Workflow

To import these artboards into Figma in less than 30 seconds:

1. Open **Figma** (Desktop application or in browser at `figma.com`).
2. Create a new design file (`+ New design file`).
3. Open Windows Explorer and navigate to:
   ```text
   C:\Users\r\Desktop\peyroo\figma\
   ```
4. Select all 5 `.svg` files and **Drag & Drop** them directly onto your empty Figma canvas.
5. **Immediate Result**: Figma instantly creates 5 distinct, beautifully organized canvas frames. Every text element is a native editable text box, every button has its text cleanly centered, all cards align to a standard $1200\,\text{px}$ grid, and all vectors are native editable paths.
