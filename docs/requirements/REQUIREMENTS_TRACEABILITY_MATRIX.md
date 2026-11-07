# Requirements Traceability Matrix (RTM): Peyroo Mentorship Platform

**Project Working Title:** Peyroo (پیرو)  
**Academic Course:** Software Analysis and Design (SSAD) | Fall 1405  
**Document Identifier:** `docs/requirements/REQUIREMENTS_TRACEABILITY_MATRIX.md`  
**Status:** `[BASELINE - STAGE 04]`  
**Date:** Aban 1405 / November 2026  
**Document Version:** 1.0  

---

## 1. Overview & Traceability Objectives

This Requirements Traceability Matrix (RTM) establishes bidirectional traceability across all engineering artifacts for the **Peyroo Mentorship Platform**:
1. **Business Objectives (OBJ):** High-level project motivations defined in Discovery and Assignment Analysis.
2. **Functional Requirements (FR):** System capabilities specified in [`docs/requirements/FUNCTIONAL_REQUIREMENTS.md`](file:///c:/Users/r/Desktop/peyroo/docs/requirements/FUNCTIONAL_REQUIREMENTS.md).
3. **Non-Functional Requirements (NFR):** Quality standards in [`docs/requirements/NON_FUNCTIONAL_REQUIREMENTS.md`](file:///c:/Users/r/Desktop/peyroo/docs/requirements/NON_FUNCTIONAL_REQUIREMENTS.md).
4. **Use Cases (UC):** User interactions in [`docs/requirements/USE_CASE_SPECIFICATIONS.md`](file:///c:/Users/r/Desktop/peyroo/docs/requirements/USE_CASE_SPECIFICATIONS.md).
5. **Acceptance Criteria (AC):** Formal verification scenarios in [`docs/requirements/ACCEPTANCE_CRITERIA.md`](file:///c:/Users/r/Desktop/peyroo/docs/requirements/ACCEPTANCE_CRITERIA.md).
6. **Future Test Cases (TC):** Targeted automated and manual verification suites for implementation stages.

---

## 2. Business Objectives Baseline

| Objective ID | Objective Title | Source Definition |
|---|---|---|
| **OBJ-01** | Eliminate Mentorship Outreach Friction | `PRODUCT_VISION.md` §1.1 — Structured discovery & transparent slot booking. |
| **OBJ-02** | Mentor Autonomy & Boundary Protection | `PRODUCT_VISION.md` §1.1 — Standard durations, topic filtering & agenda inputs. |
| **OBJ-03** | Commercial Viability & Revenue Generation | `PRODUCT_VISION.md` §5.1 — Session pricing, 10% platform commission & bank demo. |
| **OBJ-04** | Academic Rigor & Full Business Journey | `ASSIGNMENT_ANALYSIS.md` §2.1 — One complete journey from UI to database with RBAC. |

---

## 3. Comprehensive Traceability Matrix

| Functional Req ID | Module / Requirement Title | Business Obj | Priority | Use Case ID | Non-Functional Req | Acceptance Criteria | Future Test Case ID |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|
| `FR-001` | User Registration | OBJ-04 | Must Have | `UC-001` | `NFR-001`, `NFR-003` | `AC-FR-001` | `TC-AUTH-01` |
| `FR-002` | User Authentication (Login) | OBJ-04 | Must Have | `UC-001` | `NFR-001`, `NFR-003` | `AC-FR-002` | `TC-AUTH-02` |
| `FR-003` | User Logout & Token Revocation | OBJ-04 | Must Have | `UC-001` | `NFR-003` | `AC-FR-003` | `TC-AUTH-03` |
| `FR-004` | Capability Toggling (Mentee/Mentor) | OBJ-04 | Must Have | `UC-002` | `NFR-002` | `AC-FR-004` | `TC-USER-01` |
| `FR-005` | Mentor Profile Setup | OBJ-01, 02 | Must Have | `UC-002` | `NFR-002`, `NFR-005` | `AC-FR-005` | `TC-PROF-01` |
| `FR-006` | Mentor Profile Public View | OBJ-01 | Must Have | `UC-004` | `NFR-005`, `NFR-007` | `AC-FR-006` | `TC-PROF-02` |
| `FR-007` | Availability Slot Creation | OBJ-02 | Must Have | `UC-003` | `NFR-002`, `NFR-012` | `AC-FR-007` | `TC-SLOT-01` |
| `FR-008` | Slot Collision Prevention | OBJ-02 | Must Have | `UC-003` | `NFR-002`, `NFR-012` | `AC-FR-008` | `TC-SLOT-02` |
| `FR-009` | Slot Deletion / Soft Cancellation | OBJ-02 | Must Have | `UC-003` | `NFR-010` | `AC-FR-009` | `TC-SLOT-03` |
| `FR-010` | Mentor Catalog Browsing | OBJ-01 | Must Have | `UC-004` | `NFR-007`, `NFR-013` | `AC-FR-010` | `TC-DISC-01` |
| `FR-011` | Filter by Technical Tags | OBJ-01 | Must Have | `UC-004` | `NFR-007` | `AC-FR-011` | `TC-DISC-02` |
| `FR-012` | Booking Initiation & Self-Booking Block | OBJ-04 | Must Have | `UC-005` | `NFR-002` | `AC-FR-012` | `TC-BOOK-01` |
| `FR-013` | 2-Hour Booking Notice Enforcement | OBJ-02 | Must Have | `UC-005` | `NFR-012` | `AC-FR-013` | `TC-BOOK-02` |
| `FR-014` | Mandatory Structured Agenda Submission | OBJ-01, 02 | Must Have | `UC-005` | `NFR-006` | `AC-FR-014` | `TC-BOOK-03` |
| `FR-015` | Concurrency Lock & 15-Min Reservation | OBJ-04 | Must Have | `UC-005` | `NFR-008` | `AC-FR-015` | `TC-BOOK-04` |
| `FR-016` | Automated Expiration of Reservations | OBJ-04 | Must Have | `UC-006` | `NFR-008` | `AC-FR-016` | `TC-BOOK-05` |
| `FR-017` | 10% Platform Commission Calculation | OBJ-03 | Must Have | `UC-005` | `NFR-009` | `AC-FR-017` | `TC-FIN-01` |
| `FR-018` | Mock Banking Gateway Simulation | OBJ-03 | Must Have | `UC-006` | `NFR-009`, `NFR-012` | `AC-FR-018` | `TC-FIN-02` |
| `FR-019` | Payment Verification Callback | OBJ-03, 04 | Must Have | `UC-006` | `NFR-009` | `AC-FR-019` | `TC-FIN-03` |
| `FR-020` | User Session Dashboards | OBJ-04 | Must Have | `UC-007` | `NFR-002`, `NFR-013` | `AC-FR-020` | `TC-DASH-01` |
| `FR-021` | Authorized Meeting Link Disclosure | OBJ-02, 04 | Must Have | `UC-007` | `NFR-002`, `NFR-005` | `AC-FR-021` | `TC-SEC-01` |
| `FR-022` | Mentee Cancellation ($\ge 24$h Full Refund) | OBJ-03, 04 | Must Have | `UC-008` | `NFR-009`, `NFR-010` | `AC-FR-022` | `TC-CANC-01` |
| `FR-023` | Mentee Late Cancellation ($< 24$h No Refund)| OBJ-02, 03 | Must Have | `UC-008` | `NFR-009`, `NFR-010` | `AC-FR-023` | `TC-CANC-02` |
| `FR-024` | Mentor Cancellation (Anytime Full Refund) | OBJ-03, 04 | Must Have | `UC-008` | `NFR-009`, `NFR-010` | `AC-FR-024` | `TC-CANC-03` |
| `FR-025` | Automated Time-Based Completion | OBJ-04 | Must Have | `UC-009` | `NFR-010` | `AC-FR-025` | `TC-STAT-01` |
| `FR-026` | Verified Mentee Post-Session Review | OBJ-01 | Should Have | `UC-009` | `NFR-002` | `AC-FR-026` | `TC-REV-01` |
| `FR-027` | User Status Management (Admin) | OBJ-04 | Must Have | `UC-010` | `NFR-002` | `AC-FR-027` | `TC-ADM-01` |
| `FR-028` | Financial Ledger Audit View (Admin) | OBJ-03, 04 | Must Have | `UC-010` | `NFR-009` | `AC-FR-028` | `TC-ADM-02` |
| `FR-029` | Global Booking Audit Trail (Admin) | OBJ-04 | Must Have | `UC-010` | `NFR-002`, `NFR-010` | `AC-FR-029` | `TC-ADM-03` |

---

## 4. Quality Validation & Verification Summary

- **Total Functional Requirements (FRs):** 29
  - *Must Have (Core MVP):* 28
  - *Should Have:* 1 (`FR-026` Verified Reviews)
- **Total Non-Functional Requirements (NFRs):** 17 (covering Security, Privacy, Performance, Reliability, Usability, Accessibility, Maintainability, and Availability)
- **Total Use Cases (UCs):** 10
- **Coverage Check:**
  - 100% of Must Have functional requirements trace to a formal Use Case and Acceptance Criteria.
  - 100% of security/privacy requirements have negative/unauthorized integration test scenarios defined.
  - Bidirectional links are established across all artifacts without orphaned requirements.
