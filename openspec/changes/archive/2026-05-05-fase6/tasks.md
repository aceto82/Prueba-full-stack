## 1. Backend E2E — Test File Setup

- [x] 1.1 Create `test/prescriptions.e2e-spec.ts` — bootstrap the NestJS app with `AppModule` + `ValidationPipe` + `HttpExceptionFilter` in `beforeAll`; close app in `afterAll`
- [x] 1.2 In `beforeAll`, log in as `dr@test.com`, `patient@test.com`, and `admin@test.com` via `POST /auth/login`; store the three access tokens; fetch `GET /patients` with the doctor token and store the first patient's `id` for use in the create tests

## 2. Backend E2E — Prescriptions Tests

- [x] 2.1 Add test: `POST /prescriptions` as doctor with the seeded patientId and one item → assert 201, body has `id`, `code` matching `/^RX-/`, and `status: "pending"`; store the new prescription `id`
- [x] 2.2 Add test: `GET /prescriptions` as doctor → assert 200, body has `data` array and numeric `total`
- [x] 2.3 Add test: `GET /prescriptions?status=pending` as doctor → assert 200, every item in `data` has `status: "pending"`
- [x] 2.4 Add test: `GET /prescriptions/:id` as doctor for the prescription created in 2.1 → assert 200, body has fields `code`, `status`, `patient`, `author`, `items`
- [x] 2.5 Add test: `GET /prescriptions` without Authorization header → assert 401
- [x] 2.6 Add test: `PUT /prescriptions/:id/consume` as patient for the prescription created in 2.1 → assert 200, response has `status: "consumed"` and non-null `consumedAt`
- [x] 2.7 Add test: `PUT /prescriptions/:id/consume` again on the same prescription → assert 409
- [x] 2.8 Add test: `GET /prescriptions/:id/pdf` as doctor for the prescription created in 2.1 → assert 200, `content-type` header contains `application/pdf`

## 3. Backend E2E — Admin Metrics Tests

- [x] 3.1 Add test: `GET /admin/metrics` as admin → assert 200, body has all four keys: `totals`, `byStatus`, `byDay`, `topDoctors`
- [x] 3.2 Add test: same response — assert `totals.doctors`, `totals.patients`, `totals.prescriptions` are all non-negative integers
- [x] 3.3 Add test: `GET /admin/metrics?from=2020-01-01&to=2030-12-31` as admin → assert 200, body has `totals`, `byStatus`, `byDay`, `topDoctors`
- [x] 3.4 Add test: `GET /admin/metrics` with doctor token → assert 403
- [x] 3.5 Add test: `GET /admin/metrics` without Authorization header → assert 401

## 4. Frontend — Test Infrastructure

- [x] 4.1 Install dev dependencies in `packages/frontend`: `jest`, `jest-environment-jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@types/jest`
- [x] 4.2 Create `packages/frontend/jest.config.ts` — call `createJestConfig` from `next/jest`; set `testEnvironment: "jsdom"`, `setupFilesAfterFramework: ["<rootDir>/jest.setup.ts"]`, and `testPathPattern: ["src/__tests__"]`
- [x] 4.3 Create `packages/frontend/jest.setup.ts` — import `@testing-library/jest-dom`; add `jest.mock('next/navigation', ...)` returning a stub `useRouter` with a `replace` spy and a `usePathname` returning `/`
- [x] 4.4 Add `"test": "jest"` to the `scripts` section of `packages/frontend/package.json`

## 5. Frontend — AuthGuard Unit Tests

- [x] 5.1 Create `packages/frontend/src/__tests__/AuthGuard.test.tsx` — define a `renderWithAuth(user, isLoading, role, children)` helper that wraps `AuthGuard` in a minimal `AuthContext.Provider` with controlled `user`, `isLoading`, `login`, and `logout` values
- [x] 5.2 Add test: `isLoading: true` → spinner is in the document, child text is not
- [x] 5.3 Add test: `user: null`, `isLoading: false` → `router.replace` called with `"/login"`, child text not rendered
- [x] 5.4 Add test: `user: { role: "patient" }`, `role="doctor"`, `isLoading: false` → `router.replace` called with `"/patient/prescriptions"`, child text not rendered
- [x] 5.5 Add test: `user: { role: "doctor" }`, `role="doctor"`, `isLoading: false` → child text is rendered, `router.replace` not called

## 6. Frontend — Navbar Unit Tests

- [x] 6.1 Create `packages/frontend/src/__tests__/Navbar.test.tsx` — define a `renderNavbar(user, logout)` helper that wraps `Navbar` in minimal `AuthContext.Provider` and `ToastContext.Provider`
- [x] 6.2 Add test: authenticated user (`email: "dr@test.com"`, `role: "doctor"`) → `"dr@test.com"` and `"doctor"` text are in the document
- [x] 6.3 Add test: `user: null` → neither email nor role text is in the document
- [x] 6.4 Add test: click `"Salir"` button → the `logout` mock function is called once

## 7. Project README

- [x] 7.1 Create `README.md` at the repository root with: one-paragraph project description, prerequisites (Node.js ≥ 20, PostgreSQL), environment variables tables for `packages/backend/.env` and `packages/frontend/.env.local` with example values, seed data table (email / role / password for 3 users), and a commands reference for all root `npm run` scripts (`dev`, `dev:backend`, `dev:frontend`, `build`, `test`) and database commands (`prisma migrate dev`, `db:seed`, `db:reset`)
