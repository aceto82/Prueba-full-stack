## Why

The application has a complete backend and frontend but lacks e2e test coverage for the prescription and admin flows, has no frontend test infrastructure, and has no README — making the project difficult to onboard to or verify in CI. Fase 6 closes those gaps before the project is considered done.

## What Changes

- Add e2e tests covering the prescriptions API (create, list, detail, consume, PDF) and the admin metrics endpoint
- Set up Jest + Testing Library for the Next.js frontend and add unit tests for the two most critical components: `AuthGuard` and `Navbar`
- Write a root `README.md` with setup, environment variables, seed data, and `npm run` command reference

## Capabilities

### New Capabilities

- `backend-e2e`: Integration tests hitting the real NestJS app + seeded DB for prescriptions (CRUD + consume + PDF download) and admin metrics (with and without date filters)
- `frontend-tests`: Jest + `@testing-library/react` setup for Next.js 16; unit tests for `AuthGuard` (redirect behavior) and `Navbar` (renders user info, calls logout)
- `project-readme`: Root `README.md` covering prerequisites, env-var setup, seed data table, and all `npm run` commands (dev, build, test, db)

### Modified Capabilities

<!-- No existing backend or frontend specs change requirements -->

## Impact

- **Backend**: `test/` directory — new e2e spec file for prescriptions and admin
- **Frontend**: new `jest.config.ts`, `jest.setup.ts`, `__tests__/` directory with two test files; new devDependencies (`jest`, `@testing-library/react`, `@testing-library/jest-dom`, `jest-environment-jsdom`, `ts-jest`)
- **Root**: new `README.md`
- **APIs consumed**: `/prescriptions/*`, `/admin/metrics`, `/me/prescriptions`
- **No breaking changes**
