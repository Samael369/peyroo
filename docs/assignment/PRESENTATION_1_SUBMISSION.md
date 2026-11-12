# Presentation 1 Submission Package: Analysis & Design Review

> **Course:** Software Analysis and Design (SSAD) | Fall 1405  
> **Project Working Title:** Peyroo (پیرو) — Mentorship Platform  
> **Milestone:** Presentation 1 (Analysis and Design Review) — 20 Points  
> **Submission Cutoff:** 24 Aban 1405 @ 23:59 (15 November 2026)  
> **Presentation Defense Dates:** 25–26 Aban 1405 (16–17 November 2026)  
> **Review Format:** 8-minute presentation + 4-minute Q&A  
> **Document Identifier:** `docs/assignment/PRESENTATION_1_SUBMISSION.md`  
> **Status:** `[FINALIZED - PENDING USER FIGMA LINK & GIT TAG]`  

---

## 1. Official Submission Metadata & Package Items

In accordance with Section 8 ("Submit one package per team at each review") of `Software_Engineering_Semester_Project_Final.pdf`:

| Submission Item | Required Content | Project Value / Artifact Link |
|---|---|---|
| **Repository Link** | Shared Git repository with clear README | [https://github.com/Samael369/peyroo](https://github.com/Samael369/peyroo) |
| **Exact Git Reference** | Git commit hash or release tag | Tag: `v0.1.0-p1` *(Commit: `[INSERT_COMMIT_HASH_BEFORE_SUBMISSION]`)* |
| **Clickable Prototype Link** | Interactive prototype (Figma / Subframe) | `[INSERT_FIGMA_PROTOTYPE_URL_HERE]` |
| **API Contract / List** | Endpoint paths, inputs, outputs, error codes | [`docs/design/API_DESIGN.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/API_DESIGN.md) |
| **UML Use Case Diagram** | Main actors & MVP actions | [`docs/analysis/uml/USE_CASE_DIAGRAM.md`](file:///c:/Users/r/Desktop/peyroo/docs/analysis/uml/USE_CASE_DIAGRAM.md) |
| **UML Activity Diagram** | Workflow steps, decisions, failure branches | [`docs/analysis/uml/ACTIVITY_DIAGRAMS.md`](file:///c:/Users/r/Desktop/peyroo/docs/analysis/uml/ACTIVITY_DIAGRAMS.md) |
| **System Architecture Diagram** | Presentation, backend, DB, external services | [`docs/design/ARCHITECTURE_DESIGN.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/ARCHITECTURE_DESIGN.md) |
| **ERD / Persistent Data Model** | Entities, PK/FK, constraints, ownership | [`docs/design/DATABASE_DESIGN.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/DATABASE_DESIGN.md) |
| **Product Scope & User Stories** | MVP definition, MoSCoW stories & criteria | [`docs/requirements/USER_STORIES.md`](file:///c:/Users/r/Desktop/peyroo/docs/requirements/USER_STORIES.md) |
| **Technology Rationale & Costs** | Arch patterns, DB choice, free-tier limits | [`docs/design/ARCHITECTURE_DECISIONS.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/ARCHITECTURE_DECISIONS.md) & [`DEPLOYMENT_DESIGN.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/DEPLOYMENT_DESIGN.md) |
| **Test Evidence / Live URL** | Appropriate to review | *Not required for P1 (code & deployment evaluated in P2 & P3)* |

---

## 2. Team Structure & Member Contributions

In compliance with the requirement: *"A short note naming each member’s contribution and any unfinished work"*:

### 2.1 Team Members
- **Alireza Abasi** — Frontend & UI/UX Engineering Lead  
- **Mostafa Sadidi** — Backend & System Architecture Lead (Repository Collaborator)

### 2.2 Contribution Breakdown for Presentation 1

#### Alireza Abasi (Frontend & UI/UX Lead):
1. **Product Discovery & Persona Modeling:** Co-authored the product vision, defined target user personas (Amir & Sara), and established the core business journey.
2. **Prioritized User Stories & MVP Scope:** Formulated the agile user stories (`US-01` through `US-14`) and observable acceptance criteria in standard format.
3. **Design System & Visual Identity:** Designed the *Oceanic Precision* dark theme design tokens ([`DESIGN_SYSTEM_TOKENS.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/ui/DESIGN_SYSTEM_TOKENS.md)) covering the 2 Primary + 1 Odd Punch palette, typography, button hierarchy, and WCAG AA accessibility matrix.
4. **Clickable UI Prototype:** Sole owner of the full Figma interactive prototype illustrating the primary user journey (landing, catalog, slot selection, agenda modal, mock payment gateway, and confirmation dashboard).
5. **Client API Review:** Validated request/response DTO schemas in [`API_DESIGN.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/API_DESIGN.md) to ensure seamless frontend component binding.

#### Mostafa Sadidi (Backend & System Architecture Lead):
1. **Architectural Strategy & Decisions:** Selected and justified the Modular Monolith pattern (ADR-001) with clean layered boundaries, evaluating trade-offs against microservices and serverless architectures.
2. **Four Mandatory Design Views:**
   - Authored the formal **UML Use Case Diagram** ([`USE_CASE_DIAGRAM.md`](file:///c:/Users/r/Desktop/peyroo/docs/analysis/uml/USE_CASE_DIAGRAM.md)) capturing human actors, system boundaries, and role capabilities.
   - Authored the **UML Activity Diagrams** ([`ACTIVITY_DIAGRAMS.md`](file:///c:/Users/r/Desktop/peyroo/docs/analysis/uml/ACTIVITY_DIAGRAMS.md)) modeling workflow branching, concurrency holds, and error paths.
   - Authored the **System Architecture Diagram** ([`ARCHITECTURE_DESIGN.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/ARCHITECTURE_DESIGN.md)) and component decomposition ([`COMPONENT_DESIGN.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/COMPONENT_DESIGN.md)).
   - Authored the **Relational Database Design (ERD)** ([`DATABASE_DESIGN.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/DATABASE_DESIGN.md)) with DDL schemas, PostgreSQL partial unique indexing, and pessimistic concurrency locking scripts (`SELECT ... FOR UPDATE`).
3. **API Contract & Error Envelopes:** Designed the complete RESTful API contract ([`API_DESIGN.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/API_DESIGN.md)) across 8 domain modules with standardized JSON error envelopes.
4. **Security & Deployment Planning:** Engineered defense-in-depth security specifications ([`SECURITY_DESIGN.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/SECURITY_DESIGN.md)) and evaluated free-tier cloud hosting feasibility ($0.00/month operational budget in [`DEPLOYMENT_DESIGN.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/DEPLOYMENT_DESIGN.md)).

### 2.3 Declared Unfinished Work
- **Clickable Figma Prototype Finalization:** The interactive prototype in Figma is currently being finalized by Alireza Abasi to ensure high visual quality and seamless interaction transitions across all edge cases (slot taken conflict, payment failure, 24h cancellation dialog). The live Figma link will be inserted prior to the presentation review.
- **Product Code:** In accordance with the course specification (*"No working product feature is required at this stage"*), zero application source code has been written; implementation commences in Milestone P2 (27 Aban – 22 Azar).

---

## 3. Evaluation Rubric Alignment (20 Points)

| Assessment Criterion | Weight | Key Deliverables & Evidence | Status |
|---|:---:|---|:---:|
| **1. Product and User Stories** | **8 pts** | • Clear problem definition & MVP boundaries in [`PRODUCT_VISION.md`](file:///c:/Users/r/Desktop/peyroo/docs/discovery/PRODUCT_VISION.md) and [`PROJECT_SCOPE.md`](file:///c:/Users/r/Desktop/peyroo/docs/requirements/PROJECT_SCOPE.md).<br>• Prioritized agile stories (`US-01` to `US-14`) in standard *"As a [user]..."* format in [`USER_STORIES.md`](file:///c:/Users/r/Desktop/peyroo/docs/requirements/USER_STORIES.md).<br>• Observable acceptance criteria covering success, failure, and backend-enforced ownership validation. | **100% COMPLETE** |
| **2. Diagrams and System / Database Design** | **7 pts** | • **UML Use Case:** [`USE_CASE_DIAGRAM.md`](file:///c:/Users/r/Desktop/peyroo/docs/analysis/uml/USE_CASE_DIAGRAM.md)<br>• **UML Activity:** [`ACTIVITY_DIAGRAMS.md`](file:///c:/Users/r/Desktop/peyroo/docs/analysis/uml/ACTIVITY_DIAGRAMS.md)<br>• **System Architecture:** [`ARCHITECTURE_DESIGN.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/ARCHITECTURE_DESIGN.md)<br>• **ERD / Data Model:** [`DATABASE_DESIGN.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/DATABASE_DESIGN.md)<br>• Semantic consistency audit report in [`UML_CONSISTENCY_REPORT.md`](file:///c:/Users/r/Desktop/peyroo/docs/analysis/uml/UML_CONSISTENCY_REPORT.md). | **100% COMPLETE** |
| **3. Prototype, API, and Choices** | **5 pts** | • **API Contract:** 8-module REST API catalog with request/response schemas in [`API_DESIGN.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/API_DESIGN.md).<br>• **Technology Rationale:** 6 formal ADRs justifying TypeScript, Modular Monolith, PostgreSQL, and JWT cookies in [`ARCHITECTURE_DECISIONS.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/ARCHITECTURE_DECISIONS.md).<br>• **Hosting Plan & Costs:** Documented $0.00/mo PaaS hosting, cold starts, and free-tier limits in [`DEPLOYMENT_DESIGN.md`](file:///c:/Users/r/Desktop/peyroo/docs/design/DEPLOYMENT_DESIGN.md).<br>• **Clickable Prototype:** Dedicated Figma prototype link placeholder. | **AWAITING FIGMA LINK** |

---

## 4. Final Submission Checklist

- [x] Shared Git repository configured with clear `README.md`.
- [x] All 4 mandatory design views version-controlled under `docs/analysis/uml/` and `docs/design/`.
- [x] Complete REST API catalog documented under `docs/design/API_DESIGN.md`.
- [x] Technology choices, architectural trade-offs, and hosting cost limits documented.
- [x] Team member contribution note detailed for Alireza Abasi and Mostafa Sadidi.
- [ ] Insert the final clickable Figma prototype link in Section 1 and in `README.md`.
- [ ] Create and push the Git release tag `v0.1.0-p1` (`git tag -a v0.1.0-p1 -m "Presentation 1 Submission Package"`).
- [ ] Submit the repository URL and tag via the official course submission channel before **24 Aban 1405 @ 23:59**.
