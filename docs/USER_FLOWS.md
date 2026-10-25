# User Experience Architecture & Product Flows: Peyroo

> **Document Status**: `APPROVED SPECIFICATION (Phase 3)`  
> **Traceability**: Aligns with Functional Requirements in [`docs/REQUIREMENTS.md`](file:///c:/Users/r/Desktop/peyroo/docs/REQUIREMENTS.md) (`FR-SRCH`, `FR-PROF`, `FR-SCHED`, `FR-BOOK`)

---

## 1. Flow Prioritization & System Scope

Based on the preliminary requirements for the Peyroo platform, this document maps out the core user journeys. To maximize usability and design rigor, we designate **Primary (MVP priority)** flows to design and verify first before secondary flows.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CORE MENTEE EXPERIENCE                          │
│                                                                        │
│   [ Flow 1: Discovery & Filter ]                                       │
│          │                                                             │
│          ▼                                                             │
│   [ Flow 2: Dossier Curriculum Review ]                                │
│          │                                                             │
│          ▼                                                             │
│   [ Flow 3: Availability & Timezone Bridge ]                           │
│          │                                                             │
│          ▼                                                             │
│   [ Flow 4: Pre-Session Intake & Confirmation ]                        │
│          │                                                             │
│          ▼                                                             │
│   [ Flow 5: Dashboard Session Lifecycle ]                              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Flow Specifications

### Flow 1: Mentor Discovery & Domain Filtering (Priority 1)
* **User Goal**: Quickly locate vetted mentors matching a specific career discipline (e.g., Software Engineering, UI/UX Design), language preference, or availability window.
* **Entry Point**: Platform Homepage or `/mentors` directory.
* **Exit Point**: Selection of a specific mentor's Dossier card or booking window.
* **Key Steps**:
  1. Mentee arrives at directory page.
  2. Mentee selects a category pill (e.g., *Product Design*).
  3. Catalog updates instantly with matching mentor dossier cards.
  4. Mentee applies sub-filter: "Languages: Persian / فارسی" and "Experience: Senior (5+ yrs)".
* **States & Edge Cases**:
  - **Loading State**: Skeleton shimmer on dossier cards maintaining layout stability (no layout shift / CLS).
  - **Empty State**: Zero results found. Renders an architectural vector graphic with a clear recovery prompt: "No mentors found with these exact filters. Try clearing the language filter or broadening seniority." Button: `[ Reset Filters ]`.
  - **Error State**: Network failure. Displays a non-intrusive alert with a retry action: `[ Retry Query ]`.
* **Accessibility & Keyboard Flow**:
  - Focus flows from search bar $\rightarrow$ category tablist (arrow key navigation via `aria-activedescendant`) $\rightarrow$ results count announcer (`aria-live="polite"`) $\rightarrow$ first dossier card.

---

### Flow 2: Mentor Dossier & Curriculum Evaluation (Priority 1)
* **User Goal**: Comprehend a mentor's exact real-world expertise, curriculum offerings, and session outcomes to determine if they match the mentee's learning goal.
* **Entry Point**: Dossier card on directory or direct URL `/m/[mentor-slug]`.
* **Information Architecture**:
  - Top: Identity, Verified Credential Seal, current company/role, aggregate session rating, and languages.
  - Middle: Professional bio, philosophy, and structured **Curriculum Offerings** (e.g., *Portfolio Teardown • 45m*, *Design Systems at Scale • 30m*).
  - Bottom: Mentee testimonials and verified reviews.
* **Decisions & Feedback**: Mentee evaluates which specific curriculum topic fits their immediate roadblock.

---

### Flow 3: Scheduling Bridge & Timezone Conversion (Priority 1)
* **User Goal**: Select an open session time slot converted accurately to their local timezone without calculation errors.
* **Entry Point**: Scheduling matrix embedded in the Dossier card or profile page.
* **Interaction Logic**:
  1. System detects mentee's browser timezone (e.g., `Asia/Tehran` / `UTC+03:30` or `Europe/London`).
  2. Availability Bridge displays mentor's local working window alongside mentee's converted window.
  3. Mentee clicks an open slot (e.g., `14:00 - 14:45`).
  4. Selected slot elevates into accent state (`color-brand-accent`: `#C86D3B`), and the action button updates to `[ Book Oct 29 @ 14:00 ]`.
* **Edge Cases & Recovery**:
  - **Slot Taken Concurrently**: If another user books the slot while the mentee is deciding, an inline banner states: "This slot was just reserved. Next available slot is 15:30."
  - **Timezone Ambiguity**: A dropdown allows the mentee to manually override their timezone if traveling or using a VPN.

---

### Flow 4: Pre-Session Intake Questionnaire & Booking Confirmation (Priority 1)
* **User Goal**: Provide context and specific questions to the mentor so the 1-on-1 session is high-impact, and receive confirmed booking details.
* **Entry Point**: Clicking `[ Proceed with Booking ]` from the Scheduling Bridge.
* **Modal / Page Architecture**:
  1. **Header**: Summary of selected mentor, topic (*Portfolio Teardown*), date, and dual timezone.
  2. **Form Fields**:
     - *Topic Focus*: Pre-filled dropdown based on selected curriculum offering.
     - *Session Goals & Context*: Required textarea (minimum 20 characters) explaining what the mentee wants to achieve.
     - *Artifact Link (Optional)*: URL input for Figma file, GitHub repo, or resume PDF.
  3. **Action Footer**:
     - `[ Cancel / Back ]` (Ghost button)
     - `[ Confirm Reservation ]` (Primary button)
* **Confirmation State**:
  - Modal transitions to success checkmark with summary: "Your session with Sara is requested/confirmed."
  - Instructions on external video link: "Meeting link (Google Meet) will be accessible in your dashboard and emailed to you."
  - Action: `[ Add to Calendar (.ics) ]` and `[ Go to Dashboard ]`.

---

### Flow 5: Session Dashboard & Lifecycle (Priority 2)
* **User Goal**: Review upcoming sessions, retrieve video meeting URLs, reschedule if necessary, or leave post-session feedback.
* **Entry Point**: Top navigation $\rightarrow$ `/dashboard`.
* **Tabs**:
  - **Upcoming**: Scheduled sessions with countdown, meeting URL button (active 10 minutes prior), and `[ Reschedule / Cancel ]` options.
  - **Completed**: Past sessions with a prominent `[ Leave Testimonial & Review ]` prompt.
  - **Cancelled**: Historical audit log of cancelled sessions.
