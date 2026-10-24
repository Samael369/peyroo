# Development Workflow & Setup Guide: Peyroo (پیرو)

## 1. Prerequisites

Before setting up the repository locally, ensure the following tools are installed:

- **Node.js**: `v20.x` or `v22.x` (LTS recommended, verified with `v22.15.0`)
- **npm**: `v10.x` or higher (verified with `v11.6.2`)
- **Git**: `v2.40.0` or higher
- **PostgreSQL**: `v15.x` or higher (required when running database migrations and runtime database queries; not required for initial bootstrap verification)

---

## 2. Initial Setup

### 2.1 Clone Repository

```bash
git clone https://github.com/Samael369/peyroo.git
cd peyroo
```

### 2.2 Configure Environment Variables

Copy the template environment file to create your local environment:

```bash
cp .env.example .env
```

Inspect `.env` and configure local values as needed:

- `PORT`: API server port (default: `5000`)
- `CORS_ORIGIN`: Permitted client origin (default: `http://localhost:3000`)
- `DATABASE_URL`: PostgreSQL connection string (e.g. `postgresql://postgres:postgres@localhost:5432/peyroo`)
- `VITE_API_URL`: Backend API base URL consumed by Vite frontend (default: `http://localhost:5000`)

> **Security Reminder**: Never commit `.env` to Git. `.gitignore` is configured to ignore all `.env` files.

### 2.3 Install Dependencies

Install all workspace dependencies from the root:

```bash
npm install
```

---

## 3. Workspace Commands

The monorepo leverages **npm workspaces** to manage packages and scripts uniformly.

### 3.1 Development Commands

| Command           | Workspace / Scope | Description                                                                            |
| :---------------- | :---------------- | :------------------------------------------------------------------------------------- |
| `npm run dev:api` | `apps/api`        | Starts backend in development mode with auto-reload via `tsx watch`.                   |
| `npm run dev:web` | `apps/web`        | Starts Vite frontend dev server with hot module replacement (HMR).                     |
| `npm run build`   | All workspaces    | Compiles TypeScript across all workspaces (`packages/shared`, `apps/api`, `apps/web`). |

### 3.2 Quality and Verification Commands

| Command                | Scope          | Description                                                                   |
| :--------------------- | :------------- | :---------------------------------------------------------------------------- |
| `npm run typecheck`    | All workspaces | Runs strict TypeScript type-checking (`tsc --noEmit`) without emitting files. |
| `npm run lint`         | All workspaces | Runs ESLint across all TypeScript and JavaScript source files.                |
| `npm run format:check` | Root           | Checks file formatting against Prettier rules.                                |
| `npm run format`       | Root           | Automatically formats all files using Prettier.                               |
| `npm run test`         | All workspaces | Executes all Vitest test suites across packages.                              |

### 3.3 Database Commands _(Planned for future feature phase)_

| Command                  | Scope | Description                                            | Status                           |
| :----------------------- | :---- | :----------------------------------------------------- | :------------------------------- |
| `npx prisma generate`    | Root  | Generates the typed Prisma Client into `node_modules`. | Available                        |
| `npx prisma migrate dev` | Root  | Applies database migrations locally.                   | Planned (models not yet defined) |
| `npx prisma studio`      | Root  | Launches visual database inspector in browser.         | Planned (models not yet defined) |

---

## 4. Git and Branching Workflow

1. **Branch Naming**:
   - `feat/<short-description>`: New platform capability.
   - `fix/<short-description>`: Bug resolution.
   - `docs/<short-description>`: Documentation additions or updates.
   - `refactor/<short-description>`: Structural code changes without functional modifications.
2. **Commit Conventions**:
   Use Conventional Commits format:
   - `feat: add mentor profile endpoint`
   - `fix: correct timezone conversion in slot generator`
   - `docs: update architecture diagram in ARCHITECTURE.md`
   - `chore: update dependencies`
3. **Pull Request Protocol**:
   - Branch from and target `main`.
   - Run `npm run typecheck`, `npm run lint`, `npm run format:check`, and `npm run test` prior to submitting changes.
   - All PRs must receive review and automated CI verification before merging.
