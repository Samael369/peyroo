# 🌟 Peyroo (پیرو) — Global Mentorship Platform

<p align="center">
  <strong>Connect, Learn, and Grow with Industry Mentors Worldwide.</strong><br>
  <strong>پیرو (Peyroo)</strong> is an open, community-driven 1-on-1 mentorship platform inspired by ADPList.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#system-architecture">Architecture</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/Status-In%20Active%20Development-orange?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js" />
</p>

---

## 📖 Overview

**Peyroo (پیرو)** is an open-source mentorship platform built to democratize knowledge sharing and career guidance. Rooted in the Persian word *پیرو* (signifying a seeker of guidance, learner, or follower on the path of growth), the platform connects ambitious learners and professionals with experienced industry mentors for impactful 1-on-1 sessions, portfolio reviews, and career coaching.

---

## ✨ Key Features

### 🔍 Discovery & Profiles
- **Smart Mentor Search & Filters:** Filter mentors by domain (Design, Engineering, Product, Marketing), skills, company, language, and seniority.
- **Rich Profiles:** Show experience, portfolio links, social handles, verified badges, and mentor bios.
- **Topic-Based Bookings:** Mentors define specific session types (e.g., *Portfolio Review*, *Mock Interview*, *Career Transition Advice*).

### 📅 Seamless Scheduling & Booking
- **Timezone Intelligence:** Automatic timezone conversion for cross-border scheduling.
- **Calendar Sync:** Integration with Google Calendar, Outlook, and Apple Calendar via iCal.
- **Booking Flow:** Pre-session questions to ensure high-value conversations.

### 📹 Video & Interaction
- **Integrated Video Meetings:** Launch 1-on-1 video rooms natively or sync with Google Meet/Zoom.
- **In-App Messaging & Notes:** Exchange notes, agenda items, and follow-ups before and after sessions.

### ⭐ Community & Social Proof
- **Ratings & Testimonials:** Mentees leave genuine endorsements and feedback.
- **Group Sessions & Masterclasses:** Host group webinars and portfolio teardowns for multiple participants.
- **Impact Metrics:** Mentors can track hours mentored, sessions completed, and community impact.

---

## 🛠 Tech Stack

Peyroo is built with a modern, performant, and scalable tech stack:

| Layer | Technology |
| :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/) (App Router), React, [Tailwind CSS](https://tailwindcss.com/), Radix UI / shadcn/ui |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Backend & API** | Next.js Server Actions / Route Handlers (or Node.js NestJS) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/) or [Drizzle ORM](https://orm.drizzle.team/) |
| **Authentication** | [NextAuth.js (Auth.js)](https://authjs.dev/) / Supabase Auth / Clerk |
| **Video / Calling** | [Daily.co](https://www.daily.co/) / [LiveKit](https://livekit.io/) / WebRTC |
| **Storage & Emails** | Cloudinary / AWS S3 (Avatars & Attachments), [Resend](https://resend.com/) (Transactional Emails) |

---

## 🏗 Architecture Preview

```text
peyroo/
├── apps/
│   └── web/                   # Next.js frontend application
│       ├── app/               # Next.js App Router (pages & layouts)
│       │   ├── (auth)/        # Login, Register, Onboarding
│       │   ├── (dashboard)/   # Mentee & Mentor Dashboards
│       │   ├── mentors/       # Directory & Profile pages
│       │   └── booking/       # Booking flow & checkout/confirmation
│       ├── components/        # Reusable UI components
│       ├── lib/               # Utility functions & API clients
│       └── hooks/             # Custom React hooks
├── packages/
│   ├── database/              # Prisma / Drizzle schemas and migrations
│   ├── email/                 # Email templates (React Email)
│   └── config/                # Shared ESLint, Prettier, and TS configs
├── .env.example               # Template environment configuration
├── package.json
└── README.md
```

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development.

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.x` or higher ([Download](https://nodejs.org/))
- **pnpm** (recommended), **npm**, or **yarn**
- **PostgreSQL** instance running locally or via Docker

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/peyroo.git
cd peyroo
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Setup Environment Variables

Copy the example environment file and configure your local credentials:

```bash
cp .env.example .env.local
```

Fill in the required keys:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/peyroo"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (Google, GitHub, LinkedIn)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Email Service (Resend)
RESEND_API_KEY=""
EMAIL_FROM="noreply@peyroo.com"

# Video / Calendar Integration (Optional for MVP)
DAILY_API_KEY=""
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev
# or
npx prisma db push
```

### 5. Start the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

---

## 🗺 Roadmap

- [x] Initial Architecture & Project Setup
- [ ] Authentication & User Onboarding (Mentee / Mentor Roles)
- [ ] Mentor Profile Management & Custom Availability
- [ ] Search & Exploration with Tag Filters
- [ ] Cal.com / Google Calendar Synchronization
- [ ] Direct Messaging & Meeting Room Integration
- [ ] Review & Recommendation System
- [ ] Group Sessions & Workshops
- [ ] AI-Powered Mentor-Mentee Matchmaking

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your Changes** (`git commit -m 'feat: add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

Please read our [Contributing Guide](CONTRIBUTING.md) and code conventions before submitting a PR.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Made with ❤️ by the Peyroo (پیرو) team & community.
</p>
