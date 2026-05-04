# AGENTS.md - Prescription App

## Commands

```bash
# Dev
npm run dev                 # Both services
npm run dev:backend        # :3001
npm run dev:frontend       # :3000

# Test
npm run test --workspace=packages/backend          # Unit tests
npm run test:e2e --workspace=packages/backend  # E2E tests
npm run test:cov --workspace=packages/backend # Coverage
npm run test --workspace=packages/frontend  # Vitest (basic only)

# Build
npm run build
```

## Architecture

- **Monorepo**: workspaces in `packages/backend` + `packages/frontend`
- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: Next.js 16 (App Router) + React 19 + TailwindCSS

## Credenciales (seed)

| Email | Password | Role |
|-------|----------|------|
| admin@test.com | password123 | admin |
| dr@test.com | password123 | doctor |
| patient@test.com | password123 | patient |

## Quirks

- Frontend tests with Vitest: React 19 has import issues with `react/jsx-dev-runtime`. Use type-level tests instead of component renders.
- E2E tests require DB connection (Neon PostgreSQL)
- Auth messages return as array sometimes: use `Array.isArray(msg) ? msg[0] : msg`