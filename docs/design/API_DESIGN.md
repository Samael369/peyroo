# RESTful API Interface Specification: Peyroo Mentorship Platform

**Project Working Title:** Peyroo (پیرو)  
**Academic Course:** Software Analysis and Design (SSAD) | Fall 1405  
**Document Identifier:** `docs/design/API_DESIGN.md`  
**Status:** `[BASELINE - STAGE 06]`  
**Date:** Aban 1405 / November 2026  
**Document Version:** 1.0  

---

## 1. API Protocol & Communication Conventions

All endpoints adhere to RESTful conventions over **HTTPS**, accepting and returning payloads formatted as `application/json; charset=utf-8`.

### 1.1 Standard Response Envelope
Successful responses return structured JSON with contextual data:

```json
{
  "success": true,
  "data": { ... },
  "meta": { "timestamp": "2026-11-10T14:30:00Z" }
}
```

### 1.2 Standard Error Response Envelope
Every failure returns an explicit HTTP status code ($4xx$, $5xx$) and a structured payload adhering to `NFR-012`:

```json
{
  "success": false,
  "error": {
    "code": "SLOT_COLLISION",
    "message": "Proposed slot collides with an existing availability slot.",
    "field": "startTime",
    "timestamp": "2026-11-10T14:30:00Z"
  }
}
```

---

## 2. API Endpoint Directory

### 2.1 Module 1: Authentication & Identity (`/api/auth`)

#### `POST /api/auth/register`
- **Purpose:** Register a new user account with default Mentee capability.
- **Auth Required:** Public / None.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "fullName": "Amir Hosseini"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "email": "user@example.com",
        "fullName": "Amir Hosseini",
        "status": "ACTIVE",
        "isMenteeEnabled": true,
        "isMentorEnabled": false,
        "isAdmin": false
      }
    }
  }
  ```
- **Error Responses:** 400 (Invalid syntax), 409 (Email already registered).

#### `POST /api/auth/login`
- **Purpose:** Authenticate user and issue secure HTTP-Only session cookie.
- **Auth Required:** Public / None.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Success Response (200 OK):** User details returned; `Set-Cookie: peyroo_session=...; HttpOnly; Secure; SameSite=Lax`.
- **Error Responses:** 401 (Invalid credentials), 403 (Account suspended).

#### `POST /api/auth/logout`
- **Purpose:** Invalidate session token and clear authentication cookie.
- **Auth Required:** Bearer / Session Cookie.
- **Success Response (200 OK):** `{"success": true, "message": "Logged out successfully"}`.

---

### 2.2 Module 2: User Profiles & Capabilities (`/api/users`)

#### `GET /api/users/me`
- **Purpose:** Retrieve profile, permissions, and active capabilities for current authenticated user.
- **Auth Required:** Authenticated User.
- **Success Response (200 OK):** User account details with mentor profile summary if activated.

#### `POST /api/users/me/mentor-profile`
- **Purpose:** Activate Mentor capability and configure mandatory profile details.
- **Auth Required:** Authenticated User (`status == ACTIVE`).
- **Request Body:**
  ```json
  {
    "headline": "Senior Backend Engineer @ TechCo",
    "biography": "10+ years designing distributed systems in Go and PostgreSQL. Passionate about mentoring junior developers.",
    "expertiseTags": ["Backend", "Go", "Distributed Systems", "PostgreSQL"],
    "baseSessionRate": 500000,
    "currency": "IRR",
    "defaultMeetingUrl": "https://meet.google.com/abc-defg-hij"
  }
  ```
- **Success Response (200 OK):** Sets `isMentorEnabled = true` and returns updated profile.
- **Error Responses:** 422 (Bio $< 20$ chars, invalid HTTPS link, negative fee).

#### `PUT /api/users/me/mentor-profile`
- **Purpose:** Update existing mentor profile details (bio, headline, expertise tags, base rate, default meeting URL).
- **Auth Required:** Authenticated Mentor (`isMentorEnabled == true`).
- **Request Body:** Same schema as profile creation; all fields optional for partial update.
- **Success Response (200 OK):** Returns updated mentor profile.
- **Error Responses:** 403 (Not a mentor), 422 (Validation constraints violated).

#### `PATCH /api/users/me/active-mode`
- **Purpose:** Toggle user's active client operational context between Mentee Mode and Mentor Mode (`FR-004`).
- **Auth Required:** Authenticated User.
- **Request Body:**
  ```json
  {
    "activeMode": "MENTOR"
  }
  ```
- **Success Response (200 OK):** `{"success": true, "data": {"activeMode": "MENTOR"}}`.
- **Error Responses:** 400 (Invalid mode), 403 (Cannot switch to MENTOR mode if mentor capability is not configured).

---

### 2.3 Module 3: Mentor Discovery & Catalog (`/api/mentors`)

#### `GET /api/mentors`
- **Purpose:** Browse active mentors possessing upcoming open slots, with optional tag filtering.
- **Auth Required:** Public / None.
- **Query Parameters:**
  - `tag` (string, optional, e.g. `Backend`)
  - `page` (integer, default: 1)
  - `limit` (integer, default: 12)
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "mentors": [
        {
          "mentorId": "m1111111-e5f6-7890-abcd-ef1234567890",
          "fullName": "Sara Rad",
          "headline": "Senior Software Engineer",
          "expertiseTags": ["Backend", "Go", "System Design"],
          "baseSessionRate": 500000,
          "currency": "IRR",
          "averageRating": 4.9,
          "totalReviewsCount": 18,
          "nextAvailableSlot": "2026-11-12T18:00:00Z"
        }
      ],
      "pagination": { "page": 1, "limit": 12, "totalCount": 42 }
    }
  }
  ```

#### `GET /api/mentors/:mentorId`
- **Purpose:** Inspect public profile and upcoming open slots for a specific mentor.
- **Auth Required:** Public / None.
- **Note:** Private external meeting URLs are strictly withheld from this response (`NFR-005`).

---

### 2.4 Module 4: Availability Slot Management (`/api/slots`)

#### `POST /api/slots`
- **Purpose:** Publish a new availability slot.
- **Auth Required:** Authenticated Mentor (`isMentorEnabled == true`).
- **Request Body:**
  ```json
  {
    "startTime": "2026-11-15T18:00:00Z",
    "durationMinutes": 45,
    "customSessionRate": 500000,
    "customMeetingUrl": "https://meet.google.com/xyz-uvwx-rst"
  }
  ```
- **Success Response (201 Created):** Returns slot record with `status = 'OPEN'`.
- **Error Responses:** 403 (Mentor capability not enabled), 409 (Temporal slot collision), 422 (Invalid duration: not 30, 45, or 60).

#### `DELETE /api/slots/:slotId`
- **Purpose:** Delete/archive an unbooked slot.
- **Auth Required:** Slot Owner (`auth.user_id == mentor_profile.user_id`).
- **Success Response (200 OK):** Slot soft-deleted.
- **Error Responses:** 403 (Not slot owner), 409 (Cannot delete slot in `HELD` or `BOOKED` status).

#### `GET /api/slots/my-slots`
- **Purpose:** Retrieve all availability slots created by the authenticated mentor (`FR-007`, `FR-009`).
- **Auth Required:** Authenticated Mentor (`isMentorEnabled == true`).
- **Query Parameters:** `status` (optional: `OPEN`, `HELD`, `BOOKED`, `CANCELLED`).
- **Success Response (200 OK):** Returns array of mentor's slots with booking indicators and current status.

---

### 2.5 Module 5: Session Booking & Concurrency (`/api/bookings`)

#### `POST /api/bookings`
- **Purpose:** Initiate slot reservation, acquire 15-minute concurrency lock, and calculate commission.
- **Auth Required:** Authenticated Mentee.
- **Request Body:**
  ```json
  {
    "slotId": "s9999999-e5f6-7890-abcd-ef1234567890",
    "agenda": {
      "topicObjective": "Code architecture review of my open-source Go project",
      "specificQuestions": "How should I structure domain repositories and handle concurrency under load?",
      "portfolioRepoUrl": "https://github.com/student/backend-core"
    }
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "bookingId": "b8888888-e5f6-7890-abcd-ef1234567890",
      "status": "PENDING_PAYMENT",
      "expiresAt": "2026-11-10T14:45:00Z",
      "pricing": {
        "mentorFee": 500000,
        "platformCommission": 50000,
        "totalAmount": 550000,
        "currency": "IRR"
      },
      "paymentRedirectUrl": "/mock-gateway/checkout?bookingId=b8888888-e5f6-7890-abcd-ef1234567890"
    }
  }
  ```
- **Error Responses:** 
  - 403 (Self-booking attempt: `auth.user.id == mentor_profile.user_id` where `mentor_profile.id == slot.mentor_id`),
  - 409 (Concurrency conflict: Slot already `HELD` or `BOOKED`),
  - 422 (Booking notice $< 2$ hours before slot start time).

#### `GET /api/bookings/my-sessions`
- **Purpose:** Retrieve authenticated user's session bookings (filter by mode: `mentee` or `mentor`).
- **Auth Required:** Authenticated User.
- **Note:** Exposes external `meetingUrl` **only** for bookings in `CONFIRMED` status.

#### `GET /api/bookings/:bookingId`
- **Purpose:** Retrieve full details for a specific session booking (`FR-020`, `FR-021`).
- **Auth Required:** Session Participant (`auth.user.id == booking.mentee_id` OR `auth.user.id == mentor_profile.user_id`) or Administrator.
- **Success Response (200 OK):** Complete booking details, mentor details, mentee details, submitted agenda, and meeting URL (if `CONFIRMED`).
- **Error Responses:** 403 (Unauthorized: neither participant nor admin), 404 (Booking not found).

#### `POST /api/bookings/:bookingId/cancel`
- **Purpose:** Cancel a confirmed booking according to cancellation policy.
- **Auth Required:** Participant (`auth.user.id == booking.mentee_id` OR `auth.user.id == mentor_profile.user_id`).
- **Success Response (200 OK):**
  - Mentee $\ge 24$h: `{"status": "CANCELLED_REFUNDED", "refundIssued": true}`
  - Mentee $< 24$h: `{"status": "CANCELLED_NO_REFUND", "refundIssued": false}`
  - Mentor anytime: `{"status": "CANCELLED_BY_MENTOR", "refundIssued": true}`

---

### 2.6 Module 6: Payment Gateway & Webhook Callback (`/api/payments`)

#### `POST /api/payments/callback`
- **Purpose:** Asynchronous webhook callback from Mock Payment Gateway simulator.
- **Auth Required:** Webhook Signature Verification (`X-Gateway-Signature` header).
- **Request Body:**
  ```json
  {
    "bookingId": "b8888888-e5f6-7890-abcd-ef1234567890",
    "externalTxRef": "MOCK-TX-987654321",
    "idempotencyKey": "IDEMP-88888888-PAYMENT-1",
    "status": "SUCCESS",
    "amountPaid": 550000,
    "timestamp": "2026-11-10T14:38:00Z"
  }
  ```
- **Success Response (200 OK):** Booking updated to `CONFIRMED`, slot locked to `BOOKED`, ledger updated to `COMPLETED`. (If already processed with same `idempotencyKey`, returns cached 200 without duplicate state changes).
- **Error Responses:** 400 (Reservation expired; payment was captured as COMPLETED and a separate linked CANCELLATION_REFUND was immediately recorded), 401 (Invalid webhook signature).

---

### 2.7 Module 7: Verified Reviews (`/api/reviews`)

#### `POST /api/reviews`
- **Purpose:** Submit post-session feedback.
- **Auth Required:** Verified Mentee of a `COMPLETED` booking.
- **Request Body:**
  ```json
  {
    "bookingId": "b8888888-e5f6-7890-abcd-ef1234567890",
    "starRating": 5,
    "commentText": "Exceptional practical guidance on database indexing."
  }
  ```
- **Success Response (201 Created):** Review recorded; mentor rating recalculated.
- **Error Responses:** 403 (Booking not `COMPLETED`), 409 (Review already submitted for this booking).

---

### 2.8 Module 8: Administration & Governance (`/api/admin`)

#### `PATCH /api/admin/users/:userId/status`
- **Purpose:** Toggle user account status between `ACTIVE` and `SUSPENDED`.
- **Auth Required:** Administrator (`auth.user.isAdmin == true`).
- **Request Body:** `{"status": "SUSPENDED"}`.

#### `GET /api/admin/financial-ledger`
- **Purpose:** Retrieve itemized transactions, total volume, and collected 10% commission.
- **Auth Required:** Administrator.

#### `GET /api/admin/bookings`
- **Purpose:** Inspect global bookings and state changes in read-only mode.
- **Auth Required:** Administrator.
