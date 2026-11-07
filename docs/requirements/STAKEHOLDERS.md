# Stakeholder & Role Analysis: Peyroo Mentorship Platform

**Project Working Title:** Peyroo (پیرو)  
**Academic Course:** Software Analysis and Design (SSAD) | Fall 1405  
**Document Identifier:** `docs/requirements/STAKEHOLDERS.md`  
**Status:** `[BASELINE - STAGE 04]`  
**Date:** Aban 1405 / November 2026  
**Document Version:** 1.0  

---

## 1. Stakeholder Classification Matrix

The system identifies four primary stakeholder groups comprising end-users, platform operators, and academic evaluators:

| Stakeholder Group | Stakeholder Type | Primary Interest & Objectives | Impact on System Requirements |
|---|---|---|---|
| **Mentees** | Direct End-User | Discover specialized mentors, book verified time slots with clear agendas, receive guidance, and manage session bookings. | Requires search/filter by tech tags, frictionless booking, 15-min payment reservation, dashboard access, and 24h refund guarantee. |
| **Mentors** | Direct End-User | Monetize or share spare time, maintain complete schedule autonomy, enforce topic boundaries, and avoid coordination chaos. | Requires slot publication with duration controls, custom pricing, default meeting link configuration, and agenda previews. |
| **Platform Administrator** | Internal Governance | Maintain platform integrity, enforce community standards, audit financial volume, and inspect system health. | Requires role-based administration dashboard, user suspension/reactivation toggles, and read-only global booking/financial ledgers. |
| **Academic Course Staff (Instructors/TAs)** | Academic Evaluator | Evaluate system design, UML traceability, automated test verification, backend authorization rigor, and live deployment. | Requires clean API contracts, backend-enforced ownership checks, reproducible local setup, and observable test suites. |

---

## 2. User Roles & Capability Architecture

Rather than treating Mentee and Mentor as mutually exclusive account types requiring separate registrations, Peyroo implements a **Unified Account Model** with **Independent Capabilities**:

```mermaid
classDiagram
    class UserAccount {
        +UUID id
        +String email
        +String passwordHash
        +String fullName
        +AccountStatus status [ACTIVE, SUSPENDED]
        +Boolean isMenteeEnabled
        +Boolean isMentorEnabled
        +Boolean isAdmin
        +DateTime createdAt
    }

    class MenteeCapability {
        +browseMentors()
        +bookSlot()
        +submitAgenda()
        +cancelBooking()
        +submitReview()
    }

    class MentorCapability {
        +String headline
        +String bio
        +List~String~ expertiseTags
        +Decimal baseSessionRate
        +String defaultMeetingUrl
        +createSlot()
        +cancelSlot()
        +viewMenteesAgendas()
    }

    class AdministratorRole {
        +toggleUserStatus()
        +viewFinancialLedger()
        +auditAllBookings()
    }

    UserAccount --> MenteeCapability : "enables (Default: true)"
    UserAccount --> MentorCapability : "enables (Optional)"
    UserAccount --> AdministratorRole : "grants (Staff only)"
```

### 2.1 Role & Capability Definitions

1. **Guest (Unauthenticated Visitor):**
   - *Description:* Any internet visitor accessing the public web application.
   - *Permissions:* Can view the landing page, browse the public mentor catalog, view mentor public profiles, and view available open slots (without meeting links or booking actions).
   - *Restrictions:* Cannot initiate bookings, cannot publish slots, cannot view private meeting URLs.

2. **Registered User (Base Account):**
   - *Description:* An authenticated user with verified credentials and `ACTIVE` account status.
   - *Permissions:* Possesses account profile management, session logout, and can activate Mentee and/or Mentor capabilities.

3. **Mentee Capability (Active):**
   - *Description:* Enabled by default for all registered users.
   - *Permissions:* Can initiate bookings for open slots (provided `slot.mentor_id != user.id`), submit agendas, process payments via the Mock Banking Gateway, view confirmed meeting URLs, cancel bookings according to policy, and submit post-session reviews for completed sessions.

4. **Mentor Capability (Active):**
   - *Description:* Enabled when a user completes their mandatory Mentor Profile (bio, expertise tags, rate, default meeting URL).
   - *Permissions:* Can create, view, and delete unbooked availability slots (durations of 30, 45, or 60 minutes), view incoming booking agendas, view confirmed meeting links, and cancel confirmed sessions with full automatic mentee refund.
   - *Restrictions:* Cannot book their own availability slots.

5. **Platform Administrator:**
   - *Description:* Elevated operational role designated for governance and academic defense.
   - *Permissions:* Can search/list all user accounts, toggle user status between `ACTIVE` and `SUSPENDED`, inspect aggregate and itemized financial ledger records (platform commission, payouts, refunds), and inspect global booking records in read-only mode.
   - *Restrictions:* Cannot create slots, cannot book sessions on behalf of users, and cannot modify mentor pricing.

---

## 3. Role-Based Access Control (RBAC) & Ownership Matrix

The following table defines the backend authorization rules governing system operations. Every check is strictly enforced at the API layer:

| Resource / Action | Guest | Mentee Mode | Mentor Mode | Administrator | Ownership Rule Enforced |
|---|:---:|:---:|:---:|:---:|---|
| **View Mentor Catalog** | Read | Read | Read | Read | Public |
| **View Mentor Public Profile** | Read | Read | Read | Read | Public (excludes meeting URL) |
| **Edit Profile / Capability** | Denied | Own | Own | Denied | `auth.user_id == target_user_id` |
| **Create Availability Slot** | Denied | Denied | Create | Denied | Requires active Mentor Capability |
| **Delete / Archive Open Slot**| Denied | Denied | Own | Denied | `auth.user_id == slot.mentor_id` |
| **Initiate Session Booking** | Denied | Execute | Denied | Denied | `auth.user_id != slot.mentor_id` |
| **Submit Agenda & Pay** | Denied | Own | Denied | Denied | `auth.user_id == booking.mentee_id` |
| **View Meeting URL** | Denied | Own (if `CONFIRMED`) | Own (if `CONFIRMED`) | Denied | `auth.user_id in (mentee_id, mentor_id)` |
| **Cancel Booking ($\ge 24$h)** | Denied | Own | Own | Denied | `auth.user_id in (mentee_id, mentor_id)` |
| **Cancel Booking ($< 24$h)** | Denied | Own (No refund) | Own (Full refund) | Denied | `auth.user_id in (mentee_id, mentor_id)` |
| **Submit Review** | Denied | Own | Denied | Denied | `auth.user_id == mentee_id AND status == COMPLETED` |
| **Toggle User Status** | Denied | Denied | Denied | Execute | `auth.user.isAdmin == true` |
| **View Financial Ledger** | Denied | Denied | Denied | Read | `auth.user.isAdmin == true` |
| **View Global Bookings** | Denied | Denied | Denied | Read | `auth.user.isAdmin == true` |
