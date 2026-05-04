## ADDED Requirements

### Requirement: Access token issuance
The system SHALL issue a signed JWT access token upon successful authentication. The token SHALL include `sub` (user ID), `email`, and `role` claims. The token SHALL expire in 15 minutes (configurable via `JWT_ACCESS_TTL` env var).

#### Scenario: Token payload is correct
- **WHEN** a user logs in with valid credentials
- **THEN** the response includes an `accessToken` JWT whose decoded payload contains `sub`, `email`, and `role`

#### Scenario: Token expires after TTL
- **WHEN** an access token older than 15 minutes is used on a protected endpoint
- **THEN** the system returns HTTP 401 with `{ message: "Unauthorized", code: "UNAUTHORIZED" }`

### Requirement: Refresh token issuance and rotation
The system SHALL issue a refresh token (opaque UUID or signed JWT) upon login. The refresh token SHALL be stored as a bcrypt hash on the `User` record. The refresh token SHALL expire in 7 days (configurable via `JWT_REFRESH_TTL` env var). On each successful refresh, the old token hash is invalidated and a new token pair is issued (rotation).

#### Scenario: Refresh issues new token pair
- **WHEN** a valid refresh token is presented to POST /auth/refresh
- **THEN** the system returns a new `accessToken` and `refreshToken`, and the old refresh token is invalidated

#### Scenario: Reused refresh token is rejected
- **WHEN** an already-used refresh token is presented to POST /auth/refresh
- **THEN** the system returns HTTP 401 and the user's refresh token hash is cleared (forced re-login)

### Requirement: Password verification uses bcrypt
The system SHALL hash passwords with bcrypt (cost factor ≥ 10) at registration. The system SHALL verify passwords by comparing the plaintext input against the stored hash using `bcrypt.compare`.

#### Scenario: Correct password is accepted
- **WHEN** a user submits the correct password for their account
- **THEN** authentication succeeds

#### Scenario: Wrong password is rejected
- **WHEN** a user submits an incorrect password
- **THEN** the system returns HTTP 401 with `{ message: "Invalid credentials", code: "UNAUTHORIZED" }`

### Requirement: Logout clears refresh token
The system SHALL clear the stored refresh token hash when the user logs out (POST /auth/logout), preventing further token refresh.

#### Scenario: Logout invalidates refresh token
- **WHEN** an authenticated user calls POST /auth/logout
- **THEN** the refresh token hash is removed from the User record and subsequent refresh attempts return HTTP 401
