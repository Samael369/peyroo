# Project Overview: Peyroo (پیرو)

## 1. Executive Summary

**Peyroo (پیرو)** is an open, community-driven mentorship web platform inspired by ADPList. The name is rooted in Persian (_پیرو_), signifying a seeker of guidance, learner, or follower on the path of professional and personal growth.

The platform is designed to democratize career guidance, knowledge sharing, and portfolio feedback by connecting ambitious learners, students, and early-career professionals (mentees) with experienced industry practitioners (mentors) for focused 1-on-1 mentorship sessions, topic-based discussions, and career coaching.

This project serves as a comprehensive university Software Analysis and Design project, demonstrating rigorous software engineering principles, clear architectural boundaries, robust security engineering, and maintainable full-stack TypeScript implementation.

---

## 2. Target Users and Stakeholders

| User Role                     | Description & Primary Goals                                                                                                                                                                   |
| :---------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mentee (Learner / Seeker)** | Discovers verified industry mentors, views mentor bios and specializations, schedules 1-on-1 sessions matching their career goals, and attends scheduled meetings.                            |
| **Mentor (Industry Guide)**   | Configures their professional profile, expertise areas, custom availability schedules, and session topics (e.g. Resume Review, Career Transition, Mock Interview); manages incoming bookings. |
| **Platform Administrator**    | Oversees platform integrity, validates mentor credentials/badges, manages abuse reports, and monitors system health.                                                                          |
| **Academic Evaluator**        | Reviews system requirements, architectural diagrams, domain models, security models, test coverage, and code quality.                                                                         |

---

## 3. Project Scope

### In-Scope (Planned for Future Phased Implementation)

- **Profile Management**: Structured profiles for mentors (bio, company, role, topics, years of experience, social links) and mentees.
- **Mentor Discovery & Search**: Filterable mentor catalog by domain (Software Engineering, UI/UX Design, Product Management, Data Science), skills, seniority, and languages.
- **Availability & Scheduling**: Mentor availability configuration (time slots, timezone management, buffer times).
- **Session Booking Flow**: Mentee session reservation with pre-session questions and booking confirmation.
- **Authentication & Identity**: Secure, role-based access control (Mentee, Mentor, Admin) with server-side session/token validation.
- **Session Lifecycle**: Booking statuses (pending, confirmed, completed, cancelled, rescheduled).
- **Reviews & Ratings**: Post-session feedback mechanism for mentees to rate sessions.

### Non-Goals (Explicitly Out of Scope for MVP / Initial Phases)

- Monetization, payment processing, or escrow systems (all sessions are community-driven / free in initial scope).
- Custom proprietary WebRTC video engine development (meetings will leverage external room URLs such as Google Meet / Zoom or pre-configured third-party provider links).
- Complex microservice orchestration or multi-region data replication.
- Direct peer-to-peer real-time file sharing within the platform.
- AI-driven automated auto-booking agents.

---

## 4. High-Level System Boundaries

The Peyroo platform operates as a **Decoupled Modular Monolith**:

```text
+-----------------------------------------------------------------+
|                         Client Tier                             |
|               apps/web (React + Vite + Tailwind CSS)            |
|     - Single Page Application (SPA)                             |
|     - Component-Driven UI, Responsive Layouts                   |
|     - Client-side routing and state management                  |
+-----------------------------------------------------------------+
                                |
                                | HTTP/HTTPS (REST JSON API)
                                | Cross-Origin Protected (CORS)
                                v
+-----------------------------------------------------------------+
|                       Application Tier                          |
|                 apps/api (Node.js + Express + Zod)              |
|     - Sole Authority for Business Rules & Authorization         |
|     - Centralized Request Validation (Zod)                      |
|     - Security Middleware (Helmet, Rate Limiting, CORS)         |
|     - Centralized Error Handling & Safe Logging                 |
+-----------------------------------------------------------------+
                                |
                                | Prisma ORM (Parameterized Queries)
                                v
+-----------------------------------------------------------------+
|                          Data Tier                              |
|                    PostgreSQL Relational DB                     |
|     - ACID Transactions, Foreign Keys, Unique Constraints       |
|     - Managed through prisma/schema.prisma & migrations         |
+-----------------------------------------------------------------+
```

---

## 5. Academic & Engineering Objectives

1. **Clean Separation of Concerns**: Enforce strict boundaries between presentation, HTTP dispatching, business domain rules, and persistent storage.
2. **Defensive Security by Design**: Implement zero-trust server validation, parameterized queries, least-privilege role-based access, and strict CORS.
3. **Strict Type Safety**: End-to-end TypeScript coverage across both frontend and backend, with shared types located in `packages/shared/`.
4. **Reproducible Monorepo Tooling**: Seamless local setup via npm workspaces, automated formatting (Prettier), linting (ESLint), and testing (Vitest).
