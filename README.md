# Prescription Management App

A full-stack prescription management system for doctors, patients, and administrators. Built with NestJS (backend REST API) and Next.js 16 (frontend), backed by PostgreSQL via Prisma.

## Prerequisites

- **Node.js** ≥ 20
- **PostgreSQL** running locally or a remote connection string (e.g. Neon)
- **npm** ≥ 10 (workspaces support required)

## Environment Variables

### `packages/backend/.env`

```env
DATABASE_URL=postgresql://user:password@localhost:5432/prescriptions
JWT_ACCESS_SECRET=change-me-access
JWT_REFRESH_SECRET=change-me-refresh
APP_PORT=3001
APP_ORIGIN=http://localhost:3000
```

### `packages/frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Database Setup

```bash
# Apply migrations
cd packages/backend && npx prisma migrate dev

# Seed test data (creates the three users below)
npm run db:seed -w @prescription/backend

# Reset and re-seed (destructive)
npm run db:reset -w @prescription/backend
```

## Seed / Test Credentials

| Email | Role | Password |
|---|---|---|
| admin@test.com | admin | password123 |
| dr@test.com | doctor | password123 |
| patient@test.com | patient | password123 |

## Commands

All commands run from the **repository root** unless noted.

| Command | Description |
|---|---|
| `npm run dev` | Start backend (port 3001) and frontend (port 3000) concurrently |
| `npm run dev:backend` | Backend only in watch mode |
| `npm run dev:frontend` | Frontend only |
| `npm run build` | Build backend then frontend |
| `npm run test` | Run backend unit tests |
| `npm run test:e2e -w @prescription/backend` | Run backend e2e tests (requires seeded DB) |
| `npm run test -w @prescription/frontend` | Run frontend component tests |

## Architecture

```
packages/
  backend/   — NestJS API (port 3000)
  frontend/  — Next.js 16 app (port 3001)
```

### Key backend endpoints

| Method | Path | Role |
|---|---|---|
| POST | `/auth/login` | Public |
| POST | `/auth/refresh` | Public |
| GET | `/prescriptions` | Doctor |
| POST | `/prescriptions` | Doctor |
| GET | `/prescriptions/:id/pdf` | Patient, Admin |
| PUT | `/prescriptions/:id/consume` | Patient |
| GET | `/me/prescriptions` | Patient |
| GET | `/admin/metrics` | Admin |
