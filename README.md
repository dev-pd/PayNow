## PayNow Pulse

**PayNow Pulse** is a full‑stack expense analytics + payments dashboard. Users submit monthly categorized expenses, view interactive charts, and pay down balances via Stripe. The backend is a Django REST API; the frontend is a React UI. Transactional emails are sent asynchronously via Celery (RabbitMQ) and Mailgun.

---

## Features

- **Auth**: register + login
- **Expense tracking**: monthly category totals per user
- **Analytics**: pie/bar/doughnut charts (category distribution + paid vs remaining)
- **Payments**: Stripe PaymentIntent flow
- **Async email**: Celery task sends payment confirmation via Mailgun

---

## Tech stack

- **Frontend**: React, Tailwind CSS, Axios, Chart.js, Stripe Elements
- **Backend**: Django, Django REST Framework
- **Async**: Celery + RabbitMQ
- **Email**: Mailgun
- **Database**: SQLite (default), MySQL (optional via env)

---

## Architecture (high level)

### High-level components
- **Frontend** (`frontend/`): React + Tailwind + Chart.js + Stripe Elements
- **Backend** (`backend/`): Django + Django REST Framework
- **Async worker** (`celery`): sends Mailgun email notifications
- **Broker** (RabbitMQ by default): backs Celery

### Data model
- **`Expense`**: per-user, per-month expense totals across categories, with derived fields:
  - `total_expenses` = sum(categories)
  - `remaining_amount` = `total_expenses - amount_paid`

### API routes
- `POST /api/register/`
- `POST /api/login/`
- `GET /api/expenses/?username=<username>`
- `POST /api/expenses/`
- `POST /api/payments/`
- `GET /payment-complete/` (Stripe redirect handler)

---

## Configuration

### Backend env (`backend/.env`)
Copy `backend/.env.example` → `backend/.env`.

Key variables:
- **`DJANGO_SECRET_KEY`**: required in production
- **`DJANGO_DEBUG`**: `true` in local dev, `false` in prod
- **`DJANGO_ALLOWED_HOSTS`**: comma-separated list
- **`DJANGO_LOG_LEVEL`**: logging level (ex: `INFO`)
- **DB**: defaults to SQLite, but can be switched to MySQL via env
- **Stripe**: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`
- **Mailgun**: `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, `MAILGUN_FROM_EMAIL`
- **Celery**: `CELERY_BROKER_URL`, `CELERY_RESULT_BACKEND`
- **Frontend**: `FRONTEND_BASE_URL` used for redirect URLs

### Frontend env (`frontend/.env`)
Copy `frontend/.env.example` → `frontend/.env`.

Key variables:
- **`REACT_APP_API_BASE_URL`**: where React calls the Django API (ex: `http://127.0.0.1:8000`)
- **`REACT_APP_STRIPE_PUBLISHABLE_KEY`**: Stripe publishable key for Stripe Elements

---

## Local development

### Prerequisites
- Python 3.10+ recommended
- Node.js 18+ recommended
- (Optional) RabbitMQ if you want Celery running locally

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

### Celery worker (optional but recommended)

```bash
cd backend
celery -A paynow worker --loglevel=info
```

---

## Docker (recommended)

This repo includes `docker-compose.yml` to run the full stack:
- **frontend** (React dev server) on `http://localhost:3000`
- **backend** (Django + Gunicorn) on `http://localhost:8000`
- **rabbitmq** (Celery broker) on `http://localhost:15672` (management UI)
- **celery** worker for background emails

### First-time setup

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Set at minimum:
- `backend/.env`: `DJANGO_SECRET_KEY`, `STRIPE_SECRET_KEY` (and Mailgun vars if you want emails)
- `frontend/.env`: `REACT_APP_STRIPE_PUBLISHABLE_KEY`

### Run

```bash
docker compose up --build
# or (older installs)
docker-compose up --build
```

### Stop

```bash
docker compose down
# or (older installs)
docker-compose down
```

---

## License
Add a license file before open-sourcing (MIT / Apache-2.0 / proprietary).
