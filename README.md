📬 MailMass
A modern, full-stack Email Marketing Platform for managing contacts, crafting templates, and orchestrating data-driven campaigns at scale.

License: MIT
Next.jsFastAPIPostgreSQLCeleryRedisDocker
PRs Welcome

📖 Overview
MailMass is a production-grade, open-source Email Marketing Platform built for teams that need reliable contact management, rich template authoring, and scalable campaign delivery — without the overhead of proprietary SaaS pricing tiers.

The platform is architected as a decoupled system: a Next.js frontend consumes a FastAPI backend over a REST API. All send-heavy and long-running operations (bulk email dispatch, analytics aggregation, scheduled sending) are offloaded to Celery workers and Celery Beat backed by Redis, keeping the API incredibly fast and responsive under load.

Built with a clean separation of concerns, strict typing end-to-end, and a deployment story that works equally well on a laptop (docker-compose up) or in production (Railway + Vercel).

[SCREENSHOTS HERE]

✨ Features
🔐 Authentication
Secure signup/login flows with JWT access & refresh token handling
Password hashing via passlib + bcrypt
Axios HTTP interceptors for automatic token attachment & refresh
Protected routes and middleware-based route guarding in Next.js
📊 Dashboard
At-a-glance analytics: total campaigns, emails sent, open rates, click rates
Real-time-friendly widgets with optimized loading skeletons
👥 Contacts Management
Full CRUD with server-side pagination
Advanced search & filtering
Bulk CSV Import with validation and error reporting
CSV Export for segment-based downloads
🧩 Templates Management
Full CRUD for reusable email templates
Live HTML preview pane with sanitized rendering
Variable/placeholder support for personalization
🚀 Campaigns Management
Campaign builder with recipient list mapping
Non-blocking send execution via Celery background tasks
Open & click tracking with pixel/link instrumentation
Per-campaign analytics breakdown
⚙️ Settings
Modular settings surface: Account, Security, Email Configuration, UI Preferences
UI preferences persisted client-side via custom localStorage hooks
SMTP/provider configuration for outbound email delivery
🛠️ Tech Stack
Layer	Technology
Frontend Framework	Next.js 16+ (App Router), React 19, TypeScript
Styling / UI	TailwindCSS v4, Base UI, Shadcn UI, Lucide React
HTTP Client	Axios
Backend Framework	FastAPI (Python 3.12+)
Database	PostgreSQL
ORM / Migrations	SQLAlchemy, Alembic
Validation	Pydantic
Async Task Queue	Celery & Celery Beat (Scheduler)
Message Broker	Redis
Authentication	JWT (python-jose), passlib, bcrypt
Containerization	Docker, Docker Compose
Deployment	Railway (API / Postgres / Redis / Workers), Vercel (Frontend)
[SYSTEM DESIGN HERE]

🏗️ Architecture
MailMass follows a decoupled, service-oriented architecture. The frontend never talks directly to the database, Redis, or SMTP providers — all of that is mediated by the FastAPI service layer, which in turn delegates long-running work to Celery workers.

Request flow at a glance:

The Next.js client sends authenticated REST requests to the FastAPI backend via Axios.
FastAPI validates payloads with Pydantic, applies business logic, and persists state through SQLAlchemy into PostgreSQL.
For heavy or slow operations (e.g., dispatching a campaign to thousands of contacts), the API enqueues a job onto Redis, and immediately returns a 202 Accepted-style response so the UI stays responsive.
One or more Celery workers consume the queue, perform the work (sending emails, updating send status, recording opens/clicks), and write results back to PostgreSQL.
Celery Beat runs alongside the workers to trigger scheduled, recurring jobs.
[ARCHITECTURAL FLOW CHART HERE]

Repository Structure


mailmass/
├── frontend/                # Next.js 16 frontend (App Router)
│   ├── app/                 # Next.js App routes
│   ├── components/          # React components (UI & Shared)
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Axios instance, interceptors, utils
│   └── types/               # TypeScript type definitions
│
├── app/                     # FastAPI backend
│   ├── api/                 # REST endpoints
│   ├── core/                # Config, security, dependencies
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic validation schemas
│   ├── services/            # Core business logic
│   ├── celery_worker.py     # Celery app initialization
│   └── main.py              # FastAPI entrypoint
│
├── alembic/                 # Database migration scripts
├── docker-compose.yml       # Full stack local orchestration
├── requirements.txt         # Python dependencies
└── README.md
🚀 Getting Started
Prerequisites
Make sure the following are installed locally:

Node.js ≥ 20.x and npm
Python ≥ 3.12
PostgreSQL ≥ 15
Redis ≥ 7
Docker & Docker Compose (recommended for local parity)
1. Clone the Repository
bash


git clone https://github.com/your-org/mailmass.git
cd mailmass
2. Environment Variables
Create the .env files in their respective directories:

Backend (.env at root):

bash


cp .env.example .env
Frontend (frontend/.env.local):

bash


cp frontend/.env.example frontend/.env.local
See the 
Environment Variables
 section below for a full reference.

3. Run with Docker Compose (Recommended)
This spins up the API, PostgreSQL, Redis, Celery Worker, and Celery Beat together:

bash


docker-compose up --build
(Note: To run the frontend, open a new terminal, cd frontend, and run npm run dev)

4. Manual Setup (Without Docker)
Backend (FastAPI):

bash


# Create and activate virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
# Run database migrations
alembic upgrade head
# Start the API server
uvicorn app.main:app --reload --port 8000
Celery Worker & Scheduler (in separate terminals):

bash


source venv/bin/activate
celery -A app.celery_worker.celery_app worker --loglevel=info
bash


source venv/bin/activate
celery -A app.celery_worker.celery_app beat --loglevel=info
Frontend (Next.js):

bash


cd frontend
npm install
npm run dev
Visit http://localhost:3000 to access the application.

🔑 Environment Variables
Backend (.env in root folder)
Variable	Description	Example
DATABASE_URL	PostgreSQL connection string	postgresql://user:pass@localhost:5432/mailmass
REDIS_URL	Redis connection string for Celery	redis://localhost:6379/0
SECRET_KEY	Secret used to sign JWT tokens	super-secret-key
ALGORITHM	Signing algorithm for JWT	HS256
ACCESS_TOKEN_EXPIRE_MINUTES	Access token TTL	30
SMTP_HOST	Outbound email server host	smtp.sendgrid.net
SMTP_PORT	Outbound email server port	587
SMTP_USER	SMTP auth username	apikey
SMTP_PASSWORD	SMTP auth password/API key	your-smtp-key
Frontend (frontend/.env.local)
Variable	Description	Example
NEXT_PUBLIC_API_URL	Base URL for the FastAPI backend	http://localhost:8000
📡 API Reference
MailMass exposes a REST API. Full interactive documentation (Swagger UI & ReDoc) is auto-generated by FastAPI:

Swagger UI → http://localhost:8000/docs
ReDoc → http://localhost:8000/redoc
Key Endpoint Groups
Resource	Description
Auth	Signup, login, token refresh, logout
Contacts	CRUD, search/filter, CSV import/export
Templates	CRUD, HTML preview rendering
Campaigns	CRUD, dispatch, status, analytics
Dashboard	Analytics dashboard aggregates
Settings	Account, security, and email configuration
☁️ Deployment
MailMass is designed for a split deployment topology:

Component	Recommended Host
Frontend (Next.js)	Vercel
API (FastAPI)	Railway
PostgreSQL	Railway managed Postgres
Redis	Railway managed Redis
Celery Worker & Beat	Railway (Separate service instances pointing to the same repo)
All backend services (API + worker + beat) share the same Docker image, differentiated only by their start command in docker-compose.yml — keeping build artifacts consistent across environments.

🤝 Contributing
Contributions are welcome and appreciated! To get started:

Fork the repository
Create a feature branch: git checkout -b feat/your-feature-name
Commit your changes: git commit -m "feat: add your feature"
Push to your branch: git push origin feat/your-feature-name
Open a Pull Request
