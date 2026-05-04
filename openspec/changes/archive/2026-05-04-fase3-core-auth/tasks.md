## 1. Dependencies and Schema

- [x] 1.1 Install missing packages: `helmet`, `@nestjs/throttler`, `passport-local`, `@types/passport-local`
- [x] 1.2 Add `refreshTokenHash String?` field to `User` model in `packages/backend/prisma/schema.prisma`
- [x] 1.3 Run `prisma migrate dev --name add-refresh-token-hash` to apply schema change

## 2. PrismaModule and UsersModule

- [x] 2.1 Create `src/prisma/prisma.module.ts` and `src/prisma/prisma.service.ts` (global module exposing PrismaClient)
- [x] 2.2 Create `src/users/users.module.ts` and `src/users/users.service.ts` with `findByEmail(email)` and `updateRefreshTokenHash(id, hash)` methods

## 3. Auth DTOs and Validation

- [x] 3.1 Create `src/auth/dto/login.dto.ts` with `@IsEmail()` and `@IsString()` validators for `email` and `password`
- [x] 3.2 Create `src/auth/dto/register.dto.ts` with validators for `email`, `password` (min 6), `name`, and `role` (enum: patient | doctor only)
- [x] 3.3 Create `src/auth/dto/refresh.dto.ts` with `@IsString()` validator for `refreshToken`

## 4. Passport Strategies

- [x] 4.1 Create `src/auth/strategies/local.strategy.ts` using `passport-local` — validates email/password via `AuthService.validateUser()`
- [x] 4.2 Create `src/auth/strategies/jwt.strategy.ts` using `passport-jwt` — extracts Bearer token, returns `{ sub, email, role }` payload
- [x] 4.3 Create `src/auth/strategies/jwt-refresh.strategy.ts` — validates refresh token from request body, verifies hash against stored value

## 5. Auth Guards and Decorators

- [x] 5.1 Create `src/auth/decorators/public.decorator.ts` with `@Public()` decorator (sets `IS_PUBLIC_KEY` metadata)
- [x] 5.2 Create `src/auth/decorators/roles.decorator.ts` with `@Roles(...roles)` decorator (sets `ROLES_KEY` metadata)
- [x] 5.3 Create `src/auth/guards/jwt-auth.guard.ts` extending `AuthGuard('jwt')` — checks `IS_PUBLIC_KEY` to skip public routes
- [x] 5.4 Create `src/auth/guards/roles.guard.ts` implementing `CanActivate` — reads `ROLES_KEY`, compares with `req.user.role`; admin bypasses all role checks

## 6. AuthService

- [x] 6.1 Create `src/auth/auth.service.ts` with `validateUser(email, password)` — fetches user, compares password hash, returns user without password
- [x] 6.2 Implement `login(user)` in `AuthService` — signs access + refresh tokens, stores refresh token hash, returns token pair + user profile
- [x] 6.3 Implement `register(dto)` in `AuthService` — hashes password, creates User (and Doctor/Patient profile if applicable), calls `login()` to return tokens
- [x] 6.4 Implement `refreshTokens(userId, refreshToken)` in `AuthService` — validates token against stored hash, rotates token pair
- [x] 6.5 Implement `logout(userId)` in `AuthService` — clears `refreshTokenHash` on the User record

## 7. AuthController

- [x] 7.1 Create `src/auth/auth.controller.ts` with `@Public()` on login, register, and refresh routes
- [x] 7.2 Implement `POST /auth/login` using `LocalAuthGuard`, calls `authService.login(req.user)`
- [x] 7.3 Implement `POST /auth/register` using `RegisterDto`, calls `authService.register(dto)`
- [x] 7.4 Implement `POST /auth/refresh` using `RefreshDto` + `JwtRefreshGuard`, calls `authService.refreshTokens()`
- [x] 7.5 Implement `GET /auth/profile` (protected) — returns `req.user` (id, email, name, role)
- [x] 7.6 Implement `POST /auth/logout` (protected) — calls `authService.logout(req.user.sub)`

## 8. AuthModule

- [x] 8.1 Create `src/auth/auth.module.ts` importing `UsersModule`, `PassportModule`, `JwtModule.registerAsync()` (reads secrets from ConfigService), registering all strategies and guards

## 9. Global Exception Filter

- [x] 9.1 Create `src/common/filters/http-exception.filter.ts` implementing `ExceptionFilter` — maps `HttpException` to `{ message, code, details? }` shape; maps unknown errors to 500 with no stack trace

## 10. App Bootstrap

- [x] 10.1 Update `src/app.module.ts` to import `ConfigModule` (global), `PrismaModule`, `UsersModule`, `ThrottlerModule`, `AuthModule`; register `JwtAuthGuard` and `RolesGuard` as global guards via `APP_GUARD`
- [x] 10.2 Update `src/main.ts` to apply: `helmet()`, `enableCors({ origin: process.env.APP_ORIGIN })`, `ValidationPipe({ whitelist: true, transform: true })`, global `HttpExceptionFilter`
- [x] 10.3 Apply `@Throttle({ default: { limit: 10, ttl: 60000 } })` decorator on `AuthController` (login and register routes)

## 11. Testing

- [x] 11.1 Write unit tests for `AuthService.validateUser()` — mock `UsersService` and `bcrypt`
- [x] 11.2 Write unit tests for `AuthService.login()` — verify token payload and refresh hash storage
- [x] 11.3 Write unit tests for `RolesGuard` — verify admin bypass and role mismatch rejection
- [x] 11.4 Write a basic e2e test: POST /auth/login → GET /auth/profile → POST /auth/refresh → POST /auth/logout
