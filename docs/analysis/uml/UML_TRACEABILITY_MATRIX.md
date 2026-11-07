# UML Traceability Matrix: Peyroo Mentorship Platform

**Project Working Title:** Peyroo (پیرو)  
**Academic Course:** Software Analysis and Design (SSAD) | Fall 1405  
**Document Identifier:** `docs/analysis/uml/UML_TRACEABILITY_MATRIX.md`  
**Status:** `[BASELINE - STAGE 05]`  
**Date:** Aban 1405 / November 2026  
**Document Version:** 1.0  

---

## 1. Overview & Traceability Objectives

This Traceability Matrix proves complete bidirectional alignment between the approved **Stage 04 Software Requirements Specification (SRS)** and the **Stage 05 System Analysis & UML Models**.

It systematically maps:
1. Functional Requirements (`FR-xxx`) to Use Cases (`UC-xxx`).
2. Use Cases to Dynamic Sequence Diagrams (`SD-xx`) and Activity Diagrams (`AD-xx`).
3. Domain Concepts and Rules to Class Diagram Elements and State Machine Diagrams (`SM-xx`).

---

## 2. Comprehensive Requirements-to-UML Traceability Matrix

| Req ID | Requirement Description | Use Case ID | Sequence Diagram ID | Activity Diagram ID | Class Diagram Element | State Machine Mapping |
|---|---|:---:|:---:|:---:|---|---|
| `FR-001` | User Registration | `UC-001` | `SD-01` | — | `UserAccount` | — |
| `FR-002` | User Authentication (Login) | `UC-001` | `SD-01` | — | `UserAccount`, `AccountStatus` | — |
| `FR-003` | User Logout & Token Revocation | `UC-001` | `SD-01` | — | `UserAccount` | — |
| `FR-004` | Capability Toggling | `UC-002` | `SD-02` | `AD-01` | `UserAccount` | — |
| `FR-005` | Mentor Profile Setup | `UC-002` | `SD-02` | `AD-01` | `MentorProfile`, `MeetingUrl` | — |
| `FR-006` | Public Mentor Profile View | `UC-004` | `SD-04` | — | `MentorProfile` | — |
| `FR-007` | Availability Slot Creation | `UC-003` | `SD-03` | `AD-02` | `AvailabilitySlot`, `SlotDuration` | `SM-Slot: [*] -> OPEN` |
| `FR-008` | Slot Collision Prevention | `UC-003` | `SD-03` | `AD-02` | `AvailabilitySlot.collidesWith()`| — |
| `FR-009` | Slot Deletion / Soft Cancellation | `UC-003` | `SD-03` | `AD-02` | `AvailabilitySlot`, `SlotStatus` | `SM-Slot: OPEN -> CANCELLED` |
| `FR-010` | Mentor Catalog Browsing | `UC-004` | `SD-04` | `AD-03` | `MentorProfile`, `AvailabilitySlot`| — |
| `FR-011` | Filter by Technical Tags | `UC-004` | `SD-04` | `AD-03` | `MentorProfile.expertiseTags` | — |
| `FR-012` | Booking Initiation & Self-Booking Block | `UC-005` | `SD-05` | `AD-03` | `Booking`, `UserAccount` | `SM-Book: [*] -> INITIATED` |
| `FR-013` | 2-Hour Booking Notice Enforcement | `UC-005` | `SD-05` | `AD-03` | `Booking`, `AvailabilitySlot` | Guard on `INITIATED -> PENDING` |
| `FR-014` | Mandatory Structured Agenda Submission | `UC-005` | `SD-05` | `AD-03` | `SessionAgenda`, `Booking` | Value object instantiated |
| `FR-015` | Concurrency Lock & 15-Min Reservation | `UC-005` | `SD-05` | `AD-03` | `AvailabilitySlot`, `Booking` | `SM-Slot: OPEN -> HELD`<br/>`SM-Book: INITIATED -> PENDING` |
| `FR-016` | Automated Expiration of Reservations | `UC-006` | `SD-07` | `AD-03` | `Booking.expire()`, `AvailabilitySlot` | `SM-Slot: HELD -> OPEN`<br/>`SM-Book: PENDING -> EXPIRED` |
| `FR-017` | 10% Platform Commission Calculation | `UC-005` | `SD-05` | `AD-03` | `PlatformCommissionPolicy` | `Money` calculations |
| `FR-018` | Mock Banking Gateway Simulation | `UC-006` | `SD-06` | `AD-03` | `PaymentTransaction` | External actor interaction |
| `FR-019` | Payment Verification Callback | `UC-006` | `SD-06` | `AD-03` | `PaymentTransaction`, `Booking` | `SM-Slot: HELD -> BOOKED`<br/>`SM-Book: PENDING -> CONFIRMED`<br/>`SM-Pay: PENDING -> COMPLETED` |
| `FR-020` | User Session Dashboards | `UC-007` | `SD-06, 08` | `AD-03` | `Booking`, `AvailabilitySlot` | Dashboard aggregation |
| `FR-021` | Authorized Meeting Link Disclosure | `UC-007` | `SD-06` | `AD-03` | `MeetingUrl`, `Booking` | Revealed only if `CONFIRMED` |
| `FR-022` | Mentee Cancellation ($\ge 24$h Full Refund) | `UC-008` | `SD-08` | `AD-04` | `Booking`, `PaymentTransaction` | `SM-Book: CONFIRMED -> CANCELLED_REFUNDED`<br/>`SM-Pay: COMPLETED -> REFUNDED`<br/>`SM-Slot: BOOKED -> OPEN` |
| `FR-023` | Mentee Late Cancellation ($< 24$h No Refund)| `UC-008` | `SD-08` | `AD-04` | `Booking`, `AvailabilitySlot` | `SM-Book: CONFIRMED -> CANCELLED_NO_REFUND`<br/>`SM-Slot: BOOKED -> CANCELLED` |
| `FR-024` | Mentor Cancellation (Anytime Full Refund) | `UC-008` | `SD-09` | `AD-04` | `Booking`, `PaymentTransaction` | `SM-Book: CONFIRMED -> CANCELLED_BY_MENTOR`<br/>`SM-Pay: COMPLETED -> REFUNDED`<br/>`SM-Slot: BOOKED -> CANCELLED` |
| `FR-025` | Automated Time-Based Session Completion | `UC-009` | `SD-10` | `AD-05` | `Booking.markCompleted()` | `SM-Book: CONFIRMED -> COMPLETED` |
| `FR-026` | Verified Mentee Post-Session Review | `UC-009` | `SD-11` | `AD-06` | `Review`, `MentorProfile` | Multiplicity 1 review per booking |
| `FR-027` | User Status Management (Admin) | `UC-010` | `SD-12` | `AD-07` | `UserAccount.suspend()` | `AccountStatus: ACTIVE <-> SUSPENDED` |
| `FR-028` | Financial Ledger Audit View (Admin) | `UC-010` | `SD-12` | `AD-07` | `PaymentTransaction`, `Ledger` | Aggregation query |
| `FR-029` | Global Booking Audit Trail (Admin) | `UC-010` | `SD-12` | `AD-07` | `Booking` | Read-only global audit query |

---

## 3. Coverage & Verification Summary

- **Total Functional Requirements (FRs):** 29
- **FRs Traced to UML Elements:** 29 (100% Coverage)
- **Total Use Cases (UCs):** 10 (100% Traced to Sequence Diagrams and Activity Diagrams)
- **Orphaned UML Artifacts:** 0 (Every diagram directly visualizes an approved requirement)
- **Unrepresented Requirements:** 0 (All 29 functional requirements are fully represented in behavioral, structural, or state models)
