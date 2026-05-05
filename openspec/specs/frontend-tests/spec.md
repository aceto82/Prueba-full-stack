# frontend-tests Specification

## Purpose
TBD - created by archiving change fase6. Update Purpose after archive.
## Requirements
### Requirement: Frontend has a working Jest configuration for Next.js 16
The system SHALL have a Jest configuration at `packages/frontend/jest.config.ts` using `createJestConfig` from `next/jest`. The configuration SHALL set the test environment to `jsdom` and include a setup file that imports `@testing-library/jest-dom`. A `test` script SHALL be added to `packages/frontend/package.json`. Running `npm run test -w @prescription/frontend` SHALL execute all frontend tests without error.

#### Scenario: Jest can discover and run a test file
- **WHEN** `npm run test -w @prescription/frontend` is executed in the repository root
- **THEN** Jest finds test files in `src/__tests__/` and reports results without configuration errors

#### Scenario: `@testing-library/jest-dom` matchers are available in tests
- **WHEN** a test file uses matchers such as `toBeInTheDocument()` or `toHaveTextContent()`
- **THEN** the test runs without "matcher not found" errors

### Requirement: AuthGuard component is covered by unit tests
The system SHALL have a test file at `src/__tests__/AuthGuard.test.tsx` covering the three redirect scenarios of the `AuthGuard` component: redirecting unauthenticated users to `/login`, redirecting authenticated users with the wrong role to their role home, and rendering children when the user and role match.

#### Scenario: Unauthenticated user is redirected to login
- **WHEN** `AuthGuard` is rendered with `role="doctor"` and the auth context has `user: null` and `isLoading: false`
- **THEN** `router.replace` is called with `/login` and no children are rendered

#### Scenario: Wrong-role user is redirected to their role home
- **WHEN** `AuthGuard` is rendered with `role="doctor"` and the auth context has a `patient` user and `isLoading: false`
- **THEN** `router.replace` is called with `/patient/prescriptions` and no children are rendered

#### Scenario: Correct-role user sees the protected content
- **WHEN** `AuthGuard` is rendered with `role="doctor"` and the auth context has a `doctor` user and `isLoading: false`
- **THEN** the child content is rendered and `router.replace` is not called

#### Scenario: Spinner is shown while auth is initializing
- **WHEN** `AuthGuard` is rendered with `isLoading: true`
- **THEN** a spinner element is visible and the child content is not rendered

### Requirement: Navbar component is covered by unit tests
The system SHALL have a test file at `src/__tests__/Navbar.test.tsx` covering the rendering and logout behavior of the `Navbar` component.

#### Scenario: Navbar renders user email and role badge when authenticated
- **WHEN** `Navbar` is rendered with an authenticated user in context (e.g., `{ email: "dr@test.com", role: "doctor" }`)
- **THEN** the user's email and role text are present in the document

#### Scenario: Navbar renders nothing user-specific when unauthenticated
- **WHEN** `Navbar` is rendered with `user: null` in the auth context
- **THEN** no email or role badge is rendered

#### Scenario: Clicking the logout button calls the logout function
- **WHEN** the user clicks the "Salir" button in `Navbar`
- **THEN** the `logout` function from `AuthContext` is invoked

