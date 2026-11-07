# Non-Functional Requirements Specification: Peyroo Mentorship Platform

**Project Working Title:** Peyroo (پیرو)  
**Academic Course:** Software Analysis and Design (SSAD) | Fall 1405  
**Document Identifier:** `docs/requirements/NON_FUNCTIONAL_REQUIREMENTS.md`  
**Status:** `[BASELINE - STAGE 04]`  
**Date:** Aban 1405 / November 2026  
**Document Version:** 1.0  

---

## 1. Overview & Quality Attributes

This specification defines the non-functional requirements (NFRs) governing the **Peyroo Mentorship Platform**. All requirements are formulated with explicit, verifiable criteria aligned with the semester project scope and deployment constraints.

---

## 2. Security Requirements

### `NFR-001`: Credential Security & Password Hashing
- **Category:** Security
- **Description:** The system must never store user passwords in plaintext or using reversible encryption.
- **Measurable Criterion:** Passwords must be hashed using industry-standard salted hashing algorithms (e.g., Argon2id with minimum memory cost 19 MiB or bcrypt with work factor $\ge 10$) prior to persistence.
- **Verification:** Security audit and unit test inspecting database records during user creation.

### `NFR-002`: Backend Authorization & Ownership Enforcement
- **Category:** Security
- **Description:** Access control must be validated at the backend application layer for every state-altering or private data request.
- **Measurable Criterion:** 100% of API endpoints handling user-owned resources (bookings, slots, agendas, meeting links) must assert `auth.user_id == resource.owner_id` or `auth.user.isAdmin == true`. Requests violating ownership must return HTTP 403 Forbidden with zero data leaked.
- **Verification:** Automated integration test suite executing negative permission attacks.

### `NFR-003`: Session Token Security
- **Category:** Security
- **Description:** Authentication sessions must be secured against interception and cross-site scripting (XSS) / cross-site request forgery (CSRF).
- **Measurable Criterion:** Tokens transmitted over cookies must be configured with `HttpOnly`, `Secure` (over HTTPS), and `SameSite=Lax` or `Strict`. Bearer tokens transmitted via headers must expire within 24 hours of inactivity.
- **Verification:** Header inspection test suite and browser security scans.

### `NFR-004`: SQL & Injection Vulnerability Immunity
- **Category:** Security
- **Description:** The system must prevent SQL injection and NoSQL injection vulnerabilities across all database operations.
- **Measurable Criterion:** 100% of database queries must utilize parameterized statements or an Object-Relational Mapping (ORM) query builder. Raw string concatenation in database queries is strictly prohibited.
- **Verification:** Static code analysis (linter) and dynamic penetration tests.

---

## 3. Privacy & Data Protection Requirements

### `NFR-005`: Confidentiality of Meeting Links
- **Category:** Privacy
- **Description:** External video conferencing URLs (Google Meet / Zoom) must remain strictly private to authorized session participants.
- **Measurable Criterion:** Public catalog APIs, mentor profile queries, and unauthenticated endpoints must return null/omit the meeting URL field. The link is disclosed exclusively when `auth.user_id in (mentee_id, mentor_id)` AND `booking.status == CONFIRMED`.
- **Verification:** API integration test validating response payloads across unauthenticated, unauthorized, and confirmed user contexts.

### `NFR-006`: Agenda Confidentiality
- **Category:** Privacy
- **Description:** Mentee session agendas, project links, and discussion questions must be accessible only to the mentee, the booked mentor, and system administrators.
- **Measurable Criterion:** Requests by third-party authenticated users to read another user's agenda must return HTTP 403 Forbidden.
- **Verification:** API authorization test.

---

## 4. Performance & Efficiency Requirements

### `NFR-007`: API Response Latency
- **Category:** Performance
- **Description:** The backend API must process standard read and write requests efficiently under normal operating load.
- **Measurable Criterion:** 95% of read requests (e.g., catalog search, user profiles, dashboard view) must respond within $\le 500$ ms at the server boundary under a simulated load of 20 concurrent users (accommodating free-tier cloud hosting constraints).
- **Verification:** Automated load test using k6, Artillery, or Apache Bench.

### `NFR-008`: Booking Lock Concurrency Performance
- **Category:** Performance
- **Description:** The concurrency lock for slot reservations must resolve without deadlocks or double-booking race conditions.
- **Measurable Criterion:** Under 10 simultaneous concurrent requests attempting to book the exact same slot, exactly 1 request must succeed (HTTP 201), and exactly 9 must be rejected (HTTP 409 Conflict) within $\le 800$ ms.
- **Verification:** Automated parallel integration test.

---

## 5. Reliability & Availability Requirements

### `NFR-009`: Financial Ledger Double-Entry Integrity
- **Category:** Reliability
- **Description:** The system must maintain strict financial consistency across booking states and payment transactions.
- **Measurable Criterion:** Every confirmed booking must have exactly one corresponding `COMPLETED` transaction in the ledger where $\text{MentorFee} + \text{PlatformCommission} == \text{TotalPaid}$. In the event of a cancellation refund, a corresponding `REFUNDED` transaction must equal the original total.
- **Verification:** Automated ledger integrity verification test.

### `NFR-010`: Non-Destructive Audit Trail
- **Category:** Reliability
- **Description:** Critical business records (bookings, slots, transactions) must be preserved for historical auditing.
- **Measurable Criterion:** Cancelled slots and bookings must undergo status transitions (`CANCELLED`, `CANCELLED_BY_MENTOR`, `REFUNDED`) rather than physical deletion (`DELETE FROM table`). Hard deletion of historical records is prohibited.
- **Verification:** Database query inspection following cancellation workflows.

### `NFR-011`: Service Availability on Public Deployment
- **Category:** Availability
- **Description:** The public deployment must maintain continuous availability during academic review periods.
- **Measurable Criterion:** The deployed web application must maintain $\ge 99.0\%$ uptime during the 7-day presentation evaluation window on an approved cloud platform (Render, Vercel, Railway, or Fly.io).
- **Verification:** Continuous uptime ping monitor.

---

## 6. Usability & User Experience Requirements

### `NFR-012`: Error Feedback Clarity
- **Category:** Usability
- **Description:** System validation and operation errors must provide human-readable, actionable guidance to the user.
- **Measurable Criterion:** 100% of validation errors (e.g., booking $< 2$ hours in advance, password too short, invalid time slot) must return structured JSON error messages containing a descriptive `message` field and the specific offending `field`. Raw database exceptions or stack traces must never leak to the client interface.
- **Verification:** Integration error-handling test suite.

### `NFR-013`: Responsive Web Design
- **Category:** Usability
- **Description:** The user interface must adapt cleanly across standard device viewports.
- **Measurable Criterion:** All core user journeys (browsing, slot creation, booking, payment simulation, dashboards) must be fully navigable and functional on screen widths ranging from 375px (mobile) to 1440px (desktop) without horizontal clipping.
- **Verification:** Visual layout inspection in Chrome DevTools responsive emulation.

---

## 7. Accessibility & Compatibility Requirements

### `NFR-014`: Browser Compatibility
- **Category:** Compatibility
- **Description:** The web application must function consistently across modern evergreen web browsers.
- **Measurable Criterion:** Zero breaking functional defects on the latest stable versions of Google Chrome, Mozilla Firefox, Microsoft Edge, and Apple Safari.
- **Verification:** Cross-browser smoke testing.

### `NFR-015`: Keyboard Navigability & Form Accessibility
- **Category:** Accessibility
- **Description:** Critical interactive controls must support standard keyboard navigation.
- **Measurable Criterion:** Users must be able to complete login, mentor filtering, slot selection, and form submission using only keyboard inputs (`Tab`, `Enter`, `Space`, `Esc`).
- **Verification:** Manual keyboard accessibility walkthrough.

---

## 8. Maintainability & Code Quality Requirements

### `NFR-016`: Separation of Concerns (SoC)
- **Category:** Maintainability
- **Description:** The codebase must maintain clear modular boundaries between presentation/UI, API routing, business domain logic, and database persistence.
- **Measurable Criterion:** No direct database queries or raw SQL may reside within frontend components or API route controllers; domain services and repository layers must mediate all state mutations.
- **Verification:** Architectural code review and linting enforcement.

### `NFR-017`: Automated Test Suite Execution
- **Category:** Maintainability
- **Description:** The automated test suite must run deterministically via a single command in CI/CD and local environments.
- **Measurable Criterion:** The test suite must execute and pass in $\le 120$ seconds without requiring manual intervention or live third-party internet connections.
- **Verification:** Test runner execution logs.
