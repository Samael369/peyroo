# Architectural Design: Peyroo Mentorship Platform

**Project Working Title:** Peyroo (پیرو)  
**Academic Course:** Software Analysis and Design (SSAD) | Fall 1405  
**Document Identifier:** `docs/design/ARCHITECTURE_DESIGN.md`  
**Status:** `[BASELINE - STAGE 06]`  
**Date:** Aban 1405 / November 2026  
**Document Version:** 1.0  

---

## 1. Architectural Style Evaluation & Selection

To select the most appropriate architecture for Peyroo, three candidate architectural styles were evaluated against the project requirements, academic delivery timeline, and operational constraints:

| Architectural Candidate | Strengths | Weaknesses & Risks | Suitability for Peyroo |
|---|---|---|---|
| **Microservices Architecture** | Independent deployment, separate database per service, technology heterogeneity. | High operational complexity, distributed transactions (two-phase commit/sagas), network latency, difficult local automated testing, excessive overhead for a student project. | **REJECTED:** Violates KISS principle; severe risk of incomplete delivery for SSAD milestones. |
| **Serverless / FaaS** | Zero server management, auto-scaling, low idle cost. | Cold-start latency (violates $\le 500$ ms read target under free-tier), vendor lock-in, fragmented local testing, complex background task management for 15-min timers. | **REJECTED:** Unpredictable cold-start latency during live academic defense. |
| **Modular Monolith (Layered Clean Architecture)** | Clear domain boundaries, simple local testing, strong compile-time type safety, local ACID transactions (no distributed locks), single deployment container, trivial CI/CD. | Requires developer discipline to avoid circular dependencies between modules; scales as a single unit. | **SELECTED:** Perfectly matches academic evaluation rubric, guarantees complete end-to-end journey, ensures deterministic automated tests. |

### 1.1 Architectural Style Selection: Modular Monolith with Layered Clean Architecture
Peyroo is architected as a **Modular Monolith**. The application runs within a single unified process and shares a single relational database, but is strictly partitioned internally into distinct, encapsulated domain modules with explicit interface boundaries.

---

## 2. Layered Architecture Model

Each domain module within the modular monolith adheres to a strict 4-layer dependency model (inspired by Clean Architecture / Ports and Adapters):

```mermaid
flowchart TD
    subgraph Layer 1: Presentation Layer
        Controllers["REST API Controllers & Route Handlers"]
        Middleware["Auth & Capability Guard Middleware"]
        DTOs["Request / Response DTO Validation Schemas"]
    end

    subgraph Layer 2: Application Layer
        Services["Application Use Case Services & Coordinators"]
        TxManager["Database Transaction Boundary Manager"]
        Ports["Outbound Port Interfaces (Gateway, Notifier)"]
    end

    subgraph Layer 3: Domain Layer
        Entities["Core Domain Entities (Booking, Slot, User)"]
        ValueObjects["Value Objects (Money, MeetingUrl, Agenda)"]
        Policies["Domain Invariants & Commission Policies"]
    end

    subgraph Layer 4: Infrastructure Layer
        Repositories["Relational Data Repositories (PostgreSQL)"]
        MockGatewayAdapter["Mock Payment Gateway Client Adapter"]
        SchedulerAdapter["Background Job Runner (Cron / Timers)"]
        NotificationAdapter["Notification Dispatcher (Logged Mock / SMTP)"]
    end

    Layer 1 -->|Calls Use Cases| Layer 2
    Layer 2 -->|Manipulates Entities & Enforces Rules| Layer 3
    Layer 4 -.->|Implements Ports & Data Access| Layer 2
    Layer 4 -->|Persists & Reconstructs| Layer 3
```

### 2.1 Layer Responsibilities & Constraints

#### Layer 1: Presentation Layer (Web API)
- **Responsibilities:**
  - Handles HTTP request parsing, routing, and response serialization.
  - Enforces schema validation using declarative schema libraries (e.g., Zod / Joi).
  - Extracts and verifies user session tokens via authentication middleware.
  - Translates internal domain exceptions into standardized, secure HTTP status codes (400, 401, 403, 404, 409, 422, 500).
- **Constraints:** Must not contain business logic or perform direct SQL/database operations.

#### Layer 2: Application Layer (Use Case Services)
- **Responsibilities:**
  - Coordinates multi-entity workflows (e.g., reserving a slot, calculating fees, generating booking records).
  - Defines transactional boundaries (opens and commits database transactions).
  - Orchestrates calls to outbound ports (e.g., dispatching webhook verification).
- **Constraints:** Agnostic to HTTP/web transport; can be invoked by CLI tools, automated integration tests, or web controllers.

#### Layer 3: Domain Layer (Business Core)
- **Responsibilities:**
  - Encapsulates pure business entities, value objects, and domain invariants.
  - Computes platform commission rates ($10\%$) and price breakdowns.
  - Enforces state transition guards (e.g., a booking cannot be cancelled if already `COMPLETED`).
- **Constraints:** Zero dependencies on external frameworks, databases, or third-party libraries. Pure domain logic.

#### Layer 4: Infrastructure Layer
- **Responsibilities:**
  - Implements persistence repositories using SQL queries or an ORM/query builder.
  - Manages database connection pooling, transactions, and row-level locking (`SELECT FOR UPDATE`).
  - Implements external adapters: Mock Payment Gateway HTTP client, background task runner, and email dispatcher.
- **Constraints:** Implements the interfaces defined by the Application Layer (Dependency Inversion Principle).

---

## 3. Inter-Module Communication Guidelines

To prevent the modular monolith from degenerating into a "spaghetti" architecture:
1. **Direct In-Memory Method Invocations:** Modules communicate via public service interfaces (e.g., `BookingService` queries `SlotService.isAvailable()`).
2. **Explicit Foreign Key References:** Modules reference other modules' entities via unique IDs (`UUID`), never via deep in-memory object graphs.
3. **No Cross-Module Database Tables:** A repository belonging to the `LedgerModule` may only read/write to the `payment_transactions` table; it cannot directly query or update the `availability_slots` table.
4. **Shared Kernel:** Shared value objects (`Money`, `MeetingUrl`, pagination parameters, standardized error classes) reside in a minimal `common` / `shared` kernel accessible by all modules.

---

## 4. Architectural Quality Attribute Trade-Offs

| Quality Attribute | Architectural Provision | Trade-Off & Defense |
|---|---|---|
| **Maintainability** | Clean separation of concerns into 4 layers per module. | Requires boilerplate DTO and mapping code; justified by eliminating spaghetti dependencies and enabling independent unit testing. |
| **Concurrency & Integrity** | Relational database row-level locking for slot reservations. | Marginally restricts parallel write throughput on the exact same slot; fully justified because a slot can only belong to one mentee at a time. |
| **Performance** | In-process module calls; indexing on foreign keys and lookup tags. | Eliminates network RPC overhead inherent in microservices; targets $\le 500$ ms latency for indexed read operations under normal operating load. |
| **Security** | Centralized authentication middleware + mandatory ownership checks at the application service layer. | Developers must explicitly invoke ownership checks in service methods; mitigated by standard service-level guard decorators/helpers. |
| **Deployability** | Single container image / single web process. | Entire application redeploys together; fully justified for a semester team project without enterprise microservice orchestration complexity. |
