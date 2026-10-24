# API Contract & Conventions: Peyroo (پیرو)

> **Status Notice**: This document outlines **API standards and conventions** for future endpoint development. No business endpoints (e.g., users, bookings, mentors) are implemented during this initial bootstrap phase.

---

## 1. Core Principles & Conventions

- **Architecture**: RESTful JSON API.
- **Protocol**: HTTPS in production; HTTP allowed on `localhost` in local development.
- **Base URI Prefix**: `/api/v1`
  - System utility endpoints (such as `/health`) reside at root `/health`.
- **Character Encoding**: UTF-8.
- **Content Negotiation**:
  - `Content-Type: application/json` for all request bodies.
  - `Accept: application/json` on all client requests.

---

## 2. Standard Response Envelope

All API responses must conform to a standardized JSON wrapper to guarantee predictable client-side parsing.

### 2.1 Successful Response (`2xx`)

```typescript
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
```

**Example:**

```json
{
  "success": true,
  "data": {
    "id": "usr_98a7b6c5",
    "email": "learner@example.com",
    "fullName": "Jane Doe",
    "role": "MENTEE"
  }
}
```

### 2.2 Error Response (`4xx` / `5xx`)

```typescript
interface ApiErrorResponse {
  success: false;
  error: {
    code: string; // Standard machine-readable uppercase snake_case code
    message: string; // Human-readable summary for client display
    details?: unknown; // Structured validation errors or contextual metadata
  };
}
```

**Example (Validation Error):**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The submitted payload failed validation.",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must contain at least 8 characters"
      }
    ]
  }
}
```

---

## 3. Standard HTTP Status Codes

The API uses semantic HTTP status codes:

| Status Code                 | Meaning           | Usage Scenario                                                               |
| :-------------------------- | :---------------- | :--------------------------------------------------------------------------- |
| `200 OK`                    | Success           | Successful `GET`, `PUT`, `PATCH`, or action that returns data.               |
| `201 Created`               | Created           | Successful `POST` creating a new resource (returns created entity).          |
| `204 No Content`            | No Content        | Successful deletion (`DELETE`) returning no body.                            |
| `400 Bad Request`           | Client Error      | Malformed JSON syntax or semantic request failure.                           |
| `401 Unauthorized`          | Unauthenticated   | Missing, invalid, or expired authentication credentials.                     |
| `403 Forbidden`             | Access Denied     | Authenticated, but lacking permissions (e.g. mentee editing mentor profile). |
| `404 Not Found`             | Not Found         | Requested resource ID does not exist.                                        |
| `409 Conflict`              | Conflict          | Resource collision (e.g., email already registered, booking slot clash).     |
| `422 Unprocessable Entity`  | Validation Failed | Zod schema validation rejected input fields.                                 |
| `429 Too Many Requests`     | Rate Limited      | Client exceeded request rate limit threshold.                                |
| `500 Internal Server Error` | Server Fault      | Unexpected unhandled server exception (sanitized output).                    |

---

## 4. Input Validation Standards

- **Server-Side Exclusivity**: All incoming parameters (`req.params`), queries (`req.query`), and bodies (`req.body`) must be validated against a strict Zod schema before invoking business logic.
- **Fail-Fast**: The validation middleware halts execution immediately upon encountering schema violations and returns a `422 Unprocessable Entity` or `400 Bad Request` with structured error details.
- **No Extra Attributes**: Zod schemas must strip or reject unknown fields (`strip()` or `strict()`) to prevent parameter injection attacks.

---

## 5. Authentication & Authorization Expectations

- **Authentication Header**:
  ```http
  Authorization: Bearer <token>
  ```
  _(Or HTTP-only cookie based on the final decision recorded in REQUIREMENTS.md)._
- **Role Verification**: Middleware functions (e.g. `requireAuth`, `requireRole('MENTOR')`) must authenticate and authorize requests before reaching the controller.
- **Subject Extraction**: Controllers must read the authenticated user's ID and role strictly from `req.user` attached by the auth middleware—never from client query or body parameters.

---

## 6. Pagination & Filtering Conventions

List endpoints (e.g., mentor search, booking listings) must implement consistent query parameter conventions:

- `page`: 1-based page index (default: `1`).
- `limit`: Items per page (default: `20`, maximum: `100`).
- `sort`: Column name with optional direction indicator (e.g. `createdAt:desc`, `rating:asc`).
- `filter`: Explicit parameter names (e.g. `category=Engineering&language=en`).
