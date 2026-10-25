# UI/UX Design Direction: Peyroo (پیرو)

> **Document Status**: `APPROVED (Visual Identity & Design System — Persian National Launch)`  
> **Approved Foundation**: The Guiding Beacon — Softened Persian Edition (Persian Lapis `#16222F` & Warm Terracotta `#C86D3B`)  
> **Associated Specifications**:
> - Screen Designs & Layouts: [`docs/SCREEN_DESIGNS.md`](file:///c:/Users/r/Desktop/peyroo/docs/SCREEN_DESIGNS.md)
> - Design System: [`docs/DESIGN_SYSTEM.md`](file:///c:/Users/r/Desktop/peyroo/docs/DESIGN_SYSTEM.md)
> - Figma Workflow & Token Setup: [`docs/FIGMA_WORKFLOW.md`](file:///c:/Users/r/Desktop/peyroo/docs/FIGMA_WORKFLOW.md)
> - User Experience Flows: [`docs/USER_FLOWS.md`](file:///c:/Users/r/Desktop/peyroo/docs/USER_FLOWS.md)
> - W3C Design Tokens: [`docs/tokens.json`](file:///c:/Users/r/Desktop/peyroo/docs/tokens.json)

---

## 1. Product Context & Design Purpose

**Peyroo (پیرو)** is an open, community-driven 1-on-1 mentorship platform inspired by the accessibility of ADPList, designed as a university Software Analysis and Design project.

### Root Meaning & National Scope
- **Etymology**: The Persian word *پیرو* signifies a seeker of knowledge, a learner, or a disciple on a path of growth and professional mastery.
- **National & Local Target**: Officially designated for a national launch in the Iranian ecosystem. The platform is natively Persian-first (`dir="rtl"`), utilizing Solar Hijri calendar dates (e.g. ۸ آبان، ۱۰ آبان), Persian numerals, and Tehran standard time (`UTC+03:30`).
- **Core Purpose**: Democratizing career guidance, portfolio reviews, and engineering mentorship by connecting ambitious learners and early-career practitioners with seasoned industry guides.
- **Key Differentiator**: Unlike commercial coaching networks with aggressive monetization and transactional aesthetics, Peyroo emphasizes intellectual curiosity, human empathy, and authentic guidance.

---

## 2. Technical & Usability Constraints

1. **Frontend Architecture**:
   - Single Page Application (SPA) in `apps/web` utilizing React 18, Vite, TypeScript (strict mode), and Tailwind CSS.
   - Design tokens are defined semantically in `docs/tokens.json` and documented in `docs/DESIGN_SYSTEM.md`.
2. **Native Persian & RTL First**:
   - Default native Persian interface (`dir="rtl"`).
   - Smooth Persian typography using harmonious typefaces (**Dana**, **Shabnam**, or smooth **Vazirmatn**) with zero letter-spacing (`letter-spacing: normal`), comfortable line-height ($1.75\text{–}1.85$), and balanced weights ($400, 500, 600$) without harsh heavy weights.
3. **Accessibility (WCAG 2.2 Level AA)**:
   - Minimum 4.5:1 contrast for normal text; 3:1 for large headings and active UI borders.
   - Visible, distinct focus rings for keyboard navigation across calendar slots and filter chips.
   - Minimum 44×44px touch targets on mobile viewports.
4. **Scope Boundaries**:
   - Out of scope: In-app payments, native WebRTC client (mentors provide external Google Meet/Zoom links), automated AI agents.
   - Open architectural decisions: Session cookie vs stateless JWT; Instant booking vs Request-to-Book approval mode.

---

## 3. Visual Directions Under Evaluation & Anti-Generic Divergence

### 3.1 Explicit Rejection of ADPList Visual Tropes
Following stakeholder feedback on Direction B's exploratory mock, we conducted an explicit critique against ADPList's visual tropes:
- **ADPList Tropes Rejected**: Trademark saturated forest green buttons, bubble-rounded pill tags, consumer influencer-style star profiles, and generic centered card grids.
- **Peyroo Bespoke Commitment**: Peyroo will not be a copy, reskin, or derivative of ADPList. The design language is built ground-up around the cultural etymology of *پیرو* (the guided pathway/seeker) and university software engineering rigor.

### 3.2 Approved Bespoke Direction: "The Guiding Beacon — Softened Persian Edition"
- **Concept & Tone**: An intellectual salon and guided architectural studio. Grounded in Persian cultural heritage, warm sand surfaces, and humane typography.
- **Visual Signature**:
  - **Primary Brand Anchor (Persian Mineral Lapis Slate - `#16222F`)**: Evokes deep night skies, classical navigational compasses, and intellectual depth (WCAG AAA contrast 13.4:1).
  - **Guiding Light Accent (Raw Sienna / Terracotta - `#C86D3B`)**: Represents human guidance, warmth, and the seeker's path.
  - **Surface Canvas (Soft Warm Linen - `#F2EFE9` & `#FAF9F6`)**: Warm, glare-reducing, humane base canvas.
  - **Card Anatomy ("The Softened Architectural Dossier")**: Asymmetrical card layout anchored by a vertical rounded guiding path capsule; structured curriculum/agenda offerings; integrated Solar Hijri scheduling bridge.
  - **Organic Curves**: Replaced sharp 4px/8px corners with soft, friendly radii ($24\,\text{px}$ outer cards, $16\,\text{px}$ inner containers, full capsule pills for buttons and tags).

---

## 4. Custom Visual Assets (Approval Status)

All custom assets have undergone the Step A–D approval workflow and are officially **APPROVED**:

| Asset Description | Purpose | Status |
| :--- | :--- | :--- |
| **Peyroo Wordmark & Logomark** | Logomark blending the 3 dots of Persian letter 'پ' with the upward guiding constellation & path line. | `APPROVED` |
| **Category Domain Icons (24px)** | Unified 1.5px architectural stroke family for Engineering, Product Design, Management, Data & AI. | `APPROVED` |
| **Verified Practitioner Seal** | Octagonal architectural seal enclosing a guidance star for verified mentor credentials. | `APPROVED` |
| **Session State Empty Visuals** | Minimalist architectural vector empty states. | `APPROVED` |

---

## 5. Figma Deliverable Strategy

Because direct Figma cloud write access is not natively connected in this environment, editable Figma designs will be delivered via:
1. **Figma Design Tokens**: W3C-compliant JSON token file ([`docs/tokens.json`](file:///c:/Users/r/Desktop/peyroo/docs/tokens.json)) importable into Figma Variables / Tokens Studio.
2. **SVG Component Library**: Production-grade SVGs with exact viewBox, stroke weights, and layout geometry for direct copy-paste into Figma frames.
3. **Figma Construction Blueprint**: Detailed Auto-Layout specifications, padding scales, variant matrix, and hierarchy definitions for seamless assembly ([`docs/FIGMA_WORKFLOW.md`](file:///c:/Users/r/Desktop/peyroo/docs/FIGMA_WORKFLOW.md)).
