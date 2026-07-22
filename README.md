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
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)

<br/>


</div>

<br/>

<p align="center">
  <a href="https://mailmass-alpha.vercel.app"><strong>🌐 Live Demo</strong></a> •
  <a href="https://mailmass.onrender.com/docs"><strong>📘 API Docs</strong></a> •
  <a href="https://github.com/RASH-2137/mailmass/issues"><strong>🐞 Report Bug</strong></a> •
  <a href="https://github.com/RASH-2137/mailmass/issues"><strong>💡 Request Feature</strong></a>
</p>

> **Note:** Screenshots at the bottom

## 🚀 Live Demo

Experience MailMass in action.

| Service | Link |
|---------|------|
| 🌐 Frontend | **https://mailmass-alpha.vercel.app** |
| ⚡ Backend API | **https://mailmass.onrender.com** |
| 📘 Swagger UI | **https://mailmass.onrender.com/docs** |
| 📗 ReDoc | **https://mailmass.onrender.com/redoc** |

> **Note:** The backend may take a few seconds to respond if hosted on a free tier due to cold starts.

## 📖 Overview

**MailMass** is a production-grade, open-source Email Marketing Platform built for teams that need reliable contact management, rich template authoring, and scalable campaign delivery — without the overhead of proprietary SaaS pricing tiers.

The platform is architected as a **decoupled system**: a fully responsive **Next.js** frontend consumes a **FastAPI** backend over a REST API. All send-heavy and long-running operations — bulk email dispatch, analytics aggregation, scheduled sending — are offloaded to **Celery** workers and a **Celery Beat** scheduler backed by **Redis**, keeping the API fast and responsive under load.

> [!TIP]
> Built with clean separation of concerns, strict typing end-to-end, and a deployment story that works equally well on a laptop (`docker-compose up`) or in production (Render + Vercel).

<br/>

## ⭐ Highlights

- 🚀 Production-grade full-stack SaaS architecture
- 🔐 JWT Authentication with protected routes
- 📧 Email Campaign Management & Scheduling
- 📊 Real-time Analytics Dashboard
- 👥 CSV Contact Import & Export
- ⚡ Background processing with Celery & Redis
- 📱 Fully responsive mobile-first UI
- 🐳 Docker-ready development environment
- ☁️ Deployable to Railway/Render + Vercel

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [System Architecture](#️-system-architecture)
- [Architecture](#️-architecture)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Deployment](#️-deployment)
<br/>

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🔐 Authentication
Secure signup/login with **JWT** access & refresh token handling, password hashing via `passlib` + `bcrypt`, Axios interceptors for automatic token refresh, and middleware-guarded protected routes.

### 📊 Dashboard
At-a-glance analytics — total campaigns, emails sent, open rates, click rates — with skeleton loaders and empty/error states throughout.

### 👥 Contacts Management
Full CRUD with server-side pagination, advanced search & filtering, bulk **CSV import** with validation, and segment-based **CSV export**.

### 🧩 Templates Management
Full CRUD for reusable email templates with a live, sanitized **HTML preview** pane and variable/placeholder support for personalization.

</td>
<td width="50%" valign="top">

### 🚀 Campaigns & Scheduling
Campaign builder with recipient list mapping, **scheduled sends** via Celery Beat, and non-blocking dispatch via Celery background tasks.

### 📈 Analytics & Tracking
Pixel-based **open tracking** and redirect-based **click tracking**, aggregated asynchronously into per-campaign and account-wide analytics.

### ⚙️ Settings
Modular settings — **Account**, **Security**, **Email Configuration**, **UI Preferences** — persisted client-side via custom `localStorage` hooks.

### 📱 Responsive, Production-Ready UI
Mobile-first layout with a desktop sidebar and a mobile slide-over drawer (shadcn `Sheet`), toast notifications, and a reusable shadcn/ui component library.

</td>
</tr>
</table>

<br/>

## 📱 Responsive Experience

MailMass is fully responsive and optimized for desktop, tablet, and mobile devices.

### Desktop

- Persistent navigation sidebar
- Spacious dashboard layout
- Optimized workspace for power users

### Mobile

- Hamburger navigation
- Slide-over navigation drawer using shadcn/ui Sheet
- Responsive forms and cards
- Responsive tables with internal horizontal scrolling
- Zero horizontal page scrolling
- Adaptive spacing for all screen sizes

## 🛠️ Tech Stack

<table>
<tr><th align="left">Layer</th><th align="left">Technology</th></tr>
<tr><td>🎨 Frontend Framework</td><td>Next.js 16+ (App Router), React 19, TypeScript</td></tr>
<tr><td>💅 Styling / UI</td><td>TailwindCSS v4, shadcn/ui, Lucide React</td></tr>
<tr><td>🔌 Data / Forms</td><td>React Query, Axios, React Hook Form, Zod</td></tr>
<tr><td>⚡ Backend Framework</td><td>FastAPI (Python 3.12+)</td></tr>
<tr><td>🗄️ Database</td><td>PostgreSQL</td></tr>
<tr><td>🔗 ORM / Migrations</td><td>SQLAlchemy, Alembic</td></tr>
<tr><td>✅ Validation</td><td>Pydantic</td></tr>
<tr><td>🔄 Async Task Queue</td><td>Celery &amp; Celery Beat (Scheduler)</td></tr>
<tr><td>📨 Message Broker</td><td>Redis</td></tr>
<tr><td>🔑 Authentication</td><td>JWT (<code>python-jose</code>), <code>passlib</code>, <code>bcrypt</code></td></tr>
<tr><td>📦 Containerization</td><td>Docker, Docker Compose</td></tr>
<tr><td>☁️ Deployment</td><td>Railway / Render (API, Postgres, Redis, Workers), Vercel (Frontend)</td></tr>
</table>

<br/>

<div align="center">

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
| **5** | **Celery Beat** runs alongside the workers to trigger scheduled, recurring jobs, such as scheduled campaign sends. |

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
git clone https://github.com/RASH-2137/mailmass.git
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
| 🚀 **Campaigns** | CRUD, dispatch, scheduling, status, analytics |
| 📊 **Dashboard** | Analytics dashboard aggregates |
| ⚙️ **Settings** | Account, security, and email configuration |

<br/>

## ☁️ Deployment

MailMass is designed for a split deployment topology:

| Component | Recommended Host |
|---|---|
| 🎨 Frontend (Next.js) | [**Vercel**](https://vercel.com) |
| ⚡ API (FastAPI) | [**Render**](https://render.com) |
| 🗄️ PostgreSQL | Neon managed Postgres |
| 📨 Redis | Upstash managed Redis |
| 🔄 Celery Worker & Beat | Render (production) or locally for development |

> [!IMPORTANT]
> All backend services (API + worker + beat) share the **same Docker image**, differentiated only by their start command in `docker-compose.yml` — keeping build artifacts consistent across environments.

<br/>

## 📸 Screenshots

<table>
<tr><th align="left">Screen</th><th align="left">Preview</th></tr>
<tr><td>Dashboard</td><td><code><img width="387" height="170" alt="Screenshot 2026-07-22 230257" src="https://github.com/user-attachments/assets/d5fec0c0-1bce-4a4b-b77a-77496e861c7f" /> <img width="100" height="200" alt="image" src="https://github.com/user-attachments/assets/6869c35f-b384-48d4-8679-13d72fd10bf9" />
</code></td></tr>
 
<tr><td>Contacts</td><td><code><img width="387" height="170" alt="image" src="https://github.com/user-attachments/assets/9df41580-8857-49cd-b90a-825424a0d8ea" /> <img width="100" height="200" alt="image" src="https://github.com/user-attachments/assets/741014a3-00b5-4d64-a7e2-27ba5cb34784" />
</code></td></tr>

<tr><td>Templates</td><td><code><img width="387" height="170" alt="Screenshot 2026-07-22 230322" src="https://github.com/user-attachments/assets/5786b140-ceb8-4aaf-8d32-1a428561b91d" /> <img width="100" height="200" alt="WhatsApp Image 2026-07-22 at 23 32 24" src="https://github.com/user-attachments/assets/d56bd8e4-2506-4dd1-81f2-1ceed88fae6c" />
</code></td></tr>

<tr><td>Analytics</td><td><code> <img width="387" height="170" alt="Screenshot 2026-07-22 230336" src="https://github.com/user-attachments/assets/f973822d-5acb-4d8d-8f62-a2a8969ce483" /> <img width="100" height="200" alt="image" src="https://github.com/user-attachments/assets/9f5cea39-1b25-4d33-845d-939ab1f27c8e" />
</code></td></tr>

<tr><td>Settings</td><td><code><img width="387" height="170" alt="Screenshot 2026-07-22 230353" src="https://github.com/user-attachments/assets/56e5c75a-1957-40a9-8a56-d0b27bb29682" /> <img width="100" height="200" alt="image" src="https://github.com/user-attachments/assets/0f0e4cc2-483b-48b6-afd2-85e3cb30052c" />

</code></td></tr>
<tr><td>Authentication</td><td><code><img width="387" height="170" alt="image" src="https://github.com/user-attachments/assets/6cad8873-e56a-45c4-a4e4-3a16b6fece21" /> <img width="100" height="200" alt="image" src="https://github.com/user-attachments/assets/b536e7f3-2621-4d00-84f3-8ecb348a16e0" />
</code></td></tr>

</table>

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

<br/>
<div align="center">

---

**👨‍💻 Rahul Sharma**

Portfolio: https://rash-2137.github.io

GitHub: https://github.com/RASH-2137

[Report Bug](../../issues) · [Request Feature](../../issues) · [Discussions](../../discussions)

</div>
