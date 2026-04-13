## PayNow Pulse (recommended product name)

**PayNow Pulse** is a full‑stack personal finance dashboard that helps users track monthly expenses, visualize spend breakdowns, and pay down balances via Stripe—backed by a Django REST API and a React UI. Background jobs (Celery) send payment confirmation emails (Mailgun).

### Why the rename?
“Kleeviyo Pay” reads like an internal/placeholder name. If you’re pushing to GitHub as a product-ready repo, **PayNow Pulse** communicates: payments + insights, without tying you to a brand that isn’t defined yet.

If you want alternatives:
- **PayNow Ledger** (expense tracking emphasis)
- **PayNow Insights** (analytics emphasis)
- **PayNow Paydown** (payments emphasis)

---

## Product overview

### What it does today
- **Auth**: register + login (basic; no JWT/session yet)
- **Expenses**: submit monthly category totals
- **Dashboard**: pie/bar/doughnut charts for category distribution + paid vs remaining
- **Payments**: Stripe PaymentIntent flow
- **Email**: payment confirmation email sent asynchronously via Celery + Mailgun

### What “Kleeviyo Pay” is right now
It’s simply the old name for the same app. There’s no separate “Kleeviyo” service in this repo—so we should brand it consistently as **PayNow Pulse**.

---

## Architecture

### High-level components
- **Frontend** (`frontend/`): React + Tailwind + Chart.js + Stripe Elements
- **Backend** (`backend/`): Django + Django REST Framework
- **Async worker** (`celery`): sends Mailgun email notifications
- **Broker** (RabbitMQ by default): backs Celery

### Data model (current)
- **`Expense`**: per-user, per-month expense totals across categories, with derived fields:
  - `total_expenses` = sum(categories)
  - `remaining_amount` = `total_expenses - amount_paid`

### API (current routes)
Backend routes (prefix is handled in `backend/users/urls.py`):
- `POST /api/register/`
- `POST /api/login/`
- `GET /api/expenses/?username=<username>`
- `POST /api/expenses/`
- `POST /api/payments/`
- `GET /payment-complete/` (Stripe redirect handler)

---

## Configuration (no hardcoded secrets)

This repo was updated to remove committed keys and move configuration to environment variables.

### Backend env (`backend/.env`)
Copy:
- `backend/.env.example` → `backend/.env`

Core variables:
- **`DJANGO_SECRET_KEY`**: required in production
- **`DJANGO_DEBUG`**: `true` in local dev, `false` in prod
- **`DJANGO_ALLOWED_HOSTS`**: comma-separated list
- **DB**: defaults to SQLite, but can be switched to MySQL via env
- **Stripe**: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`
- **Mailgun**: `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, `MAILGUN_FROM_EMAIL`
- **Celery**: `CELERY_BROKER_URL`, `CELERY_RESULT_BACKEND`
- **Frontend**: `FRONTEND_BASE_URL` used for redirect URLs

### Frontend env (`frontend/.env`)
Copy:
- `frontend/.env.example` → `frontend/.env`

Core variables:
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

## Suggested architectural upgrades (recommended before “real product”)

### Security & auth
- **Replace “dummy_token” login** with real auth:
  - Use **JWT (SimpleJWT)** or session auth
  - Return access/refresh tokens on login
  - Store tokens securely (httpOnly cookie preferred)
- **Stop using `username` query params** for access control. Use the authenticated user.
- **Lock down CORS**: switch from `CORS_ALLOW_ALL_ORIGINS=True` to an allowlist via env.

### Payments (Stripe)
- Use a **server-generated PaymentIntent** based on trusted amounts (do not trust client “amount”).
- Store a **Payment** record and Stripe IDs in DB for reconciliation.
- Make `payment_complete` robust:
  - Add metadata to PaymentIntent (ex: user id)
  - Prefer **webhooks** for final payment state instead of relying on redirects

### Email
- Use templated transactional emails (subject/body per event).
- Add retries/backoff for Mailgun failures; store delivery status.

### Settings & deployment
- Split settings into `settings/base.py`, `settings/dev.py`, `settings/prod.py`
- Add `DJANGO_DEBUG=false`, `SECURE_SSL_REDIRECT`, secure cookies, etc.
- Add Docker + docker-compose for a one-command dev stack (Django + React + RabbitMQ + DB)

---

## Repository hygiene (before pushing to GitHub)
- Do **not** commit `.env` files (only `.env.example`)
- Remove OS artifacts like `.DS_Store`
- Ensure `backend/.gitignore` and `frontend/.gitignore` cover secrets and build outputs

---

## License
Add a license file before open-sourcing (MIT / Apache-2.0 / proprietary).
