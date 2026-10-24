# 🌟 Peyroo (پیرو) — Global Mentorship Platform

<p align="center">
  <strong>Connect, Learn, and Grow with Industry Mentors Worldwide.</strong><br>
  <strong>پیرو (Peyroo)</strong> is an open, community-driven 1-on-1 mentorship platform inspired by ADPList.
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#key-features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#system-architecture">Architecture</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/Status-Scaffold%20Initialized-orange?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/TypeScript-Strict%205.6-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Express-REST%20API-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-PostgreSQL-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
</p>

---

## 📖 Overview

**Peyroo (پیرو)** is an open-source mentorship platform built to democratize knowledge sharing and career guidance. Rooted in the Persian word _پیرو_ (signifying a seeker of guidance, learner, or follower on the path of growth), the platform connects ambitious learners and professionals with experienced industry mentors for impactful 1-on-1 sessions, portfolio reviews, and career coaching.

This project is developed as a university Software Analysis and Design project, demonstrating rigorous decoupled software architecture, defensive engineering, and modern full-stack TypeScript tooling.

---

## ✨ Key Features (Proposed System Scope)

### 🔍 Discovery & Profiles

- **Smart Mentor Search & Filters:** Filter mentors by domain (Design, Engineering, Product, Marketing), skills, company, language, and seniority.
- **Rich Profiles:** Experience, portfolio links, social handles, verified badges, and mentor bios.
- **Topic-Based Bookings:** Mentors define specific session types (e.g., _Portfolio Review_, _Mock Interview_, _Career Transition Advice_).

### 📅 Seamless Scheduling & Booking

- **Timezone Intelligence:** Automatic timezone conversion for cross-border scheduling.
- **Availability Management:** Mentor-defined weekly recurring windows and buffer intervals.
- **Booking Flow:** Pre-session questions to ensure high-value conversations.

### 📹 Video & Interaction

- **Integrated Video Meetings:** Mentors provide session meeting URLs (Google Meet / Zoom) or launch connected rooms.
- **In-App Messaging & Notes:** Exchange agenda items and notes before and after sessions.

### ⭐ Community & Social Proof

- **Ratings & Testimonials:** Mentees leave genuine endorsements and feedback.
- **Impact Metrics:** Mentors track hours mentored, sessions completed, and community impact.

---

## 🛠 Tech Stack

Peyroo adopts a **Decoupled Modular Monolith** with clear architectural boundaries:

| Layer                          | Technology                                 | Purpose                                                                                  |
| :----------------------------- | :----------------------------------------- | :--------------------------------------------------------------------------------------- |
| **Frontend (`apps/web`)**      | React 18, Vite, TypeScript, Tailwind CSS   | High-performance Single Page Application (SPA) with responsive styling.                  |
| **Backend (`apps/api`)**       | Node.js (LTS), Express, TypeScript, Zod    | Authoritative REST API enforcing business rules, validation, and security headers.       |
| **Database Tier (`prisma/`)**  | PostgreSQL, Prisma ORM                     | Relational database schema, migrations, and type-safe query generation.                  |
| **Shared (`packages/shared`)** | TypeScript                                 | Shared DTOs, API envelope contracts, and domain enums.                                   |
| **Monorepo & Tooling**         | npm workspaces, ESLint 9, Prettier, Vitest | Coordinated workspace dependency management, automated formatting, linting, and testing. |

---

## 🏗 System Architecture

```text
peyroo/
├── apps/
│   ├── web/                   # React + Vite + Tailwind CSS frontend SPA
│   └── api/                   # Express + TypeScript + Zod backend REST API
├── packages/
│   └── shared/                # Shared API contracts, DTOs, and enums
├── prisma/
│   └── schema.prisma          # PostgreSQL database schema configuration
├── docs/                      # Architectural & requirements documentation
├── tests/                     # Test organization and guides
├── AGENTS.md                  # Persistent AI and developer rules
├── .env.example               # Sanitized environment variable template
├── package.json               # Root npm workspace configuration
└── README.md
```

---

## 📚 Documentation

Detailed architecture and design specifications are maintained in the [`docs/`](docs/) directory:

- [Project Overview](docs/PROJECT_OVERVIEW.md) — Purpose, target users, scope, and system boundaries.
- [Requirements Specification](docs/REQUIREMENTS.md) — Functional, non-functional, and security requirements.
- [System Architecture](docs/ARCHITECTURE.md) — Modular monolith design, layers, communication, and Mermaid diagram.
- [Database Design](docs/DATABASE_DESIGN.md) — Domain ERD, preliminary models, constraints, and open decisions.
- [API Contract](docs/API_CONTRACT.md) — Standard response envelopes, error conventions, status codes, and pagination.
- [Security Architecture](docs/SECURITY.md) — Threat models, verified vs planned controls, and OWASP mitigations.
- [Testing Strategy](docs/TESTING_STRATEGY.md) — Unit, API, and component test methodology and quality gates.
- [Development Workflow](docs/DEVELOPMENT_WORKFLOW.md) — Setup prerequisites, workspace commands, and Git conventions.
- [Agent Rules](AGENTS.md) — Persistent developer guidelines and boundary rules.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed locally:

- **Node.js**: `v20.x` or `v22.x` (LTS recommended, verified on `v22.15.0`)
- **npm**: `v10.x` or higher
- **PostgreSQL**: `v15.x` or higher (required for database features in future phases)

### 1. Clone the Repository

```bash
git clone https://github.com/Samael369/peyroo.git
cd peyroo
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Review and adjust variables in `.env` as required (see `.env.example` for reference).

### 3. Install Dependencies

```bash
npm install
```

### 4. Build the Monorepo

```bash
npm run build
```

### 5. Run Quality Checks

```bash
# Type check all workspaces
npm run typecheck

# Lint codebase
npm run lint

# Check code formatting
npm run format:check

# Run test suites
npm run test
```

### 6. Start Development Servers

```bash
# Start backend API (http://localhost:5000)
npm run dev:api

# Start frontend application (http://localhost:3000)
npm run dev:web
```

---

## 🗺 Roadmap

- [x] Initial Architecture, Monorepo Scaffolding & Specifications
- [ ] Database Schema Definition & Initial Migration (Prisma)
- [ ] User Authentication & Role-Based Authorization
- [ ] Mentor Profile Management & Custom Availability Schedules
- [ ] Public Mentor Directory & Search with Filters
- [ ] Session Booking & Management Flow
- [ ] Post-Session Review & Feedback System
- [ ] Meeting Link Integrations & Notifications

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feat/amazing-feature`)
3. Commit your Changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the Branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

Please review [`AGENTS.md`](AGENTS.md) and [`docs/DEVELOPMENT_WORKFLOW.md`](docs/DEVELOPMENT_WORKFLOW.md) for repository standards.

---

## 📄 License

Distributed under the **MIT License**.

---

<p align="center">
  Made with ❤️ by the Peyroo (پیرو) team & community.
</p>
