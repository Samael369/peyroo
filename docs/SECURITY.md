# Security Architecture & Standards: Peyroo (پیرو)

## 1. Security Philosophy & Trust Boundaries

The security architecture of Peyroo is founded on the **Zero Trust Principle** regarding all external and client inputs. The system treats the client application running in the user's browser as completely untrusted.

### Trust Boundaries

1. **Client / Browser (Untrusted)**: The React single-page application, client cookies, local storage, URL parameters, and HTTP headers are vulnerable to inspection and tampering. Client-side checks are UX conveniences only.
2. **Network Perimeter (Untrusted / In-Transit)**: All communication between client and server must use TLS/HTTPS in production.
3. **Application Server (`apps/api`) (Trusted Boundary)**: The authoritative boundary where validation, authentication, authorization, and rate limiting are enforced.
4. **Data Tier (`PostgreSQL`) (Secured Core)**: Accessible exclusively through the application server with parameterized Prisma ORM operations and least-privilege database user credentials.

---

## 2. Threat Considerations & Mitigations (OWASP Top 10)

| Threat Category                        | Potential Risk in Peyroo                                         | Mitigation Standard                                                                                                 | Status                                  |
| :------------------------------------- | :--------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------ | :-------------------------------------- |
| **Injection (SQL, NoSQL, OS)**         | Malicious SQL syntax in search filters or booking inputs.        | Exclusively use Prisma ORM parameterized queries; prohibit raw SQL string concatenation; validate types with Zod.   | Planned                                 |
| **Broken Access Control (IDOR)**       | Mentee accessing or modifying another user's session or booking. | Authoritative server checks verifying `booking.menteeId === req.user.id`; do not rely on client-supplied user IDs.  | Planned                                 |
| **Cryptographic Failures**             | Weak password hashing or plaintext storage.                      | Hash passwords using Argon2id or bcrypt (cost factor >= 12); require HTTPS in production; exclude secrets from Git. | Planned                                 |
| **Security Misconfiguration**          | Leaked stack traces or default server headers.                   | Helmet security headers configured; centralized error handler stripping internal details in production.             | Implemented (Scaffold) / Planned (Full) |
| **Vulnerable Components**              | Outdated or compromised dependencies.                            | Keep dependency count minimal; lock versions via `package-lock.json`; regular audit scans via `npm audit`.          | Planned                                 |
| **Identification & Auth Failures**     | Credential stuffing or brute force attacks.                      | Rate limit `/auth/*` endpoints; enforce strong password policies; safe token or session expiration.                 | Planned                                 |
| **Software & Data Integrity**          | Tampered packages or corrupted migration states.                 | Strictly review npm dependencies; manage schema exclusively via versioned Prisma migrations.                        | Implemented (Scaffold)                  |
| **Security Logging & Monitoring**      | Failing to detect unauthorized access attempts.                  | Structured logging of authentication events; sanitize sensitive fields (passwords, tokens, keys).                   | Planned                                 |
| **Server-Side Request Forgery (SSRF)** | Malicious URLs submitted for meeting links or avatars.           | Whitelist accepted avatar domains; sanitize external meeting URLs before redirecting or rendering.                  | Planned                                 |

---

## 3. Mandatory Security Controls & Implementation Specifications

### 3.1 Input Validation & Sanitization

- All untrusted input must pass through Zod schemas.
- Reject or strip unknown properties (`strip()` / `strict()`).
- Sanitize any user-generated content rendered in HTML to protect against Cross-Site Scripting (XSS).

### 3.2 Authentication & Password Handling

- Passwords must be hashed using an adaptive, memory-hard algorithm (Argon2id or bcrypt with cost factor >= 12).
- Plaintext passwords must never be stored, logged, or serialized into JSON responses.

### 3.3 Authorization & Least-Privilege

- Role-based access control (RBAC) enforced via server-side middleware: `requireAuth`, `requireRole(['MENTOR', 'ADMIN'])`.
- Resource ownership validation (e.g. mentor modifying only their own profile, mentee cancelling only their own booking).

### 3.4 Security Headers & CORS

- **Helmet**: Set secure HTTP response headers (`Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`).
- **CORS**: Explicit origin whitelisting configured via the `CORS_ORIGIN` environment variable. Never use wildcard `*` with credentials enabled.

### 3.5 Rate Limiting

- Enforce IP-based and user-based rate limiting on sensitive routes (authentication, booking creation, contact forms) using `express-rate-limit`.

### 3.6 Centralized Error Handling & Safe Logging

- Centralized Express error-handling middleware catches all errors.
- Internal errors return generic client payloads (e.g. `INTERNAL_SERVER_ERROR`).
- Loggers must redact fields named `password`, `token`, `authorization`, `cookie`, `secret`, `creditCard`.

### 3.7 Secret Management & Environment Security

- Configuration must be driven by environment variables.
- All `.env` and credential files must be listed in `.gitignore`.
- Dummy template `.env.example` provides documentation without secrets.

---

## 4. Security Verification Status

To ensure complete transparency, this matrix distinguishes **implemented and verified** controls from **planned** controls:

| Control                            | Status         | Verification Mechanism                              | Notes                                                            |
| :--------------------------------- | :------------- | :-------------------------------------------------- | :--------------------------------------------------------------- |
| **Git Secret Exclusion**           | **Verified**   | `.gitignore` verified, test `.env` untracked        | `.env*` files are strictly ignored.                              |
| **Security Headers (Helmet)**      | **Scaffolded** | Added to `apps/api` Express middleware              | Configured on minimal Express scaffold.                          |
| **Strict CORS Whitelisting**       | **Scaffolded** | Added to `apps/api` Express middleware              | Controlled via `CORS_ORIGIN` environment variable.               |
| **Safe Error Handling**            | **Scaffolded** | Added to `apps/api`                                 | Centralized middleware prevents unhandled crash.                 |
| **Input Validation (Zod)**         | **Scaffolded** | Config validation implemented via Zod in `apps/api` | Business endpoint schemas will be added when routes are created. |
| **Parameterized Queries (Prisma)** | **Scaffolded** | Minimal `schema.prisma` configured                  | No domain queries implemented in bootstrap.                      |
| **Authentication & RBAC**          | **Planned**    | Pending future implementation                       | Not implemented during bootstrap.                                |
| **Password Hashing**               | **Planned**    | Pending future implementation                       | Not implemented during bootstrap.                                |
| **Rate Limiting Middleware**       | **Planned**    | Pending future implementation                       | To be added with auth endpoints.                                 |
| **Audit Logs & Redaction**         | **Planned**    | Pending future implementation                       | To be added with logging module.                                 |
