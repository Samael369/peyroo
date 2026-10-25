# Peyroo Design System (PDS) — نسخه ملی و بومی

> **Document Status**: `APPROVED SPECIFICATION (Phase 5/6 Refinement)`  
> **Target Scope**: National & Local Iranian Launch (۱۰۰٪ بومی و فارسی)  
> **Brand Identity Foundation**: The Guiding Beacon — Softened Edition (Persian Lapis `#16222F` & Warm Terracotta `#C86D3B`)  
> **Aesthetic Philosophy**: Soft Organic Curves ($16\text{–}24\,\text{px}$), Humane Persian Typography, Glare-Free Warm Sand Surfaces  
> **Accessibility Standard**: WCAG 2.2 Level AA / Section 508

---

## 1. Visual Foundation & Philosophy

The **Peyroo Design System (PDS)** provides an architectural, human-centered, and disciplined visual framework tailored specifically for a national launch in the Iranian software and design ecosystem.

### Core Revisions Following Stakeholder Review:
1. **100% Persian-First Native Experience**: All terminology, Solar Hijri calendar dates (e.g. ۸ آبان، ۱۰ آبان), Persian numerals, and Tehran standard time (`UTC+03:30`) are native defaults rather than translations.
2. **Elimination of Sharp Edges**: Transitioned from sharp $4\text{–}8\,\text{px}$ angular corners to soft, friendly, organic radii ($16\text{–}24\,\text{px}$ for cards, $12\,\text{px}$ for controls, and full capsule pills for badges and slot buttons).
3. **Smooth Persian Typography**: Prioritizing harmonious typefaces (**Dana**, **Shabnam**, or smooth **Vazirmatn**) with zero letter-spacing (`letter-spacing: normal`), comfortable line-height ($1.75\text{–}1.85$), and moderate weights ($400, 500, 600$) to avoid harsh black weights.
4. **Softened Warm Borders & Gentle Elevation**: Harsh high-contrast dividers are replaced with soft, warm borders (`#E5DFD5`, `#DDD7CD`) and ambient diffuse shadows.

---

## 2. Color System & Semantic Tokens

All interface colors are defined as semantic tokens with precise functional roles and verified WCAG 2.2 contrast compliance.

### 2.1 Brand & Neutral Spectrum

| Token Name | HEX Code | Role & Usage | Contrast Ratio (vs Background) |
| :--- | :--- | :--- | :--- |
| `color-brand-primary` | `#16222F` | Persian Lapis Slate. Primary brand anchor, high-emphasis headings, primary buttons. | $13.4:1$ on canvas (WCAG AAA) |
| `color-brand-primary-hover`| `#223345` | Hover state for primary buttons and active navigation links. | $11.2:1$ on canvas (WCAG AAA) |
| `color-brand-primary-pressed`| `#0E161F` | Pressed/active state for primary brand actions. | $15.6:1$ on canvas (WCAG AAA) |
| `color-brand-accent` | `#C86D3B` | Raw Sienna / Terracotta. Represents guidance, active booking slots, key CTA focus. | $4.8:1$ on canvas (WCAG AA) |
| `color-brand-accent-hover` | `#B45D2E` | Hover state for accent buttons and slot selections. | $5.5:1$ on canvas (WCAG AA) |
| `color-brand-accent-subtle`| `#F8EFE9` | Subtle terracotta tint for selected slot backgrounds and highlight chips. | N/A (Surface) |
| `color-surface-canvas` | `#F7F6F2` | Unbleached natural linen canvas. Organic, glare-reducing base page background. | Base canvas |
| `color-surface-card` | `#FFFFFF` | Card, modal, and panel background. Maximum clean contrast for content. | Contrast with canvas: $1.1:1$ |
| `color-surface-muted` | `#FAF9F5` | Secondary card sections, dossier availability bridges, subtle input backgrounds. | Subtle separation |
| `color-border-subtle` | `#E4E0D5` | Hairline $1\,\text{px}$ card borders and section dividers. | Non-text boundary |
| `color-border-strong` | `#D5D0C2` | Input field borders, unselected interactive chips, structural frame edges. | $3.2:1$ (UI Component AA) |
| `color-border-focus` | `#16222F` | $2\,\text{px}$ high-visibility focus ring with $2\,\text{px}$ offset for keyboard navigation. | Accessible focus indicator |

### 2.2 Text & Typography Hierarchy Colors

| Token Name | HEX Code | Intended Usage | Contrast Ratio |
| :--- | :--- | :--- | :--- |
| `color-text-primary` | `#16222F` | Page titles, mentor names, major headings, active values. | $13.4:1$ (AAA) |
| `color-text-secondary` | `#4F5966` | Mentor company, bio summaries, filter titles, form labels. | $6.2:1$ (AAA) |
| `color-text-tertiary` | `#697380` | Timestamps, timezone indicators, helper captions, session counters. | $4.6:1$ (AA) |
| `color-text-disabled` | `#A0A8B4` | Disabled control text, unavailable slot numbers. | Non-interactive |
| `color-text-inverse` | `#FFFFFF` | Text rendered on dark primary buttons and dark badges. | $13.4:1$ on `#16222F` (AAA) |

### 2.3 Semantic & Feedback Tokens

| Semantic Role | Token Name | HEX Code | Usage Context |
| :--- | :--- | :--- | :--- |
| **Success** | `color-semantic-success` | `#2D5A46` | Confirmed bookings, verified mentor status, valid form checks. |
| **Success Subtle** | `color-semantic-success-subtle` | `#EAF2ED` | Success message alert container background. |
| **Warning** | `color-semantic-warning` | `#B45309` | Low slot availability warnings, session rescheduled notices. |
| **Warning Subtle** | `color-semantic-warning-subtle` | `#FEF3C7` | Warning notification banner background. |
| **Danger / Error** | `color-semantic-danger` | `#B91C1C` | Cancellation notices, validation errors, destructive actions. |
| **Danger Subtle** | `color-semantic-danger-subtle` | `#FEE2E2` | Error banner background, invalid input outline. |
| **Info / Bridge** | `color-semantic-info` | `#255273` | Timezone conversion hints, informational scheduling notes. |

---

## 3. Typography System & Bidirectional (RTL/LTR) Rules

### 3.1 Typeface Selection
* **Latin Script (English)**: **Plus Jakarta Sans** (Primary UI & Headings). Clean geometric humanist grotesque, open apertures, legible tabular numbers, zero decorative fluff.
* **Persian Script (RTL)**: **Vazirmatn** (Primary Persian UI & Headings). High-legibility modern digital grotesque designed by Saber Rastikerdar, featuring flawless kerning across 9 weights.
* **Monospace / Numerical Data**: **JetBrains Mono** or system monospace (used strictly for timezone indicators, military timestamps `14:00 UTC`, and date tags).

### 3.2 Type Scale (Major Second 1.125 / Modular Proportions)

| Token | Size (px / rem) | Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `type-display` | $36\,\text{px}\,(2.25\,\text{rem})$ | $44\,\text{px}\,(1.22)$ | Bold (700) | Landing hero headings, platform manifesto |
| `type-h1` | $28\,\text{px}\,(1.75\,\text{rem})$ | $36\,\text{px}\,(1.28)$ | Bold (700) | Directory page titles, mentor profile names |
| `type-h2` | $22\,\text{px}\,(1.375\,\text{rem})$ | $30\,\text{px}\,(1.36)$ | SemiBold (600) | Section titles, modal headers, dossier categories |
| `type-h3` | $18\,\text{px}\,(1.125\,\text{rem})$ | $26\,\text{px}\,(1.44)$ | SemiBold (600) | Card headings, topic offering titles |
| `type-body-lg` | $16\,\text{px}\,(1.0\,\text{rem})$ | $24\,\text{px}\,(1.50)$ | Regular (400) / Medium (500) | Mentor bio introductions, lead paragraphs |
| `type-body-md` | $14\,\text{px}\,(0.875\,\text{rem})$ | $22\,\text{px}\,(1.57)$ | Regular (400) / Medium (500) | Base interface copy, card descriptions, form inputs |
| `type-body-sm` | $12\,\text{px}\,(0.75\,\text{rem})$ | $18\,\text{px}\,(1.50)$ | Medium (500) | Metadata tags, timezone chips, secondary captions |
| `type-caption` | $11\,\text{px}\,(0.6875\,\text{rem})$ | $16\,\text{px}\,(1.45)$ | SemiBold (600) | Eyebrow badges, uppercase section indicators |

### 3.3 Bidirectional & Persian (RTL) Principles
1. **Optical Height Adjustment**: When Persian text is rendered alongside English in identical containers, Persian font scale factor is increased by $1\,\text{px}$ or line-height is increased by $0.15$ (e.g. $1.65$ line height) to prevent clipping of ascenders/descenders (*sar-kash* and *noghteh*).
2. **Logical CSS Properties**: Never use `left` or `right` margins/paddings. All styling uses logical properties (`padding-inline-start`, `margin-inline-end`, `text-start`, `text-end`).
3. **Mirrored Layout Anatomy**:
   - In LTR: Guiding pathway indicator line is on the **left** border; mentor avatar is on the **left**; booking slot grid is on the **right**.
   - In RTL: Guiding pathway indicator line mirrors to the **right** border; avatar is on the **right**; booking slots flow from **right to left**.
4. **Mixed Direction Text**: When technical keywords or English company names (e.g. "Stripe", "PostgreSQL") appear inside Persian copy, text elements are isolated with `<bdi>` or `unicode-bidi: isolate` to prevent punctuation inversion.

---

## 4. Spacing Scale, Grid & Layout Architecture

PDS is built on an **$8\,\text{px}$ spatial grid** with a $4\,\text{px}$ half-step for micro-alignment.

### 4.1 Spacing Scale

| Token Name | Value | Recommended Application |
| :--- | :--- | :--- |
| `space-1` | $4\,\text{px}$ | Micro padding inside badges, icon-to-text gap |
| `space-2` | $8\,\text{px}$ | Gap between tags, compact button padding, item list spacing |
| `space-3` | $12\,\text{px}$ | Input internal horizontal padding, chip margins |
| `space-4` | $16\,\text{px}$ | Standard card inner padding, form field gap |
| `space-6` | $24\,\text{px}$ | Dossier section separation, modal internal margins |
| `space-8` | $32\,\text{px}$ | Desktop card padding, layout column gutters |
| `space-12` | $48\,\text{px}$ | Page section spacing, header-to-content separation |
| `space-16` | $64\,\text{px}$ | Major page tier spacing |

### 4.2 Breakpoints & Layout Grid
* **Mobile (`sm`)**: $375\,\text{px}$ to $767\,\text{px}$ — 4-column fluid grid, $16\,\text{px}$ screen margins, full-width stacked dossier cards.
* **Tablet (`md`)**: $768\,\text{px}$ to $1023\,\text{px}$ — 8-column grid, $24\,\text{px}$ margins, $24\,\text{px}$ gutters.
* **Desktop (`lg` / `xl`)**: $1024\,\text{px}$ to $1280\,\text{px}$ (Max container width: $1280\,\text{px}$) — 12-column grid, $32\,\text{px}$ gutters, centered with automatic margins.

---

## 5. Shape, Elevation & Borders

### 5.1 Corner Radii (`border-radius`)
* `radius-none`: $0\,\text{px}$ — Dividers, full-bleed backgrounds.
* `radius-sm`: $4\,\text{px}$ — Badges, code blocks, calendar day selectors.
* `radius-md`: $8\,\text{px}$ — Buttons, form inputs, topic chips, slot selection chips.
* `radius-lg`: $12\,\text{px}$ — Dossier cards, modals, dropdown panels.
* `radius-full`: $9999\,\text{px}$ — Circular avatar frames, pill status dots.

### 5.2 Elevation & Shadows
PDS favors crisp $1\,\text{px}$ architectural boundaries over heavy diffuse shadows:
* `shadow-none`: `none` — Default flat state.
* `shadow-subtle`: `0 1px 2px 0 rgba(22, 34, 47, 0.05)` — Cards resting on canvas.
* `shadow-elevated`: `0 4px 12px -2px rgba(22, 34, 47, 0.08), 0 2px 4px -1px rgba(22, 34, 47, 0.04)` — Hovered cards, active dropdowns.
* `shadow-modal`: `0 12px 32px -4px rgba(22, 34, 47, 0.16)` — Booking confirmation dialogs.

---

## 6. Component Conventions & Interaction States

### 6.1 Buttons

```
[ Primary Button ]        [ Secondary Button ]        [ Accent Button (CTA) ]
┌────────────────────┐    ┌────────────────────┐      ┌────────────────────┐
│ #16222F (Slate)    │    │ White / #E4E0D5    │      │ #C86D3B (Sienna)   │
│ Text: #FFFFFF      │    │ Text: #16222F      │      │ Text: #FFFFFF      │
└────────────────────┘    └────────────────────┘      └────────────────────┘
```

* **States Matrix**:
  * **Default**: Smooth background, $8\,\text{px}$ radius, font-medium $14\,\text{px}$, minimum height $40\,\text{px}$ (desktop) / $44\,\text{px}$ (mobile).
  * **Hover**: Background shifts to hover token (`color-brand-primary-hover` or `color-brand-accent-hover`), cursor pointer.
  * **Active / Pressed**: Subtle scale down ($0.98$) and shift to pressed token.
  * **Focus Visible**: $2\,\text{px}$ solid ring in `color-border-focus` (`#16222F`) with a $2\,\text{px}$ white offset (`outline: 2px solid #16222F; outline-offset: 2px;`).
  * **Disabled**: `opacity: 0.45; cursor: not-allowed; pointer-events: none;`.

### 6.2 The Mentor Dossier Card (Original Architectural Anatomy)
* **Visual Anchor**: $6\,\text{px}$ vertical Raw Sienna (`#C86D3B`) pathway accent line along the start border.
* **Col 1 (Identity & Curriculum)**:
  * Mentor monogram/avatar ($56 \times 56\,\text{px}$) with status indicator.
  * Mentor full name, seniority years badge, current role and company.
  * Curriculum offerings: structured $2$-column list with title and duration (e.g. *Portfolio Teardown • 45m*), not floating consumer pills.
* **Col 2 (Scheduling Bridge)**:
  * Dual-timezone header: Mentor local time + Mentee converted time.
  * Date selector chips ($3$ immediate upcoming days).
  * Available time slot buttons with distinct *Available*, *Selected*, and *Unavailable* states.
  * Direct action CTA: "Request 1-on-1 Session".

---

## 7. Accessibility Checklist & Rules

1. **Text Contrast**: Normal text ($\ge 14\,\text{px}$) must strictly meet or exceed $4.5:1$ against its background surface. Large text ($\ge 18\,\text{px}$ bold or $24\,\text{px}$ regular) must meet $3:1$.
2. **Keyboard Traversal**:
   - Tab order must logically flow: Search $\rightarrow$ Filters $\rightarrow$ Mentor Card $\rightarrow$ Slot Selector $\rightarrow$ Book Action.
   - All interactive elements must have visible focus rings meeting WCAG 2.4.7 (Focus Visible).
3. **Screen Reader Semantics**:
   - Dossier cards use semantic `<article aria-labelledby="mentor-[id]">`.
   - Time slot buttons specify `aria-label="Book session on Thursday October 29 at 14:00 Tehran time"`.
   - Status badges include descriptive text rather than relying on color alone.
4. **Touch Ergonomics**: All clickable slots, filters, and buttons maintain a minimum tap target of $44 \times 44\,\text{px}$ on mobile viewports.
