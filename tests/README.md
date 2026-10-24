# Peyroo Test Organization

This directory contains repository-wide testing documentation, shared fixtures, and future end-to-end (E2E) testing configurations.

## Workspace Test Structure

Automated tests are distributed across workspaces for maximum isolation and speed:

- **Backend API Tests**: Located in `apps/api/test/**/*.test.ts`. Uses **Vitest** and **Supertest** to verify Express routes, middleware, and validation.
- **Frontend Component Tests**: Located in `apps/web/src/**/*.test.tsx`. Uses **Vitest** and **React Testing Library** for UI component testing.
- **Shared Package Tests**: Located in `packages/shared/src/**/*.test.ts`. Verifies shared schemas and utility logic.

## Running Tests

From the monorepo root:

```bash
# Run all tests across all workspaces
npm run test

# Run tests specifically in the backend workspace
npm run test --workspace=apps/api

# Run tests specifically in the frontend workspace
npm run test --workspace=apps/web
```
