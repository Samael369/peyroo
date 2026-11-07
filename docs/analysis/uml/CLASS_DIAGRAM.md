# Conceptual Class Diagram: Peyroo Mentorship Platform

**Project Working Title:** Peyroo (پیرو)  
**Academic Course:** Software Analysis and Design (SSAD) | Fall 1405  
**Document Identifier:** `docs/analysis/uml/CLASS_DIAGRAM.md`  
**Status:** `[BASELINE - STAGE 05]`  
**Date:** Aban 1405 / November 2026  
**Document Version:** 1.0  

---

## 1. Conceptual Class Diagram Overview

This conceptual UML Class Diagram models the essential domain concepts, structural relationships, attributes, operations, and enumerations of the **Peyroo Mentorship Platform**. 

In strict adherence to system analysis principles:
- It excludes physical database constructs (primary keys, foreign keys, table indexes) and framework-specific middleware.
- It models **Mentee** and **Mentor** as active role capabilities anchored to a single `UserAccount`.
- It captures the 10% platform commission logic, 15-minute concurrency holding reservation, and the financial ledger double-entry structure.

---

## 2. Conceptual Class Diagram

```mermaid
classDiagram
    %% Enumerations
    class AccountStatus {
        <<enumeration>>
        ACTIVE
        SUSPENDED
    }

    class SlotDuration {
        <<enumeration>>
        MINUTES_30
        MINUTES_45
        MINUTES_60
    }

    class SlotStatus {
        <<enumeration>>
        OPEN
        HELD
        BOOKED
        CANCELLED
    }

    class BookingStatus {
        <<enumeration>>
        INITIATED
        PENDING_PAYMENT
        CONFIRMED
        PAYMENT_FAILED
        EXPIRED
        CANCELLED_REFUNDED
        CANCELLED_NO_REFUND
        CANCELLED_BY_MENTOR
        COMPLETED
    }

    class TransactionType {
        <<enumeration>>
        SESSION_PAYMENT
        CANCELLATION_REFUND
    }

    class TransactionStatus {
        <<enumeration>>
        PENDING
        COMPLETED
        FAILED
        REFUNDED
    }

    %% Value Objects
    class Money {
        <<value object>>
        +Decimal amount
        +String currency
        +add(Money other) Money
        +multiply(Decimal factor) Money
    }

    class MeetingUrl {
        <<value object>>
        +String rawUrl
        +isValidHttps() Boolean
    }

    class SessionAgenda {
        <<value object>>
        +String topicObjective
        +String specificQuestions
        +String portfolioRepoUrl
    }

    %% Domain Classes
    class UserAccount {
        +UUID accountId
        +String email
        +String fullName
        +AccountStatus status
        +Boolean isMenteeEnabled
        +Boolean isMentorEnabled
        +Boolean isAdmin
        +DateTime registeredAt
        +suspend() Void
        +activate() Void
        +enableMentorCapability(MentorProfile profile) Void
    }

    class MentorProfile {
        +String headline
        +String biography
        +List~String~ expertiseTags
        +Money baseSessionRate
        +MeetingUrl defaultMeetingUrl
        +Decimal averageRating
        +Integer totalReviewsCount
        +updateProfile(headline, bio, tags, rate, url) Void
        +recalculateRating(Integer newScore) Void
    }

    class AvailabilitySlot {
        +UUID slotId
        +DateTime startTime
        +DateTime endTime
        +SlotDuration duration
        +SlotStatus status
        +Money sessionRate
        +MeetingUrl meetingUrl
        +holdForBooking() Void
        +confirmBooking() Void
        +releaseToOpen() Void
        +cancelSlot() Void
        +collidesWith(AvailabilitySlot other) Boolean
    }

    class Booking {
        +UUID bookingId
        +BookingStatus status
        +DateTime createdAt
        +DateTime expiresAt
        +DateTime confirmedAt
        +DateTime completedAt
        +initiatePayment(expiresAt) Void
        +confirmPayment() Void
        +expire() Void
        +markPaymentFailed() Void
        +cancelWithRefund() Void
        +cancelWithoutRefund() Void
        +cancelByMentor() Void
        +markCompleted() Void
        +canBeCancelledWithRefund() Boolean
    }

    class PaymentTransaction {
        +UUID transactionId
        +String externalTransactionRef
        +TransactionType type
        +TransactionStatus status
        +Money mentorFee
        +Money platformCommission
        +Money totalAmount
        +DateTime timestamp
        +markCompleted(refId) Void
        +markFailed() Void
        +markRefunded() Void
    }

    class Review {
        +UUID reviewId
        +Integer starRating
        +String commentText
        +DateTime submittedAt
        +isValid() Boolean
    }

    class PlatformCommissionPolicy {
        <<policy service>>
        +Decimal commissionRate = 0.10
        +calculateCommission(Money mentorFee) Money
        +calculateTotal(Money mentorFee) Money
    }

    %% Relationships and Multiplicities
    UserAccount "1" *-- "0..1" MentorProfile : "has profile (if Mentor)"
    MentorProfile "1" *-- "0..*" AvailabilitySlot : "publishes"
    
    UserAccount "1" -- "0..*" Booking : "books as Mentee"
    AvailabilitySlot "1" -- "0..1" Booking : "allocated to"
    
    Booking "1" *-- "1" SessionAgenda : "specifies"
    Booking "1" -- "1..*" PaymentTransaction : "financial records"
    Booking "1" -- "0..1" Review : "reviewed by"
    MentorProfile "1" -- "0..*" Review : "accumulates"
    
    UserAccount ..> AccountStatus : "has"
    AvailabilitySlot ..> SlotDuration : "constrained by"
    AvailabilitySlot ..> SlotStatus : "tracks"
    Booking ..> BookingStatus : "transitions across"
    PaymentTransaction ..> TransactionType : "classifies"
    PaymentTransaction ..> TransactionStatus : "tracks"
    
    AvailabilitySlot ..> Money : "defines rate"
    AvailabilitySlot ..> MeetingUrl : "contains"
    PaymentTransaction ..> Money : "denominates"
    PaymentTransaction ..> PlatformCommissionPolicy : "calculates via"
```

---

## 3. Structural Semantics & Multiplicity Explanations

### 3.1 `UserAccount` $\longleftrightarrow$ `MentorProfile` (1 to 0..1 Composition)
- **Multiplicity:** A `UserAccount` can exist purely in Mentee capability (0 profiles). When a user activates Mentor capability, exactly 1 `MentorProfile` is instantiated.
- **Composition Semantics:** The `MentorProfile` cannot exist independently of its parent `UserAccount`. If the account is deactivated or suspended, the mentor capability is suspended simultaneously.

### 3.2 `MentorProfile` $\longleftrightarrow$ `AvailabilitySlot` (1 to 0..\* Composition)
- **Multiplicity:** A mentor may create zero or multiple availability slots.
- **Domain Constraints:** A mentor cannot publish two slots that temporally overlap (`slot.collidesWith(other) == true`). All slots must adhere to `SlotDuration` (30, 45, or 60 minutes).

### 3.3 `AvailabilitySlot` $\longleftrightarrow$ `Booking` (1 to 0..1 Association)
- **Multiplicity:** An `AvailabilitySlot` is initially unbooked (0 bookings). When reserved, exactly 1 `Booking` is associated with it. A slot cannot be shared across multiple simultaneous bookings.

### 3.4 `UserAccount` (as Mentee) $\longleftrightarrow$ `Booking` (1 to 0..\* Association)
- **Multiplicity:** A user acting as a mentee may create multiple bookings over time.
- **Self-Booking Invariant:** The system strictly enforces that `booking.menteeId != booking.slot.mentorId`.

### 3.5 `Booking` $\longleftrightarrow$ `PaymentTransaction` (1 to 1..\* Association)
- **Multiplicity:** Every booking initiates with at least 1 `PaymentTransaction` representing the session payment attempt. If the booking is subsequently cancelled with a refund, a second transaction of type `CANCELLATION_REFUND` is recorded.
- **Audit Preservation:** Financial records are immutable double-entry ledger items and are never overwritten.

### 3.6 `Booking` $\longleftrightarrow$ `Review` (1 to 0..1 Association)
- **Multiplicity:** A booking has zero reviews while in progress. Once `status == COMPLETED`, the mentee may submit at most 1 `Review`.
