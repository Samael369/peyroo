# Brand Identity, Official Standalone Icon System & Figma Assets: Peyroo (پیرو)

> **Document Reference:** `docs/design/brand/BRAND_IDENTITY_AND_LOGO.md`  
> **Interactive Showcase:** [`docs/design/brand/peyroo_brand_identity.html`](file:///c:/Users/r/Desktop/peyroo/docs/design/brand/peyroo_brand_identity.html)  
> **Figma File URL:** [https://www.figma.com/design/Fg9BRHVc9e7iI2cI6NKGgj](https://www.figma.com/design/Fg9BRHVc9e7iI2cI6NKGgj)  
> **Figma File Key:** `Fg9BRHVc9e7iI2cI6NKGgj`  
> **Lifecycle Stage:** Stage 04 / Stage 07 — Visual Architecture & Design System  
> **Status:** `[DEPLOYED TO FIGMA & LOCAL REPOSITORY]`  
> **Version:** 4.0.0 (Official Standalone Icon System Edition)  
> **Date:** Aban 1405 / November 2026  

---

## 1. Executive Summary & Brand Mark Architecture

The brand mark for **Peyroo (پیرو)** embodies the human and architectural essence of mentorship:
1. **The Mentee (Left Figure):** Represents the aspiring engineer embarking on an architectural journey, looking upward toward clarity.
2. **The 4-Pointed Star (North Star / Guidance Sparkle):** Positioned directly above the mentee in Sky Baby Blue (`#8EC5FF`), symbolizing inspiration, milestone achievement, and the guiding north star of sound engineering.
3. **The Guidance Stream / River (Center Blue Ribbon):** Winding smoothly from the bottom left upward between mentee and mentor, symbolizing the continuous flow of knowledge, pairing sessions, and Architecture Decision Records (ADRs).
4. **The Mentor (Right Figure):** Elevated and protective, curling gracefully in a supportive arc over the mentee and stream.

---

## 2. Color Palette Harmony (60-30-10 Rule)

```
┌────────────────────────────────────────────────────────────────────────┐
│                      PEYROO TRI-COLOR SYSTEM                           │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ 60% DOMINANT       │ 30% STRUCTURAL     │ 10% VITAL ACCENT             │
│ Warm Cream         │ Dark Roasted Cacao │ Sky Baby Blue                │
│ #F2E8DA            │ #2C1A11            │ #8EC5FF                      │
├────────────────────┼────────────────────┼──────────────────────────────┤
│ - Primary surfaces │ - Typography       │ - Guidance stream & star     │
│ - Backgrounds      │ - Structural body  │ - Interactive focal points   │
│ - Ambient warmth   │ - High contrast    │ - Active states & indicators │
└────────────────────┴────────────────────┴──────────────────────────────┘
```

---

## 3. Standalone Icon System & Small-Size Optical Calibration

To ensure the mark remains crisp and unmistakable at small scales ($16\text{px}$, $32\text{px}$, $64\text{px}$), the following optical adjustments were engineered:

1. **Negative Space Expansion:**
   - At $512\text{px}$, negative gaps between heads and bodies are calibrated to at least $18\text{px}-24\text{px}$.
   - For the $16\text{px}$ and $32\text{px}$ favicons, the negative clearance is proportionally widened so the elements never fuse on low-DPI displays.
2. **Star Core Weight:**
   - In micro sizes ($16\text{px}$), ultra-thin vector tips tend to wash out. The star core is gently thickened and scaled to retain radiant presence in browser tabs.
3. **Squircle Safe Margin:**
   - For app icons (macOS, iOS, Android), the mark is centered within a superellipse squircle (`rx="112" ry="112"`) with a $15\%$ optical margin.
4. **Circular Crop Avatar:**
   - Social avatars (LinkedIn, GitHub, Telegram) feature a circular clip boundary (`r="256"`) with safe-zone clearance.

---

## 4. Deployed Vector Assets & Figma Layer Mapping

All assets are stored natively in the repository and deployed directly as editable vector trees in the team Figma file:

| Asset Name | Dimensions | Figma Node ID | File Location | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Standalone Mark** | $512\times 512\text{px}$ | `1:2` | [`assets/brand/peyroo_icon_standalone.svg`](file:///c:/Users/r/Desktop/peyroo/assets/brand/peyroo_icon_standalone.svg) | Transparent vector master |
| **App Icon Cream** | $512\times 512\text{px}$ | `1:9` | [`assets/brand/peyroo_app_icon_cream.svg`](file:///c:/Users/r/Desktop/peyroo/assets/brand/peyroo_app_icon_cream.svg) | Default platform squircle |
| **App Icon Dark** | $512\times 512\text{px}$ | `1:18` | [`assets/brand/peyroo_app_icon_dark.svg`](file:///c:/Users/r/Desktop/peyroo/assets/brand/peyroo_app_icon_dark.svg) | High-contrast dark mode |
| **App Icon Blue** | $512\times 512\text{px}$ | `1:27` | [`assets/brand/peyroo_app_icon_blue.svg`](file:///c:/Users/r/Desktop/peyroo/assets/brand/peyroo_app_icon_blue.svg) | High-energy accent variant |
| **Profile Avatar** | $512\times 512\text{px}$ | `1:36` | [`assets/brand/peyroo_avatar_profile.svg`](file:///c:/Users/r/Desktop/peyroo/assets/brand/peyroo_avatar_profile.svg) | Circular crop for social |
| **Favicon 32** | $32\times 32\text{px}$ | `1:50` | [`assets/brand/peyroo_favicon_32.svg`](file:///c:/Users/r/Desktop/peyroo/assets/brand/peyroo_favicon_32.svg) | Retina browser tabs |
| **Favicon 16** | $16\times 16\text{px}$ | `1:60` | [`assets/brand/peyroo_favicon_16.svg`](file:///c:/Users/r/Desktop/peyroo/assets/brand/peyroo_favicon_16.svg) | Standard browser tabs |

---

## 5. Direct Figma Cloud Access
- **File Name:** `Peyroo Brand Icon System`
- **File Link:** [https://www.figma.com/design/Fg9BRHVc9e7iI2cI6NKGgj](https://www.figma.com/design/Fg9BRHVc9e7iI2cI6NKGgj)
- **Editor Access:** Verified and live in the workspace team account.
