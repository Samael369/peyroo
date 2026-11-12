# Google AI (Gemini) Prompt Engineering Kit for Figma Design

> **Project:** Peyroo (پیرو) — Mentorship Platform  
> **Target Figma File:** [`https://www.figma.com/design/ukkaM4uP7bLipB7BPZrKAU`](https://www.figma.com/design/ukkaM4uP7bLipB7BPZrKAU)  
> **Approved Visual Identity:** **Cream & Baby Blue Warm Light (60-30-10 Rule)**  
> **Core Triad:** `#F2E8DA` (60% Cream Canvas) • `#3B2418` (30% Espresso Brown) • `#8EC5FF` (10% Baby Blue Accent)  
> **Document Identifier:** `docs/design/ui/FIGMA_PROMPT_ENGINEERING_KIT.md`  
> **Status:** `[APPROVED & BASELINED]`  

---

## 1. Global Gemini System Prompt (Copy into Google AI Studio / Gemini Chat)

```markdown
You are a Principal UI/UX Designer & Senior Frontend Engineer designing a charming, minimalistic web application for Peyroo (پیرو), an academic mentorship platform connecting software industry professionals with junior engineers.

Visual Design Language:
- Palette: "Cream & Baby Blue Warm Light" (60-30-10 Rule)
  - 60% Primary Canvas: #F2E8DA (Warm Vintage Cream / linen-like, organic breathing room)
  - 30% Secondary Structure & Text: #3B2418 (Deep Roasted Espresso Brown for headings, brand text, card borders #E2D5C3, and navigation)
  - 10% Loud Accent: #8EC5FF (Sky Baby Blue for high-stakes conversion CTAs, active highlights, and verification badges)
  - Card Surfaces: #FFFFFF (Pure White) and #FAF6F0 (Subtle Warm Cream)
  - Delicate Borders: #E2D5C3 (Soft Sand)
  - Text on Baby Blue CTA: Always use dark espresso #3B2418 text for crisp 8.5:1 WCAG AAA contrast
  - Semantic Status: #2E7D32 (Success), #D97706 (15m Hold Warning), #DC2626 (Error)
- Typography:
  - UI/Headings: Plus Jakarta Sans (or Inter/system-ui)
  - Timestamps, Rates, IDs: JetBrains Mono (bold monospace)
- Layout:
  - Desktop canvas: 1440px wide, max-w-6xl container.
  - 8px grid, generous whitespace, rounded-2xl (16px) cards, rounded-xl (12px) buttons.
```

---

## 2. Interactive Panel-by-Panel Prompts

---

### Step 1: Panel 1 — Hero Landing & Value Proposition (`/`)

#### Ready-to-Copy Figma AI Prompt:
```markdown
Create a charming, warm, minimalistic landing page for 'Peyroo' (a software engineering mentorship platform):
- 60% Canvas: Warm Vintage Cream background (#F2E8DA). Clean, uncluttered layout with generous whitespace.
- 30% Structure: Deep Espresso Brown (#3B2418) for all typography, navbar, and card outlines (#E2D5C3).
- 10% Loud Accent: Sky Baby Blue (#8EC5FF) for conversion buttons (with dark brown #3B2418 bold text).
- Top Navbar:
  - Brand mark 'P' in brown square + 'Peyroo (پیرو)'.
  - Nav links: 'Explore Mentors', 'How It Works', 'Pricing'.
  - Pill toggle: [ 'Mentee Mode' | 'Mentor Mode' ].
  - CTA Button: 'Book a Session' in Baby Blue (#8EC5FF).
- Hero Section:
  - Small top pill: '15-Minute Concurrency Lock • 100% Refund Policy'.
  - Display Headline: 'Master Software Engineering Through 1-on-1 Mentorship.'
  - Subtitle: 'Book discrete, verified sessions with senior systems architects. Every session requires a structured pre-submitted agenda—zero ghosting, zero cold outreach friction.'
  - Search Box: Input for 'Search by skill (e.g., Go, Distributed Systems, Kafka)' with a Brown 'Search' button.
  - Filter chips: 'Backend', 'Distributed Systems', 'Go', 'System Design', 'DevOps'.
```

---

### Step 2: Panel 2 — Mentor Catalog & Search Results (`/mentors`)

#### Ready-to-Copy Figma AI Prompt:
```markdown
Create a clean, charming minimalistic Mentor Catalog page for 'Peyroo':
- Canvas: Warm Vintage Cream (#F2E8DA).
- Filter Bar: Multi-select category pills (Active tag: Baby Blue #8EC5FF with #3B2418 text), rate slider, duration filter (30, 45, 60m).
- 3-Column Mentor Card Grid:
  - Cards: Pure White (#FFFFFF) surface, delicate warm border (#E2D5C3), rounded-2xl, soft shadow.
  - Mentor Avatar with verified checkmark badge.
  - Name: 'Sara Rad' + Headline: 'Staff Distributed Systems Engineer'.
  - Bio: '10+ years scaling high-throughput backends. Specializing in concurrency models and senior interview prep.'
  - Skill Badges: ['Go', 'Kafka', 'System Design'].
  - Rate: '$25.00 / 45-min session' in JetBrains Mono brown font.
  - Action Button: 'View Slots & Book' (Ghost button with brown border, or Baby Blue CTA).
```

---

### Step 3: Panel 3 — Mentor Profile & Weekly Slot Grid (`/mentors/:id`)

#### Ready-to-Copy Figma AI Prompt:
```markdown
Create a warm editorial Mentor Public Profile page for 'Peyroo':
- Canvas: Warm Cream (#F2E8DA).
- Left Column: Mentor details (Sara Rad), star rating (4.9 ★), bio, mentoring topics, GitHub/LinkedIn links.
- Right Column: Weekly Availability Calendar & Slots:
  - Week view tabs (Mon - Sun).
  - Slot Pills:
    - Available: White background, #E2D5C3 border, brown text.
    - Selected: Sky Baby Blue (#8EC5FF) border and subtle fill, bold checkmark.
    - Held (15m): Amber border with countdown timer.
    - Booked: Soft beige background, muted strikethrough text.
  - Security note: 'Private video meeting link (Google Meet) revealed upon confirmation.'
  - Action CTA: 'Proceed to Agenda ($27.50)' in Baby Blue (#8EC5FF) with dark brown text.
```

---

### Step 4: Panel 4 — Booking Drawer & Mandatory Structured Agenda (`/bookings/new`)

#### Ready-to-Copy Figma AI Prompt:
```markdown
Create a charming modal dialog for booking a mentorship session on 'Peyroo':
- Modal: Pure White (#FFFFFF) elevated container, delicate warm border (#E2D5C3), rounded-2xl, dark backdrop blur.
- Header: 'Book Session with Sara Rad • Friday 18:00 (45 min) • $25.00'.
- Mandatory Agenda Form:
  - Field 1: 'Primary Objective / Topic' (Input: min 10 chars).
  - Field 2: 'Specific Questions & Roadblocks' (Textarea: min 15 chars).
  - Field 3: 'Project / Code Link' (Input: GitHub or portfolio URL).
- 15-Minute Lock Alert: Amber pill (#FFFBEB with #D97706 text): 'Your slot is held for 15:00 minutes while you complete payment.'
- Footer: 'Cancel' (Ghost) and 'Proceed to Payment ($27.50)' (Baby Blue CTA #8EC5FF).
```

---

### Step 5: Panel 5 — Mock Banking Gateway Simulator (`/mock-gateway/checkout`)

#### Ready-to-Copy Figma AI Prompt:
```markdown
Create a clean, minimalist Mock Banking Gateway checkout page for 'Peyroo':
- Canvas: Warm Cream (#F2E8DA).
- Checkout Card (#FFFFFF with #E2D5C3 border):
  - Title: 'Peyroo Mock Payment Gateway (Sandbox)'.
  - Itemized Ledger:
    - Mentor Session Fee: $25.00
    - Peyroo Platform Commission (10%): $2.50
    - Total Amount Due: $27.50 (bold JetBrains Mono in brown #3B2418).
  - 15-Minute Countdown Timer: '14:32 remaining'.
  - Mock Card Inputs (Card Number, Expire, CVV).
  - Academic Test Triggers (Two prominent buttons):
    - Green button: 'Simulate Successful Payment'
    - Red button: 'Simulate Failed Payment (Test Failure Path)'
```

---

### Step 6: Panel 6 — Booking Confirmation & Meeting URL Access (`/bookings/:id/confirmation`)

#### Ready-to-Copy Figma AI Prompt:
```markdown
Create a warm, minimalist Booking Confirmation screen for 'Peyroo':
- Canvas: Warm Cream (#F2E8DA).
- Confirmation Card (#FFFFFF):
  - Green checkmark icon + 'Booking Confirmed! (ID: #BK-10492)'.
  - Highlighted Meeting Room Container (#F0F7FF with #8EC5FF border):
    - 'Your Private Google Meet Link:'
    - URL box: 'https://meet.google.com/abc-defg-hij' with 'Join Meeting' button (#8EC5FF) and 'Copy Link' button.
    - Confidentiality footnote: 'Masked from public; accessible only to booked mentee and mentor.'
  - Session Summary: Sara Rad • Friday, Nov 20 @ 18:00 • Total Paid: $27.50.
  - 24-Hour Policy Pill: 'Full 100% refund available if cancelled at least 24h before start.'
```

---

### Step 7: Panel 7 — Personal Session Dashboard (`/dashboard`)

#### Ready-to-Copy Figma AI Prompt:
```markdown
Create a clean, charming user dashboard for 'Peyroo':
- Canvas: Warm Cream (#F2E8DA).
- Top Bar: User avatar (Amir Hosseini) + Mode Switch Pill: [ 'Mentee Mode' (Active) | 'Mentor Mode' ].
- Navigation Tabs: ['Upcoming Sessions (1)', 'Past Sessions (3)', 'Cancelled (0)'].
- Upcoming Session Card:
  - Status Badge: 'CONFIRMED' (green).
  - Mentor Sara Rad, Friday 18:00 countdown badge ('In 2 days').
  - Action: 'Join Google Meet' in Baby Blue (#8EC5FF).
  - Submitted Agenda accordion.
  - Secondary action: 'Cancel Booking' (triggers 24h refund modal).
```
