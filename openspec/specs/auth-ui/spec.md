# auth-ui Specification

## Purpose
TBD - created by archiving change fase5-frontend. Update Purpose after archive.
## Requirements
### Requirement: Login page collects and submits credentials
The system SHALL provide a `/login` page with email and password fields. On submit it SHALL call `POST /auth/login`, store the returned `accessToken` and `refreshToken` in `localStorage`, and redirect the user to their role-specific home page (`/doctor/prescriptions`, `/patient/prescriptions`, or `/admin`). Validation errors from the API SHALL be displayed inline.

#### Scenario: Successful login redirects by role
- **WHEN** a user submits valid credentials on `/login`
- **THEN** the access token and refresh token are stored in `localStorage`, and the user is redirected to the page matching their role

#### Scenario: Invalid credentials shows error message
- **WHEN** a user submits incorrect credentials
- **THEN** an error message is shown below the form without redirecting

#### Scenario: Already authenticated user is redirected away from login
- **WHEN** a user with a valid token navigates to `/login`
- **THEN** they are immediately redirected to their role-specific home page

### Requirement: AuthContext provides global auth state
The system SHALL expose an `AuthContext` (via React Context) with the current user object (`{ id, email, name, role }`), `login`, and `logout` functions. The context SHALL initialize from `localStorage` on mount and show a loading spinner until initialization is complete.

#### Scenario: Auth state is restored on page reload
- **WHEN** a user with stored tokens reloads the page
- **THEN** the app shows a spinner briefly, then renders the authenticated view without requiring re-login

#### Scenario: Missing token shows loading then redirects
- **WHEN** a user with no stored token visits a protected page
- **THEN** a spinner is shown briefly, then the user is redirected to `/login`

### Requirement: AuthGuard component protects routes by role
The system SHALL provide an `<AuthGuard role="doctor|patient|admin">` component that wraps each protected page. It SHALL redirect unauthenticated users to `/login` and users with a mismatched role to their correct home.

#### Scenario: Correct role accesses protected page
- **WHEN** a doctor navigates to `/doctor/prescriptions`
- **THEN** the page content is rendered

#### Scenario: Wrong role is redirected
- **WHEN** a patient navigates to `/doctor/prescriptions`
- **THEN** they are redirected to `/patient/prescriptions`

#### Scenario: Unauthenticated user is redirected to login
- **WHEN** an unauthenticated user navigates to any protected page
- **THEN** they are redirected to `/login`

### Requirement: API client transparently refreshes expired access tokens
The system SHALL provide an `apiFetch` utility that attaches the `Authorization: Bearer <token>` header to every request. On HTTP 401, it SHALL call `POST /auth/refresh` with the stored refresh token, update `localStorage` with the new token pair, and retry the original request once. If the refresh also fails, the user SHALL be logged out and redirected to `/login`.

#### Scenario: Expired access token is refreshed transparently
- **WHEN** an API call returns 401 and a valid refresh token is stored
- **THEN** a new access token is obtained, stored, and the original request succeeds transparently

#### Scenario: Expired refresh token logs the user out
- **WHEN** both the access token and refresh token are invalid or expired
- **THEN** localStorage is cleared and the user is redirected to `/login`

### Requirement: Logout clears auth state and redirects
The system SHALL provide a logout action that calls `POST /auth/logout`, clears `localStorage`, and redirects to `/login`.

#### Scenario: Logout redirects to login
- **WHEN** a user clicks logout
- **THEN** the auth endpoints is called, tokens are removed from localStorage, and the user sees the login page

