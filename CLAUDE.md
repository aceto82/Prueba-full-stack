# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A prescription management app with a NestJS backend and Next.js frontend, structured as an npm workspace monorepo under `packages/`.

## Commands

All commands run from the repo root unless noted.

### Development
```bash
npm run dev              # Start both backend (port 3000) and frontend concurrently
npm run dev:backend      # Backend only (NestJS watch mode)
npm run dev:frontend     # Frontend only (Next.js dev server)
```

### Build
```bash
npm run build            # Build backend then frontend
```

### Testing (backend only)
```bash
npm run test             # Run all unit tests
# From packages/backend:
npm run test:watch       # Watch mode
npm run test:cov         # Coverage
npm run test:e2e         # E2E tests (test/app.e2e-spec.ts)
npm run test -- --testPathPattern=auth  # Run a single test file
```

### Linting & Formatting (from packages/backend)
```bash
npm run lint             # ESLint with auto-fix
npm run format           # Prettier
```

### Database
```bash
# From packages/backend:
npx prisma migrate dev   # Apply migrations
npx prisma generate      # Regenerate Prisma client after schema changes
npm run db:seed          # Seed test data (ts-node prisma/seed.ts)
npm run db:reset         # Reset DB and re-seed (prisma migrate reset --force)
npx prisma studio        # Visual DB browser
```

## Environment Variables

**`packages/backend/.env`**
```
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
APP_PORT=3000
APP_ORIGIN=http://localhost:3001
```

**`packages/frontend/.env.local`**
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Architecture

### Monorepo structure
```
packages/
  backend/   @prescription/backend  — NestJS API
  frontend/  @prescription/frontend — Next.js 16 app
```

### Backend (NestJS)

**Global setup** (`main.ts`): Helmet, CORS, `ValidationPipe` (whitelist + transform), global `HttpExceptionFilter`.

**Global guards** (registered via `APP_GUARD` in `AppModule`): `JwtAuthGuard` runs on every route. `RolesGuard` enforces role-based access. Mark public endpoints with `@Public()` to bypass JWT.

**Modules:**
- `PrismaModule` — singleton `PrismaService` wrapping `PrismaClient` via the `@prisma/adapter-pg` driver (uses a `pg.Pool`).
- `UsersModule` — `UsersService` for user lookup and refresh token hash management.
- `AuthModule` — JWT access + refresh token strategy. Access tokens expire in 15 minutes, refresh tokens in 7 days. Refresh tokens are stored as bcrypt hashes in `User.refreshTokenHash`. The `JwtRefreshStrategy` extracts the token from the request body (`refreshToken` field).
- `ThrottlerModule` — global rate limit 100 req/60s; auth endpoints further limited to 10 req/60s.

**Auth flow:**
1. `POST /auth/login` — Local strategy validates credentials, returns `{ accessToken, refreshToken, user }`.
2. `POST /auth/refresh` — JwtRefreshGuard validates refresh token from body, issues new pair.
3. `POST /auth/logout` — Clears stored refresh token hash.
4. `GET /auth/profile` — Returns JWT payload (protected, no `@Public()`).

**Roles:** `Role` enum from Prisma — `admin | doctor | patient`. Registration is limited to `doctor | patient` (via `RegisterDto`). Use `@Roles(Role.doctor)` + `RolesGuard` for endpoint-level RBAC.

**Error responses** are normalized by `HttpExceptionFilter` to `{ message, code, details? }`.

### Database (Prisma + PostgreSQL)

Key relationships:
- `User` has an optional `Doctor` or `Patient` profile (1:1), created inline on registration.
- `Prescription` belongs to both a `Patient` and a `Doctor` (as `author`).
- `PrescriptionItem` cascades on `Prescription` delete.
- `PrescriptionStatus`: `pending | consumed`.

### Frontend (Next.js 16)

**Important:** This is Next.js 16, which may have breaking changes vs. earlier versions. Before writing Next.js code, check `node_modules/next/dist/docs/` for current API conventions (as noted in `packages/frontend/AGENTS.md`).

Currently only the default app scaffold exists. Planned pages (from `fases.md`):
- `/login`, `/doctor/prescriptions`, `/patient/prescriptions`, `/admin`

### Seed data (test credentials)
| Email | Role | Password |
|-------|------|----------|
| admin@test.com | admin | password123 |
| dr@test.com | doctor | password123 |
| patient@test.com | patient | password123 |
