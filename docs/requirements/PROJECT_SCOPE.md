# Project Scope Specification: Peyroo Mentorship Platform

**Project Working Title:** Peyroo (پیرو)  
**Academic Course:** Software Analysis and Design (SSAD) | Fall 1405  
**Document Identifier:** `docs/requirements/PROJECT_SCOPE.md`  
**Status:** `[BASELINE - STAGE 04]`  
**Date:** Aban 1405 / November 2026  
**Document Version:** 1.0  

---

## 1. Executive Overview & Purpose

The **Peyroo Mentorship Platform** is an academic software engineering project designed to connect tech-industry mentors (software engineers, technical leaders, and alumni) with mentees (computer science students, junior developers, and career switchers) for structured, 1-on-1 guidance sessions.

The primary objective is to eliminate cold-outreach friction, response anxiety, and calendar coordination chaos through:
1. Searchable mentor discovery filtered by technical domains.
2. Independent capability management (Mentee and Mentor modes within a single account).
3. Explicit availability slot publishing with standard durations.
4. Mandatory structured session agendas submitted prior to booking.
5. An integrated mock banking payment flow that proves business viability and ledger tracking with a 10% platform commission fee.
6. Rigorous backend-enforced data ownership and access control.

---

## 2. System Boundaries & Interfaces

```mermaid
flowchart TB
    subgraph Peyroo Platform Boundary
        Auth[Authentication & Capability Engine]
        SlotMgr[Slot Management Service]
        Catalog[Mentor Catalog & Discovery]
        BookingMgr[Booking Lifecycle & Concurrency Engine]
        Ledger[Financial Ledger & Commission Service]
        Dashboard[User & Admin Dashboards]
    end

    subgraph External System Boundaries
        MockBank[Mock Payment Gateway Simulator]
        ExtMeeting[External Video Providers: Google Meet / Zoom]
        BrowserClient[Web Browser Client: Desktop & Mobile Web]
    end

    BrowserClient <-->|HTTPS / REST| Peyroo Platform Boundary
    BookingMgr <-->|Redirect & Webhook Callback| MockBank
    Dashboard -.->|Displays URL Only| ExtMeeting
```

### 2.1 In-Boundary Components
- **Identity & Capability Management:** User authentication, capability toggling (Mentor / Mentee), and profile management.
- **Availability Engine:** Creation, validation, slot status updates, and collision detection.
- **Discovery Service:** Keyword and tag-based mentor search, pricing transparency, and slot inspection.
- **Booking Engine:** Concurrency-locked reservations, 15-minute payment holds, agenda persistence, and automated completion.
- **Ledger & Audit Engine:** Double-entry financial tracking of session fees, 10% platform commission, and refund records.
- **Governance Panel:** Administrator user status moderation (`ACTIVE` / `SUSPENDED`) and global read-only audit logs.

### 2.2 External Interfaces (Out-of-Boundary)
- **External Video Providers:** Peyroo does **not** stream video. Mentors store static meeting URLs (e.g., Google Meet, Zoom), which the system reveals to authorized participants upon booking confirmation.
- **Mock Payment Gateway:** A dedicated simulator interface that models real-world payment redirection, credit card inputs, transaction callbacks, and explicit success/failure testing triggers without real banking liability.

---

## 3. MoSCoW Scope Prioritization

The platform scope strictly preserves the boundaries approved during Product Discovery and Requirements Elicitation:

| Category | Module / Feature Description | Priority |
|---|---|---|
| **Must Have** | User Registration, Login, and Persistent Session Management | Must Have (MVP) |
| **Must Have** | Unified Account with Independent Mentor/Mentee Capability Toggling | Must Have (MVP) |
| **Must Have** | Mentor Profile Setup (Bio, Expertise Tags, Base Rate, Default Meeting Link) | Must Have (MVP) |
| **Must Have** | Mentor Availability Slot Management (30, 45, 60 min durations; no collisions) | Must Have (MVP) |
| **Must Have** | Mentor Catalog & Search (Filter by Technical Expertise Tags) | Must Have (MVP) |
| **Must Have** | Session Booking with Mandatory Agenda & 2-Hour Advance Notice Enforced | Must Have (MVP) |
| **Must Have** | Concurrency Protection & 15-Minute Payment Holding Window | Must Have (MVP) |
| **Must Have** | Mock Banking Gateway Simulation with 10% Platform Commission Calculation | Must Have (MVP) |
| **Must Have** | Immutable Transaction Ledger (`PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`) | Must Have (MVP) |
| **Must Have** | Dual Dashboards (Upcoming, Past, Cancelled Sessions) with Meeting URL Access | Must Have (MVP) |
| **Must Have** | Cancellation Workflows (Mentee $\ge 24$h full refund; $< 24$h no refund; Mentor anytime full refund) | Must Have (MVP) |
| **Must Have** | Automated Time-Based Session Completion Trigger | Must Have (MVP) |
| **Must Have** | Platform Administrator Governance (User suspend/activate, financial audit, read-only bookings) | Must Have (MVP) |
| **Should Have**| Verified Mentee Post-Session Review System (1–5 stars + optional comment on `COMPLETED` sessions) | Should Have |
| **Should Have**| Mock/Logged Email Notification Dispatcher (Booking confirmation, cancellation, refund alerts) | Should Have |
| **Could Have** | Export Session Schedule to `.ics` Calendar Format | Could Have |
| **Could Have** | Mentee Mentor Bookmarking / Saved Favorites | Could Have |
| **Won't Have**  | Native WebRTC In-App Video and Audio Streaming | Won't Have (Out of Scope) |
| **Won't Have**  | Real-Money Live Payment Gateways & Banking Escrow | Won't Have (Out of Scope) |
| **Won't Have**  | Two-Way Google Calendar / Microsoft Outlook Synchronization APIs | Won't Have (Out of Scope) |
| **Won't Have**  | Real-Time WebSockets In-App Chat | Won't Have (Out of Scope) |
| **Won't Have**  | Native Mobile Operating System Applications (iOS / Android) | Won't Have (Out of Scope) |

---

## 4. Assumptions & Constraints

### 4.1 Academic & Technical Constraints
- **Course Deadlines:** Must align with SSAD Fall 1405 milestones (P1 Presentation in Aban, P2 Progress in Azar, P3 Final Defense in Bahman).
- **Core Journey Mandate:** Delivery of one complete, functional, backend-enforced business journey from frontend UI to database storage.
- **Backend-Enforced Authorization:** Frontend UI button-hiding is insufficient. Every API endpoint must independently enforce role authorization and entity ownership.
- **Platform Architecture Independence:** No specific tech stack is prescribed at this stage; requirements must remain implementation-neutral.

### 4.2 Operational Assumptions
- All monetary values are recorded in standard non-fractional units (e.g., Tomans or USD integer cents) to prevent floating-point rounding errors.
- Session time-to-live and scheduled timestamps are stored and validated in UTC, with client-side localization for presentation.
- Meeting links provided by mentors are valid, accessible HTTPS URLs.
