<div align="center">

<img width="130" height="76" alt="image" src="https://github.com/user-attachments/assets/98d4274b-20de-444e-9d68-a96d36c7ae65" />

# MailMass

### The open-source Email Marketing Platform for teams who ship

**Manage contacts. Craft templates. Orchestrate campaigns. Track every open and click — at scale.**

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16+-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.136-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Celery](https://img.shields.io/badge/Celery-Async-37814A?style=for-the-badge&logo=celery&logoColor=white)](https://docs.celeryq.dev/)
[![Redis](https://img.shields.io/badge/Redis-Broker-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

<br/>

[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Deploy on Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E?logo=railway&logoColor=white)](https://railway.app)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)

<br/>

`[SCREENSHOTS HERE]`

</div>

<br/>

## 📖 Overview

**MailMass** is a production-grade, open-source Email Marketing Platform built for teams that need reliable contact management, rich template authoring, and scalable campaign delivery — without the overhead of proprietary SaaS pricing tiers.

The platform is architected as a **decoupled system**: a **Next.js** frontend consumes a **FastAPI** backend over a REST API. All send-heavy and long-running operations — bulk email dispatch, analytics aggregation, scheduled sending — are offloaded to **Celery** workers and a **Celery Beat** scheduler backed by **Redis**, keeping the API fast and responsive under load.

> [!TIP]
> Built with clean separation of concerns, strict typing end-to-end, and a deployment story that works equally well on a laptop (`docker-compose up`) or in production (Railway + Vercel).

<br/>

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#️-architecture)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Deployment](#️-deployment)
- [Contributing](#-contributing)
- [License](#-license)

<br/>

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🔐 Authentication
Secure signup/login with **JWT** access & refresh token handling, password hashing via `passlib` + `bcrypt`, Axios interceptors for automatic token refresh, and middleware-guarded protected routes in Next.js.

### 📊 Dashboard
At-a-glance analytics — total campaigns, emails sent, open rates, click rates — rendered with responsive widgets and optimized loading skeletons.

### 👥 Contacts Management
Full CRUD with server-side pagination, advanced search & filtering, bulk **CSV import** with validation and error reporting, and segment-based **CSV export**.

</td>
<td width="50%" valign="top">

### 🧩 Templates Management
Full CRUD for reusable email templates with a live, sanitized **HTML preview** pane and variable/placeholder support for personalization.

### 🚀 Campaigns Management
Campaign builder with recipient list mapping and **non-blocking sends** via Celery background tasks, plus open & click tracking with pixel/link instrumentation and per-campaign analytics.

### ⚙️ Settings
Modular settings surface — **Account**, **Security**, **Email Configuration**, **UI Preferences** — with UI preferences persisted client-side via custom `localStorage` hooks.

</td>
</tr>
</table>

<br/>

## 🛠️ Tech Stack

<table>
<tr><th align="left">Layer</th><th align="left">Technology</th></tr>
<tr><td>🎨 Frontend Framework</td><td>Next.js 16+ (App Router), React 19, TypeScript</td></tr>
<tr><td>💅 Styling / UI</td><td>TailwindCSS v4, Base UI, Shadcn UI, Lucide React</td></tr>
<tr><td>🔌 HTTP Client</td><td>Axios</td></tr>
<tr><td>⚡ Backend Framework</td><td>FastAPI (Python 3.12+)</td></tr>
<tr><td>🗄️ Database</td><td>PostgreSQL</td></tr>
<tr><td>🔗 ORM / Migrations</td><td>SQLAlchemy, Alembic</td></tr>
<tr><td>✅ Validation</td><td>Pydantic</td></tr>
<tr><td>🔄 Async Task Queue</td><td>Celery &amp; Celery Beat (Scheduler)</td></tr>
<tr><td>📨 Message Broker</td><td>Redis</td></tr>
<tr><td>🔑 Authentication</td><td>JWT (<code>python-jose</code>), <code>passlib</code>, <code>bcrypt</code></td></tr>
<tr><td>📦 Containerization</td><td>Docker, Docker Compose</td></tr>
<tr><td>☁️ Deployment</td><td>Railway (API / Postgres / Redis / Workers), Vercel (Frontend)</td></tr>
</table>

<div align="centre">
 
 ## 🏗️ System Architecture
 
 ```mermaid
 flowchart LR
 
     subgraph Frontend
         A[Browser]
         B[Next.js 16]
         A --> B
     end
 
     subgraph Backend
         C[FastAPI]
 
         subgraph Background_Jobs
             D[Redis]
             E[Celery Worker]
             F[Celery Beat]
         end
     end
 
     subgraph Data
         G[(PostgreSQL)]
     end
 
     subgraph External
         H[SMTP<br/>SES / SendGrid]
         I[Recipients]
     end
 
     B -->|REST API| C
     C -->|Read/Write| G
     C -->|Queue Jobs| D
     F -->|Schedule| D
     D -->|Tasks| E
     E -->|Load Data| G
     E -->|Send Email| H --> I
 
     classDef frontend fill:#000000,stroke:#2471A3,stroke-width:2px;
     classDef backend fill:#000000,stroke:#239B56,stroke-width:2px;
     classDef database fill:#000000,stroke:#B7950B,stroke-width:2px;
     classDef external fill:#000000,stroke:#7D3C98,stroke-width:2px;
 
     class A,B frontend;
     class C,D,E,F backend;
     class G database;
     class H,I external;
 ```

</div>

<br/>

## 🏗️ Architecture

MailMass follows a **decoupled, service-oriented architecture**. The frontend never talks directly to the database, Redis, or SMTP providers — every interaction is mediated by the FastAPI service layer, which delegates long-running work to Celery.

| Step | What happens |
|:---:|---|
| **1** | The **Next.js client** sends authenticated REST requests to **FastAPI** via Axios. |
| **2** | FastAPI validates payloads with **Pydantic**, applies business logic, and persists state through **SQLAlchemy** into **PostgreSQL**. |
| **3** | For heavy or slow operations (e.g. dispatching a campaign to thousands of contacts), the API enqueues a job onto **Redis** and immediately returns a `202 Accepted`-style response — keeping the UI responsive. |
| **4** | One or more **Celery workers** consume the queue, perform the work (sending emails, updating send status, recording opens/clicks), and write results back to PostgreSQL. |
| **5** | **Celery Beat** runs alongside the workers to trigger scheduled, recurring jobs. |

**System Flow**

<img width="530" height="260" alt="image" src="https://github.com/user-attachments/assets/a9f270ca-2c31-412d-be72-78c1dbee437c" /> <img width="470" height="260" alt="image" src="https://github.com/user-attachments/assets/3008f9e8-f449-47cb-b2e0-4057ccc8ce41" />



<br/>

## 📂 Repository Structure

```
mailmass/
├── frontend/                # Next.js 16 frontend (App Router)
│   ├── app/                 # Next.js App routes
│   ├── components/          # React components (UI & Shared)
│   ├── hooks/                # Custom React hooks
│   ├── lib/                   # Axios instance, interceptors, utils
│   └── types/                  # TypeScript type definitions
│
├── app/                      # FastAPI backend
│   ├── api/                   # REST endpoints
│   ├── core/                   # Config, security, dependencies
│   ├── models/                  # SQLAlchemy models
│   ├── schemas/                   # Pydantic validation schemas
│   ├── services/                    # Core business logic
│   ├── celery_worker.py               # Celery app initialization
│   └── main.py                          # FastAPI entrypoint
│
├── alembic/                  # Database migration scripts
├── docker-compose.yml        # Full stack local orchestration
├── requirements.txt          # Python dependencies
└── README.md
```

<br/>

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | ≥ 20.x |
| npm | latest |
| Python | ≥ 3.12 |
| PostgreSQL | ≥ 15 |
| Redis | ≥ 7 |
| Docker & Docker Compose | recommended for local parity |

<br/>

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-org/mailmass.git
cd mailmass
```

### 2️⃣ Configure Environment Variables

```bash
# Backend
cp .env.example .env

# Frontend
cp frontend/.env.example frontend/.env.local
```

See [Environment Variables](#-environment-variables) below for the full reference.

### 3️⃣ Run with Docker Compose *(recommended)*

Spins up the API, PostgreSQL, Redis, Celery Worker, and Celery Beat together:

```bash
docker-compose up --build
```

> [!NOTE]
> To run the frontend, open a new terminal and run:
> ```bash
> cd frontend && npm run dev
> ```

<details>
<summary><b>4️⃣ Manual Setup (without Docker)</b> — click to expand</summary>

<br/>

**Backend (FastAPI)**

```bash
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start the API server
uvicorn app.main:app --reload --port 8000
```

**Celery Worker & Scheduler** *(separate terminals)*

```bash
source venv/bin/activate
celery -A app.celery_worker.celery_app worker --loglevel=info
```

```bash
source venv/bin/activate
celery -A app.celery_worker.celery_app beat --loglevel=info
```

**Frontend (Next.js)**

```bash
cd frontend
npm install
npm run dev
```

</details>

<br/>

Once running, open **`http://localhost:3000`** 🎉

<br/>

## 🔑 Environment Variables

### Backend — `.env` *(root folder)*

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/mailmass` |
| `REDIS_URL` | Redis connection string for Celery | `redis://localhost:6379/0` |
| `SECRET_KEY` | Secret used to sign JWT tokens | `super-secret-key` |
| `ALGORITHM` | Signing algorithm for JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token TTL | `30` |
| `SMTP_HOST` | Outbound email server host | `smtp.sendgrid.net` |
| `SMTP_PORT` | Outbound email server port | `587` |
| `SMTP_USER` | SMTP auth username | `apikey` |
| `SMTP_PASSWORD` | SMTP auth password / API key | `your-smtp-key` |

### Frontend — `frontend/.env.local`

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL for the FastAPI backend | `http://localhost:8000` |

<br/>

## 📡 API Reference

MailMass exposes a REST API with interactive documentation auto-generated by FastAPI:

<div align="center">

| Docs | URL |
|---|---|
| 📘 Swagger UI | `http://localhost:8000/docs` |
| 📗 ReDoc | `http://localhost:8000/redoc` |

</div>

### Key Endpoint Groups

| Resource | Description |
|---|---|
| 🔐 **Auth** | Signup, login, token refresh, logout |
| 👥 **Contacts** | CRUD, search/filter, CSV import/export |
| 🧩 **Templates** | CRUD, HTML preview rendering |
| 🚀 **Campaigns** | CRUD, dispatch, status, analytics |
| 📊 **Dashboard** | Analytics dashboard aggregates |
| ⚙️ **Settings** | Account, security, and email configuration |

<br/>

## ☁️ Deployment

MailMass is designed for a split deployment topology:

| Component | Recommended Host |
|---|---|
| 🎨 Frontend (Next.js) | [**Vercel**](https://vercel.com) |
| ⚡ API (FastAPI) | [**Railway**](https://railway.app) |
| 🗄️ PostgreSQL | Railway managed Postgres |
| 📨 Redis | Railway managed Redis |
| 🔄 Celery Worker & Beat | Railway — separate service instances pointing to the same repo |

> [!IMPORTANT]
> All backend services (API + worker + beat) share the **same Docker image**, differentiated only by their start command in `docker-compose.yml` — keeping build artifacts consistent across environments.

<br/>

## 🤝 Contributing

Contributions are welcome and appreciated!

```bash
# 1. Fork the repository

# 2. Create a feature branch
git checkout -b feat/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature"

# 4. Push to your branch
git push origin feat/your-feature-name

# 5. Open a Pull Request 🎉
```

<div align="center">

---

**visit rash-2137.github.io for more of my work**

[Report Bug](../../issues) · [Request Feature](../../issues) · [Discussions](../../discussions)

</div>
