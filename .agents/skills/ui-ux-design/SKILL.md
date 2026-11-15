---
name: ui-ux-design
description: >-
  Design system guidelines and UI specifications for the Peyroo Mentorship Platform.
  Covers Persian typography and RTL layout, liquid glass texture scoping, border radius hierarchy,
  responsive navigation, and atmospheric warm studio palettes for all pages, panels, and modals.
---

# Peyroo UI/UX Design System & Interface Standards

This skill governs the visual styling, responsive behavior, component geometry, and Persian manuscript localization for all web pages, dashboard panels, modals, and cards across the Peyroo platform.

---

## 1. Persian Manuscript & Localization Invariants (`dir="rtl"`)

All interfaces must strictly adhere to native Iranian software engineering and manuscript standards:

1. **Typography (`Vazirmatn`):**
   - Font family: `Vazirmatn, system-ui, -apple-system, sans-serif`.
   - Weights: Regular (400), Medium (500), SemiBold (600), Bold (700), ExtraBold (800).
   - **Line Height:**
     - Headlines (`h1`, `h2`): **`leading-[1.55]` to `leading-[1.6]`** (prevents visual clash between Persian dots, diacritics, and ascenders/descenders).
     - Body copy & descriptions: **`leading-[1.85]`** for effortless editorial legibility.
2. **Direction & Layout Mirroring:**
   - Always declare `dir="rtl"` and `lang="fa"`.
   - Brand and logos position on the **right**; navigation links in center; primary CTAs, log in, and user profile toggles on the **left**.
   - Form inputs, search boxes, and text align right by default with icons placed on the right edge.
3. **Persian Numerals (`.farsi-nums`):**
   - Apply `font-feature-settings: "ss01"` or use native Persian digit characters (`۰ ۱ ۲ ۳ ۴ ۵ ۶ ۷ ۸ ۹`).
   - All dates, timestamps, prices, durations, and counts must render in Persian numerals.
4. **Official Iranian Currency (`تومان` - Toman):**
   - Denominate all fees and amounts in **تومان** with 3-digit comma separation (`۲۵۰٬۰۰۰ تومان`).
   - Maintain explicit financial breakdown: Base fee + 10% platform fee = Total payable.
5. **Jalali Solar Hijri Calendar & Timezones:**
   - Display dates in Solar Hijri format (e.g. `پنج‌شنبه ۲۲ آبان ۱۴۰۵`).
   - Timestamps must default to Iran Standard Time (`به وقت ایران - تهران`).

---

## 2. Atmosphere & Color Palette

The interface follows an **editorial warm studio** ambiance:

- **Background Gradient:** `linear-gradient(180deg, #FBF5EC 0%, #F2E8DA 50%, #E7E7E1 100%)`.
- **Primary Ink (Dark Accent):** `#2C1A11` (Deep Espresso brown/black for text, solid buttons, and brand marks).
- **Secondary Ink:** `#5E4131` (Warm Walnut brown for subtitles, descriptions, and labels).
- **Primary Accent (Soft Sky Blue):** `#8EC5FF` (hover: `#78B4F5`) for hero booking CTAs, primary pills, and subtle glows.
- **Surface Neutrals:** `#FFFFFF` (pure white for cards/inputs), `#FBF5EC` (eggshell surface), `#DFCFC0` (subtle dividers and borders).
- **Ambient Glows:** Large background blurs (`w-[600px] h-[600px] bg-[#8EC5FF]/20 blur-[140px]`).

---

## 3. Liquid Glass Geometry & Surface Scoping

> [!IMPORTANT]
> **Strict Containment Rule:** Liquid glass textures must ONLY be applied to top-level structural containers (Navbar, Main Cards, Search Shells). **Never apply liquid glass to nested child elements.**

- **Liquid Glass Container Specifications:**
  - `background: rgba(255, 255, 255, 0.75)` (or `rgba(251, 245, 236, 0.70)`).
  - `backdrop-filter: blur(28px) saturate(160%)`.
  - `border: 1px solid rgba(255, 255, 255, 0.85)`.
  - Specular top highlight: `box-shadow: inset 0 1.5px 0 rgba(255, 255, 255, 0.95), 0 20px 45px -15px rgba(44, 26, 17, 0.08)`.
- **Solid Child Elements:**
  - All nested interactive elements (buttons, selectable time slots, chips, badges, agenda blocks, text inputs) must have **solid (non-glass) backgrounds** (e.g. white, sky blue, or dark espresso) to ensure crisp legibility and eliminate stacking blur artifacts.

---

## 4. Border Radius Hierarchy

Maintain disciplined, restrained geometry:
- **Major Structural Cards & Dialogs:** `rounded-[28px]`.
- **Search Shells & Search Bars:** `rounded-[24px]`.
- **Selectable Time Slots & Inner Section Cards:** `rounded-[18px]` or `rounded-[16px]`.
- **Action Buttons & Form Inputs:** `rounded-[16px]`.
- **Pills, Avatars, Badges, Brand Monograms, and Mobile Islands:** `rounded-full`.

---

## 5. Responsive Navigation Standard

Navigation headers must follow a dual-mode responsive layout:
1. **Desktop & Tablet (`md:` breakpoint $\ge 768px$):**
   - Edge-to-edge full-width glass bar (`h-[68px]`, `border-b border-white/85`).
   - Max inner content constraint: `max-w-[1440px] px-8 lg:px-20`.
   - Wide spacing between navigation links: `gap-12 lg:gap-14` (48px–56px).
2. **Mobile Phone View (`< md` $< 768px$):**
   - Hovering floating island capsule (`h-[60px] max-w-md mx-auto rounded-full px-4 shadow-lg`).
   - Brand on right, compact CTA on left, and a hamburger icon toggling an animated liquid glass floating drawer.
