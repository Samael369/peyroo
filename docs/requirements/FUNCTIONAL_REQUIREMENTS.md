# Functional Requirements Specification: Peyroo Mentorship Platform

**Project Working Title:** Peyroo (پیرو)  
**Academic Course:** Software Analysis and Design (SSAD) | Fall 1405  
**Document Identifier:** `docs/requirements/FUNCTIONAL_REQUIREMENTS.md`  
**Status:** `[BASELINE - STAGE 04]`  
**Date:** Aban 1405 / November 2026  
**Document Version:** 1.0  

---

## 1. Overview & Structure

This document specifies the complete functional requirements for the **Peyroo Mentorship Platform**. Each requirement defines observable, testable system behavior, identified by a unique key (`FR-xxx`), prioritized via MoSCoW, mapped to its primary actor, and cross-referenced with architectural dependencies.

---

## 2. Module 1: Authentication, Identity & Capabilities

### `FR-001`: User Registration
- **Priority:** Must Have (MVP)
- **Actor:** Guest / Unauthenticated Visitor
- **Description:** The system shall allow an unauthenticated visitor to register a new user account by providing an email address, password, and full name.
- **Observable Behavior:** The system validates that the email format is correct and unique in the database. Upon successful registration, the account is created in `ACTIVE` status with Mentee capability enabled by default, and a secure session or JWT token is issued.
- **Dependencies:** None
- **Verification Method:** Integration Test (API registration endpoint validation)

### `FR-002`: User Authentication (Login)
- **Priority:** Must Have (MVP)
- **Actor:** Registered User
- **Description:** The system shall authenticate existing users using their registered email and password.
- **Observable Behavior:** The system verifies password hash authenticity. Upon success, an authenticated session token is established. Upon failure (invalid credentials or account in `SUSPENDED` status), an explicit error message is returned with HTTP 401/403.
- **Dependencies:** `FR-001`
- **Verification Method:** Integration Test (positive login, invalid password rejection, suspended account rejection)

### `FR-003`: User Logout & Session Invalidation
- **Priority:** Must Have (MVP)
- **Actor:** Authenticated User
- **Description:** The system shall allow an authenticated user to terminate their active session.
- **Observable Behavior:** The system clears or blacklists the session token, revoking subsequent authenticated API requests.
- **Dependencies:** `FR-002`
- **Verification Method:** Automated Test (request after logout returns HTTP 401)

### `FR-004`: Capability Toggling (Mentee / Mentor Modes)
- **Priority:** Must Have (MVP)
- **Actor:** Authenticated User
- **Description:** The system shall provide a unified account interface allowing the user to seamlessly toggle their active operational context between "Mentee Mode" and "Mentor Mode".
- **Observable Behavior:** Switching context alters the client-side navigation and controls, granting access to mentor tools only if the user has enabled and configured the Mentor capability (`FR-005`).
- **Dependencies:** `FR-002`, `FR-005`
- **Verification Method:** E2E / Integration Test

---

## 3. Module 2: Mentor Profile & Capability Setup

### `FR-005`: Mentor Capability Activation & Profile Configuration
- **Priority:** Must Have (MVP)
- **Actor:** Authenticated User
- **Description:** The system shall require a user wishing to activate Mentor capability to provide mandatory profile attributes.
- **Observable Behavior:** The profile requires: Professional Headline, Biography (minimum 20 characters), at least one Technical Expertise Tag (selected from or added to system taxonomy), Base Session Rate (monetary value $\ge 0$), and a Default External Meeting URL (valid HTTPS link). The system sets `isMentorEnabled = true` upon validation.
- **Dependencies:** `FR-001`
- **Verification Method:** Integration Test (validation rules for profile fields)

### `FR-006`: Mentor Profile Public View
- **Priority:** Must Have (MVP)
- **Actor:** Guest / Mentee
- **Description:** The system shall render a public mentor profile page accessible to visitors and mentees.
- **Observable Behavior:** Displays mentor's name, headline, bio, expertise tags, base session fee, and upcoming open availability slots. The default meeting URL is strictly withheld from public view.
- **Dependencies:** `FR-005`
- **Verification Method:** Integration Test (verify response payload omits `defaultMeetingUrl`)

---

## 4. Module 3: Availability & Slot Management

### `FR-007`: Availability Slot Creation
- **Priority:** Must Have (MVP)
- **Actor:** Mentor
- **Description:** The system shall allow a mentor to publish discrete availability time slots for mentorship sessions.
- **Observable Behavior:** The mentor specifies `start_time`, `duration` (strictly constrained to 30, 45, or 60 minutes), optional custom session rate (defaults to mentor base rate), and optional custom meeting URL (defaults to profile default URL). The slot is initialized with status `OPEN`.
- **Dependencies:** `FR-005`
- **Verification Method:** Integration Test (validate slot fields and status)

### `FR-008`: Slot Conflict & Overlap Prevention
- **Priority:** Must Have (MVP)
- **Actor:** Mentor
- **Description:** The system shall reject the creation of any slot that temporally overlaps with an existing slot published by the same mentor.
- **Observable Behavior:** If `new_start < existing_end AND new_end > existing_start`, the system rejects the request with HTTP 409 Conflict.
- **Dependencies:** `FR-007`
- **Verification Method:** Automated Unit/Integration Test

### `FR-009`: Slot Deletion / Cancellation by Mentor
- **Priority:** Must Have (MVP)
- **Actor:** Mentor
- **Description:** The system shall allow a mentor to delete an unbooked availability slot.
- **Observable Behavior:** If the slot status is `OPEN`, it is soft-deleted or removed from the catalog. If the slot is in `HELD` or `BOOKED` status, deletion is rejected, redirecting the mentor to the session cancellation flow (`FR-022`).
- **Dependencies:** `FR-007`
- **Verification Method:** Integration Test

---

## 5. Module 4: Mentor Discovery & Catalog Search

### `FR-010`: Mentor Catalog Browsing
- **Priority:** Must Have (MVP)
- **Actor:** Guest / Mentee
- **Description:** The system shall provide a paginated or scrollable catalog listing all active mentors who possess at least one upcoming `OPEN` availability slot.
- **Observable Behavior:** Each mentor card displays name, headline, expertise tags, base rate, and next available slot timestamp.
- **Dependencies:** `FR-005`, `FR-007`
- **Verification Method:** Integration Test

### `FR-011`: Filter Mentors by Technical Expertise Tags
- **Priority:** Must Have (MVP)
- **Actor:** Guest / Mentee
- **Description:** The system shall allow users to filter the mentor catalog by one or more technical tags (e.g., "Backend", "Distributed Systems", "Frontend", "DevOps").
- **Observable Behavior:** The system returns only mentors whose profiles contain all or any matching selected tags.
- **Dependencies:** `FR-010`
- **Verification Method:** Automated API Test

---

## 6. Module 5: Booking Lifecycle & Concurrency Control

### `FR-012`: Booking Initiation & Self-Booking Prevention
- **Priority:** Must Have (MVP)
- **Actor:** Mentee
- **Description:** The system shall allow a mentee to initiate a booking for an `OPEN` slot.
- **Observable Behavior:** The system verifies that the authenticated mentee is not the owner of the slot (`auth.user_id != slot.mentor_id`). If the user attempts to book their own slot, the request is rejected with HTTP 403 Forbidden.
- **Dependencies:** `FR-002`, `FR-007`
- **Verification Method:** Integration Test (self-booking rejection)

### `FR-013`: Booking Advance Notice Validation
- **Priority:** Must Have (MVP)
- **Actor:** Mentee
- **Description:** The system shall enforce a minimum advance notice window of 2 hours prior to the slot start time.
- **Observable Behavior:** If `(slot.start_time - current_timestamp) < 2 hours`, the system rejects the booking initiation with HTTP 422 Unprocessable Entity ("Bookings must be made at least 2 hours in advance").
- **Dependencies:** `FR-012`
- **Verification Method:** Automated Test

### `FR-014`: Mandatory Structured Agenda Submission
- **Priority:** Must Have (MVP)
- **Actor:** Mentee
- **Description:** The system shall require the mentee to submit a structured session agenda when initiating a booking.
- **Observable Behavior:** The mentee must supply: Discussion Topic / Objective (minimum 10 characters), Specific Questions (minimum 15 characters), and optional relevant URLs (GitHub repository, portfolio, or resume link).
- **Dependencies:** `FR-012`
- **Verification Method:** Integration Test (payload schema validation)

### `FR-015`: Concurrency Lock & 15-Minute Expiration Window
- **Priority:** Must Have (MVP)
- **Actor:** System / Mentee
- **Description:** Upon valid booking initiation, the system shall atomically lock the target slot and establish a 15-minute reservation timer.
- **Observable Behavior:** The slot transitions from `OPEN` to `HELD`. The booking is created with status `PENDING_PAYMENT` and an expiration timestamp `expires_at = now + 15 minutes`. Concurrent attempts by other mentees to book the same slot are rejected with HTTP 409 Conflict.
- **Dependencies:** `FR-012`, `FR-014`
- **Verification Method:** Automated Concurrency Test (parallel booking attempts)

### `FR-016`: Automated Expiration of Abandoned Reservations
- **Priority:** Must Have (MVP)
- **Actor:** System (Background Process / On-Demand Validator)
- **Description:** The system shall automatically release reservations that exceed the 15-minute holding window without payment completion.
- **Observable Behavior:** When `current_timestamp > booking.expires_at` and `booking.status == PENDING_PAYMENT`, the booking transitions to `EXPIRED` and the slot reverts to `OPEN`.
- **Dependencies:** `FR-015`
- **Verification Method:** Unit/Integration Test (time-travel simulated expiration)

---

## 7. Module 6: Payment Simulation & Commission Ledger

### `FR-017`: Platform Commission & Fee Calculation
- **Priority:** Must Have (MVP)
- **Actor:** System
- **Description:** The system shall calculate the financial breakdown for a booking prior to payment routing.
- **Observable Behavior:** 
  $$\text{Mentor Fee} = \text{slot.session\_rate}$$
  $$\text{Platform Commission} = \text{Mentor Fee} \times 0.10$$
  $$\text{Total Amount} = \text{Mentor Fee} + \text{Platform Commission}$$
  The itemized breakdown is returned to the client and embedded into the payment initiation request.
- **Dependencies:** `FR-015`
- **Verification Method:** Unit Test (calculation accuracy, zero-fee handling)

### `FR-018`: Mock Banking Gateway Redirection & Simulation
- **Priority:** Must Have (MVP)
- **Actor:** Mentee
- **Description:** The system shall provide an interactive Mock Banking Gateway interface to simulate online payment.
- **Observable Behavior:** The gateway displays the transaction details, simulated card entry fields, and explicit test triggers: "Simulate Successful Payment" and "Simulate Failed Payment".
- **Dependencies:** `FR-017`
- **Verification Method:** E2E Test

### `FR-019`: Payment Callback Verification & Booking Confirmation
- **Priority:** Must Have (MVP)
- **Actor:** System / Mock Banking Gateway
- **Description:** The system shall process the payment callback from the Mock Banking Gateway to finalize the booking.
- **Observable Behavior:** 
  - **On Success:** The system records a ledger transaction (`Status: COMPLETED`), transitions booking status to `CONFIRMED`, and locks the slot as `BOOKED`.
  - **On Failure:** The system records a ledger transaction (`Status: FAILED`), transitions booking status to `PAYMENT_FAILED`, and immediately returns the slot to `OPEN`.
- **Dependencies:** `FR-018`
- **Verification Method:** Integration Test (success and failure callback branches)

---

## 8. Module 7: Session Dashboard & Management

### `FR-020`: User Session Dashboards
- **Priority:** Must Have (MVP)
- **Actor:** Mentee / Mentor
- **Description:** The system shall provide dedicated dashboards for authenticated users displaying their upcoming, completed, and cancelled sessions.
- **Observable Behavior:** Mentee dashboard shows booked mentors, dates, agendas, and meeting URLs. Mentor dashboard shows scheduled mentees, submitted agendas, dates, and meeting URLs.
- **Dependencies:** `FR-019`
- **Verification Method:** E2E / Integration Test

### `FR-021`: Authorized Access to Meeting Link
- **Priority:** Must Have (MVP)
- **Actor:** Mentee / Mentor
- **Description:** The system shall disclose the external meeting URL only to authorized session participants once the booking is in `CONFIRMED` status.
- **Observable Behavior:** If `auth.user_id != mentee_id AND auth.user_id != mentor_id`, access is denied (HTTP 403). If `booking.status != CONFIRMED`, the link remains hidden.
- **Dependencies:** `FR-019`
- **Verification Method:** Integration Security Test

---

## 9. Module 8: Cancellation & Refund Handling

### `FR-022`: Mentee Cancellation ($\ge 24$ Hours Notice)
- **Priority:** Must Have (MVP)
- **Actor:** Mentee
- **Description:** The system shall permit a mentee to cancel a confirmed booking if the cancellation occurs at least 24 hours prior to the session start time.
- **Observable Behavior:** The booking transitions to `CANCELLED_REFUNDED`. A 100% refund transaction is recorded in the financial ledger (`Status: REFUNDED`). The slot reverts to `OPEN` if the start time is still $\ge 2$ hours in the future.
- **Dependencies:** `FR-019`
- **Verification Method:** Integration Test (verify refund ledger and slot availability)

### `FR-023`: Mentee Late Cancellation ($< 24$ Hours Notice)
- **Priority:** Must Have (MVP)
- **Actor:** Mentee
- **Description:** The system shall permit a mentee to cancel a confirmed booking within 24 hours of start time without issuing a refund.
- **Observable Behavior:** The booking transitions to `CANCELLED_NO_REFUND`. No refund transaction is generated. The slot transitions to `CANCELLED` (cannot be re-booked). The mentor compensation minus platform fee remains credited.
- **Dependencies:** `FR-019`
- **Verification Method:** Integration Test

### `FR-024`: Mentor Cancellation (Anytime Before Session)
- **Priority:** Must Have (MVP)
- **Actor:** Mentor
- **Description:** The system shall permit a mentor to cancel a confirmed booking at any time prior to the session start time.
- **Observable Behavior:** The booking transitions to `CANCELLED_BY_MENTOR`. The system automatically issues a 100% full refund to the mentee, records the refund transaction in the ledger, and transitions the slot to `CANCELLED`.
- **Dependencies:** `FR-019`
- **Verification Method:** Integration Test

---

## 10. Module 9: Session Completion & Review System

### `FR-025`: Automated Time-Based Session Completion
- **Priority:** Must Have (MVP)
- **Actor:** System
- **Description:** The system shall automatically transition a booking to `COMPLETED` once the scheduled slot `end_time` has elapsed.
- **Observable Behavior:** A background worker or on-demand status evaluation detects `current_timestamp >= slot.end_time AND booking.status == CONFIRMED` and updates status to `COMPLETED`.
- **Dependencies:** `FR-019`
- **Verification Method:** Integration Test

### `FR-026`: Verified Mentee Post-Session Review
- **Priority:** Should Have
- **Actor:** Mentee
- **Description:** The system shall permit a mentee to submit a review for a completed mentorship session.
- **Observable Behavior:** The mentee supplies a mandatory rating (integer 1 to 5 stars) and an optional text comment ($\le 1000$ characters). The system validates that `auth.user_id == booking.mentee_id`, `booking.status == COMPLETED`, and no prior review exists for this `booking_id`.
- **Dependencies:** `FR-025`
- **Verification Method:** Integration Test (prevent duplicate reviews, reject uncompleted sessions)

---

## 11. Module 10: Administration & Governance

### `FR-027`: User Status Management (Suspend / Activate)
- **Priority:** Must Have (MVP)
- **Actor:** Platform Administrator
- **Description:** The system shall allow an administrator to view all registered users and toggle their status between `ACTIVE` and `SUSPENDED`.
- **Observable Behavior:** When an account is `SUSPENDED`, active sessions are revoked, and subsequent authentication attempts are rejected with HTTP 403.
- **Dependencies:** `FR-001`, `FR-002`
- **Verification Method:** Integration Test

### `FR-028`: Financial Ledger & Commission Audit View
- **Priority:** Must Have (MVP)
- **Actor:** Platform Administrator
- **Description:** The system shall provide an audit dashboard displaying system-wide financial statistics.
- **Observable Behavior:** Displays total transaction volume, total mentor payouts, total platform commission collected (10%), and itemized transaction logs with filtering by status (`COMPLETED`, `FAILED`, `REFUNDED`).
- **Dependencies:** `FR-017`, `FR-019`, `FR-022`, `FR-024`
- **Verification Method:** Integration Test

### `FR-029`: Global Booking Audit Trail
- **Priority:** Must Have (MVP)
- **Actor:** Platform Administrator
- **Description:** The system shall provide an administrator with a read-only view of all system bookings and their historical state changes.
- **Observable Behavior:** Administrator can inspect any booking, slot, mentor, mentee, agenda, and state transition history. The administrator is prevented from creating bookings or altering prices.
- **Dependencies:** `FR-019`, `FR-025`
- **Verification Method:** Integration Test
