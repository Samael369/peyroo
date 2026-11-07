# Global Agent Guidelines & Project Instructions

## 1. Project Context
This repository hosts the academic software engineering project for a **Mentorship Platform** (working title / project workspace: *Peyroo*). The platform connects mentors and mentees to facilitate structured knowledge sharing, guidance, and professional growth. 

This project follows an academic software engineering lifecycle, prioritizing rigorous requirement engineering, domain modeling, system architecture, disciplined design, quality assurance, and traceability before and during implementation.

---

## 2. Development Workflow & Lifecycle Gates
Development progresses sequentially through defined lifecycle stages. No stage may be bypassed without explicit user direction:

1. **Stage 0: Workspace Initialization & Setup** *(Current)*
   - Directory structure, global configuration, baseline documentation.
2. **Stage 1: Discovery & Inception**
   - Stakeholder identification, problem statement, vision document, preliminary scope definition.
3. **Stage 2: Requirements Engineering**
   - User stories, functional requirements, non-functional requirements (NFRs), use case specifications, Software Requirements Specification (SRS).
4. **Stage 3: System Analysis & Modeling**
   - Domain modeling, UML analysis diagrams (Use Case, Activity, State Machine, Sequence diagrams).
5. **Stage 4: System Architecture & Detailed Design**
   - Architectural pattern selection, database schema (conceptual, logical, physical), API contracts, UI/UX wireframes and component architecture.
6. **Stage 5: Implementation**
   - Technology stack onboarding, modular coding, unit tests, adherence to design models.
7. **Stage 6: Verification & Quality Assurance**
   - Integration testing, end-to-end testing, code reviews, performance and security checks.
8. **Stage 7: Delivery & Academic Presentation**
   - Submission artifacts, final documentation consolidation, slide decks, demonstration walkthroughs.

---

## 3. Analysis and Design Principles
- **Separation of Concerns (SoC):** Distinct boundaries between presentation, domain logic, data access, and integrations.
- **Traceability:** Every functional implementation component must trace back to a documented requirement and use case.
- **Model-Driven Clarity:** UML diagrams must adhere to standard OMG UML 2.x conventions.
- **Incremental & Iterative Refinement:** Design artifacts evolve from conceptual to logical to physical specifications without skipping intermediate abstractions.
- **No Premature Optimization or Tech Lock-in:** Architecture decisions must be justified by stated requirements and evaluated objectively.

---

## 4. Documentation Standards
- **Format:** All documentation must be written in clean GitHub-Flavored Markdown (`.md`).
- **Location:** Documentation belongs under `docs/` within its designated topical subfolder.
- **Diagrams:**
  - Standard text-based diagrams should use Mermaid syntax inside markdown blocks for direct GitHub rendering.
  - Exported visual diagrams or assets should be placed in `docs/analysis/diagrams/` or `assets/` and referenced via standard markdown image links.
- **Structure:** Documents must include a clear title, status, version/date, table of contents (where applicable), and author/contributor notes.

---

## 5. Coding Standards (Applicable during Implementation)
- **Readability First:** Write expressive, self-documenting code with meaningful naming conventions.
- **Comments & Docstrings:** Document public APIs, complex algorithmic branches, and architectural boundaries.
- **Test-Driven / Test-Accompanied:** Every feature requires corresponding unit and integration tests.
- **Linting & Formatting:** Adhere strictly to `.editorconfig` and language-specific formatters adopted during stack selection.
- **Error Handling:** Explicit, predictable error boundaries and graceful degradation; avoid raw exceptions leaking to the client interface.

---

## 6. Git Safety & Version Control Rules
- **Branching Strategy:** Main branch remains stable. Work proceeds via feature branches or staged development branches.
- **Commit Messages:** Follow the Conventional Commits specification:
  - `feat: ...` for new features
  - `docs: ...` for documentation additions or edits
  - `fix: ...` for bug fixes
  - `refactor: ...` for code restructurings
  - `test: ...` for test suites
  - `chore: ...` for configuration or repository maintenance
- **No Secrets or Credentials:** Never commit API keys, passwords, `.env` files, credentials, or session tokens.
- **No Large Binaries:** Keep the repository lightweight; store large binary assets outside or compress them appropriately within `assets/`.
- **Atomic Commits:** Keep commits scoped to a single logical change with an accurate description.

---

## 7. Agent Collaboration Guidelines
- **Autonomous Execution with Human Oversight:** Perform authorized tasks systematically, but pause and request explicit user confirmation at major architectural gates or requirement baselines.
- **No Unsolicited Assumptions:** Do not fabricate domain rules, technical dependencies, or framework choices without direct guidance or approval.
- **Non-Destructive Actions:** Never delete or alter user files or existing specifications without justification and explicit consent.
- **Skill Alignment:** When developing within specific sub-disciplines, refer to and update the corresponding `.agents/skills/<skill-name>/` instructions as skills are defined.
