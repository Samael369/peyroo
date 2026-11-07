# Design Traceability Matrix: Peyroo Mentorship Platform

**Project Working Title:** Peyroo (پیرو)  
**Academic Course:** Software Analysis and Design (SSAD) | Fall 1405  
**Document Identifier:** `docs/design/DESIGN_TRACEABILITY_MATRIX.md`  
**Status:** `[BASELINE - STAGE 06]`  
**Date:** Aban 1405 / November 2026  
**Document Version:** 1.0  

---

## 1. Traceability Scope & Objectives

This matrix establishes complete bidirectional traceability linking the approved **Stage 04 Functional Requirements (FR)** and **Non-Functional Requirements (NFR)** to:
1. **Architectural Components** defined in [`COMPONENT_DESIGN.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/COMPONENT_DESIGN.md).
2. **Database Tables & Constraints** defined in [`DATABASE_DESIGN.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/DATABASE_DESIGN.md).
3. **RESTful API Operations** defined in [`API_DESIGN.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/API_DESIGN.md).
4. **Security & Concurrency Mechanisms** defined in [`SECURITY_DESIGN.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/SECURITY_DESIGN.md) and [`WORKFLOW_AND_TRANSACTION_DESIGN.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/WORKFLOW_AND_TRANSACTION_DESIGN.md).

---

## 2. Functional Requirements Design Traceability

| Req ID | Requirement Title | Component ID | Database Entity | API Operation | Transaction / Security Rule |
|---|---|---|---|---|---|
| `FR-001` | User Registration | `IdentityComponent` | `user_accounts` | `POST /api/auth/register` | Argon2id/bcrypt hashing, default Mentee capability |
| `FR-002` | User Authentication (Login) | `IdentityComponent` | `user_accounts` | `POST /api/auth/login` | HttpOnly cookie issuance, account status check |
| `FR-003` | User Logout & Token Revocation | `IdentityComponent` | `user_accounts` | `POST /api/auth/logout` | Session cookie invalidation |
| `FR-004` | Capability Toggling | `IdentityComponent` | `user_accounts` | `GET /api/users/me` | Client mode toggle, verified capabilities |
| `FR-005` | Mentor Profile Setup | `MentorProfileComponent` | `mentor_profiles` | `POST /api/users/me/mentor-profile` | Bio $\ge 20$, HTTPS link check, `isMentorEnabled=true` |
| `FR-006` | Public Mentor Profile View | `CatalogComponent` | `mentor_profiles`, `availability_slots` | `GET /api/mentors/:id` | Data projection: strips out `meeting_url` |
| `FR-007` | Availability Slot Creation | `SlotComponent` | `availability_slots` | `POST /api/slots` | Duration check (30/45/60m), future time check |
| `FR-008` | Slot Collision Prevention | `SlotComponent` | `availability_slots` | `POST /api/slots` | Temporal overlap SQL check $\to$ HTTP 409 Conflict |
| `FR-009` | Slot Deletion / Soft Cancellation | `SlotComponent` | `availability_slots` | `DELETE /api/slots/:id` | Soft-deletion, rejects if `HELD` or `BOOKED` |
| `FR-010` | Mentor Catalog Browsing | `CatalogComponent` | `mentor_profiles`, `availability_slots` | `GET /api/mentors` | Pagination, filters mentors with upcoming open slots |
| `FR-011` | Filter by Technical Tags | `CatalogComponent` | `mentor_profiles` | `GET /api/mentors?tag=...` | GIN index array search on `expertise_tags` |
| `FR-012` | Booking Initiation & Self-Booking Block | `BookingComponent` | `bookings` | `POST /api/bookings` | Asserts `mentee_id != mentor_profile.user_id` |
| `FR-013` | 2-Hour Booking Notice Enforcement | `BookingComponent` | `availability_slots` | `POST /api/bookings` | Asserts `slot.start_time - now >= 2 hours` |
| `FR-014` | Mandatory Structured Agenda Submission | `BookingComponent` | `session_agendas` | `POST /api/bookings` | Topic ($\ge 10$) & Questions ($\ge 15$) length checks |
| `FR-015` | Concurrency Lock & 15-Min Reservation | `BookingComponent`, `SlotComponent` | `bookings`, `availability_slots` | `POST /api/bookings` | Atomic `SELECT FOR UPDATE`, sets slot `HELD`, 15m timer |
| `FR-016` | Automated Expiration of Reservations | `SchedulerService`, `BookingComponent` | `bookings`, `availability_slots` | Background Batch SQL | Expiration worker releases slot back to `OPEN` |
| `FR-017` | 10% Platform Commission Calculation | `LedgerComponent` | `payment_transactions` | `POST /api/bookings` | Calculates: Fee + 10% Peyroo Commission = Total |
| `FR-018` | Mock Banking Gateway Simulation | `LedgerComponent` | External Simulator | `/mock-gateway/checkout` | Interactive portal with success/failure triggers |
| `FR-019` | Payment Verification Callback | `LedgerComponent`, `BookingComponent` | `payment_transactions`, `bookings` | `POST /api/payments/callback` | HMAC webhook verification, transitions to `CONFIRMED` |
| `FR-020` | User Session Dashboards | `BookingComponent` | `bookings`, `availability_slots` | `GET /api/bookings/my-sessions` | Displays upcoming, completed, cancelled sessions |
| `FR-021` | Authorized Meeting Link Disclosure | `BookingComponent` | `availability_slots` | `GET /api/bookings/my-sessions` | Exposed strictly when `CONFIRMED` and participant |
| `FR-022` | Mentee Cancellation ($\ge 24$h Full Refund) | `BookingComponent`, `LedgerComponent` | `bookings`, `payment_transactions` | `POST /api/bookings/:id/cancel` | Status $\to$ `CANCELLED_REFUNDED`, 100% refund ledger |
| `FR-023` | Mentee Late Cancellation ($< 24$h No Refund)| `BookingComponent` | `bookings`, `availability_slots` | `POST /api/bookings/:id/cancel` | Status $\to$ `CANCELLED_NO_REFUND`, no refund generated |
| `FR-024` | Mentor Cancellation (Anytime Full Refund) | `BookingComponent`, `LedgerComponent` | `bookings`, `payment_transactions` | `POST /api/bookings/:id/cancel` | Status $\to$ `CANCELLED_BY_MENTOR`, 100% refund ledger |
| `FR-025` | Automated Time-Based Session Completion | `SchedulerService`, `BookingComponent` | `bookings` | Background Batch SQL | Updates status $\to$ `COMPLETED` when end time elapses |
| `FR-026` | Verified Mentee Post-Session Review | `ReviewComponent`, `MentorProfileComponent`| `reviews`, `mentor_profiles` | `POST /api/reviews` | Validates `COMPLETED`, 1 review per booking, recalculates rating |
| `FR-027` | User Status Management (Admin) | `AdminComponent`, `IdentityComponent` | `user_accounts` | `PATCH /api/admin/users/:id/status`| Toggles `ACTIVE` $\leftrightarrow$ `SUSPENDED`, revokes sessions |
| `FR-028` | Financial Ledger Audit View (Admin) | `AdminComponent`, `LedgerComponent` | `payment_transactions` | `GET /api/admin/financial-ledger` | Summarizes gross volume, 10% commission, refunds |
| `FR-029` | Global Booking Audit Trail (Admin) | `AdminComponent`, `BookingComponent` | `bookings` | `GET /api/admin/bookings` | Read-only global audit, cannot alter slots/prices |

---

## 3. Non-Functional Requirements Design Traceability

| NFR ID | Quality Requirement | Architectural Mechanism | Document Reference |
|---|---|---|---|
| `NFR-001` | Argon2id / bcrypt Password Hashing | `IdentityService` pre-persistence hashing | `SECURITY_DESIGN.md` §2.1 |
| `NFR-002` | Backend Authorization & Ownership | Application Service ownership guards + Route middleware | `SECURITY_DESIGN.md` §3 |
| `NFR-003` | Session Token Security | `HttpOnly`, `Secure`, `SameSite=Lax` cookies | `SECURITY_DESIGN.md` §2.2 |
| `NFR-004` | SQL Injection Immunity | Parameterized queries via ORM / PostgreSQL driver | `SECURITY_DESIGN.md` §6 |
| `NFR-005` | Meeting URL Confidentiality | Projection masking in `CatalogComponent` and `BookingComponent` | `SECURITY_DESIGN.md` §4.1 |
| `NFR-006` | Agenda Confidentiality | Ownership-restricted API responses in `/api/bookings` | `SECURITY_DESIGN.md` §4.2 |
| `NFR-007` | Target Response Latency $\le 500$ ms | In-process module calls + DB indexes (`GIN`, composite B-tree) | `DATABASE_DESIGN.md` §3 |
| `NFR-008` | Concurrency Lock Reliability | Pessimistic `SELECT ... FOR UPDATE` row locks | `WORKFLOW_AND_TRANSACTION_DESIGN.md` §2 |
| `NFR-009` | Payment Ledger Integrity | Auditable `payment_transactions` log with linked refunds | `DATABASE_DESIGN.md` §3.6 |
| `NFR-010` | Non-Destructive Audit Trail | Soft updates (`CANCELLED`, `REFUNDED`), no physical `DELETE` | `DATABASE_DESIGN.md` §1 |
| `NFR-011` | Public HTTPS Deployment Target | Containerized PaaS deployment (Render / Railway / Fly.io) | `DEPLOYMENT_DESIGN.md` §2 |
| `NFR-012` | Error Feedback Clarity | Standardized JSON error response envelope across all endpoints | `API_DESIGN.md` §1.2 |
| `NFR-016` | Separation of Concerns (SoC) | 4-layer architecture within each module of Modular Monolith | `ARCHITECTURE_DESIGN.md` §2 |
