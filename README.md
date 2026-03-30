# PropSpace AI

PropSpace AI is a full-stack real estate intelligence app built with Next.js 14, Tailwind CSS, Zustand, Framer Motion, FastAPI, and PostgreSQL with PostGIS-ready models.

## What is included

- Next.js 14 App Router frontend with dark and light mode, glassmorphism, charts, map, search, dashboard, alerts, portfolio, and property detail flows.
- FastAPI backend with auth, property, dashboard, valuation, EMI calculator, PDF report, portfolio, and alerts endpoints.
- A seeded catalog of 30 realistic properties across Tier 1, Tier 2, and Tier 3 Indian cities with house, villa, and apartment sample galleries.
- Docker Compose setup for frontend, backend, and PostGIS.

## Local environment

Copy `.env.example` to `.env` and adjust values if needed.

## Frontend commands

```bash
npm install
npm run dev
```

## Backend commands

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Docker Compose

```bash
docker compose up --build
```

Frontend: `http://localhost:3000`

Backend: `http://localhost:8000/api/v1`

## API highlights

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `GET /api/v1/properties`
- `GET /api/v1/properties/featured`
- `GET /api/v1/properties/{property_id}`
- `GET /api/v1/properties/{property_id}/emi`
- `GET /api/v1/dashboard/overview`
- `GET /api/v1/portfolio`
- `GET /api/v1/alerts`
- `GET /api/v1/ml/valuation/{property_id}`
- `GET /api/v1/reports/{property_id}/pdf`

## Notes

- The frontend gracefully falls back to the local seeded dataset if the backend is unavailable.
- The backend bootstrap attempts to create the PostGIS extension and seed demo records when a database is reachable.
