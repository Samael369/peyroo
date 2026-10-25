# Figma Architecture & Construction Workflow: Peyroo

> **Document Status**: `APPROVED SPECIFICATION (Phase 4)`  
> **Target Environment**: Figma Cloud / Desktop  
> **Tokens File**: [`docs/tokens.json`](file:///c:/Users/r/Desktop/peyroo/docs/tokens.json)  
> **Design Foundations**: [`docs/DESIGN_SYSTEM.md`](file:///c:/Users/r/Desktop/peyroo/docs/DESIGN_SYSTEM.md)

---

## 1. Deliverable Strategy & Tooling Alignment

As verified during Phase 1, our development workspace operates without direct write access to a remote Figma API token. To guarantee that you receive a **genuinely editable, structured, and production-grade Figma project**—without relying on flat screenshot pastes—this document defines the exact architecture, Auto-Layout rules, variant schemas, and token import workflows required.

### Deliverable Package Components
1. **Design Tokens File ([`tokens.json`](file:///c:/Users/r/Desktop/peyroo/docs/tokens.json))**:
   - W3C standard JSON containing colors, radii, spacing, and font sizes.
   - Importable in 1 click using **Tokens Studio for Figma** or Figma's native **Variables Importer**.
2. **Figma Page Hierarchy & File Structure**:
   - Standardized page breakdown designed for clear academic presentation and design system scalability.
3. **Auto-Layout Blueprint**:
   - Exact padding, hug/fill rules, and gap parameters for every component.
4. **SVG Vector Source Code**:
   - Scalable vectors with standardized $24 \times 24\,\text{px}$ viewBox coordinates for drag-and-drop insertion into Figma vector frames.

---

## 2. Figma File Page Organization

Organize the Figma document into the following 6 standardized pages:

```
📁 Peyroo Design File
│
├── 📄 00 — Cover & Readme
│   └── Presentation cover card, project metadata, academic scope, link to documentation
│
├── 📄 01 — Foundations (Tokens & Styles)
│   ├── Color Styles & Variables (Lapis, Sienna, Linen, Semantics)
│   ├── Typography Styles (Display, H1-H3, Body, Caption in Latin & Vazirmatn)
│   ├── Spacing & Grid System (4px half-step, 8px grid, 1280px max desktop frame)
│   └── Elevation & Corner Radii Specs
│
├── 📄 02 — Component Library
│   ├── Atoms: Buttons, Form Controls, Badges, Chips, Monograms
│   ├── Molecules: Scheduling Bridge, Timezone Indicator, Search Input, Topic Tag
│   └── Organisms: The Architectural Dossier Card, Global Navigation Bar, Footer
│
├── 📄 03 — User Flows
│   └── Flow 1: Discovery & Filter Navigation → Dossier Detail → Slot Booking → Confirmation
│
├── 📄 04 — Screen Designs (Desktop 1440px)
│   ├── Screen 1: Mentor Discovery & Catalog (All states: populated, filtered, empty)
│   ├── Screen 2: Mentor Dossier Profile & Curriculum Detail
│   └── Screen 3: Interactive Booking & Pre-Session Questionnaire Modal
│
└── 📄 05 — Responsive Layouts (Mobile 375px & Tablet 768px)
    ├── Mobile Discovery Screen (Stacked single-column Dossier)
    └── Mobile Booking Bottom Sheet Flow
```

---

## 3. Step-by-Step Design Token Import Workflow

To populate Figma with native color styles and variables from [`docs/tokens.json`](file:///c:/Users/r/Desktop/peyroo/docs/tokens.json):

### Method A: Using Tokens Studio for Figma (Recommended)
1. In Figma, open the **Tokens Studio for Figma** plugin (Community free version).
2. Click **Tools / Settings** $\rightarrow$ **Load Token File**.
3. Select or paste the contents of [`docs/tokens.json`](file:///c:/Users/r/Desktop/peyroo/docs/tokens.json).
4. Click **Apply to Document** $\rightarrow$ **Create Styles / Variables**.
5. All color styles (`Brand/Primary`, `Brand/Accent`, `Surface/Canvas`, etc.) are generated automatically.

### Method B: Manual Variable Creation (Figma Native)
If using Figma's native Local Variables without plugins:
1. Open the **Local Variables** modal (right sidebar on empty canvas).
2. Create a Collection named `Peyroo Core`:
   - `color/brand/primary`: `#16222F`
   - `color/brand/accent`: `#C86D3B`
   - `color/surface/canvas`: `#F7F6F2`
   - `color/surface/card`: `#FFFFFF`
   - `color/surface/muted`: `#FAF9F5`
   - `color/border/subtle`: `#E4E0D5`
   - `color/border/strong`: `#D5D0C2`
   - `color/text/primary`: `#16222F`
   - `color/text/secondary`: `#4F5966`
   - `color/text/tertiary`: `#697380`

---

## 4. Component Construction Specs (Auto-Layout Blueprint)

### 4.1 Button Component (Component Set)
* **Frame Name**: `Button`
* **Auto-Layout**: Direction: Horizontal (`→`), Alignment: Center (`Middle`), Gap: $8\,\text{px}$.
* **Padding**: Horizontal: $16\,\text{px}$, Vertical: $10\,\text{px}$ (Height: $40\,\text{px}$).
* **Corner Radius**: $8\,\text{px}$ (`radius-md`).
* **Variants Matrix**:

| Property | Values | Construction Notes |
| :--- | :--- | :--- |
| `Type` | `Primary` \| `Secondary` \| `Accent` \| `Ghost` | `Primary`: Fill `#16222F`, Text White.<br>`Secondary`: Fill White, Stroke $1\,\text{px}$ `#D5D0C2`, Text `#16222F`.<br>`Accent`: Fill `#C86D3B`, Text White. |
| `State` | `Default` \| `Hover` \| `Pressed` \| `Focused` \| `Disabled` | `Hover`: Darker tint.<br>`Focused`: Stroke $2\,\text{px}$ `#16222F` with $2\,\text{px}$ gap.<br>`Disabled`: Opacity $45\%$. |
| `Size` | `Medium (40px)` \| `Large (48px)` \| `Small (32px)` | Adjust vertical padding and font size ($12\,\text{px}$ / $14\,\text{px}$ / $16\,\text{px}$). |
| `Icon` | `None` \| `Leading` \| `Trailing` | Icon $16 \times 16\,\text{px}$, matching text color. |

---

### 4.2 The Mentor Dossier Card (Organism Component)
* **Frame Name**: `Card / Mentor Dossier`
* **Auto-Layout**: Direction: Horizontal (`→`), Alignment: Top (`Start`), Gap: $24\,\text{px}$.
* **Frame Dimensions**: Width: `Fill Container` (Desktop minimum $800\,\text{px}$), Height: `Hug Contents`.
* **Padding**: $24\,\text{px}$ all sides.
* **Corner Radius**: $12\,\text{px}$ (`radius-lg`).
* **Fill**: `#FFFFFF` (`color-surface-card`).
* **Stroke**: $1\,\text{px}$ solid `#E4E0D5` (`color-border-subtle`).
* **Left Pathway Accent**: Nested frame width $6\,\text{px}$, height `Fill Container`, fill `#C86D3B` (`color-brand-accent`), corner radius $3\,\text{px}$.

#### Internal Frame Anatomy:
1. **Column 1 — Identity & Curriculum (Width: `Fill`, Flex 5)**:
   - Header Row:
     - Avatar Frame: $56 \times 56\,\text{px}$, radius $12\,\text{px}$, fill `#EAE6DA`.
     - Name & Experience: Mentor Name (H3, Bold), Experience Badge (Caption, Mono, border `#D5D0C2`).
     - Subtitle: Role & Company (`color-text-secondary`, $14\,\text{px}$).
     - Metric Row: Star Rating (`#C86D3B`), session count, Language tag (`فارسی و انگلیسی`).
   - Bio Text: Body-sm ($14\,\text{px}$), max 3 lines, line-clamp.
   - Curriculum Section:
     - Header: "CURRICULUM OFFERINGS" (Caption, SemiBold, `#697380`).
     - Offering Cards Frame: Auto-Layout 2 columns, fill container. Each item $8\,\text{px}$ radius, fill `#FAF9F5`, stroke $1\,\text{px}$ `#E4E0D5`.
2. **Column 2 — Availability Bridge (Width: `Fill`, Flex 7)**:
   - Outer Frame: Auto-Layout Vertical, padding $16\,\text{px}$, radius $10\,\text{px}$, fill `#FAF9F5`, stroke $1\,\text{px}$ `#E4E0D5`.
   - Timezone Header: Local Mentor Time vs Mentee Converted Time (`14:00 Tehran / 10:30 UTC`).
   - Date Selector Row: 3 horizontal date cards (`Day / Date`), selected state has $2\,\text{px}$ `#16222F` border.
   - Slot Matrix Frame: 2-column grid of time slots:
     - *Default Slot*: White fill, $1\,\text{px}$ stroke `#D5D0C2`, text `#4F5966`.
     - *Selected Slot*: Fill `#C86D3B`, text White, font SemiBold.
   - Booking Action Footer: Information note + Button `[ Proceed with Mentor → ]` (Primary).

---

### 4.3 Bidirectional (RTL) Component Mirroring in Figma
When constructing Persian screen variants:
1. Duplicate the Desktop 1440px frame to a new frame named `Screen / Discovery / RTL-Persian`.
2. Set text layers to direction: Right-to-Left (`RTL`) with font family **Vazirmatn**.
3. In the Dossier Card:
   - Swap the Guiding Pathway Line to the **Right** edge.
   - In Auto-Layout settings, switch alignment from `Top-Left` to `Top-Right`.
   - Swap the column positions: Identity & Bio on the **Right**, Availability Bridge on the **Left**.
   - Chevrons (e.g. `→`) flip to `←`.

---

## 5. Screen Hierarchy & Resolution Specs

* **Desktop Viewport**: $1440 \times 1024\,\text{px}$ (Content grid: $1200\,\text{px}$ max width, 12 columns, $32\,\text{px}$ gutters).
* **Tablet Viewport**: $768 \times 1024\,\text{px}$ (Content grid: $720\,\text{px}$ width, 8 columns, $24\,\text{px}$ gutters).
* **Mobile Viewport**: $375 \times 812\,\text{px}$ (Content grid: $343\,\text{px}$ width, 4 columns, $16\,\text{px}$ margins).
