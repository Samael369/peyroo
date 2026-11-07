# Stage 06 Design Review and Correction Report

**Project Working Title:** Peyroo (پیرو)  
**Academic Course:** Software Analysis and Design (SSAD) | Fall 1405  
**Document Identifier:** `docs/design/DESIGN_REVIEW_AND_CORRECTION_REPORT.md`  
**Status:** `[SUBMITTED FOR APPROVAL]`  
**Date:** Aban 1405 / November 2026  
**Document Version:** 1.0  

---

## 1. Executive Summary

As Senior Software Architect, I have conducted a comprehensive technical review and targeted remediation of the **Stage 06 System Design** documentation for the **Peyroo Mentorship Platform**. 

The review audited the initial design against authoritative baselines in **Stage 04 (Requirements Engineering)** and **Stage 05 (UML Analysis Models)**. All identified design flaws—including database uniqueness constraints, self-booking validation logic, financial ledger semantics, concurrent slot overlap vulnerabilities, security assumptions, scheduler reliability, API coverage, and performance/hosting claims—have been systematically investigated, corrected, and documented.

---

## 2. Itemized Issue Review & Correction Status

| # | Issue Identified | Category | Status | Action Taken / Resolution Summary | Documents Modified |
|---|---|---|:---:|---|---|
| **1** | `bookings.slot_id UNIQUE` constraint prevented historical bookings on reopened slots. | Database | **CORRECTED** | Replaced plain `UNIQUE` with a PostgreSQL partial unique index (`uq_active_booking_per_slot`) restricted to active states (`INITIATED`, `PENDING_PAYMENT`, `CONFIRMED`). Historical states (`EXPIRED`, `CANCELLED_*`, `COMPLETED`) do not block future bookings. | `DATABASE_DESIGN.md` §2, §3.4; `ARCHITECTURE_DECISIONS.md` (ADR-002) |
| **2** | Self-booking comparison evaluated incompatible identifiers (`bookings.mentee_id` vs `availability_slots.mentor_id`). | Schema / Logic | **CORRECTED** | Corrected validation to join `availability_slots` with `mentor_profiles` to assert `bookings.mentee_id != mentor_profiles.user_id` (comparing user account to user account). | `DATABASE_DESIGN.md` §4.1; `COMPONENT_DESIGN.md` §3.5; `SECURITY_DESIGN.md` §3.2; `WORKFLOW_AND_TRANSACTION_DESIGN.md` §2; `DESIGN_TRACEABILITY_MATRIX.md` |
| **3** | Inaccurate claim of "immutable double-entry ledger" with status updates. | Financial Model | **CORRECTED** | Replaced double-entry claim with an **Auditable Payment Transaction Ledger**. Preserved original payment records, added `parent_transaction_id` foreign key for linked refunds, and introduced `idempotency_key` deduplication. | `DATABASE_DESIGN.md` §1, §3.6; `SYSTEM_DESIGN.md` §2; `COMPONENT_DESIGN.md` §3.6; `ARCHITECTURE_DECISIONS.md` (ADR-002) |
| **4** | Concurrent slot creation TOCTOU race condition in `SELECT COUNT(*)` check. | Concurrency | **CORRECTED** | Added PostgreSQL database-level exclusion constraint (`EXCLUDE USING gist`) with `btree_gist` range checks (`tstzrange(start_time, end_time) WITH &&`), plus documented transaction advisory locking fallback. | `DATABASE_DESIGN.md` §3.3; `WORKFLOW_AND_TRANSACTION_DESIGN.md` §2 (Workflow 1) |
| **5** | "Expiration takes strict precedence over late payment" presented as unapproved assumption. | Business Rule | **RESOLVED & APPROVED** | User approved **Policy Option A (Strict Expiration Precedence)**. Formally specified rule: If a late payment is successfully captured after expiration, record it as a `COMPLETED` payment followed by an immediate linked `CANCELLATION_REFUND`. Never mark captured funds as `FAILED`. | `WORKFLOW_AND_TRANSACTION_DESIGN.md` §4.1; `DATABASE_DESIGN.md` §3.6; `COMPONENT_DESIGN.md` §3.6; `API_DESIGN.md` §2.6 |
| **6** | Lack of defined edge-case handling for payment callbacks, duplicate requests, and timeouts. | Distributed Flow | **CORRECTED** | Formally specified duplicate callback idempotency (`idempotency_key`), explicit gateway failure callbacks, gateway timeouts (15-min scheduler release), and linked refund logging for late payments. | `WORKFLOW_AND_TRANSACTION_DESIGN.md` §4.2; `DATABASE_DESIGN.md` §3.6; `API_DESIGN.md` §2.6 |
| **7** | In-process 60s scheduler multi-instance race conditions and connection pooling safety. | Reliability | **CORRECTED** | Upgraded to PostgreSQL transaction-level advisory locks (`pg_try_advisory_xact_lock`), which automatically release on `COMMIT`/`ROLLBACK`, guaranteeing safety with connection poolers (PgBouncer) and multi-instance deployments. | `ARCHITECTURE_DECISIONS.md` (ADR-004); `WORKFLOW_AND_TRANSACTION_DESIGN.md` §3 |
| **8** | Missing API operations for profile updates, capability mode toggle, and slot list. | API Completeness | **CORRECTED** | Added `PATCH /api/users/me/active-mode` (`FR-004`), `PUT /api/users/me/mentor-profile` (`FR-005`), `GET /api/slots/my-slots` (`FR-007`, `FR-009`), and `GET /api/bookings/:bookingId` (`FR-020`, `FR-021`). | `API_DESIGN.md` §2.2, §2.4, §2.5 |
| **9** | Security design over-claimed `HttpOnly` cookie protection against XSS and CSRF. | Security | **CORRECTED** | Clarified defense-in-depth: `HttpOnly` does not stop browser-based XSS requests (requires input sanitization and CSP). Added strict `Origin`/`Referer` validation and custom request header checks (`X-Requested-With`) for CSRF defense. Documented real-time account status checks in auth middleware for instant suspension enforcement. | `SECURITY_DESIGN.md` §2.2, §3.1 |
| **10** | Unsupported absolute claims of guaranteed $<500$ms latency, 99% availability, and $0 cost. | Operations | **CORRECTED** | Reframed metrics as architectural design targets and feasibility estimates based on published free-tier terms, distinguishing internal objectives from non-existent commercial SLAs and noting cold-start behavior. | `DEPLOYMENT_DESIGN.md` §4; `ARCHITECTURE_DESIGN.md` §4; `DESIGN_TRACEABILITY_MATRIX.md` |
| **11** | Stage sequence mislabeled in documentation (Stage 07 called Implementation instead of UI/UX). | Governance | **CORRECTED** | Restored official 9-stage sequence; verified Stage 07 is **UI/UX Design**, followed by Stage 08 (Implementation) and Stage 09 (Testing & Finalization). | `README.md` §3 |

---

## 3. Detailed Technical Solutions Implemented

### 3.1 Partial Unique Index for Active Slot Bookings
* **Problem:** If `bookings.slot_id` has an unconditional unique constraint, a slot whose booking expires after 15 minutes or is cancelled with $\ge 24$h notice can never be booked again, violating `FR-016` and `FR-022`.
* **Remediation in [`DATABASE_DESIGN.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/DATABASE_DESIGN.md):**
  ```sql
  -- Remove unconditional UNIQUE from slot_id column definition
  -- Enforce uniqueness strictly across active booking states:
  CREATE UNIQUE INDEX uq_active_booking_per_slot ON bookings (slot_id)
  WHERE status IN ('INITIATED', 'PENDING_PAYMENT', 'CONFIRMED');
  ```
* **State Categorization:**
  - **Active States:** `INITIATED`, `PENDING_PAYMENT`, `CONFIRMED`.
  - **Terminal / Historical States:** `EXPIRED`, `PAYMENT_FAILED`, `CANCELLED_REFUNDED`, `CANCELLED_NO_REFUND`, `CANCELLED_BY_MENTOR`, `COMPLETED`.

### 3.2 Corrected Self-Booking Validation
* **Problem:** Initial SQL and service checks compared `bookings.mentee_id` (pointing to `user_accounts.id`) directly with `availability_slots.mentor_id` (pointing to `mentor_profiles.id`), causing false passes or broken queries.
* **Remediation across Design Suite:**
  ```sql
  SELECT s.*, mp.user_id AS mentor_user_id 
  FROM availability_slots s 
  JOIN mentor_profiles mp ON mp.id = s.mentor_id 
  WHERE s.id = :slotId 
  FOR UPDATE OF s;

  -- Validate:
  IF :menteeUserId = mentor_user_id THEN
      -- Abort: Return HTTP 403 Forbidden ("Mentors cannot book their own slots")
  END IF;
  ```

### 3.3 Auditable Payment Transaction Ledger
* **Problem:** Previous text claimed "double-entry ledger" but described state updates (`UPDATE ... SET status = 'COMPLETED'`) on single rows without debit/credit balancing.
* **Remediation:**
  - Removed double-entry accounting claims.
  - Re-specified as an **Auditable Payment Transaction Ledger**:
    - `SESSION_PAYMENT` row tracks the initial charge.
    - Refund operations insert a **new independent row** (`transaction_type = 'CANCELLATION_REFUND'`, `status = 'REFUNDED'`, `parent_transaction_id = original_payment_id`).
    - Added `idempotency_key VARCHAR(100) UNIQUE` to prevent duplicate ledger entries on retried webhook callbacks.

### 3.4 Concurrent Slot Overlap Prevention
* **Problem:** Application-level `SELECT COUNT(*)` followed by `INSERT` allowed race conditions if two slot creation requests executed concurrently.
* **Remediation:**
  ```sql
  CREATE EXTENSION IF NOT EXISTS btree_gist;

  ALTER TABLE availability_slots
  ADD CONSTRAINT no_overlapping_slots_per_mentor
  EXCLUDE USING gist (
      mentor_id WITH =,
      tstzrange(start_time, end_time) WITH &&
  ) WHERE (status != 'CANCELLED');
  ```

### 3.5 Transaction-Level Advisory Locking for Connection Pooling Safety
* **Problem:** Session-level advisory locks (`pg_try_advisory_lock`) are bound to the physical backend connection. In connection-pooled environments (e.g. PgBouncer in transaction mode or application pools), connections are reused across different requests, risking orphaned locks or deadlocks.
* **Remediation:** Migrated the scheduler to **Transaction-Level Advisory Locks** (`pg_try_advisory_xact_lock`):
  ```sql
  BEGIN;
  SELECT pg_try_advisory_xact_lock(hashtext('peyroo_background_scheduler')) AS lock_acquired;
  -- If acquired: run idempotent expiration & completion queries
  COMMIT; -- Lock automatically and reliably releases on COMMIT or ROLLBACK
  ```

### 3.6 Late Captured Payment & Separate Linked Refund Policy
* **Decision:** Formally approved **Policy Option A (Strict Expiration Precedence)**.
* **Accounting Invariant:** If the Mock Payment Gateway successfully captures funds but the callback arrives after the booking expired, the transaction is **never marked as FAILED**. Instead, the system records the payment as `status = 'COMPLETED'` (`SESSION_PAYMENT`), and immediately inserts an independent linked refund record (`status = 'REFUNDED'`, `transaction_type = 'CANCELLATION_REFUND'`, `parent_transaction_id = payment.id`). This guarantees accurate mathematical reconciliation against bank merchant statements ($\text{Captured} - \text{Refunded} = 0$).

---

## 4. Status of Stakeholder Decisions

* **Decision Item 1 (Late Payment Policy):** **`[APPROVED - POLICY OPTION A]`**  
  Late payments arriving after expiration are recorded as successful payments (`COMPLETED`) followed by a separate linked refund (`REFUNDED`). Booking remains `EXPIRED` and slot remains available.
* **Remaining Unresolved Questions:** **`[ZERO]`** — All business rules, invariants, and edge cases are now fully resolved and aligned with Stage 04 requirements and Stage 05 UML models.

---

## 5. Cross-Document Consistency Audit

A final verification sweep was conducted across all modified documents under `docs/design/`:

- [x] **Entity Relationships:** Slot-to-Booking relationship is $1 \longleftrightarrow 0..*$ (historical) with at most $1$ active booking enforced by partial unique index in all documents.
- [x] **Identifier Comparisons:** All self-booking assertions compare `mentee_id` against `mentor_profiles.user_id` consistently across `DATABASE_DESIGN.md`, `COMPONENT_DESIGN.md`, `SECURITY_DESIGN.md`, and `API_DESIGN.md`.
- [x] **Financial Terminology:** The term "double-entry ledger" has been eliminated across all documents in favor of "auditable payment transaction ledger with linked refund records".
- [x] **API Coverage:** Added endpoints (`PUT /api/users/me/mentor-profile`, `PATCH /api/users/me/active-mode`, `GET /api/slots/my-slots`, `GET /api/bookings/:id`) trace directly to `FR-004`, `FR-005`, `FR-007`, `FR-009`, `FR-020`, and `FR-021`.
- [x] **Tone & Claims:** Absolute guarantees ("guaranteed $<500$ms", "guaranteed 99% uptime", "$0 cost") have been reframed as architectural performance targets and free-tier operational feasibility estimates.
- [x] **Stage Roadmap:** Verified that the official sequence remains: (1) Project Initialization $\to$ (2) Assignment Analysis $\to$ (3) Product Discovery $\to$ (4) Requirements Engineering $\to$ (5) System Analysis & UML $\to$ (6) System Design $\to$ (7) UI/UX Design $\to$ (8) Implementation $\to$ (9) Testing & Finalization.
- [x] **Zero Code / No Unapproved Additions:** No application source code or UI/UX designs were written; Stage 04 and Stage 05 baselines were preserved without modification.

---

### Approval Gate

All design corrections and the approved Policy Option A (Strict Expiration Precedence with captured payment and separate linked refund) have been incorporated across [`docs/design/`](file:///c:/Users/r/Desktop/peyroo/docs/design/).

The revised **Stage 06: System Design** package is now complete, fully harmonized, and awaiting your final signoff to advance to **Stage 07: UI/UX Design**.
