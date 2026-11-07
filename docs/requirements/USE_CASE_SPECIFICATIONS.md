# Use Case Specifications: Peyroo Mentorship Platform

**Project Working Title:** Peyroo (پیرو)  
**Academic Course:** Software Analysis and Design (SSAD) | Fall 1405  
**Document Identifier:** `docs/requirements/USE_CASE_SPECIFICATIONS.md`  
**Status:** `[BASELINE - STAGE 04]`  
**Date:** Aban 1405 / November 2026  
**Document Version:** 1.0  

---

## 1. Overview

This document provides formal Use Case Specifications for the core functional interactions within the **Peyroo Mentorship Platform**. Each specification adheres to standard software engineering practice, detailing preconditions, primary success flows, alternative/branching paths, failure exception paths, postconditions, and mapped requirements.

---

## 2. Use Case Catalog

| Use Case ID | Use Case Name | Primary Actor | Priority |
|---|---|---|---|
| **UC-001** | Register User Account | Guest | Must Have |
| **UC-002** | Configure Mentor Profile & Enable Capability | Authenticated User | Must Have |
| **UC-003** | Publish Availability Slot | Mentor | Must Have |
| **UC-004** | Discover & Filter Mentors | Mentee / Guest | Must Have |
| **UC-005** | Book Session & Submit Structured Agenda | Mentee | Must Have |
| **UC-006** | Complete Payment via Mock Banking Gateway | Mentee | Must Have |
| **UC-007** | View Dashboard & Access Meeting Link | Mentee / Mentor | Must Have |
| **UC-008** | Cancel Session Booking (Mentee / Mentor) | Mentee / Mentor | Must Have |
| **UC-009** | Submit Post-Session Review | Mentee | Should Have |
| **UC-010** | Moderate User & Audit Platform Ledger | Platform Administrator | Must Have |

---

## 3. Detailed Specifications

### Use Case: `UC-001` — Register User Account
- **Primary Actor:** Guest / Unauthenticated Visitor
- **Preconditions:** Guest is connected to the web platform and is not authenticated.
- **Related Requirements:** `FR-001`, `FR-002`, `NFR-001`, `NFR-003`
- **Main Flow:**
  1. Guest navigates to the Registration page.
  2. Guest inputs full name, email address, and desired password.
  3. Guest submits the registration form.
  4. System validates that the email format is correct and does not already exist in the database.
  5. System hashes the password using Argon2id/bcrypt (`NFR-001`).
  6. System creates a new user record with `status = ACTIVE`, `isMenteeEnabled = true`, and `isMentorEnabled = false`.
  7. System generates an authenticated session token (`NFR-003`).
  8. System redirects the user to the Mentee Dashboard with a welcome confirmation.
- **Alternative Flows:**
  - *None.*
- **Exception Flows:**
  - *4a. Invalid Data Format:* If email format is invalid or password does not meet complexity rules, system returns validation error messages and highlights offending fields.
  - *4b. Duplicate Email:* If the email address is already registered, system returns HTTP 409 with the message "Email already registered; please log in."
- **Postconditions:** A new user record exists in the database; user is logged in with active Mentee capability.

---

### Use Case: `UC-002` — Configure Mentor Profile & Enable Capability
- **Primary Actor:** Authenticated User
- **Preconditions:** User is logged in (`status == ACTIVE`).
- **Related Requirements:** `FR-004`, `FR-005`, `NFR-002`
- **Main Flow:**
  1. User toggles to "Mentor Mode" or selects "Become a Mentor" from the navigation menu.
  2. System presents the Mentor Profile Configuration form.
  3. User enters Professional Headline, Biography ($\ge 20$ characters), Technical Expertise Tags, Base Session Rate ($\ge 0$), and Default Meeting URL (valid HTTPS link).
  4. User submits the configuration form.
  5. System validates all mandatory fields.
  6. System persists the mentor profile attributes and sets `isMentorEnabled = true`.
  7. System confirms capability activation and transitions UI to the Mentor Dashboard.
- **Alternative Flows:**
  - *3a. Existing Mentor Updates Profile:* Mentor modifies bio, tags, rate, or default meeting link. System updates records and applies the new default meeting URL to future slots.
- **Exception Flows:**
  - *5a. Incomplete Profile:* If required fields are missing or meeting link is not a valid URL, system returns HTTP 422 with descriptive validation errors.
- **Postconditions:** User has active Mentor capability and can publish availability slots.

---

### Use Case: `UC-003` — Publish Availability Slot
- **Primary Actor:** Mentor
- **Preconditions:** User is logged in and possesses active Mentor capability (`isMentorEnabled == true`).
- **Related Requirements:** `FR-007`, `FR-008`, `NFR-002`
- **Main Flow:**
  1. Mentor navigates to "Manage Availability" in the Mentor Dashboard.
  2. Mentor clicks "Add New Slot".
  3. Mentor selects slot date, start time, and standard duration (30, 45, or 60 minutes).
  4. System pre-populates session rate and meeting URL from mentor profile defaults (mentor can override if desired).
  5. Mentor submits the slot creation form.
  6. System validates that the slot is scheduled in the future and does not overlap with any existing slot published by this mentor (`FR-008`).
  7. System persists the new slot with status `OPEN`.
  8. System displays the new slot in the mentor's availability calendar/list.
- **Alternative Flows:**
  - *None.*
- **Exception Flows:**
  - *6a. Temporal Overlap Conflict:* If the proposed slot collides with an existing slot for this mentor, system rejects with HTTP 409 Conflict: "Time slot overlaps with an existing availability slot."
  - *6b. Invalid Duration:* If duration is not 30, 45, or 60 minutes, system rejects with HTTP 422.
- **Postconditions:** A new `OPEN` availability slot is created and visible in the public catalog.

---

### Use Case: `UC-004` — Discover & Filter Mentors
- **Primary Actor:** Mentee / Guest
- **Preconditions:** Platform is accessible.
- **Related Requirements:** `FR-006`, `FR-010`, `FR-011`, `NFR-005`, `NFR-007`
- **Main Flow:**
  1. User navigates to the "Explore Mentors" catalog.
  2. System retrieves and renders active mentors with upcoming `OPEN` slots (`NFR-007`).
  3. User selects one or more technical filter tags (e.g., "Backend", "Go").
  4. System filters the mentor list in real time to show matching mentors.
  5. User clicks on a mentor card.
  6. System displays the mentor's public profile, expertise tags, rate, and open time slots (omitting private meeting URLs, `NFR-005`).
- **Alternative Flows:**
  - *4a. No Matching Mentors:* If no mentors match selected tags, system displays "No mentors found matching your criteria" with a "Clear Filters" button.
- **Exception Flows:**
  - *None.*
- **Postconditions:** User identifies a desired mentor and an available time slot.

---

### Use Case: `UC-005` — Book Session & Submit Structured Agenda
- **Primary Actor:** Mentee
- **Preconditions:** Mentee is logged in; target slot has status `OPEN`; slot start time is at least 2 hours in the future.
- **Related Requirements:** `FR-012`, `FR-013`, `FR-014`, `FR-015`, `NFR-002`, `NFR-006`, `NFR-008`
- **Main Flow:**
  1. Mentee views mentor's open slots and selects an `OPEN` slot.
  2. System prompts mentee with the Structured Agenda form.
  3. Mentee enters Discussion Topic / Objective, Specific Questions, and optional repository/portfolio URL.
  4. Mentee clicks "Proceed to Payment".
  5. System validates that mentee is not booking their own slot (`FR-012`).
  6. System validates that slot start time is $\ge 2$ hours away (`FR-013`).
  7. System executes an atomic transaction lock: transitions slot status to `HELD` and creates booking with status `PENDING_PAYMENT` and `expires_at = now + 15 min` (`FR-015`, `NFR-008`).
  8. System calculates the financial breakdown (Mentor Fee + 10% Peyroo Commission, `FR-017`).
  9. System redirects the mentee to the Mock Banking Gateway (`UC-006`).
- **Alternative Flows:**
  - *None.*
- **Exception Flows:**
  - *5a. Self-Booking Attempt:* If `mentee_id == slot.mentor_id`, system rejects with HTTP 403 Forbidden: "Mentors cannot book their own slots."
  - *6a. Less Than 2 Hours Notice:* System rejects with HTTP 422: "Bookings must be scheduled at least 2 hours in advance."
  - *7a. Concurrency Conflict (Slot Already Held/Booked):* If another mentee reserved the slot concurrently, system returns HTTP 409: "This slot is no longer available; please choose another slot."
- **Postconditions:** Target slot is `HELD`; booking is `PENDING_PAYMENT`; 15-minute expiration clock is running.

---

### Use Case: `UC-006` — Complete Payment via Mock Banking Gateway
- **Primary Actor:** Mentee
- **Preconditions:** Booking is in `PENDING_PAYMENT`; slot is `HELD`; transaction is within 15-minute window.
- **Related Requirements:** `FR-016`, `FR-017`, `FR-018`, `FR-019`, `NFR-009`
- **Main Flow:**
  1. Mentee is presented with the Mock Banking Gateway interface showing the itemized total (Mentor Fee + 10% Platform Commission).
  2. Mentee reviews details, inputs simulated card info, and clicks "Simulate Successful Payment".
  3. Gateway sends a verification callback to the backend API (`POST /api/payments/callback`).
  4. Backend validates transaction reference and verifies booking is still within the 15-minute window.
  5. Backend records an immutable `COMPLETED` transaction in the financial ledger (`NFR-009`).
  6. Backend updates slot status to `BOOKED` and booking status to `CONFIRMED`.
  7. Backend redirects mentee to the Booking Confirmation view.
  8. System renders booking receipt, meeting details, and reveals the authorized meeting URL (`FR-021`, `NFR-005`).
- **Alternative Flows:**
  - *2a. Simulated Payment Failure:* Mentee clicks "Simulate Failed Payment". Gateway triggers failure callback. Backend records `FAILED` transaction in ledger, transitions booking to `PAYMENT_FAILED`, and immediately returns slot to `OPEN`. System displays payment failure notice with retry option.
  - *2b. Payment Window Expiration:* Mentee abandons session $> 15$ minutes. Background worker or status check marks booking `EXPIRED` and returns slot to `OPEN` (`FR-016`). Subsequent payment attempt is rejected.
- **Exception Flows:**
  - *4a. Expired Callback:* If payment arrives after expiration, system rejects callback, logs error, and issues simulated refund.
- **Postconditions:** Booking is `CONFIRMED`; slot is permanently `BOOKED`; financial ledger record is persisted.

---

### Use Case: `UC-007` — View Dashboard & Access Meeting Link
- **Primary Actor:** Mentee / Mentor
- **Preconditions:** User is logged in.
- **Related Requirements:** `FR-020`, `FR-021`, `NFR-002`, `NFR-005`, `NFR-006`
- **Main Flow:**
  1. User navigates to their Session Dashboard (Mentee or Mentor mode).
  2. System retrieves bookings where user is either `mentee_id` or `mentor_id`.
  3. For each booking in `CONFIRMED` status, system renders the scheduled time, other party's details, submitted agenda, and reveals the external meeting URL button.
  4. User clicks the meeting URL button, opening the Google Meet / Zoom room in a new browser tab.
- **Alternative Flows:**
  - *3a. Past Completed Sessions:* System displays sessions in `COMPLETED` status without active meeting link emphasis, offering a "Leave Review" button for mentees (`UC-009`).
- **Exception Flows:**
  - *3b. Unauthorized Access Attempt:* If user attempts to fetch details of a booking they do not participate in, backend returns HTTP 403 Forbidden (`NFR-002`).
- **Postconditions:** Authorized participant accesses the scheduled meeting URL.

---

### Use Case: `UC-008` — Cancel Session Booking
- **Primary Actor:** Mentee / Mentor
- **Preconditions:** Booking status is `CONFIRMED`; session scheduled start time is in the future.
- **Related Requirements:** `FR-022`, `FR-023`, `FR-024`, `NFR-009`, `NFR-010`
- **Main Flow (Mentee Cancellation with $\ge 24$h Notice):**
  1. Mentee selects a confirmed booking on their dashboard and clicks "Cancel Session".
  2. System prompts for confirmation, displaying policy: "Full refund will be issued."
  3. Mentee confirms cancellation.
  4. Backend verifies `(slot.start_time - current_timestamp) >= 24 hours`.
  5. Backend transitions booking status to `CANCELLED_REFUNDED`.
  6. Backend records a `REFUNDED` transaction in the financial ledger (`NFR-009`).
  7. Backend transitions slot back to `OPEN` (if start time $\ge 2$ hours away).
  8. System displays cancellation confirmation with refund receipt.
- **Alternative Flows:**
  - *4a. Mentee Late Cancellation ($< 24$h Notice):* If `start_time - now < 24 hours`, system informs mentee: "Cancellations under 24 hours are non-refundable." If mentee confirms, booking transitions to `CANCELLED_NO_REFUND`. No refund transaction is generated. Slot transitions to `CANCELLED`. Mentor payout remains credited.
  - *4b. Mentor Cancellation (Anytime Prior to Session):* Mentor clicks "Cancel Session". System prompts for confirmation. Upon confirmation, backend transitions booking to `CANCELLED_BY_MENTOR`, automatically issues a 100% full refund (`REFUNDED` ledger entry), and marks slot as `CANCELLED`. Mentee is notified.
- **Exception Flows:**
  - *4c. Past Session Cancellation:* If session start time has already passed, cancellation is rejected with HTTP 400.
- **Postconditions:** Booking is cancelled; ledger records refund if applicable; records preserved for audit (`NFR-010`).

---

### Use Case: `UC-009` — Submit Post-Session Review
- **Primary Actor:** Mentee
- **Preconditions:** Mentee is logged in; booking status is `COMPLETED`; no review previously submitted for this booking.
- **Related Requirements:** `FR-025`, `FR-026`, `NFR-002`
- **Main Flow:**
  1. Mentee views a `COMPLETED` booking on their dashboard and clicks "Leave Review".
  2. System displays review modal containing mandatory 1–5 star rating selector and optional text feedback box.
  3. Mentee selects star rating (e.g., 5 stars), enters feedback, and clicks "Submit Review".
  4. System validates rating is an integer between 1 and 5 and text comment $\le 1000$ characters.
  5. System persists the review linked to the mentor and booking.
  6. System recalculates the mentor's average rating on their public profile.
  7. System disables further review submissions for this booking.
- **Alternative Flows:**
  - *None.*
- **Exception Flows:**
  - *4a. Duplicate Review Attempt:* If a review already exists for this booking ID, system rejects with HTTP 409 Conflict.
  - *4b. Incomplete Session:* If booking is not in `COMPLETED` status, review submission is rejected with HTTP 403 Forbidden.
- **Postconditions:** Review is published and mentor's aggregate rating is updated.

---

### Use Case: `UC-010` — Moderate User & Audit Platform Ledger
- **Primary Actor:** Platform Administrator
- **Preconditions:** Administrator is logged in (`auth.user.isAdmin == true`).
- **Related Requirements:** `FR-027`, `FR-028`, `FR-029`, `NFR-002`, `NFR-009`
- **Main Flow:**
  1. Administrator navigates to the Admin Panel.
  2. System displays platform-wide summary cards: Total Registered Users, Active Mentors, Total Bookings, Total Gross Volume, Platform Commission Collected (10%), and Total Refunds.
  3. Administrator views the User Management tab and searches for a specific user.
  4. Administrator toggles the user's status from `ACTIVE` to `SUSPENDED`.
  5. System invalidates target user's active sessions and updates status in the database (`FR-027`).
  6. Administrator views the Financial Ledger tab and filters transactions by status (`COMPLETED`, `REFUNDED`).
  7. Administrator views the Global Bookings tab in read-only mode to audit session lifecycles.
- **Alternative Flows:**
  - *4a. Reactivate User:* Administrator toggles a `SUSPENDED` account back to `ACTIVE`.
- **Exception Flows:**
  - *2a. Non-Admin Access Attempt:* If a regular user navigates to `/admin`, system rejects request with HTTP 403 Forbidden (`NFR-002`).
- **Postconditions:** User status is updated or ledger audit is reviewed; administrator actions are logged.
