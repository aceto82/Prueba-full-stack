## Context

The backend has 24 passing unit tests across 5 suites (auth, prescriptions, admin, roles guard, app controller). The single e2e test file (`test/app.e2e-spec.ts`) covers only auth flows (login, profile, refresh, logout). No e2e tests exist for the prescriptions or admin endpoints. The frontend has zero test infrastructure — no Jest config, no Testing Library, no test files. The project has no README.

The backend e2e tests boot the real NestJS app (with `AppModule`) against a live PostgreSQL database seeded with `npm run db:seed` test data (1 doctor, 1 patient, 5 prescriptions).

## Goals / Non-Goals

**Goals:**
- Add e2e tests for prescriptions API and admin metrics, using the existing test harness and seeded DB
- Set up Jest + Testing Library for the Next.js 16 frontend with minimal config
- Write unit tests for `AuthGuard` and `Navbar` — the two components with the most critical runtime behavior
- Write a root `README.md` sufficient for a new developer to run the full stack

**Non-Goals:**
- 100% test coverage for any layer
- Testing every UI page (scope: two components only)
- Frontend integration tests hitting the real API
- Swagger/OpenAPI generation (deferred to Plus)
- CI pipeline changes

## Decisions

### 1. Backend e2e: share the seeded DB state, don't reset between test files

**Decision**: The prescriptions and admin e2e test file will log in as the seeded `dr@test.com` / `patient@test.com` users in `beforeAll` and operate on seeded prescriptions. It will **not** call `prisma migrate reset` between runs.
- **Alternative considered**: Reset + re-seed before each e2e suite — more isolated but adds ~5s per run and requires the seed script to be idempotent with the test data in a known state.
- **Reason**: The seeded data is stable (5 fixed prescriptions). Tests that mutate state (consume, create) generate their own records and don't touch the seeded ones. Acceptable for a local dev MVP.

### 2. Backend e2e: create a new test file rather than extending app.e2e-spec.ts

**Decision**: Write `test/prescriptions.e2e-spec.ts` (covering prescriptions + admin) as a separate file from the existing `test/app.e2e-spec.ts`.
- **Reason**: Keeps each file focused and independent. The existing auth e2e is self-contained; prescriptions needs its own login token lifecycle.

### 3. Frontend test runner: Jest via `next/jest` transform

**Decision**: Use Jest with the official `next/jest` config helper (`createJestConfig` from `next/jest`). This handles SWC transforms, module aliases, and `'use client'` directives automatically for Next.js 16.
- **Alternative considered**: Vitest — simpler config, ESM-native, but `@testing-library/react` works equally well with Jest. The backend already uses Jest; keeping the same runner reduces cognitive overhead.
- **Alternative considered**: Direct `ts-jest` — more manual config, no Next.js-specific handling. Rejected.

### 4. Frontend tests: wrap with real providers, don't mock Context modules

**Decision**: Create lightweight test wrappers (`renderWithAuth`, `renderWithAuthAndToast`) that instantiate real `AuthProvider`/`ToastProvider` (or stub versions with preset state) rather than mocking the context with `jest.mock`.
- **Alternative considered**: `jest.mock('../context/AuthContext')` — simpler but breaks if context internals change. Real provider wrapping tests the actual integration.
- **Reason**: `AuthGuard` and `Navbar` both depend on `useAuth()`; injecting a stub `AuthProvider` with controlled state is the most reliable approach.

### 5. Frontend: mock `next/navigation` router

**Decision**: Mock `next/navigation` globally in `jest.setup.ts` using `jest.mock('next/navigation', ...)` to provide stub `useRouter` and `usePathname` implementations.
- **Reason**: `AuthGuard` calls `router.replace()` on auth state changes. The JSDOM environment doesn't have a real router; without the mock the component throws.

### 6. README: single root file, not per-package

**Decision**: One `README.md` at the repo root covering the full stack. Individual package READMEs are not needed — the monorepo is small enough.
- **Reason**: Simpler onboarding UX; CLAUDE.md already serves as the developer reference.

## Risks / Trade-offs

- [Risk] E2e tests depend on seeded data being present → [Mitigation] Document `npm run db:seed` as a prerequisite in the test section of the README and in test file comments.
- [Risk] Frontend tests may break on Next.js minor upgrades that change internal module paths → [Mitigation] Use only public APIs (`next/navigation`, `next/link`) in tests; avoid importing from `next/dist/`.
- [Risk] `next/jest` config may not support all Turbopack-specific features → [Mitigation] Tests run via standard Jest (not Turbopack), which is the supported path for unit testing per Next.js docs.
- [Risk] `AuthGuard` redirect tests depend on `isLoading` timing → [Mitigation] Control `isLoading` synchronously through the stub provider; no async timers needed.
