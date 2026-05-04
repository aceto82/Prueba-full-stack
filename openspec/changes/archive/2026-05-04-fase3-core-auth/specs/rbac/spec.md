## ADDED Requirements

### Requirement: Global JWT guard protects all routes by default
The system SHALL apply `JwtAuthGuard` globally so that every route requires a valid access token unless explicitly marked with `@Public()`.

#### Scenario: Unauthenticated request to protected route
- **WHEN** a request without an `Authorization: Bearer <token>` header reaches a protected endpoint
- **THEN** the system returns HTTP 401 with `{ message: "Unauthorized", code: "UNAUTHORIZED" }`

#### Scenario: Public route is accessible without token
- **WHEN** a request without an auth token reaches a route decorated with `@Public()`
- **THEN** the request proceeds normally

### Requirement: Role-based access control via @Roles decorator
The system SHALL provide a `@Roles(...roles)` decorator that restricts a route to users whose `role` claim matches one of the listed roles. The `RolesGuard` SHALL execute after `JwtAuthGuard` (user is already authenticated at this point).

#### Scenario: Correct role is allowed
- **WHEN** an authenticated user with role `doctor` accesses a route decorated with `@Roles('doctor')`
- **THEN** the request proceeds

#### Scenario: Wrong role is denied
- **WHEN** an authenticated user with role `patient` accesses a route decorated with `@Roles('doctor')`
- **THEN** the system returns HTTP 403 with `{ message: "Forbidden resource", code: "FORBIDDEN" }`

#### Scenario: Admin role bypasses role checks
- **WHEN** an authenticated user with role `admin` accesses any role-restricted route
- **THEN** the request proceeds regardless of which roles are listed in `@Roles()`

### Requirement: Role claims are derived from the JWT payload
The system SHALL extract the user's role from the `role` claim in the JWT access token. The system SHALL NOT query the database on every request to fetch the role — the JWT payload is the authoritative source within its validity window.

#### Scenario: Role is read from token
- **WHEN** a JWT with `role: "doctor"` is presented
- **THEN** `req.user.role` equals `"doctor"` without a database lookup
