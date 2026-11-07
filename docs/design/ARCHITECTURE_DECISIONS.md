# Architecture Decision Records (ADRs): Peyroo Mentorship Platform

**Project Working Title:** Peyroo (پیرو)  
**Academic Course:** Software Analysis and Design (SSAD) | Fall 1405  
**Document Identifier:** `docs/design/ARCHITECTURE_DECISIONS.md`  
**Status:** `[BASELINE - STAGE 06]`  
**Date:** Aban 1405 / November 2026  
**Document Version:** 1.0  

---

## 1. Overview & ADR Index

This document formalizes the key architectural decisions made for the **Peyroo Mentorship Platform** using standard Architecture Decision Record (ADR) conventions.

| ADR ID | Decision Title | Status | Date |
|---|---|:---:|:---:|
| **ADR-001** | Architectural Style: Modular Monolith with Layered Domain Architecture | Accepted | Nov 2026 |
| **ADR-002** | Persistence & Concurrency Strategy: Relational Database with Row-Level Locking | Accepted | Nov 2026 |
| **ADR-003** | User Identity Architecture: Unified Account with Independent Dynamic Capabilities | Accepted | Nov 2026 |
| **ADR-004** | Time-Based Background Processing: Embedded In-Process Task Scheduler | Accepted | Nov 2026 |
| **ADR-005** | Authentication & Session Management: JWT Transmitted via Secure HTTP-Only Cookies | Accepted | Nov 2026 |
| **ADR-006** | Financial Gateway Strategy: External Mock Banking Gateway Simulator with Webhook Callbacks | Accepted | Nov 2026 |

---

## ADR-001: Architectural Style — Modular Monolith

### Context
The platform requires clear separation of concerns across multiple domains (Identity, Slot Management, Booking, Financial Ledger, Reviews, Administration). In modern software engineering, architectures range from single monolithic applications to distributed microservices. The project is an academic semester software engineering delivery requiring deterministic end-to-end integration, high test reliability, and a live cloud deployment defense under free-tier resource limits.

### Decision
We will adopt a **Modular Monolith** architecture partitioned into strict domain modules following a 4-layer clean architecture pattern (Presentation, Application, Domain, Infrastructure).

### Consequences
- **Positive:**
  - Zero network overhead or serialization latency between domains.
  - Native ACID transactions across related operations (e.g., booking creation, slot reservation, and ledger recording) without distributed two-phase commits.
  - Highly simplified local development, automated integration testing, and single-container deployment.
  - Aligns directly with academic evaluation criteria: features work reliably end-to-end without artificial microservice complexity.
- **Negative / Mitigations:**
  - Risk of domain coupling if developers take shortcuts. *Mitigation:* Enforce strict internal dependency rules via linter/module boundaries and code reviews.
  - All modules scale together. *Mitigation:* Acceptable because traffic volume for an academic demonstration and MVP is well within single-instance capacity.

---

## ADR-002: Persistence & Concurrency Strategy — Relational Database with Row-Level Locking

### Context
The platform mandates strict data integrity:
1. Concurrency control: Two users must never be able to book the same availability slot simultaneously.
2. Financial integrity: An auditable payment transaction ledger must record fees, 10% platform commission, and refund transactions with full traceability back to originating payments via `parent_transaction_id`.
3. NoSQL document stores provide eventual consistency and lack multi-document ACID transactions out-of-the-box, introducing race condition vulnerabilities during high-concurrency booking attempts.

### Decision
We select a **Relational Database Management System (PostgreSQL)** utilizing ACID transactions, **pessimistic row-level locking (`SELECT ... FOR UPDATE`)**, and a **partial unique index** (`uq_active_booking_per_slot`) for slot reservation operations.

### Consequences
- **Positive:**
  - Deterministic prevention of double-booking: When a mentee initiates a booking, the target slot row is locked during the transaction. Competing requests block or fail immediately with HTTP 409 Conflict.
  - Native relational constraints (foreign keys, check constraints, unique constraints) guarantee referential integrity at the storage layer.
  - Excellent tooling, widespread industry adoption, and free-tier managed cloud availability (e.g., Supabase, Neon, Render PostgreSQL).
- **Negative / Mitigations:**
  - Row locking creates brief serialization on the specific slot row being booked. *Mitigation:* Locks are held only for the duration of the reservation creation transaction (a few milliseconds), not during the 15-minute checkout window.

---

## ADR-003: User Identity Architecture — Unified Account with Independent Dynamic Capabilities

### Context
A user may wish to mentor others in certain technologies (e.g., Go/Backend) while simultaneously seeking mentorship in other areas (e.g., Machine Learning or Engineering Management). Requiring separate accounts for Mentors and Mentees creates user friction, duplicate authentication credentials, and fragmented session states.

### Decision
Implement a **Unified Account Model** where `Mentee` and `Mentor` are independent, non-mutually exclusive capabilities attached to a single `UserAccount`.
- Mentee capability is enabled by default for all registered accounts.
- Mentor capability is activated dynamically when the user completes mandatory mentor profile attributes (headline, bio, expertise tags, rate, default meeting URL).
- Users can seamlessly switch their active dashboard mode ("Mentee Mode" vs. "Mentor Mode") within a single session.
- Self-booking is structurally prohibited by validating that the booking mentee user account does not equal the user account of the mentor profile (`booking.mentee_id != mentor_profile.user_id`).

### Consequences
- **Positive:**
  - Modern, intuitive UX matching leading platforms (e.g., ADPList, Airbnb).
  - Eliminates the need for duplicate user registration, separate emails, or multiple login sessions.
  - Simplifies identity queries and session token payloads.
- **Negative / Mitigations:**
  - Authorization middleware must verify capability activation (`isMentorEnabled`) before allowing slot creation. *Mitigation:* Dedicated capability guard middleware in the presentation layer.

---

## ADR-004: Time-Based Background Processing — Embedded In-Process Task Scheduler

### Context
The system requires automated time-triggered operations:
1. Releasing expired slot reservations after 15 minutes of non-payment.
2. Transitioning confirmed bookings to `COMPLETED` once the scheduled slot `end_time` has elapsed.
Introducing external distributed task queues (e.g., RabbitMQ, Celery, Redis BullMQ) adds external process dependencies, increases operational failure points, and exceeds free-tier memory allowances.

### Decision
Utilize a lightweight **embedded in-process background task scheduler** (e.g., periodic interval runner executing optimized SQL polling queries every 60 seconds) protected by PostgreSQL non-blocking **transaction-level advisory locks (`pg_try_advisory_xact_lock`)** to prevent concurrent duplicate execution across multiple server instances.
- *Connection Pooling Safety:* Transaction-level advisory locks are bound strictly to the transaction block (`BEGIN ... COMMIT/ROLLBACK`), ensuring they automatically release upon completion. Unlike session-level advisory locks, transaction-level locks are 100% safe with connection poolers (such as PgBouncer in transaction pooling mode or application connection pools) because they cannot leak across pooled physical connections.
- Query 1 (Expiration): `UPDATE bookings SET status = 'EXPIRED' WHERE status = 'PENDING_PAYMENT' AND expires_at <= NOW() RETURNING slot_id;` followed by `UPDATE availability_slots SET status = 'OPEN' WHERE id IN (...);`.
- Query 2 (Completion): `UPDATE bookings SET status = 'COMPLETED', completed_at = NOW() WHERE status = 'CONFIRMED' AND EXISTS (SELECT 1 FROM availability_slots WHERE availability_slots.id = bookings.slot_id AND availability_slots.end_time <= NOW());`.

### Consequences
- **Positive:**
  - Zero external infrastructure dependencies (runs within the main application process).
  - Minimal CPU and memory overhead; completely deterministic and easy to test.
  - Transaction-scoped advisory locks guarantee single-leader execution when multiple instances are deployed, without connection pool leakage.
  - Inherently self-healing: upon application restart, the queries immediately catch up all overdue bookings accumulated during downtime.
- **Negative / Mitigations:**
  - Background task runs on a 60-second polling interval, introducing up to 60 seconds of latency for automated completion. *Mitigation:* Also implement on-demand status evaluation whenever an individual booking is queried by ID.

---

## ADR-005: Authentication & Session Management — JWT Transmitted via Secure HTTP-Only Cookies

### Context
The application requires secure, persistent authentication across browser refreshes and tab closures. Storing authentication tokens in browser `localStorage` or `sessionStorage` exposes tokens to Cross-Site Scripting (XSS) exfiltration.

### Decision
Adopt **JSON Web Tokens (JWT)** or secure signed session tokens transmitted via **`HttpOnly`, `Secure`, `SameSite=Lax` cookies**.
- The token payload includes `userId`, `email`, `isAdmin`, and active capability flags.
- Browser automatically transmits the cookie on API requests; client JavaScript cannot access the token directly.
- API endpoints validate token signature and expiration on every authenticated request.

### Consequences
- **Positive:**
  - Immune to token theft via client-side XSS vulnerabilities.
  - `SameSite=Lax` configuration mitigates Cross-Site Request Forgery (CSRF).
  - Transparent persistence across page refreshes.
- **Negative / Mitigations:**
  - Requires proper CORS configuration (`credentials: true`, specific allowed origin) between frontend and backend. *Mitigation:* Documented and standardized in API and deployment configurations.

---

## ADR-006: Financial Gateway Strategy — External Mock Banking Gateway Simulator with Webhooks

### Context
To prove business viability and meet academic requirements, the platform requires an integrated monetization model (mentor session fee + 10% platform commission) and a realistic banking flow. However, connecting to live commercial payment gateways (Stripe, Zarinpal) introduces real-money liability, merchant legal verification, and dependency on external banking networks during live grading presentations.

### Decision
Implement a dedicated **Mock Payment Gateway Simulator** operating as an external service interface with real-world redirect and webhook callback mechanics.
- Peyroo backend issues an authenticated transaction redirect URL to the Mock Gateway.
- The simulator renders an interactive banking portal displaying the itemized total, mentor fee, and 10% Peyroo commission.
- The simulator provides explicit "Simulate Successful Payment" and "Simulate Failed Payment" triggers.
- The gateway sends an asynchronous signed webhook callback `POST /api/payments/callback` to finalize transactions in the immutable ledger.

### Consequences
- **Positive:**
  - Demonstrates real-world distributed payment architecture (redirections, callbacks, idempotency) without external banking red tape or financial liability.
  - Enables 100% deterministic testing of both success and failure payment branches during academic presentations.
  - Satisfies the course requirement for business viability and revenue tracking.
- **Negative / Mitigations:**
  - Must secure the webhook endpoint against spoofing. *Mitigation:* Gateway signs callback payloads using a shared HMAC secret key, verified by the backend API.
