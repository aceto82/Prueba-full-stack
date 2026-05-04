## Why

The backend has the database schema, migrations, and seed data in place (Phases 1-2), but there is no authentication layer yet. Without JWT-based auth and RBAC guards, no endpoint is protected and the system cannot distinguish between admin, doctor, and patient roles — making all business logic inaccessible in a safe way.

## What Changes

- New `AuthModule` with login, refresh, and profile endpoints
- JWT access token (15 min) + refresh token (7 days) strategy with rotation
- `RolesGuard` and `@Roles()` decorator for RBAC on all protected routes
- Global exception filter returning consistent `{ message, code, details? }` error shape
- Security middleware: Helmet, CORS (allow APP_ORIGIN), rate limiting on auth routes
- DTOs with `class-validator` for login and register payloads
- `UsersModule` stub for profile lookup (needed by auth)

## Capabilities

### New Capabilities
- `jwt-auth`: JWT access + refresh token issuance, validation, and rotation via Passport strategies
- `rbac`: Role-based access control with `@Roles()` decorator and `RolesGuard`
- `auth-endpoints`: REST endpoints — POST /auth/login, POST /auth/refresh, GET /auth/profile, POST /auth/register

### Modified Capabilities
<!-- No existing specs to modify — this is the first spec-covered phase -->

## Impact

- **Backend**: New modules `auth/`, `users/` (stub); `main.ts` updated with Helmet, CORS, throttler
- **APIs**: Three new public endpoints + one protected endpoint
- **Dependencies**: `@nestjs/passport`, `passport-jwt`, `passport-local`, `@nestjs/throttler`, `helmet` (already installed or to be added)
- **DB**: No schema changes; reads `User` table for credential validation
