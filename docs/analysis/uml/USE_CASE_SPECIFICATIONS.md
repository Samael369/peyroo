# Detailed Use Case Specifications: Peyroo Mentorship Platform

**Project Working Title:** Peyroo (پیرو)  
**Academic Course:** Software Analysis and Design (SSAD) | Fall 1405  
**Document Identifier:** `docs/analysis/uml/USE_CASE_SPECIFICATIONS.md`  
**Status:** `[BASELINE - STAGE 05]`  
**Date:** Aban 1405 / November 2026  
**Document Version:** 1.0  

---

## 1. Specification Index

| ID | Use Case Name | Primary Actor | Supporting Actors | Priority |
|---|---|---|---|---|
| **UC-001** | Register & Authenticate User | Guest / Visitor | None | Must Have |
| **UC-002** | Configure Mentor Profile & Enable Capability | Registered User | None | Must Have |
| **UC-003** | Publish Availability Slot | Mentor | None | Must Have |
| **UC-004** | Discover & Filter Mentors | Mentee / Guest | None | Must Have |
| **UC-005** | Book Mentorship Session with Structured Agenda | Mentee | Mentor | Must Have |
| **UC-006** | Process Payment & Confirm Booking | Mentee | Mock Payment Gateway, Mentor | Must Have |
| **UC-007** | View Session Dashboard & Access Meeting URL | Mentee / Mentor | None | Must Have |
| **UC-008** | Cancel Session Booking & Process Refund | Mentee / Mentor | Mock Payment Gateway | Must Have |
| **UC-009** | Submit Verified Post-Session Review | Mentee | Mentor | Should Have |
| **UC-010** | Moderate User Accounts & Audit Ledger | Administrator | None | Must Have |

---

## 2. Detailed Specifications

### Use Case `UC-001`: Register & Authenticate User
- **Primary Actor:** Guest / Visitor
- **Supporting Actors:** None
- **Preconditions:** Client has network access to the Peyroo web application.
- **Trigger:** Guest clicks "Sign Up" or "Log In" on the navigation bar.
- **Related Requirements:** `FR-001`, `FR-002`, `FR-003`, `FR-004`, `NFR-001`, `NFR-003`
- **Main Success Scenario:**
  1. Guest submits full name, email, and password.
  2. System validates email syntax and asserts database uniqueness.
  3. System hashes the password using Argon2id/bcrypt (`NFR-001`).
  4. System creates `UserAccount` with `status = ACTIVE`, `isMenteeEnabled = true`, and `isMentorEnabled = false`.
  5. System generates an authenticated session token.
  6. System redirects user to the Mentee Dashboard.
- **Alternative Flows:**
  - *1a. Existing User Login:* User submits email and password; system verifies hash, checks account is `ACTIVE`, and issues session token.
- **Exception Flows:**
  - *2a. Duplicate Email:* System returns HTTP 409 Conflict: "Email already registered."
  - *1a. Suspended Account Login Attempt:* If account status is `SUSPENDED`, system rejects authentication with HTTP 403 Forbidden.
- **Postconditions:** A valid authenticated user session is established with default Mentee capability.

---

### Use Case `UC-002`: Configure Mentor Profile & Enable Capability
- **Primary Actor:** Registered User
- **Supporting Actors:** None
- **Preconditions:** User is authenticated and account status is `ACTIVE`.
- **Trigger:** User toggles "Mentor Mode" or clicks "Become a Mentor".
- **Related Requirements:** `FR-004`, `FR-005`, `NFR-002`
- **Main Success Scenario:**
  1. User opens the Mentor Profile Configuration view.
  2. User inputs headline, biography ($\ge 20$ characters), technical expertise tags, base session fee ($\ge 0$), and a default meeting URL.
  3. System validates that the meeting URL is a valid HTTPS URI.
  4. System persists `MentorProfile` associated with `UserAccount`.
  5. System sets `user.isMentorEnabled = true`.
  6. System grants access to the Mentor Dashboard.
- **Alternative Flows:**
  - *2a. Profile Update:* Mentor edits existing biography, rates, or tags; system saves updates.
- **Exception Flows:**
  - *3a. Invalid Input Data:* Missing mandatory fields or non-HTTPS URL return HTTP 422 Unprocessable Entity.
- **Postconditions:** User is empowered to create availability slots and receive mentorship bookings.

---

### Use Case `UC-003`: Publish Availability Slot
- **Primary Actor:** Mentor
- **Supporting Actors:** None
- **Preconditions:** User is authenticated with active Mentor capability (`isMentorEnabled == true`).
- **Trigger:** Mentor clicks "Create Availability Slot".
- **Related Requirements:** `FR-007`, `FR-008`, `FR-009`, `NFR-002`, `NFR-012`
- **Main Success Scenario:**
  1. Mentor selects slot date, start time, and standard duration (30, 45, or 60 minutes).
  2. System pre-populates session fee and meeting URL from profile defaults.
  3. Mentor confirms slot creation.
  4. System verifies that start time is in the future.
  5. System verifies that the slot does not collide with existing slots for this mentor.
  6. System creates `AvailabilitySlot` in `OPEN` status.
- **Alternative Flows:**
  - *1a. Mentor Overrides Defaults:* Mentor provides a custom session fee or custom meeting URL for this specific slot.
- **Exception Flows:**
  - *5a. Slot Collision:* If `new.start < existing.end AND new.end > existing.start`, system rejects with HTTP 409 Conflict: "Time slot collides with an existing slot."
  - *1a. Non-Standard Duration:* Duration not equal to 30, 45, or 60 minutes returns HTTP 422.
- **Postconditions:** A new bookable `OPEN` slot exists in the mentor's schedule and catalog.

---

### Use Case `UC-004`: Discover & Filter Mentors
- **Primary Actor:** Mentee / Guest
- **Supporting Actors:** None
- **Preconditions:** Web application is accessible.
- **Trigger:** User navigates to the "Explore Mentors" catalog.
- **Related Requirements:** `FR-006`, `FR-010`, `FR-011`, `NFR-005`, `NFR-007`
- **Main Success Scenario:**
  1. System retrieves active mentors possessing upcoming `OPEN` availability slots.
  2. User selects technical filter tags (e.g., "Backend", "Distributed Systems").
  3. System filters and displays matching mentor cards with pricing and credentials.
  4. User clicks a mentor card to view full profile and open calendar slots.
- **Alternative Flows:**
  - *3a. No Filters Applied:* System displays all active mentors sorted by availability.
- **Exception Flows:**
  - *3b. Zero Matches:* System displays "No mentors found matching criteria" with a "Reset Filters" action.
- **Postconditions:** User selects a specific mentor and desired open slot. Private meeting links remain concealed.

---

### Use Case `UC-005`: Book Mentorship Session with Structured Agenda
- **Primary Actor:** Mentee
- **Supporting Actors:** Mentor
- **Preconditions:** Mentee is authenticated; target slot status is `OPEN`; `(slot.start_time - now) >= 2 hours`.
- **Trigger:** Mentee selects an `OPEN` slot and clicks "Book Session".
- **Related Requirements:** `FR-012`, `FR-013`, `FR-014`, `FR-015`, `FR-017`, `NFR-002`, `NFR-008`
- **Main Success Scenario:**
  1. System displays the Structured Agenda form.
  2. Mentee inputs session objective, specific questions, and optional project URL.
  3. Mentee clicks "Proceed to Payment".
  4. System asserts `mentee_id != slot.mentor_id` (Self-Booking Invariant).
  5. System asserts `(slot.start_time - now) >= 2 hours` (Booking Notice Invariant).
  6. System atomically transitions slot status from `OPEN` to `HELD`.
  7. System creates `Booking` record with status `PENDING_PAYMENT` and `expires_at = now + 15 min`.
  8. System calculates: $\text{MentorFee} = \text{slot.rate}$, $\text{Commission} = \text{slot.rate} \times 0.10$, $\text{Total} = \text{MentorFee} + \text{Commission}$.
  9. System redirects mentee to the Mock Payment Gateway (`UC-006`).
- **Alternative Flows:**
  - *None.*
- **Exception Flows:**
  - *4a. Self-Booking Attempt:* System returns HTTP 403 Forbidden: "Mentors cannot book their own slots."
  - *5a. Late Booking ($< 2$ Hours Notice):* System returns HTTP 422: "Bookings must be made $\ge 2$ hours in advance."
  - *6a. Concurrent Booking Collision:* Another mentee acquired the slot lock moments earlier; system returns HTTP 409 Conflict: "Slot is no longer available."
- **Postconditions:** Slot is `HELD` exclusively; booking is `PENDING_PAYMENT`; 15-minute reservation timer is running.

---

### Use Case `UC-006`: Process Payment & Confirm Booking
- **Primary Actor:** Mentee
- **Supporting Actors:** Mock Payment Gateway, Mentor
- **Preconditions:** Booking is in `PENDING_PAYMENT`; slot is `HELD`; transaction is within 15-minute window.
- **Trigger:** Mentee arrives at the Mock Payment Gateway page.
- **Related Requirements:** `FR-016`, `FR-018`, `FR-019`, `NFR-009`
- **Main Success Scenario:**
  1. Mentee reviews transaction summary (Mentor Fee + 10% Platform Commission).
  2. Mentee enters card details and clicks "Simulate Successful Payment".
  3. Mock Gateway sends webhook callback `POST /api/payments/callback` to Peyroo backend.
  4. Backend verifies that booking is within the 15-minute window.
  5. Backend records an immutable `COMPLETED` transaction in the financial ledger.
  6. Backend transitions booking status to `CONFIRMED` and slot status to `BOOKED`.
  7. Gateway redirects mentee back to Booking Confirmation page.
  8. System reveals the meeting URL, receipt, and adds session to both dashboards.
- **Alternative Flows:**
  - *2a. Simulated Payment Failure:* Mentee clicks "Simulate Failed Payment". Gateway sends failure callback. Backend logs `FAILED` transaction, transitions booking to `PAYMENT_FAILED`, and immediately releases slot back to `OPEN`.
  - *2b. 15-Minute Expiration:* Mentee abandons page $> 15$ minutes. Background worker marks booking `EXPIRED` and returns slot to `OPEN` (`FR-016`). Subsequent payment callbacks are rejected.
- **Exception Flows:**
  - *4a. Callback After Expiration:* If callback arrives after 15 minutes and slot is already reverted/rebooked, system rejects confirmation, flags error, and simulates an immediate refund.
- **Postconditions:** On success, booking is `CONFIRMED`, slot is `BOOKED`, and ledger tracks commission. On failure/expiration, slot returns to `OPEN`.

---

### Use Case `UC-007`: View Session Dashboard & Access Meeting URL
- **Primary Actor:** Mentee / Mentor
- **Supporting Actors:** None
- **Preconditions:** User is authenticated.
- **Trigger:** User navigates to their dashboard.
- **Related Requirements:** `FR-020`, `FR-021`, `NFR-002`, `NFR-005`, `NFR-006`
- **Main Success Scenario:**
  1. System queries bookings where `user_id in (mentee_id, mentor_id)`.
  2. System categorizes sessions into Upcoming, Completed, and Cancelled.
  3. For upcoming `CONFIRMED` sessions, system displays scheduled start/end time, counterpart details, submitted agenda, and reveals the clickable external meeting URL.
  4. User clicks the meeting URL to open the external meeting room.
- **Alternative Flows:**
  - *None.*
- **Exception Flows:**
  - *1a. Unauthorized Query:* Third-party users attempting to inspect booking details receive HTTP 403 Forbidden.
- **Postconditions:** Participants view agendas and access the external meeting room.

---

### Use Case `UC-008`: Cancel Session Booking & Process Refund
- **Primary Actor:** Mentee / Mentor
- **Supporting Actors:** Mock Payment Gateway
- **Preconditions:** Booking status is `CONFIRMED`; session scheduled start time has not passed.
- **Trigger:** Mentee or Mentor clicks "Cancel Booking" on their dashboard.
- **Related Requirements:** `FR-022`, `FR-023`, `FR-024`, `NFR-009`, `NFR-010`
- **Main Success Scenario (Mentee Cancellation with $\ge 24$h Notice):**
  1. Mentee clicks "Cancel Booking".
  2. System verifies `(slot.start_time - now) >= 24 hours`.
  3. System updates booking status to `CANCELLED_REFUNDED`.
  4. System records a `REFUNDED` transaction in the ledger for 100% of the total amount.
  5. System reverts slot status back to `OPEN` (if slot start is still $\ge 2$ hours away).
  6. System displays refund receipt to mentee.
- **Alternative Flows:**
  - *1a. Mentee Late Cancellation ($< 24$h Notice):* System notifies mentee that late cancellations are non-refundable. Mentee confirms. System sets booking to `CANCELLED_NO_REFUND`, marks slot as `CANCELLED` (cannot be rebooked), and maintains mentor compensation.
  - *1b. Mentor Cancellation (Anytime Prior to Session):* Mentor cancels booking. System sets booking to `CANCELLED_BY_MENTOR`, marks slot as `CANCELLED`, and automatically creates a 100% `REFUNDED` ledger transaction for the mentee.
- **Exception Flows:**
  - *1c. Post-Session Cancellation:* If session start time has elapsed, cancellation is rejected with HTTP 400 Bad Request.
- **Postconditions:** Booking is cancelled; ledger tracks refunds accurately; all records preserved for audit (`NFR-010`).

---

### Use Case `UC-009`: Submit Verified Post-Session Review
- **Primary Actor:** Mentee
- **Supporting Actors:** Mentor
- **Preconditions:** Mentee is authenticated; booking status is `COMPLETED`; no review exists for this booking.
- **Trigger:** Mentee clicks "Leave Review" on a completed session card.
- **Related Requirements:** `FR-025`, `FR-026`, `NFR-002`
- **Main Success Scenario:**
  1. System opens review submission form.
  2. Mentee selects star rating ($1 \dots 5$) and writes optional feedback comment ($\le 1000$ chars).
  3. Mentee submits review.
  4. System validates inputs and asserts `booking.status == COMPLETED` and `booking.mentee_id == auth.user_id`.
  5. System records `Review` entity linked to `Booking` and `MentorProfile`.
  6. System recalculates mentor's aggregate average rating.
- **Alternative Flows:**
  - *None.*
- **Exception Flows:**
  - *4a. Duplicate Review:* If a review already exists for this booking ID, system rejects with HTTP 409 Conflict.
  - *4b. Incomplete Booking:* Attempt to review an uncompleted booking returns HTTP 403 Forbidden.
- **Postconditions:** Review is published and mentor's rating is updated.

---

### Use Case `UC-010`: Moderate User Accounts & Audit Ledger
- **Primary Actor:** Platform Administrator
- **Supporting Actors:** None
- **Preconditions:** User is authenticated with `isAdmin == true`.
- **Trigger:** Administrator accesses the Admin Panel.
- **Related Requirements:** `FR-027`, `FR-028`, `FR-029`, `NFR-002`, `NFR-009`
- **Main Success Scenario:**
  1. Administrator views system financial summary: Gross Volume, 10% Platform Commission Collected, Total Refunds.
  2. Administrator inspects user management table and toggles an abusive user's status to `SUSPENDED`.
  3. System invalidates target user's active sessions and updates status in database (`FR-027`).
  4. Administrator reviews historical global bookings in read-only mode (`FR-029`).
- **Alternative Flows:**
  - *2a. Reactivation:* Administrator toggles a `SUSPENDED` account back to `ACTIVE`.
- **Exception Flows:**
  - *1a. Non-Admin Access:* Non-administrator attempting access receives HTTP 403 Forbidden.
- **Postconditions:** User status is updated or ledger audit is verified; administrator actions are logged.
