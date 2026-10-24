# Requirements Specification: Peyroo (پیرو)

> **Status Notice**: All requirements detailed in this document are **preliminary and proposed** for university analysis and design evaluation. None of these requirements are finalized or authorized for implementation during the bootstrap phase.

---

## 1. Functional Requirements (Proposed)

### 1.1 User Management & Identity (FR-AUTH)

- **FR-AUTH-01 (Proposed)**: The system shall permit users to register an account by providing an email address, password, full name, and selected primary role (Mentee or Mentor).
- **FR-AUTH-02 (Proposed)**: The system shall authenticate users securely and issue an authenticated session credential (HTTP-only secure cookie or Authorization token).
- **FR-AUTH-03 (Proposed)**: The system shall enforce role-based permissions (Mentee, Mentor, Admin) restricting access to administrative or mentor-specific features.
- **FR-AUTH-04 (Proposed)**: The system shall allow users to view and update their basic account information and change their password.

### 1.2 Mentor Profile Management (FR-PROF)

- **FR-PROF-01 (Proposed)**: Mentors shall be able to create and update their public profile, including headline, current company, role, years of experience, professional bio, languages spoken, and social profile links (LinkedIn, GitHub, Portfolio).
- **FR-PROF-02 (Proposed)**: Mentors shall be able to define mentorship topics/offerings (e.g., "Resume & Portfolio Teardown", "Career Switch to Frontend", "System Design Interview Prep") with predefined durations (e.g., 30 or 45 minutes).
- **FR-PROF-03 (Proposed)**: The system shall support profile verification badges assigned by administrators.

### 1.3 Mentor Catalog & Search (FR-SRCH)

- **FR-SRCH-01 (Proposed)**: Visitors and authenticated mentees shall be able to browse a directory of verified mentors.
- **FR-SRCH-02 (Proposed)**: The system shall support filtering mentors by domain category (e.g. Engineering, Design, Product, Data), specific skills, languages, and minimum seniority.
- **FR-SRCH-03 (Proposed)**: The system shall provide text-based search querying mentor names, titles, companies, and bios.

### 1.4 Availability & Scheduling (FR-SCHED)

- **FR-SCHED-01 (Proposed)**: Mentors shall be able to configure their weekly recurring availability windows (days of week, start time, end time) in their local timezone.
- **FR-SCHED-02 (Proposed)**: Mentors shall be able to set buffer intervals between back-to-back sessions and specify minimum advance notice required for bookings.
- **FR-SCHED-03 (Proposed)**: The system shall calculate available time slots for a mentor on a given date and render them converted to the mentee's local timezone.

### 1.5 Session Booking & Lifecycle (FR-BOOK)

- **FR-BOOK-01 (Proposed)**: Mentees shall be able to select an open time slot and submit a booking request along with session goals/questions.
- **FR-BOOK-02 (Proposed)**: The system shall record the booking with an initial state (Pending or Confirmed depending on mentor settings).
- **FR-BOOK-03 (Proposed)**: Both parties shall have access to their dashboard listing Upcoming, Completed, and Cancelled sessions.
- **FR-BOOK-04 (Proposed)**: Either party shall be able to cancel a scheduled session prior to the session start time with an optional cancellation reason.
- **FR-BOOK-05 (Proposed)**: Following session completion, mentees shall have the option to leave a rating (1-5 stars) and a testimonial review.

---

## 2. Non-Functional Requirements (Proposed)

### 2.1 Performance & Scalability (NFR-PERF)

- **NFR-PERF-01**: The backend REST API shall respond to 95% of standard read queries within 250 milliseconds under normal load conditions.
- **NFR-PERF-02**: The frontend single-page application shall achieve an initial client bundle parse/render under 1.5 seconds on broadband connections.
- **NFR-PERF-03**: Database queries shall use appropriate indexing on foreign keys and frequently queried filter columns (`userId`, `mentorId`, `category`, `status`).

### 2.2 Usability & Accessibility (NFR-USE)

- **NFR-USE-01**: The user interface shall be fully responsive across mobile (>= 375px), tablet, and desktop viewports.
- **NFR-USE-02**: Core workflows shall meet WCAG 2.1 Level AA contrast guidelines and support standard keyboard navigation.

### 2.3 Reliability & Maintainability (NFR-MAINT)

- **NFR-MAINT-01**: All codebase components shall adhere to strict TypeScript compilation settings without the use of `any` overrides or suppressed type checking.
- **NFR-MAINT-02**: All business error responses shall follow a standardized, predictable JSON schema.
- **NFR-MAINT-03**: The backend shall implement health check endpoints (`/health`) reporting system operational status.

---

## 3. Security and Privacy Requirements (Proposed)

- **SEC-REQ-01**: All inbound API payloads must be validated against strict server-side schemas using Zod before reaching domain handlers.
- **SEC-REQ-02**: Passwords must be hashed using a modern, adaptive hashing algorithm (Argon2id or bcrypt with cost factor >= 12) prior to persistence.
- **SEC-REQ-03**: Database queries must be executed exclusively through Prisma ORM to guarantee parameterized SQL statements and prevent SQL injection.
- **SEC-REQ-04**: The API shall implement Cross-Origin Resource Sharing (CORS) with explicit, whitelist-only origin configuration.
- **SEC-REQ-05**: HTTP security headers (including CSP, HSTS, X-Content-Type-Options, Frameguard) must be served on all HTTP responses via Helmet.
- **SEC-REQ-06**: Rate limiting must be enforced on sensitive endpoints (e.g. login, registration, booking creation) to mitigate brute-force and denial-of-service attempts.
- **SEC-REQ-07**: Error responses returned to clients must never disclose database error messages, stack traces, internal server file paths, or sensitive credentials.
- **SEC-REQ-08**: Application logs must sanitize and omit passwords, authentication tokens, session identifiers, and personally identifiable financial data.

---

## 4. Explicit Assumptions

1. **Academic Context**: The initial system is developed as an academic Software Analysis and Design project; extreme multi-region clustering and enterprise compliance audits (e.g. SOC2, HIPAA) are not required at this stage.
2. **PostgreSQL Availability**: The production and local development environments will provide access to PostgreSQL 15+ for relational persistence.
3. **External Meeting Infrastructure**: Video conferencing will rely on mentors providing external meeting links (e.g., Google Meet, Zoom) or an external webhook-driven room service rather than hosting custom media streaming servers.
4. **No Direct Frontend DB Access**: The client application will never communicate directly with PostgreSQL; all interactions traverse the Node.js Express REST API.

---

## 5. Open Questions for Future Stakeholder Decision

The following architectural and product decisions remain unresolved and require explicit stakeholder approval prior to implementation:

1. **Authentication Architecture**:
   - _Option A_: State-managed HTTP-only session cookies stored server-side.
   - _Option B_: Stateless JWT tokens passed in `Authorization: Bearer` headers (or HTTP-only cookies) with refresh token rotation.
   - _Decision needed_: Which token lifecycle matches project security and deployment needs?
2. **Booking Approval Mode**:
   - Should bookings be automatically confirmed upon selection of an open slot, or should mentors have an optional "Request to Book" approval gate?
3. **Calendar Synchronization**:
   - Should initial versions support native iCal/.ics calendar file exports, or is two-way Google Calendar OAuth sync required for the first release?
4. **Third-Party Video Integration**:
   - Should mentors manually enter static meeting links in their profiles, or should the backend generate ephemeral rooms using a provider such as Daily.co / LiveKit?
5. **Session Notifications**:
   - Should email notifications (confirmations, reminders, cancellations) be sent via transactional email provider (e.g. Resend / SendGrid) or handled purely as in-app notifications initially?
