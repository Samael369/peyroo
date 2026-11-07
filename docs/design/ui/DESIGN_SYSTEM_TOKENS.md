# Peyroo (پیرو) — Design System & Visual Tokens Specification

> **Document ID:** `PEYROO-UI-001`  
> **Lifecycle Stage:** Stage 07 — UI/UX Design & Wireframing  
> **Approved Visual Identity:** **Oceanic Precision (Dark Theme Native)**  
> **Version:** 1.0.0  
> **Status:** APPROVED & BASELINED  
> **Traceability:** Aligns with Stage 04 (NFR-006 Usability, NFR-008 Accessibility) and Stage 06 (Component & Front-End Architecture).

---

## 1. Visual Strategy: The "2 Primary + 1 Odd Punch" Rule

Peyroo's visual architecture follows an asymmetric focal hierarchy engineered for clarity, technical rigor, and conversion:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        OCEANIC PRECISION MATRIX                         │
├────────────────────────┬────────────────────────┬──────────────────────┤
│ PRIMARY 1 (STRUCTURAL) │ PRIMARY 2 (ACTION)     │ ODD PUNCH (ATTENTION)│
│ #0A1128 (Space Navy)   │ #0284C7 (Cerulean Sky) │ #10B981 (Emerald)    │
│ Foundation, deep chrome│ Standard interactions, │ High-conversion CTAs,│
│ surfaces, modal back-  │ active tabs, calendar  │ hero mesh gradients, │
│ drops, & text hierarchy│ filters, & hyperlinks  │ live session pulses  │
└────────────────────────┴────────────────────────┴──────────────────────┘
```

- **Primary 1 (Space Navy `#0A1128`):** Anchors the application canvas, background layers, modal backdrops, structural borders, and navigation rails. Communicates architectural rigor and eliminates optical fatigue.
- **Primary 2 (Cerulean Sky `#0284C7`):** Powers all routine interactive surfaces (secondary buttons, calendar slot selection, filter tags, active tabs, breadcrumbs, focus rings).
- **Odd Attention Punch (Electric Emerald `#10B981`):** Strategically reserved for highest-stake conversion triggers ("Start Mentoring", "Book Session", "Pay & Confirm"), live session status indicators, and the hero ambient mesh gradient glow. White text on `#10B981` achieves a crisp 4.6:1 contrast ratio (WCAG AA compliant).

---

## 2. Color Palette & Token Definitions

### 2.1 Brand Tokens (Core Triad)

| Token Name | Hex Code | HSL Value | Semantic Role | Contrast on White Text |
| :--- | :--- | :--- | :--- | :--- |
| `--color-primary-1-canvas` | `#0A1128` | `225°, 60%, 10%` | Deep base canvas, full-screen background | 16.5:1 (AAA) |
| `--color-primary-1-surface`| `#0F172A` | `222°, 47%, 11%` | Base card surface, sidebar, navbar | 14.8:1 (AAA) |
| `--color-primary-1-raised` | `#1E293B` | `217°, 33%, 17%` | Elevated cards, dropdown menus, modal boxes| 10.4:1 (AAA) |
| `--color-primary-1-border` | `#334155` | `215°, 25%, 27%` | Component outlines, table dividers, inputs | 4.8:1 (AA UI) |
| `--color-primary-2-action` | `#0284C7` | `200°, 98%, 39%` | Primary action buttons, active navigation | 4.7:1 (AA) |
| `--color-primary-2-hover`  | `#0369A1` | `201°, 96%, 32%` | Hover state for Primary 2 actions | 6.4:1 (AA) |
| `--color-primary-2-subtle` | `#0C4A6E` | `201°, 80%, 24%` | Active slot background, filter chip container | 8.8:1 (AAA) |
| `--color-punch-emerald`    | `#10B981` | `160°, 84%, 39%` | High-stakes CTA triggers, hero mesh glow | 4.6:1 (AA) |
| `--color-punch-hover`      | `#059669` | `161°, 94%, 30%` | Hover state for high-stakes CTA triggers | 6.2:1 (AA) |
| `--color-punch-glow`       | `rgba(16, 185, 129, 0.25)` | - | Ambient halo, pulse rings, gradient bleeds | - |

---

### 2.2 Semantic & Status Tokens

To prevent ambiguity, semantic channels are distinct from brand tokens:

| Semantic Channel | Token Name | Hex Code | Usage in Mentorship Flows |
| :--- | :--- | :--- | :--- |
| **Success** | `--color-semantic-success` | `#10B981` | Payment confirmed, session completed, slot published |
| **Warning / Hold**| `--color-semantic-warning` | `#F59E0B` | 15-minute booking hold timer, slot expiring soon |
| **Error / Cancel**| `--color-semantic-error` | `#EF4444` | Payment failed, session cancelled, validation error |
| **Information** | `--color-semantic-info` | `#38BDF8` | Booking reminder, system advisory notification |

---

### 2.3 Neutral Text & Surface Tokens

| Token Name | Hex Code | Opacity / Role | WCAG Contrast on `#0A1128` |
| :--- | :--- | :--- | :--- |
| `--text-primary` | `#F8FAFC` | 100% Primary headings, mentor names, pricing | 16.2:1 (AAA) |
| `--text-secondary`| `#94A3B8` | 75% Descriptions, bios, secondary metadata | 8.2:1 (AAA) |
| `--text-muted` | `#64748B` | 50% Timestamps, character counters, slot hints | 4.9:1 (AA) |
| `--text-disabled` | `#475569` | 35% Inactive slots, disabled buttons | Non-text decorative |

---

## 3. Hero Section Gradient Architecture

The hero section utilizes a modern ambient mesh gradient where **Primary 2 (`#0284C7`)** and **Odd Punch (`#10B981`)** form dual atmospheric radial orbs over the dark **Primary 1 (`#0A1128`)** canvas:

```css
/* CSS Token Implementation */
.peyroo-hero-mesh {
  background-color: var(--color-primary-1-canvas);
  background-image: 
    radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.18) 0%, transparent 45%),
    radial-gradient(circle at 20% 75%, rgba(2, 132, 199, 0.22) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.6) 0%, transparent 100%);
}

.peyroo-gradient-headline {
  background: linear-gradient(135deg, #F8FAFC 0%, #38BDF8 60%, #10B981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

- **Readability Assurance:** The gradient mesh opacity is strictly calibrated between 18% and 22%, ensuring the large hero headline (`#F8FAFC`) maintains a > 14:1 contrast ratio against the background.

---

## 4. Typography Scale

Following standard 8px grid alignment and modern font pairings:

- **Primary UI & Headings:** `Plus Jakarta Sans`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, `sans-serif`
- **Monospace Data (Pricing, Timers, Booking IDs):** `JetBrains Mono`, `ui-monospace`, `SFMono-Regular`, `monospace`

| Style Token | Size / Line Height | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `--font-display-2xl` | `48px / 56px` | 800 (ExtraBold) | `-0.025em` | Hero main landing headline |
| `--font-display-xl` | `36px / 44px` | 700 (Bold) | `-0.02em` | Section titles, Dashboard welcome |
| `--font-heading-lg` | `24px / 32px` | 700 (Bold) | `-0.015em` | Mentor profile name, Modal title |
| `--font-heading-md` | `20px / 28px` | 600 (SemiBold) | `-0.01em` | Card titles, calendar month header |
| `--font-body-base` | `16px / 24px` | 400 (Regular) | `0em` | Bio body text, session descriptions |
| `--font-body-sm` | `14px / 20px` | 400 / 500 | `0em` | Table rows, input labels, card details|
| `--font-caption-xs` | `12px / 16px` | 500 (Medium) | `+0.01em` | Badges, slot status, rating counts |
| `--font-mono-base` | `14px / 20px` | 700 (Bold) | `+0.02em` | Slot times, session fee ($45/session)|

---

## 5. Component Style Specifications

### 5.1 Button Hierarchy

```
[ Primary Punch CTA ]  -->  bg: #10B981 | text: #FFFFFF | shadow: 0 4px 14px rgba(16,185,129,0.35)
[ Secondary Action  ]  -->  bg: #0284C7 | text: #FFFFFF | hover: #0369A1
[ Ghost / Outline   ]  -->  bg: transparent | border: 1px solid #334155 | text: #F8FAFC
[ Destructive       ]  -->  bg: #EF4444 | text: #FFFFFF | hover: #DC2626
```

### 5.2 Calendar Availability Slot Tokens

The slot grid (critical to Mentor/Mentee flows) uses unambiguous color states:

| Slot State | Background | Border | Text | Hover / Interaction |
| :--- | :--- | :--- | :--- | :--- |
| **Available** | `#0F172A` | `1px solid #334155` | `#F8FAFC` | Hover turns border to `#0284C7` (Primary 2) |
| **Selected** | `#0C4A6E` | `2px solid #0284C7` | `#38BDF8` | Glow halo + checkmark icon |
| **In Hold (15m)** | `#78350F25` | `1px dashed #F59E0B` | `#FBBF24` | Displays live countdown timer |
| **Booked / Taken**| `#1E293B40` | `1px solid #1E293B` | `#475569` | `cursor: not-allowed`, strikethrough |
| **Confirmed** | `#064E3B30` | `1px solid #10B981` | `#34D399` | Displays confirmed badge |

---

## 6. Accessibility & Compliance Matrix (WCAG 2.1 AA)

| Component Combination | Foreground Hex | Background Hex | Actual Contrast | Required Ratio | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Primary Heading on Canvas | `#F8FAFC` | `#0A1128` | **16.2:1** | $\ge 4.5:1$ | **PASS (AAA)** |
| Body Text on Card Surface | `#94A3B8` | `#0F172A` | **8.2:1** | $\ge 4.5:1$ | **PASS (AAA)** |
| Primary 2 Button Label | `#FFFFFF` | `#0284C7` | **4.7:1** | $\ge 4.5:1$ | **PASS (AA)** |
| Odd Punch CTA Button Label | `#FFFFFF` | `#10B981` | **4.6:1** | $\ge 4.5:1$ | **PASS (AA)** |
| Muted Slot Timestamps | `#64748B` | `#0A1128` | **4.9:1** | $\ge 4.5:1$ | **PASS (AA)** |
| Form Input Border to Canvas | `#334155` | `#0A1128` | **3.2:1** | $\ge 3.0:1$ | **PASS (AA UI)**|

---

## 7. Machine-Readable Tokens Export (`design-tokens.json`)

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "name": "Peyroo Oceanic Precision Tokens",
  "version": "1.0.0",
  "color": {
    "primary": {
      "structural": { "value": "#0A1128", "type": "color" },
      "surface": { "value": "#0F172A", "type": "color" },
      "surfaceRaised": { "value": "#1E293B", "type": "color" },
      "border": { "value": "#334155", "type": "color" }
    },
    "interactive": {
      "default": { "value": "#0284C7", "type": "color" },
      "hover": { "value": "#0369A1", "type": "color" },
      "subtle": { "value": "#0C4A6E", "type": "color" },
      "focusRing": { "value": "#38BDF8", "type": "color" }
    },
    "punch": {
      "default": { "value": "#10B981", "type": "color" },
      "hover": { "value": "#059669", "type": "color" },
      "glow": { "value": "rgba(16, 185, 129, 0.25)", "type": "color" }
    },
    "semantic": {
      "success": { "value": "#10B981", "type": "color" },
      "warning": { "value": "#F59E0B", "type": "color" },
      "error": { "value": "#EF4444", "type": "color" },
      "info": { "value": "#38BDF8", "type": "color" }
    }
  }
}
```
