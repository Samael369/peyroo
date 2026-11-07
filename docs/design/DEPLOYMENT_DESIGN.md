# Deployment Design & Operational Topology: Peyroo Mentorship Platform

**Project Working Title:** Peyroo (پیرو)  
**Academic Course:** Software Analysis and Design (SSAD) | Fall 1405  
**Document Identifier:** `docs/design/DEPLOYMENT_DESIGN.md`  
**Status:** `[BASELINE - STAGE 06]`  
**Date:** Aban 1405 / November 2026  
**Document Version:** 1.0  

---

## 1. Overview & Deployment Philosophy

In accordance with the academic constraints documented in [`ASSIGNMENT_ANALYSIS.md`](file:///c:/Users/r/Desktop/peyroo/docs/assignment/ASSIGNMENT_ANALYSIS.md), the deployment architecture is designed to:
1. Provide a public **HTTPS** endpoint accessible worldwide for milestone demonstrations (Presentation 2 and Presentation 3).
2. Operate comfortably within **free-tier resource allocations** without incurring financial hosting liability.
3. Eliminate operational complexity by avoiding multi-cluster Kubernetes orchestration, distributed message brokers, or external caching tiers that add failure modes without serving stated functional requirements.

---

## 2. Physical Deployment Topology

```mermaid
deploymentDiagram
    actor UserClient as Web Browser (Desktop / Mobile)
    
    node CDN as Edge / Reverse Proxy (Cloudflare / Platform Ingress) {
        artifact SSLCert as TLS 1.3 HTTPS Certificate
        artifact StaticAssets as Pre-rendered Web Client Assets (SPA)
    }

    node ApplicationServer as Web Application Host (Render / Railway / Fly.io) {
        component BackendService as Node.js / TypeScript App Process
        component EmbeddedScheduler as In-Process Background Scheduler
    }

    node DatabaseHost as Managed Relational Database (Neon / Supabase / Render Postgres) {
        database PostgreSQL as PostgreSQL 15+ Instance
    }

    node ExternalServices as External Infrastructure Interfaces {
        component MockBankSimulator as Mock Banking Gateway Service
        component VideoProvider as External Video Servers (Google Meet / Zoom)
    }

    UserClient -->|HTTPS :443| CDN
    CDN -->|Reverse Proxy / Static Cache| UserClient
    CDN -->|Forward API Traffic :443| BackendService

    BackendService -->|Encrypted TCP / SSL Connection Pool :5432| PostgreSQL
    EmbeddedScheduler -->|Executes 60s Expiration & Completion Tasks| PostgreSQL

    UserClient <-->|Redirect Checkout & Callback :443| MockBankSimulator
    MockBankSimulator -->|Signed Webhook Callback /api/payments/callback| BackendService
    UserClient -.->|User Joins Session Meeting URL| VideoProvider
```

---

## 3. Node Specifications & Component Allocation

### 3.1 Edge / Presentation Tier (Client Delivery)
- **Role:** Delivers static web application bundles (HTML, CSS, compiled JavaScript) and terminates public TLS/HTTPS.
- **Hosting Candidates:** Vercel, Netlify, Cloudflare Pages, or bundled directly from the backend server using static file middleware.
- **Port / Protocol:** HTTPS (Port 443) using modern TLS 1.2 / 1.3 ciphers.

### 3.2 Application Server Tier (Modular Monolith)
- **Role:** Executes backend API routes, business logic, transaction coordination, and background timers.
- **Container / Runtime:** Standard Docker container running Node.js 20+ LTS runtime or equivalent modern web server.
- **Memory Allocation:** Minimum 512 MiB RAM (standard free tier on Render, Railway, or Fly.io).
- **Background Worker Co-location:** The background task scheduler executes within the same application process as an asynchronous interval timer (ADR-004), eliminating the cost and complexity of a separate worker container.

### 3.3 Database Tier (Relational Storage)
- **Role:** Persistent ACID storage, relational constraints, and row-level lock coordinator.
- **Engine:** PostgreSQL 15+ with SSL connection enforcement (`sslmode=require`).
- **Connection Management:** Connection pooling (5 to 10 connections) configured to prevent exhausting free-tier connection limits (typically 20–50 connections on Neon/Supabase/Render).

### 3.4 Mock Payment Gateway Interface
- **Role:** Simulates external bank card processing, transaction receipts, and signed webhook callbacks.
- **Deployment Option:** Deployed as a dedicated standalone route group within the Peyroo application (`/mock-gateway`) or as an independent lightweight mock micro-service to clearly demonstrate inter-system HTTP redirection and webhook decoupling.

---

## 4. Hosting Feasibility, Resource Estimation & Operational Targets

In compliance with the **Hosting & Financial Transparency** requirements of the SSAD Fall 1405 syllabus:

### 4.1 Target vs. SLA Classification
- **Performance Target:** The $\le 500$ ms latency metric is an internal architectural design objective for indexed database queries and cached read operations under simulated academic loads. It is **not** a commercially verified SLA and does not account for external internet transit jitter.
- **Availability Target:** Continuous public availability during review milestones is an operational objective. Commercial free-tier providers offer zero uptime SLAs; occasional compute sleeping occurs after 15 minutes of inactivity.
- **Financial Cost Estimate:** The **$0.00 / month** projection is an architectural feasibility estimate based on published free-tier allowances. It is subject to third-party policy changes.

| Platform / Resource | Free-Tier Specification (Estimated) | Projected Consumption for Peyroo MVP | Financial Cost Estimate |
|---|---|---|:---:|
| **Web Server (Render / Railway / Fly.io)** | 512 MiB RAM, 0.1–0.5 vCPU, ~500 active hours/month. | Single web process consumes ~120 MiB RAM under load; subject to idle spin-down. | **$0.00 / month (Estimated)** |
| **Relational DB (Neon / Supabase)** | 0.5 GiB storage, 10–20 pooled connections, compute auto-pause. | Peyroo schema and 1,000 test bookings require $< 25$ MiB storage. Max 5 connections in pool. | **$0.00 / month (Estimated)** |
| **SSL / HTTPS Certificates** | Automated Let's Encrypt certificates managed by PaaS. | Wildcard or subdomain certificate at platform domain (`*.onrender.com` or custom domain). | **$0.00 / month** |
| **Outbound Bandwidth** | ~100 GiB / month. | Estimated demo consumption $< 5$ GiB / month. | **$0.00 / month** |
| **Total Estimated Operating Cost** | — | — | **$0.00 / month (Academic Estimate)** |

### 4.2 Cold-Start Handling Strategy
Free-tier compute instances (e.g., Render Web Services) spin down after 15 minutes of inactivity, introducing a **30 to 50-second cold start** on the initial HTTP request.
- **Evaluation Handling:** Prior to formal course evaluations and presentation defense sessions, team members will execute a lightweight ping script or open the web URL 2 minutes in advance to pre-warm the container and eliminate latency during live evaluator interaction.
