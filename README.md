# MailMass

MailMass is a production-style Email Marketing Platform inspired by tools like Mailchimp.

It allows users to manage contacts, create email templates, launch campaigns, schedule email delivery, track email opens and clicks, and analyze campaign performance.

## Features

### Authentication

* User Signup
* User Login
* JWT Authentication
* Protected Routes

### Contact Management

* Create Contacts
* Update Contacts
* Delete Contacts
* Contact Subscription Status
* CSV Import
* CSV Export

### Template Management

* Create Templates
* Update Templates
* Delete Templates

### Campaign Management

* Create Campaigns
* Assign Recipients
* Send Campaigns
* Schedule Campaigns

### Email Tracking

* Open Tracking Pixel
* Click Tracking
* Unsubscribe Links

### Analytics

* Campaign Statistics
* Open Rate Tracking
* Click Rate Tracking
* Dashboard Metrics

### Production Features

* Dockerized Deployment
* PostgreSQL Database
* Redis Integration
* Celery Background Tasks
* Celery Beat Scheduling
* Alembic Migrations
* Health Check Endpoints
* Rate Limiting
* Email Validation

---

## Tech Stack

* FastAPI
* PostgreSQL
* SQLAlchemy
* Redis
* Celery
* Alembic
* JWT Authentication
* Docker
* Docker Compose

---

## Architecture

Client
↓
FastAPI API
↓
PostgreSQL

FastAPI
↓
Redis
↓
Celery Worker

Celery Beat
↓
Scheduled Campaigns

---

## Health Endpoints

GET /health

GET /health/db

GET /health/redis

GET /health/full

---

## Running Locally

```bash
docker compose up --build
```

API:

http://localhost:8000

Swagger Docs:

http://localhost:8000/docs

## Future Improvements

* Contact Segmentation
* Campaign Duplication
* Bounce Handling
* Frontend Dashboard
* CI/CD Pipeline
* VPS Deployment
* Nginx Reverse Proxy
* HTTPS Support
