## Context

The backend stack (NestJS + Prisma + PostgreSQL) is initialized with migrations and seed data. The `app.module.ts` imports nothing beyond the bare AppModule scaffold. The `common/` and `users/` directories exist but contain no files yet. Installed packages already include `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`, `class-validator`, and `class-transformer`. Missing packages to install: `helmet`, `@nestjs/throttler`, `passport-local`, `@types/passport-local`.

The `User` model in Prisma has `email`, `password` (hashed), `name`, and `role` (enum: admin | doctor | patient).

## Goals / Non-Goals

**Goals:**
- Implement stateless JWT authentication with short-lived access tokens and rotating refresh tokens
- Protect all future routes via a global `JwtAuthGuard`; role restriction via `@Roles()` + `RolesGuard`
- Provide consistent error responses via a global exception filter
- Harden the API with Helmet, CORS, and rate limiting on auth routes

**Non-Goals:**
- Email verification or password reset flows
- OAuth / social login
- User management UI (admin panel for creating users is a Plus feature)
- Frontend integration — this phase is backend only

## Decisions

### 1. Token storage: Bearer header (not HTTP-only cookies)
The spec allows either cookies or Bearer. We use `Authorization: Bearer <token>` to simplify mobile/Postman testing and avoid CSRF complexity. The frontend stores tokens in memory (not localStorage) to mitigate XSS.

**Alternative considered:** HTTP-only cookies with CSRF tokens — more secure but adds complexity that's not required for this MVP.

### 2. Refresh token rotation with hashed storage
Refresh tokens are stored hashed in the `User` table (new `refreshTokenHash` column) rather than a separate `RefreshToken` table. On each `/auth/refresh`, the old token is invalidated and a new one issued. This gives single-use semantics with minimal schema overhead.

**Alternative considered:** Separate `RefreshToken` table with family-based reuse detection — overkill for an MVP, deferred to Plus phase.

### 3. Global `JwtAuthGuard` with `@Public()` opt-out
Rather than applying `@UseGuards(JwtAuthGuard)` everywhere, we set `JwtAuthGuard` as a global guard in `AppModule` and use a `@Public()` decorator on routes that don't require auth (login, register, refresh). This is the NestJS recommended pattern for "secure by default."

### 4. `RolesGuard` as a second layer guard
`RolesGuard` is applied globally after `JwtAuthGuard`. If a route has `@Roles(...)`, it checks `req.user.role`. Routes without `@Roles()` pass through after JWT validation.

### 5. Exception filter: global, catches all `HttpException` + unknown errors
A single `HttpExceptionFilter` maps all errors to `{ message, code, details? }`. Unknown errors become HTTP 500 with a generic message (no leaking of stack traces).

### 6. Rate limiting on auth routes only
`@nestjs/throttler` applied at the route level on `/auth/login` and `/auth/register` (10 req/min per IP). Not applied globally to avoid throttling the main API.

### 7. Schema change: add `refreshTokenHash` to User
One new nullable column on `User`. Requires a new Prisma migration.

## Risks / Trade-offs

- **In-memory refresh token invalidation gap**: if a token is stolen between rotation steps, the attacker and legitimate user both have a valid token briefly. Mitigation: short access token TTL (15 min) limits the blast radius.
- **Adding `refreshTokenHash` to User**: schema migration is additive (nullable column) — safe to apply with zero downtime.
- **`passport-local` vs manual credential check**: we use `passport-local` for the login strategy to stay consistent with NestJS conventions, even though a manual check would be simpler. Trade-off: a bit more boilerplate.

## Migration Plan

1. Install missing packages: `helmet`, `@nestjs/throttler`, `passport-local`, `@types/passport-local`
2. Add `refreshTokenHash String?` to `User` in `schema.prisma`
3. Run `prisma migrate dev --name add-refresh-token-hash`
4. Implement modules in order: `PrismaModule` → `UsersModule` → `AuthModule`
5. Update `main.ts` with Helmet, CORS, `ValidationPipe`, global guards, exception filter
6. Update `AppModule` to import new modules and register global guards
7. Verify with Postman/curl: login → get tokens → call profile → refresh → logout
