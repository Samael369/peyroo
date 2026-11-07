# Activity Diagrams: Peyroo Mentorship Platform

**Project Working Title:** Peyroo (پیرو)  
**Academic Course:** Software Analysis and Design (SSAD) | Fall 1405  
**Document Identifier:** `docs/analysis/uml/ACTIVITY_DIAGRAMS.md`  
**Status:** `[BASELINE - STAGE 05]`  
**Date:** Aban 1405 / November 2026  
**Document Version:** 1.0  

---

## 1. Overview & Diagram Index

This document models the procedural control flow, decision branching, and concurrency synchronization for 7 critical business processes in the **Peyroo Mentorship Platform**:

1. [Workflow 1: Mentor Onboarding & Profile Setup](#workflow-1-mentor-onboarding--profile-setup)
2. [Workflow 2: Availability Slot Management](#workflow-2-availability-slot-management)
3. [Workflow 3: End-to-End Booking & Payment Flow](#workflow-3-end-to-end-booking--payment-flow)
4. [Workflow 4: Session Cancellation & Refund Processing](#workflow-4-session-cancellation--refund-processing)
5. [Workflow 5: Automated Session Completion](#workflow-5-automated-session-completion)
6. [Workflow 6: Verified Post-Session Review Submission](#workflow-6-verified-post-session-review-submission)
7. [Workflow 7: Administrator Moderation & Financial Audit](#workflow-7-administrator-moderation--financial-audit)

---

## Workflow 1: Mentor Onboarding & Profile Setup

```mermaid
flowchart TD
    Start([User Initiates Mentor Onboarding]) --> InputForm[Input Headline, Bio, Tags, Base Rate, Default Meeting URL]
    InputForm --> ValidateFields{Are All Mandatory<br/>Fields Provided?}
    
    ValidateFields -- No --> ShowValidationErrors[Display Field Validation Errors]
    ShowValidationErrors --> InputForm
    
    ValidateFields -- Yes --> ValidateLength{Bio >= 20 Chars<br/>and Rate >= 0?}
    ValidateLength -- No --> ShowLengthError[Display Constraint Error]
    ShowLengthError --> InputForm

    ValidateLength -- Yes --> ValidateUrl{Is Default Meeting URL<br/>a Valid HTTPS Link?}
    ValidateUrl -- No --> ShowUrlError[Display Invalid URL Error]
    ShowUrlError --> InputForm

    ValidateUrl -- Yes --> PersistProfile[Instantiate MentorProfile Entity]
    PersistProfile --> EnableCapability[Set user.isMentorEnabled = true]
    EnableCapability --> GrantDashboardAccess[Grant Access to Mentor Dashboard]
    GrantDashboardAccess --> End([Mentor Capability Active])
```

---

## Workflow 2: Availability Slot Management

```mermaid
flowchart TD
    Start([Mentor Opens Slot Management]) --> SelectAction{Select Action}
    
    SelectAction -- Create New Slot --> PickTime[Select Date, Start Time & Duration]
    PickTime --> CheckDuration{Duration strictly<br/>30, 45, or 60 min?}
    CheckDuration -- No --> RejectDuration[Display Duration Error: Must be 30, 45, or 60 min]
    RejectDuration --> PickTime

    CheckDuration -- Yes --> CheckFuture{Is Start Time in Future?}
    CheckFuture -- No --> RejectPast[Display Error: Must be scheduled in future]
    RejectPast --> PickTime

    CheckFuture -- Yes --> CheckCollision{Does Slot Collide with<br/>Existing Mentor Slot?}
    CheckCollision -- Yes --> RejectCollision[Display HTTP 409: Collision Detected]
    RejectCollision --> PickTime

    CheckCollision -- No --> PopulateDefaults[Inherit Base Rate & Meeting URL or Custom Override]
    PopulateDefaults --> PersistSlot[Create Slot with status = OPEN]
    PersistSlot --> RenderCalendar[Render Slot on Availability Calendar]
    RenderCalendar --> EndSuccess([Slot Available in Catalog])

    SelectAction -- Delete Open Slot --> SelectSlot[Select Target Slot]
    SelectSlot --> CheckSlotState{Is Slot Status OPEN?}
    CheckSlotState -- No (HELD or BOOKED) --> RejectDelete[Reject Deletion: Redirect to Cancellation Flow]
    RejectDelete --> EndFail([Operation Terminated])
    CheckSlotState -- Yes --> SoftDelete[Soft-Delete Slot: Remove from Catalog]
    SoftDelete --> EndDelete([Slot Removed])
```

---

## Workflow 3: End-to-End Booking & Payment Flow

```mermaid
flowchart TD
    Start([Mentee Explores Mentors]) --> FilterCatalog[Filter Catalog by Technical Tags]
    FilterCatalog --> SelectSlot[Select Mentor & Open Slot]
    SelectSlot --> InputAgenda[Input Discussion Topic, Questions & Repo URL]
    InputAgenda --> SubmitBooking[Click Proceed to Payment]
    
    SubmitBooking --> CheckSelfBooking{Is Mentee the<br/>Owner of the Slot?}
    CheckSelfBooking -- Yes --> RejectSelf[HTTP 403 Forbidden: Cannot Book Own Slot]
    RejectSelf --> EndFail([Booking Aborted])

    CheckSelfBooking -- No --> CheckLeadTime{Slot Start - Now<br/>>= 2 Hours?}
    CheckLeadTime -- No --> RejectNotice[HTTP 422: Must Book >= 2 Hours in Advance]
    RejectNotice --> EndFail

    CheckLeadTime -- Yes --> AcquireLock{Acquire Concurrency Lock<br/>Is Slot Still OPEN?}
    AcquireLock -- No (Already Held/Booked) --> RejectCollision[HTTP 409 Conflict: Slot Reserved by Another]
    RejectCollision --> SelectSlot

    AcquireLock -- Yes --> HoldSlot[Set Slot Status = HELD]
    HoldSlot --> CreateBooking[Create Booking with status = PENDING_PAYMENT<br/>Set expiresAt = now + 15 min]
    CreateBooking --> CalcCommission[Calculate Financials:<br/>Fee + 10% Peyroo Commission = Total]
    CalcCommission --> RedirectGateway[Redirect to Mock Payment Gateway Simulator]
    
    RedirectGateway --> UserPaymentAction{User Gateway Action}
    
    UserPaymentAction -- Clicks Simulate Success --> ProcessSuccessCallback[Send Success Webhook to Backend]
    ProcessSuccessCallback --> CheckTimeout{Is Callback Received<br/>within 15 Min Window?}
    
    CheckTimeout -- Yes --> RecordLedger[Record COMPLETED Transaction in Ledger]
    RecordLedger --> TransitionConfirmed[Set Booking Status = CONFIRMED<br/>Set Slot Status = BOOKED]
    TransitionConfirmed --> RevealMeetingUrl[Expose External Meeting URL to Mentee & Mentor]
    RevealMeetingUrl --> EndSuccess([Session Confirmed & Active])

    CheckTimeout -- No (Past 15m) --> MarkExpiredPast[Mark Transaction FAILED<br/>Issue Simulated Refund]
    MarkExpiredPast --> EndFail

    UserPaymentAction -- Clicks Simulate Failure --> ProcessFailCallback[Send Failure Webhook to Backend]
    ProcessFailCallback --> RecordFailLedger[Record FAILED Transaction in Ledger]
    RecordFailLedger --> ReleaseSlotFail[Revert Slot to OPEN<br/>Set Booking = PAYMENT_FAILED]
    ReleaseSlotFail --> ShowRetry[Display Failure Alert with Retry Option]
    ShowRetry --> EndFail

    UserPaymentAction -- Abandons Page (> 15m) --> ExpirationWorker[Expiration Evaluator Runs]
    ExpirationWorker --> ReleaseSlotTimeout[Set Booking = EXPIRED<br/>Revert Slot to OPEN]
    ReleaseSlotTimeout --> EndFail
```

---

## Workflow 4: Session Cancellation & Refund Processing

```mermaid
flowchart TD
    Start([User Initiates Session Cancellation]) --> IdentifyRole{Who is Cancelling?}
    
    IdentifyRole -- Mentor Cancelling --> ConfirmMentorCancel[Mentor Confirms Cancellation]
    ConfirmMentorCancel --> MentorRefund[Set Booking = CANCELLED_BY_MENTOR<br/>Record 100% REFUNDED Transaction in Ledger]
    MentorRefund --> CloseSlot[Mark Slot Status = CANCELLED]
    CloseSlot --> NotifyMentee[Notify Mentee & Issue Full Refund]
    NotifyMentee --> EndMentor([Session Cancelled & Fully Refunded])

    IdentifyRole -- Mentee Cancelling --> CheckMenteeWindow{Slot Start - Now<br/>>= 24 Hours?}
    
    CheckMenteeWindow -- Yes (>= 24h Early Cancellation) --> ConfirmFullRefund[Mentee Confirms Cancellation]
    ConfirmFullRefund --> ProcessMenteeRefund[Set Booking = CANCELLED_REFUNDED<br/>Record 100% REFUNDED Transaction in Ledger]
    ProcessMenteeRefund --> CheckSlotFuture{Slot Start - Now<br/>>= 2 Hours?}
    CheckSlotFuture -- Yes --> ReopenSlot[Revert Slot Status to OPEN]
    CheckSlotFuture -- No --> ArchiveSlot[Mark Slot CANCELLED]
    ReopenSlot --> EndMenteeRefund([Booking Cancelled & 100% Refunded])
    ArchiveSlot --> EndMenteeRefund

    CheckMenteeWindow -- No (< 24h Late Cancellation) --> ShowNoRefundWarning[Display Warning: Cancellation is Non-Refundable]
    ShowNoRefundWarning --> MenteeAccepts{Mentee Accepts?}
    MenteeAccepts -- No --> CancelAborted([Cancellation Aborted; Booking Stays CONFIRMED])
    MenteeAccepts -- Yes --> ProcessLateCancel[Set Booking = CANCELLED_NO_REFUND<br/>Slot Status = CANCELLED]
    ProcessLateCancel --> PreserveMentorCredit[No Refund Issued; Mentor Payout Maintained]
    PreserveMentorCredit --> EndLateCancel([Booking Cancelled without Refund])
```

---

## Workflow 5: Automated Session Completion

```mermaid
flowchart TD
    Start([Background Scheduler / State Evaluator]) --> QueryBookings[Query all Bookings with status == CONFIRMED]
    QueryBookings --> CheckEmpty{Any Active Bookings?}
    CheckEmpty -- No --> Sleep([Wait for Next Evaluation Interval])
    
    CheckEmpty -- Yes --> LoopBookings[Evaluate Each Booking]
    LoopBookings --> CheckElapsed{Current Timestamp >=<br/>Slot Scheduled End Time?}
    
    CheckElapsed -- No --> KeepActive[Maintain Booking Status = CONFIRMED]
    KeepActive --> NextBooking{More Bookings?}
    
    CheckElapsed -- Yes --> TransitionCompleted[Set Booking Status = COMPLETED<br/>Set completedAt = Current Timestamp]
    TransitionCompleted --> UnlockReview[Unlock Review Eligibility for Mentee]
    UnlockReview --> NextBooking
    
    NextBooking -- Yes --> LoopBookings
    NextBooking -- No --> Sleep
```

---

## Workflow 6: Verified Post-Session Review Submission

```mermaid
flowchart TD
    Start([Mentee Clicks Leave Review]) --> CheckStatus{Is Booking Status<br/>== COMPLETED?}
    CheckStatus -- No --> DenyReview[HTTP 403 Forbidden: Only Completed Sessions Can Be Reviewed]
    DenyReview --> EndFail([Review Aborted])

    CheckStatus -- Yes --> CheckOwnership{Is Current User<br/>the Booked Mentee?}
    CheckOwnership -- No --> DenyOwnership[HTTP 403 Forbidden: Only Booked Mentee Can Review]
    DenyOwnership --> EndFail

    CheckOwnership -- Yes --> CheckDuplicate{Has a Review Already<br/>Been Submitted?}
    CheckDuplicate -- Yes --> DenyDuplicate[HTTP 409 Conflict: One Review Permitted per Booking]
    DenyDuplicate --> EndFail

    CheckDuplicate -- No --> OpenForm[Render Review Form]
    OpenForm --> InputReview[Select Star Rating: 1 to 5 Stars<br/>Input Optional Comment <= 1000 Chars]
    InputReview --> SubmitReview[Click Submit Review]
    
    SubmitReview --> ValidateScore{Is Rating Integer<br/>Between 1 and 5?}
    ValidateScore -- No --> ShowScoreError[Display Error: Rating must be 1 to 5]
    ShowScoreError --> OpenForm

    ValidateScore -- Yes --> PersistReview[Instantiate Review Entity Linked to Booking]
    PersistReview --> RecalculateAverage[Recalculate Mentor Average Rating & Total Reviews Count]
    RecalculateAverage --> DisableButton[Permanently Disable Review Button for Booking]
    DisableButton --> EndSuccess([Review Published])
```

---

## Workflow 7: Administrator Moderation & Financial Audit

```mermaid
flowchart TD
    Start([Administrator Accesses Admin Panel]) --> VerifyAdmin{Is auth.user.isAdmin<br/>== true?}
    VerifyAdmin -- No --> DenyAdmin[HTTP 403 Forbidden]
    DenyAdmin --> EndFail([Access Denied])

    VerifyAdmin -- Yes --> SelectAdminTask{Select Admin View}
    
    SelectAdminTask -- Financial Audit --> FetchLedger[Aggregate Transaction Ledger]
    FetchLedger --> DisplayMetrics[Display Gross Transaction Volume<br/>Display 10% Platform Commission Collected<br/>Display Total Refund Records]
    DisplayMetrics --> EndAdmin([Audit Complete])

    SelectAdminTask -- User Management --> SearchUser[Search User by Email/Name]
    SearchUser --> SelectUser[Select Target User]
    SelectUser --> ToggleStatus{Toggle Account Status}
    ToggleStatus -- Suspend --> SetSuspended[Set status = SUSPENDED<br/>Invalidate Active Session Tokens]
    SetSuspended --> EndAdmin
    ToggleStatus -- Activate --> SetActive[Set status = ACTIVE]
    SetActive --> EndAdmin

    SelectAdminTask -- Global Bookings --> FetchGlobalBookings[Query All Bookings in Read-Only Mode]
    FetchGlobalBookings --> RenderReadOnlyGrid[Display Global Historical State Changes<br/>Admin CANNOT Edit Slots, Bookings, or Prices]
    RenderReadOnlyGrid --> EndAdmin
```
