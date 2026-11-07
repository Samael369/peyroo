# Prioritized User Stories & MVP Definition: Peyroo Mentorship Platform

**Project Working Title:** Peyroo (پیرو)  
**Academic Course:** Software Analysis and Design (SSAD) | Fall 1405  
**Semester Work Plan Milestone:** Plan 1 (9–15 Aban 1405) — *Define the MVP and prioritize user stories*  
**Document Identifier:** `docs/requirements/USER_STORIES.md`  
**Status:** `[APPROVED & BASELINED]`  
**Date:** Aban 1405 / November 2026  
**Document Version:** 1.0  

---

## Table of Contents
1. [Product Overview & MVP Boundaries](#1-product-overview--mvp-boundaries)
2. [Prioritized User Stories Catalog (MoSCoW)](#2-prioritized-user-stories-catalog-moscow)
3. [Detailed User Stories & Observable Acceptance Criteria](#3-detailed-user-stories--observable-acceptance-criteria)
4. [Traceability to Functional Requirements & Use Cases](#4-traceability-to-functional-requirements--use-cases)

---

## 1. Product Overview & MVP Boundaries

### 1.1 Who Uses Peyroo & The Problem They Face
In the software engineering industry, junior developers, computer science students, and career switchers (**Mentees**) struggle to obtain actionable technical guidance, code reviews, and career mentorship. Relying on ad-hoc channels (LinkedIn cold messages, Telegram groups, or email) results in under 5% response rates, cold-outreach anxiety, vague unstructured conversations, and endless calendar back-and-forth. Conversely, experienced software engineers (**Mentors**) want to give back or monetize spare hours but are overwhelmed by open-ended requests that lack topical boundaries, clear agendas, or scheduling discipline.

### 1.2 What the Peyroo MVP Solves
The **Peyroo MVP** delivers one complete, end-to-end, concurrency-safe business journey from UI to persistent database storage:
1. **Unified Identity & Capability Model:** A single registered account can seamlessly toggle between **Mentee Mode** (enabled by default) and **Mentor Mode** (unlocked upon configuring bio, expertise tags, base rate, and default meeting link).
2. **Standardized Availability Publishing:** Mentors publish non-overlapping 30, 45, or 60-minute availability slots with transparent session rates and private external video URLs (Google Meet / Zoom).
3. **Structured Discovery & Agenda-Driven Booking:** Mentees filter mentors by technical tags, select an open slot (at least 2 hours in advance), and submit a mandatory structured session agenda (objective, specific questions, and repository/portfolio links).
4. **ACID Concurrency & 15-Minute Reservation Lock:** Initiating a booking atomically locks the slot (`HELD`) for 15 minutes via PostgreSQL row-level locking (`SELECT ... FOR UPDATE`) and partial unique indexing, preventing double-booking race conditions.
5. **Commercial Viability & Mock Banking Gateway:** The platform calculates a **10% Peyroo platform commission** ($\text{Total} = \text{Mentor Fee} + 10\%$), routes the mentee through an interactive **Mock Payment Gateway Simulator**, records an auditable transaction ledger (`PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`), and confirms the booking (`CONFIRMED`).
6. **Strict Backend Ownership & Confidentiality:** Meeting URLs and agendas are strictly masked in public catalog queries and disclosed exclusively to the booked Mentee and Mentor once the session is `CONFIRMED`.
7. **Policy-Enforced Cancellations & Governance:** Supports time-bounded mentee cancellations ($\ge 24\text{h}$ full refund; $< 24\text{h}$ non-refundable), mentor cancellations (100% refund anytime), automated session completion, verified reviews, and administrator governance.

### 1.3 What Features Are Deliberately Left Out (Out of Scope)
To maintain ruthless MVP scope discipline and ensure high-quality delivery within the semester schedule, the following features are explicitly **excluded (`Won't Have`)**:
- **Native In-App Video/Audio Streaming (WebRTC):** Replaced by confidential external meeting URLs (Google Meet / Zoom) revealed upon confirmation.
- **Live Real-Money Banking Gateways & Escrow:** Replaced by the deterministic Mock Banking Gateway Simulator and internal auditable financial ledger.
- **Two-Way External Calendar Sync (Google/Outlook OAuth APIs):** Mentors manage discrete slots directly in Peyroo.
- **Real-Time In-App Chat (WebSockets):** Structured pre-session agendas eliminate the need for back-and-forth messaging.
- **Native Mobile Applications (iOS / Android):** Delivered as a responsive web application over HTTPS.

---

## 2. Prioritized User Stories Catalog (MoSCoW)

All identified user stories follow the standard agile format mandated by Section 2 of the course project specification:
> *"As a **[user role]**, I want **[action]**, so that **[benefit]**."*

| Story ID | Actor / Role | User Story Summary | MoSCoW Priority | Traced FRs |
|:---:|---|---|:---:|:---:|
| **US-01** | Guest / Registered User | Register an account, sign in, and sign out with persistent session state | **Must Have** | `FR-001` – `FR-003` |
| **US-02** | Authenticated User | Configure a Mentor Profile and toggle between Mentee and Mentor modes | **Must Have** | `FR-004`, `FR-005` |
| **US-03** | Mentor | Publish non-overlapping availability slots (30/45/60m) and remove open slots | **Must Have** | `FR-007` – `FR-009` |
| **US-04** | Guest / Mentee | Browse the mentor catalog, filter by technical expertise tags, and view open slots | **Must Have** | `FR-006`, `FR-010`, `FR-011` |
| **US-05** | Mentee | Reserve an open slot with a mandatory structured agenda and 15-minute lock | **Must Have** | `FR-012` – `FR-016` |
| **US-06** | Mentee | Complete session payment (including 10% platform commission) via Mock Bank Gateway | **Must Have** | `FR-017` – `FR-019` |
| **US-07** | Mentee & Mentor | View personal session dashboards and access confidential meeting URLs & agendas | **Must Have** | `FR-020`, `FR-021`, `FR-025` |
| **US-08** | Mentee | Cancel a confirmed booking under the 24-hour refund policy | **Must Have** | `FR-022`, `FR-023` |
| **US-09** | Mentor | Cancel an upcoming booked session with an automatic 100% refund to the mentee | **Must Have** | `FR-024` |
| **US-10** | Platform Admin | Moderate user account statuses (`ACTIVE`/`SUSPENDED`) and audit global ledgers | **Must Have** | `FR-027` – `FR-029` |
| **US-11** | Mentee | Submit a verified 1–5 star rating and review after a session is completed | **Should Have** | `FR-026` |
| **US-12** | Mentee & Mentor | View logged/simulated email notifications for booking confirmations and cancellations | **Should Have** | `PROJECT_SCOPE` §3 |
| **US-13** | Mentee & Mentor | Export a confirmed mentorship session to an `.ics` calendar file | **Could Have** | `PROJECT_SCOPE` §3 |
| **US-14** | Mentee | Bookmark favorite mentors for quick future access | **Could Have** | `PROJECT_SCOPE` §3 |

---

## 3. Detailed User Stories & Observable Acceptance Criteria

Each user story below includes observable acceptance criteria covering **success behavior**, **failure/validation cases**, and **backend-enforced authorization & ownership rules**.

---

### `US-01`: Account Registration, Login, and Session Persistence
- **Priority:** **Must Have (MVP)**
- **User Story:**
  > *"As a **visitor or registered user**, I want **to register an account, log in, and log out securely**, so that **my identity and personal mentorship records remain protected across browser refreshes and return visits**."*
- **Observable Acceptance Criteria:**
  - **Success Behavior:**
    - A visitor submitting a valid full name, unique email address, and password ($\ge 8$ chars) receives a `201 Created` response, has an `ACTIVE` account created with Mentee capability enabled by default, and is signed in via an `HttpOnly` session cookie.
    - A registered user submitting valid credentials via login stays authenticated after refreshing the page or closing/reopening the browser tab.
    - Clicking logout invalidates the session cookie; subsequent requests to protected endpoints return `401 Unauthorized`.
  - **Failure & Ownership Cases:**
    - Registering with an email address that already exists fails with `409 Conflict` without creating a duplicate user record.
    - Logging in with an incorrect password fails with `401 Unauthorized`.
    - Logging in with an account whose status is `SUSPENDED` is rejected by the backend with `403 Forbidden`.

---

### `US-02`: Mentor Profile Activation & Dual-Mode Toggling
- **Priority:** **Must Have (MVP)**
- **User Story:**
  > *"As an **authenticated user**, I want **to complete my mentor profile with my expertise tags, session rate, and default meeting link and toggle between Mentee and Mentor modes**, so that **I can both seek mentorship and offer mentorship from a single unified account**."*
- **Observable Acceptance Criteria:**
  - **Success Behavior:**
    - Submitting a valid professional headline, bio ($\ge 20$ characters), at least one technical expertise tag (e.g., `Backend`, `Go`, `System Design`), base session rate ($\ge 0$), and a valid HTTPS default meeting URL updates the profile and sets `isMentorEnabled = true`.
    - Once `isMentorEnabled = true`, the user can switch between "Mentee Mode" and "Mentor Mode" in the interface.
  - **Failure & Ownership Cases:**
    - Submitting a mentor profile with a bio shorter than 20 characters, negative rate, or non-HTTPS meeting link fails with `422 Unprocessable Entity` and leaves `isMentorEnabled = false`.
    - A user cannot modify another user's mentor profile; backend enforces identity from the authenticated session token (`403 Forbidden` if unauthorized).
    - Attempting to access mentor slot-publishing actions while `isMentorEnabled = false` is rejected by the backend with `403 Forbidden`.

---

### `US-03`: Mentor Availability Slot Management
- **Priority:** **Must Have (MVP)**
- **User Story:**
  > *"As a **mentor**, I want **to publish available time slots of 30, 45, or 60 minutes and delete my unbooked slots**, so that **mentees can book my time strictly within my schedule boundaries without calendar back-and-forth**."*
- **Observable Acceptance Criteria:**
  - **Success Behavior:**
    - A mentor can create a future availability slot with a start time, duration (`30`, `45`, or `60` minutes), optional custom fee, and optional custom meeting link; the slot is saved in the database with status `OPEN` and remains visible after refreshing the page.
    - A mentor can delete an `OPEN` slot they own, removing it from public discovery.
  - **Failure & Ownership Cases:**
    - Creating a slot that overlaps in time with another active slot owned by the same mentor (`new_start < existing_end AND new_end > existing_start`) is rejected by the backend and database constraint with `409 Conflict`.
    - Creating a slot in the past or with a non-standard duration (e.g., 25 or 90 minutes) fails with `422 Unprocessable Entity`.
    - Mentor A cannot delete or modify Mentor B's time slot (`403 Forbidden`).
    - A mentor cannot directly delete a slot that is currently `HELD` or `BOOKED` (`409 Conflict`; must use the session cancellation workflow instead).

---

### `US-04`: Mentor Discovery, Tag Filtering & Confidential Slot Viewing
- **Priority:** **Must Have (MVP)**
- **User Story:**
  > *"As a **mentee**, I want **to browse mentors, filter them by technical expertise tags, and inspect their open availability slots**, so that **I can quickly find a qualified industry professional whose expertise and schedule match my goals**."*
- **Observable Acceptance Criteria:**
  - **Success Behavior:**
    - Users can view the mentor catalog showing each active mentor's name, headline, expertise tags, base session rate, average rating, and upcoming `OPEN` slots.
    - Selecting one or more technical tags (e.g., `Backend`, `React`, `DevOps`) filters the catalog to show matching mentors.
    - Clicking a mentor opens their public profile with their bio and selectable `OPEN` time slots.
  - **Failure & Ownership Cases:**
    - **Confidentiality Rule:** Public catalog and mentor profile API responses strictly omit the mentor's `default_meeting_url` and any slot `meeting_url` so unauthorized visitors cannot join private meeting rooms.
    - Slots in `HELD`, `BOOKED`, or `CANCELLED` status cannot be selected for new bookings.

---

### `US-05`: Session Booking Initiation, Structured Agenda & Concurrency Lock
- **Priority:** **Must Have (MVP)**
- **User Story:**
  > *"As a **mentee**, I want **to reserve an available time slot and submit my structured session agenda**, so that **my mentor knows my exact questions in advance and the slot is exclusively held for me for 15 minutes while I complete payment**."*
- **Observable Acceptance Criteria:**
  - **Success Behavior:**
    - Selecting an `OPEN` slot ($\ge 2$ hours in the future) and submitting a valid agenda (topic $\ge 10$ chars, specific questions $\ge 15$ chars, optional GitHub/portfolio URL) atomically transitions the slot to `HELD` and creates a booking in `PENDING_PAYMENT` status with `expires_at = now + 15 minutes`.
    - If payment is not completed within 15 minutes, the reservation expires (`EXPIRED`) and the slot automatically returns to `OPEN` for other mentees.
  - **Failure & Ownership Cases:**
    - **No Double-Booking:** If two mentees click "Book" on the same open slot simultaneously, database row-level locking (`SELECT ... FOR UPDATE`) and partial unique indexing ensure only the first request succeeds (`201 Created`) while the second fails cleanly with `409 Conflict` without creating a second booking.
    - **Self-Booking Blocked:** A mentor attempting to book their own availability slot is rejected by the backend with `403 Forbidden`.
    - **Advance Notice Rule:** Attempting to book a slot starting in less than 2 hours fails with `422 Unprocessable Entity`.
    - **Unauthenticated Access Blocked:** An unauthenticated visitor attempting to POST a booking is rejected with `401 Unauthorized`.

---

### `US-06`: Mock Banking Payment & 10% Platform Commission Verification
- **Priority:** **Must Have (MVP)**
- **User Story:**
  > *"As a **mentee**, I want **to review the itemized price breakdown (mentor fee plus 10% platform commission) and pay via the Mock Banking Gateway**, so that **my booking is permanently confirmed and an auditable receipt is recorded**."*
- **Observable Acceptance Criteria:**
  - **Success Behavior:**
    - Upon booking initiation, the backend computes `platform_commission = mentor_fee * 0.10` and `total_amount = mentor_fee + platform_commission` and redirects the mentee to the Mock Banking Gateway interface.
    - Clicking **"Simulate Successful Payment"** triggers a signed callback to the backend, records a `COMPLETED` payment transaction in the ledger, transitions the booking to `CONFIRMED`, and permanently transitions the slot to `BOOKED`.
    - The confirmed booking persists in the database and remains visible when the mentee or mentor refreshes or returns later.
  - **Failure & Ownership Cases:**
    - Clicking **"Simulate Failed Payment"** records a `FAILED` transaction in the ledger, transitions the booking to `PAYMENT_FAILED`, immediately releases the slot back to `OPEN`, and shows a clear error state to the mentee.
    - **Late Payment After Expiry:** If a payment callback arrives after the 15-minute reservation window has already expired, expiration takes strict precedence: the captured payment is recorded as `COMPLETED` followed immediately by an automatic linked `CANCELLATION_REFUND` transaction, keeping net balance accurate without corrupting slot state.
    - Duplicate webhook callbacks with the same `idempotency_key` are safely ignored without double-charging.

---

### `US-07`: Personal Session Dashboards & Confidential Meeting Link Disclosure
- **Priority:** **Must Have (MVP)**
- **User Story:**
  > *"As a **mentee or mentor**, I want **to view my upcoming, completed, and cancelled sessions in my dashboard and access the private video meeting link for confirmed sessions**, so that **I can prepare from the submitted agenda and join the 1-on-1 call on time**."*
- **Observable Acceptance Criteria:**
  - **Success Behavior:**
    - Both the booked Mentee and the booked Mentor can view the session date/time, status, itemized fee, submitted agenda, and the external `meeting_url` (Google Meet / Zoom) once the booking status is `CONFIRMED`.
    - Once the scheduled slot `end_time` passes, the system automatically transitions `CONFIRMED` bookings to `COMPLETED`.
  - **Failure & Ownership Cases:**
    - **Strict Ownership Enforcement:** User C (any authenticated user who is neither the `mentee_id` nor the `mentor_id` of the booking) is strictly rejected with `403 Forbidden` when attempting to view the booking details, agenda, or `meeting_url`.
    - If a booking is in `PENDING_PAYMENT`, `PAYMENT_FAILED`, `EXPIRED`, or `CANCELLED_*` status, the `meeting_url` is masked (`null`) even for the participants.

---

### `US-08`: Mentee Booking Cancellation & 24-Hour Refund Policy
- **Priority:** **Must Have (MVP)**
- **User Story:**
  > *"As a **mentee**, I want **to cancel my confirmed booking if my schedule changes**, so that **I receive a full refund when cancelling at least 24 hours in advance, while respecting the mentor's time if cancelling late**."*
- **Observable Acceptance Criteria:**
  - **Success Behavior:**
    - **Early Cancellation ($\ge 24\text{h}$ before start time):** Booking status transitions to `CANCELLED_REFUNDED`, a linked `CANCELLATION_REFUND` entry for 100% of the total paid amount is recorded in the financial ledger, and the slot reverts to `OPEN`.
    - **Late Cancellation ($< 24\text{h}$ before start time):** Booking status transitions to `CANCELLED_NO_REFUND`, no refund ledger entry is created, and the slot transitions to `CANCELLED` (not re-opened).
  - **Failure & Ownership Cases:**
    - Mentee A cannot cancel Mentee B's booking; the backend verifies `booking.mentee_id == auth.user_id` and rejects unauthorized requests with `403 Forbidden`.
    - A booking that is already `COMPLETED` or already cancelled cannot be cancelled again (`409 Conflict`).

---

### `US-09`: Mentor Session Cancellation with Automatic Mentee Refund
- **Priority:** **Must Have (MVP)**
- **User Story:**
  > *"As a **mentor**, I want **to cancel an upcoming confirmed session if an emergency arises**, so that **the mentee is automatically issued a 100% full refund and my slot is marked cancelled**."*
- **Observable Acceptance Criteria:**
  - **Success Behavior:**
    - When the mentor owning the slot cancels a `CONFIRMED` booking at any time prior to `start_time`, the booking transitions to `CANCELLED_BY_MENTOR`, a 100% `CANCELLATION_REFUND` transaction is recorded in the ledger for the mentee, and the slot status becomes `CANCELLED`.
  - **Failure & Ownership Cases:**
    - Mentor A cannot cancel a session belonging to Mentor B (`403 Forbidden`).
    - Attempting to cancel a session after its `start_time` has passed is rejected with `422 Unprocessable Entity`.

---

### `US-10`: Platform Administrator Governance & Financial Ledger Audit
- **Priority:** **Must Have (MVP)**
- **User Story:**
  > *"As a **platform administrator**, I want **to suspend or reactivate user accounts and inspect the global booking and financial commission ledgers**, so that **I can enforce platform rules and verify total transaction volume and 10% platform revenue**."*
- **Observable Acceptance Criteria:**
  - **Success Behavior:**
    - An administrator (`isAdmin = true`) can list users and toggle a user's status between `ACTIVE` and `SUSPENDED`.
    - An administrator can view read-only financial metrics (total volume, mentor payouts, 10% platform commission, refunds) and inspect the global booking audit log.
  - **Failure & Ownership Cases:**
    - Any non-admin user (`isAdmin = false`) attempting to call `/api/admin/*` endpoints is rejected by the backend with `403 Forbidden`.
    - Even an administrator cannot create slots on behalf of mentors, modify mentor session prices, or book sessions on behalf of mentees.

---

### `US-11`: Verified Mentee Post-Session Review
- **Priority:** **Should Have**
- **User Story:**
  > *"As a **mentee**, I want **to submit a 1–5 star rating and review comment after my mentorship session is completed**, so that **I can share authentic feedback to help future mentees choose mentors**."*
- **Observable Acceptance Criteria:**
  - **Success Behavior:**
    - A mentee whose booking is in `COMPLETED` status can submit a rating (`1` to `5`) and optional comment ($\le 1000$ chars), saving the review and updating the mentor's aggregate rating.
  - **Failure & Ownership Cases:**
    - Attempting to review a booking that is not in `COMPLETED` status fails with `403 Forbidden`.
    - A user who was not the mentee of that specific booking cannot submit a review (`403 Forbidden`).
    - Submitting a second review for the same `booking_id` is rejected with `409 Conflict` (enforced by unique constraint on `booking_id`).

---

### `US-12` – `US-14`: Secondary Enhancements (Should Have / Could Have)
- **`US-12` (Should Have — Notification Log):** *"As a **mentee or mentor**, I want **the system to log or dispatch confirmation and cancellation alerts**, so that **I have a clear record of state transitions**."*
- **`US-13` (Could Have — Calendar `.ics` Export):** *"As a **mentee or mentor**, I want **to download an `.ics` calendar file for a confirmed session**, so that **I can import the appointment into my personal calendar app**."*
- **`US-14` (Could Have — Mentor Bookmarks):** *"As a **mentee**, I want **to bookmark mentors into a saved list**, so that **I can easily find them when I am ready to book later**."*

---

## 4. Traceability to Functional Requirements & Use Cases

| User Story ID | Story Title | Priority | Functional Requirements (`FUNCTIONAL_REQUIREMENTS.md`) | Use Cases (`USE_CASE_SPECIFICATIONS.md`) | Acceptance Criteria (`ACCEPTANCE_CRITERIA.md`) |
|:---:|---|:---:|---|---|---|
| **US-01** | Account Registration, Login & Logout | Must Have | `FR-001`, `FR-002`, `FR-003` | `UC-001` | `AC-FR-001` – `AC-FR-003` |
| **US-02** | Mentor Profile & Mode Toggling | Must Have | `FR-004`, `FR-005` | `UC-002` | `AC-FR-004`, `AC-FR-005` |
| **US-03** | Mentor Availability Slot Management | Must Have | `FR-007`, `FR-008`, `FR-009` | `UC-003` | `AC-FR-007` – `AC-FR-009` |
| **US-04** | Mentor Discovery & Tag Filtering | Must Have | `FR-006`, `FR-010`, `FR-011` | `UC-004` | `AC-FR-006`, `AC-FR-010`, `AC-FR-011` |
| **US-05** | Booking Initiation, Agenda & 15m Lock | Must Have | `FR-012`, `FR-013`, `FR-014`, `FR-015`, `FR-016` | `UC-005`, `UC-006` | `AC-FR-012` – `AC-FR-016` |
| **US-06** | Mock Bank Payment & 10% Commission | Must Have | `FR-017`, `FR-018`, `FR-019` | `UC-005`, `UC-006` | `AC-FR-017` – `AC-FR-019` |
| **US-07** | Dashboards & Confidential Meeting URL | Must Have | `FR-020`, `FR-021`, `FR-025` | `UC-007`, `UC-009` | `AC-FR-020`, `AC-FR-021`, `AC-FR-025` |
| **US-08** | Mentee Cancellation ($\ge 24\text{h}$ / $< 24\text{h}$) | Must Have | `FR-022`, `FR-023` | `UC-008` | `AC-FR-022`, `AC-FR-023` |
| **US-09** | Mentor Cancellation (100% Refund) | Must Have | `FR-024` | `UC-008` | `AC-FR-024` |
| **US-10** | Admin Governance & Ledger Audit | Must Have | `FR-027`, `FR-028`, `FR-029` | `UC-010` | `AC-FR-027` – `AC-FR-029` |
| **US-11** | Verified Post-Session Review | Should Have | `FR-026` | `UC-009` | `AC-FR-026` |
