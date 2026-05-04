## ADDED Requirements

### Requirement: POST /auth/login returns token pair
The system SHALL accept `{ email, password }` and return `{ accessToken, refreshToken, user: { id, email, name, role } }` on success. Invalid credentials SHALL return HTTP 401.

#### Scenario: Successful login
- **WHEN** a POST /auth/login request is made with a valid email and password
- **THEN** the response is HTTP 200 with `accessToken`, `refreshToken`, and `user` fields

#### Scenario: Unknown email
- **WHEN** a POST /auth/login request uses an email not in the database
- **THEN** the response is HTTP 401 with `{ message: "Invalid credentials", code: "UNAUTHORIZED" }`

#### Scenario: Missing fields are rejected
- **WHEN** a POST /auth/login request is made without `email` or `password`
- **THEN** the response is HTTP 400 with validation error details

### Requirement: POST /auth/register creates a new patient or doctor account
The system SHALL accept `{ email, password, name, role }` where `role` is `patient` or `doctor` (not `admin`). On success it returns `{ accessToken, refreshToken, user }`. Duplicate emails SHALL return HTTP 409.

#### Scenario: Successful registration
- **WHEN** a POST /auth/register request is made with valid unique email, password ≥ 6 chars, name, and role in [patient, doctor]
- **THEN** the response is HTTP 201 with token pair and user object, and the user record is persisted with hashed password

#### Scenario: Duplicate email is rejected
- **WHEN** a POST /auth/register request uses an email that already exists
- **THEN** the response is HTTP 409 with `{ message: "Email already in use", code: "CONFLICT" }`

#### Scenario: Admin role cannot self-register
- **WHEN** a POST /auth/register request includes `role: "admin"`
- **THEN** the response is HTTP 400 with a validation error

### Requirement: POST /auth/refresh returns a new access token
The system SHALL accept `{ refreshToken }` in the request body. If valid and not expired, it SHALL return `{ accessToken, refreshToken }` (rotated). Expired or invalid tokens return HTTP 401.

#### Scenario: Valid refresh token rotates token pair
- **WHEN** a POST /auth/refresh request is made with a valid, non-expired refresh token
- **THEN** the response is HTTP 200 with a new `accessToken` and `refreshToken`

#### Scenario: Expired refresh token is rejected
- **WHEN** a POST /auth/refresh request is made with an expired or invalid refresh token
- **THEN** the response is HTTP 401 with `{ message: "Unauthorized", code: "UNAUTHORIZED" }`

### Requirement: GET /auth/profile returns authenticated user
The system SHALL return the current user's profile (`id`, `email`, `name`, `role`) when a valid access token is presented. This route requires authentication.

#### Scenario: Authenticated user gets profile
- **WHEN** a GET /auth/profile request is made with a valid Bearer token
- **THEN** the response is HTTP 200 with `{ id, email, name, role }`

#### Scenario: Unauthenticated request is rejected
- **WHEN** a GET /auth/profile request is made without a token
- **THEN** the response is HTTP 401

### Requirement: POST /auth/logout clears refresh token
The system SHALL clear the stored refresh token hash for the authenticated user. This route requires authentication.

#### Scenario: Logout succeeds
- **WHEN** an authenticated user calls POST /auth/logout
- **THEN** the response is HTTP 200 and subsequent refresh token usage returns HTTP 401

### Requirement: Global exception filter returns consistent error shape
All API errors SHALL return `{ message: string, code: string, details?: any }` with appropriate HTTP status codes: 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found), 409 (conflict), 500 (server error).

#### Scenario: Validation error shape
- **WHEN** a request fails class-validator validation
- **THEN** the response is HTTP 400 with `{ message: "Validation failed", code: "BAD_REQUEST", details: [...] }`

#### Scenario: Unhandled error shape
- **WHEN** an unexpected server error occurs
- **THEN** the response is HTTP 500 with `{ message: "Internal server error", code: "INTERNAL_ERROR" }` and no stack trace in the response body
