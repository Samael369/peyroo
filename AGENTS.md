# Agent Development Rules and Repository Guidelines

This document contains persistent operating instructions for all AI agents and developers working on the **Peyroo** codebase. These rules are mandatory and must be strictly followed.

---

## 1. Core Operating Principles

1. **Read Before Acting**: Always read the relevant project documentation in `docs/` (`PROJECT_OVERVIEW.md`, `ARCHITECTURE.md`, `REQUIREMENTS.md`, `SECURITY.md`, etc.) before beginning any design or feature implementation.
2. **Inspect Existing State First**: Inspect the existing implementation, tests, and configuration before editing or proposing replacements. Never assume a file or structure is empty or absent.
3. **Follow the Approved Architecture and Tech Stack**:
   - **Frontend**: React, TypeScript (strict mode), Vite, Tailwind CSS in `apps/web`.
   - **Backend**: Node.js, TypeScript (strict mode), Express, REST conventions, Zod validation in `apps/api`.
   - **Database**: PostgreSQL, Prisma ORM, migrations in `prisma/`.
   - **Shared**: Shared types and contracts in `packages/shared/`.
   - **Monorepo**: npm workspaces.
   - Do not introduce alternatives (e.g. Next.js, NestJS, GraphQL, Drizzle) without explicit written approval.
4. **Avoid Unrelated Refactoring and Speculative Code**: Keep changes small, focused, reviewable, and limited strictly to the requested scope. Do not clean up, reformat, or refactor unrelated code.
5. **No Speculative Abstractions or Boilerplate**: Avoid creating unnecessary interfaces, abstract factories, repository layers, mock services, or placeholder domain classes without a concrete, immediate requirement.
6. **No Product Features Without Explicit Request**: Never implement unrequested platform features (such as user registration, login, bookings, search, or payments). Wait for explicit instructions.

---

## 2. Security and Data Integrity Boundary

7. **Server-Side Authority**: The backend is the sole authority for business rules, authorization, and data integrity. Never trust frontend checks or client input as a security boundary.
8. **Server-Side Validation**: Validate all untrusted input (request parameters, query strings, headers, request bodies, and external payloads) on the server using Zod schemas before processing.
9. **Zero Secret Leaks**: Never commit `.env`, `.env.local`, API keys, passwords, connection strings, or real credentials to Git. Always use `.env.example` as a sanitised reference template.
10. **Database Boundary**: The frontend must never connect directly to the database. All data access must pass through validated backend REST API endpoints. Database operations must use parameterized queries via Prisma ORM.

---

## 3. Quality, Verification, and Testing Standards

11. **Test-Backed Changes**: When implementing actual functionality, add or update corresponding unit or integration tests under Vitest.
12. **Verification Integrity**: Run all relevant automated checks (linting, type checking, tests, builds) before concluding a task. Report genuine, unfiltered execution output.
13. **Never Falsify Results**: Never claim a test, build, or security check passed unless it was actually executed and exited with zero errors. If a check cannot be executed, explicitly state why.
14. **Preserve Rigor**: Never disable tests, weaken TypeScript settings (such as disabling `strict`), or suppress ESLint rules merely to make a check pass. Fix the underlying issue.

---

## 4. Change Management and Destructive Actions

15. **Require Explicit Approval for Architectural Decisions**: Ask for explicit user approval before introducing any new major dependency, adding external cloud services, or altering the approved system architecture.
16. **Protect Git History**: Never run destructive Git operations (e.g. `git reset --hard`, `git push --force`, history rewriting, branch deletion), change the GitHub remote, or commit/push changes without explicit user permission.
17. **Synchronize Documentation**: Whenever an approved architectural decision, API contract, or data model changes, update the relevant documentation in `docs/` in the same changeset.
18. **Review Working Tree**: Always inspect `git status` and `git diff` before completing a task to verify that only intentional changes remain in the local working tree.
