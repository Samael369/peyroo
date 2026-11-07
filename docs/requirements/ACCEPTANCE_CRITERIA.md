# Acceptance Criteria: Peyroo Mentorship Platform

**Project Working Title:** Peyroo (پیرو)  
**Academic Course:** Software Analysis and Design (SSAD) | Fall 1405  
**Document Identifier:** `docs/requirements/ACCEPTANCE_CRITERIA.md`  
**Status:** `[BASELINE - STAGE 04]`  
**Date:** Aban 1405 / November 2026  
**Document Version:** 1.0  

---

## 1. Overview & Verification Standard

This document establishes the formal, testable **Acceptance Criteria** for all major functional requirements of the **Peyroo Mentorship Platform**. Acceptance criteria are specified using the standard **Given / When / Then** (Gherkin) notation to provide unambiguous blueprints for unit, integration, and end-to-end verification.

---

## 2. Module 1: Authentication & Capability Management

### `AC-FR-001`: User Registration
- **Scenario 1.1: Successful Registration**
  - **Given** an unauthenticated visitor is on the registration page,
  - **When** they submit a valid full name, a unique email address ("user@example.com"), and a strong password,
  - **Then** the system creates a new user record in `ACTIVE` status,
  - **And** enables the Mentee capability by default,
  - **And** returns HTTP 201 Created with an authenticated session token.
- **Scenario 1.2: Duplicate Email Rejection**
  - **Given** an existing user account is registered with "existing@example.com",
  - **When** a visitor attempts to register with "existing@example.com",
  - **Then** the system rejects the request with HTTP 409 Conflict,
  - **And** returns a structured error message: "Email is already registered."

### `AC-FR-002`: User Authentication (Login)
- **Scenario 2.1: Successful Login**
  - **Given** a registered user with email "dev@example.com" and password "ValidPassword123!",
  - **When** they submit these credentials via `POST /api/auth/login`,
  - **Then** the system returns HTTP 200 OK with a valid session token,
  - **And** sets the active user session context.
- **Scenario 2.2: Suspended Account Rejection**
  - **Given** a user account with status `SUSPENDED`,
  - **When** they submit valid email and password credentials,
  - **Then** the system rejects authentication with HTTP 403 Forbidden,
  - **And** returns error message: "Account has been suspended. Please contact platform administration."

### `AC-FR-004`: Capability Toggling
- **Scenario 4.1: Switch from Mentee to Mentor Mode**
  - **Given** an authenticated user who has completed their Mentor Profile configuration,
  - **When** they trigger a switch to Mentor Mode via `POST /api/users/me/active-role`,
  - **Then** the system returns HTTP 200 OK,
  - **And** updates the client session context to expose mentor management views.
- **Scenario 4.2: Deny Mentor Mode if Profile Incomplete**
  - **Given** an authenticated user with `isMentorEnabled == false`,
  - **When** they attempt to switch to Mentor Mode,
  - **Then** the system prompts the user to complete mandatory mentor profile setup first.

---

## 3. Module 2 & 3: Mentor Profile & Slot Management

### `AC-FR-005`: Mentor Profile Configuration
- **Scenario 5.1: Successful Mentor Activation**
  - **Given** an authenticated user with base account,
  - **When** they submit a headline, bio $\ge 20$ chars, at least one expertise tag, base rate $\ge 0$, and a valid HTTPS meeting URL,
  - **Then** the system updates user records, sets `isMentorEnabled = true`,
  - **And** returns HTTP 200 OK with the updated mentor profile.
- **Scenario 5.2: Rejection of Missing Mandatory Fields**
  - **Given** an authenticated user,
  - **When** they submit a mentor profile with an empty bio or an invalid meeting URL (e.g., "invalid-link"),
  - **Then** the system rejects the update with HTTP 422 Unprocessable Entity,
  - **And** leaves `isMentorEnabled = false`.

### `AC-FR-007`: Slot Creation Constraints
- **Scenario 7.1: Valid Slot Creation**
  - **Given** an active mentor,
  - **When** they create a slot starting tomorrow at 18:00 with duration of 45 minutes,
  - **Then** the system creates the slot with status `OPEN` and returns HTTP 201 Created.
- **Scenario 7.2: Rejection of Non-Standard Duration**
  - **Given** an active mentor,
  - **When** they attempt to create a slot with a duration of 25 minutes or 90 minutes,
  - **Then** the system rejects the request with HTTP 422 Unprocessable Entity,
  - **And** states: "Slot duration must be exactly 30, 45, or 60 minutes."

### `AC-FR-008`: Temporal Slot Collision Prevention
- **Scenario 8.1: Overlapping Slot Rejection**
  - **Given** an active mentor has an existing slot from 14:00 to 15:00 on Nov 10,
  - **When** the mentor attempts to create another slot from 14:30 to 15:15 on Nov 10,
  - **Then** the system rejects the request with HTTP 409 Conflict,
  - **And** returns error message: "Slot time collides with an existing availability slot."

---

## 4. Module 4 & 5: Discovery & Booking Concurrency

### `AC-FR-011`: Filter Mentors by Technical Expertise Tags
- **Scenario 11.1: Multi-Tag Filtering**
  - **Given** Mentor A has tags ["Backend", "Go"] and Mentor B has tags ["Frontend", "React"],
  - **When** a user queries `/api/mentors?tag=Go`,
  - **Then** the response array includes Mentor A and excludes Mentor B.

### `AC-FR-012`: Self-Booking Prevention
- **Scenario 12.1: Mentor Cannot Book Own Slot**
  - **Given** Mentor A is authenticated (`user_id = 101`),
  - **When** Mentor A initiates a booking on a slot where `slot.mentor_id = 101`,
  - **Then** the system rejects the request with HTTP 403 Forbidden,
  - **And** returns error: "Users cannot book mentorship sessions with themselves."

### `AC-FR-013`: 2-Hour Booking Notice Enforcement
- **Scenario 13.1: Reject Booking Under 2 Hours Notice**
  - **Given** current time is 10:00 AM, and an open slot is scheduled for 11:30 AM today,
  - **When** a mentee attempts to book this slot,
  - **Then** the system rejects the request with HTTP 422 Unprocessable Entity,
  - **And** returns: "Bookings must be scheduled at least 2 hours in advance."

### `AC-FR-015`: Concurrency Lock & Slot Exclusivity
- **Scenario 15.1: Atomic Reservation Race Condition**
  - **Given** an `OPEN` slot,
  - **When** Mentee 1 and Mentee 2 simultaneously submit booking requests for this slot,
  - **Then** exactly one mentee receives HTTP 201 Created and booking status `PENDING_PAYMENT`,
  - **And** the second mentee receives HTTP 409 Conflict ("Slot is already reserved"),
  - **And** the slot transitions to `HELD` with an expiration timestamp set to 15 minutes in the future.

### `AC-FR-016`: 15-Minute Reservation Expiration
- **Scenario 16.1: Automatic Release of Abandoned Reservation**
  - **Given** a booking in `PENDING_PAYMENT` with `expires_at` in the past,
  - **When** the expiration evaluator runs or a user inspects the slot,
  - **Then** the system transitions the booking to `EXPIRED`,
  - **And** reverts the slot status from `HELD` back to `OPEN`.

---

## 5. Module 6: Payment Simulation & Commission Calculation

### `AC-FR-017`: 10% Platform Commission Calculation
- **Scenario 17.1: Commission Calculation Precision**
  - **Given** a mentor's session fee is set to $50.00 (or 500,000 Tomans),
  - **When** a booking is initiated,
  - **Then** the system calculates:
    - Mentor Fee: $50.00
    - Platform Commission (10%): $5.00
    - Total Charged: $55.00
  - **And** returns these itemized amounts in the checkout payload.

### `AC-FR-019`: Payment Callback Verification
- **Scenario 19.1: Successful Payment Callback**
  - **Given** a booking in `PENDING_PAYMENT` status,
  - **When** the Mock Banking Gateway issues a success callback (`status: SUCCESS`, `tx_ref: "TX12345"`),
  - **Then** the system records a `COMPLETED` transaction in the ledger,
  - **And** transitions booking status to `CONFIRMED`,
  - **And** permanently sets the slot status to `BOOKED`.
- **Scenario 19.2: Failed Payment Callback**
  - **Given** a booking in `PENDING_PAYMENT` status,
  - **When** the Mock Banking Gateway issues a failure callback (`status: FAILED`),
  - **Then** the system records a `FAILED` transaction in the ledger,
  - **And** transitions booking status to `PAYMENT_FAILED`,
  - **And** immediately reverts the slot status to `OPEN`.

---

## 6. Module 7 & 8: Privacy, Management & Cancellations

### `AC-FR-021`: Meeting URL Privacy Protection
- **Scenario 21.1: Authorized Access by Mentee and Mentor**
  - **Given** a booking is in `CONFIRMED` status,
  - **When** the booked mentee or mentor requests booking details,
  - **Then** the system returns HTTP 200 OK including the `meeting_url`.
- **Scenario 21.2: Strict Denial to Unrelated Users**
  - **Given** a booking is in `CONFIRMED` status between User A and User B,
  - **When** User C (an authenticated third party) queries the booking or slot,
  - **Then** the system returns HTTP 403 Forbidden or omits the `meeting_url` completely.

### `AC-FR-022`: Mentee Cancellation with $\ge 24$h Notice
- **Scenario 22.1: Full Refund on Early Cancellation**
  - **Given** a confirmed booking scheduled 48 hours in the future,
  - **When** the mentee cancels the booking,
  - **Then** the booking status transitions to `CANCELLED_REFUNDED`,
  - **And** a 100% refund transaction is written to the ledger (`Status: REFUNDED`),
  - **And** the slot reverts to `OPEN`.

### `AC-FR-023`: Mentee Cancellation with $< 24$h Notice
- **Scenario 23.1: No Refund on Late Cancellation**
  - **Given** a confirmed booking scheduled 5 hours in the future,
  - **When** the mentee cancels the booking,
  - **Then** the booking status transitions to `CANCELLED_NO_REFUND`,
  - **And** no refund transaction is generated in the ledger,
  - **And** the slot transitions to `CANCELLED` (cannot be rebooked).

### `AC-FR-024`: Mentor Cancellation Anytime
- **Scenario 24.1: Mentor Cancellation Always Refunds Mentee**
  - **Given** a confirmed booking scheduled 2 hours in the future,
  - **When** the mentor cancels the booking,
  - **Then** the booking status transitions to `CANCELLED_BY_MENTOR`,
  - **And** a full 100% refund transaction is written to the ledger,
  - **And** the slot is marked `CANCELLED`.

---

## 7. Module 9 & 10: Reviews & Administrative Governance

### `AC-FR-026`: Verified Mentee Review Submission
- **Scenario 26.1: Valid Review Submission**
  - **Given** a mentee has a booking in `COMPLETED` status,
  - **When** they submit a rating of 5 stars and comment "Exceptional architectural feedback",
  - **Then** the system records the review, updates the mentor's average score,
  - **And** returns HTTP 201 Created.
- **Scenario 26.2: Rejection of Review on Incomplete Session**
  - **Given** a booking in `CONFIRMED` or `CANCELLED` status,
  - **When** the mentee attempts to submit a review,
  - **Then** the system rejects the request with HTTP 403 Forbidden.

### `AC-FR-027`: Administrator Account Suspension
- **Scenario 27.1: Suspend Abusive User**
  - **Given** an authenticated administrator,
  - **When** they send `PATCH /api/admin/users/102/status` with `{"status": "SUSPENDED"}`,
  - **Then** User 102's status is updated to `SUSPENDED`,
  - **And** User 102's active session is revoked immediately.
