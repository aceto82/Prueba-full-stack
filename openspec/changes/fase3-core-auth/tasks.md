## 1. Dependencies and Schema

- [ ] 1.1 Install missing packages: `helmet`, `@nestjs/throttler`, `passport-local`, `@types/passport-local`
- [ ] 1.2 Add `refreshTokenHash String?` field to `User` model in `packages/backend/prisma/schema.prisma`
- [ ] 1.3 Run `prisma migrate dev --name add-refresh-token-hash` to apply schema change

## 2. PrismaModule and UsersModule

- [ ] 2.1 Create `src/prisma/prisma.module.ts` and `src/prisma/prisma.service.ts` (global module exposing PrismaClient)
- [ ] 2.2 Create `src/users/users.module.ts` and `src/users/users.service.ts` with `findByEmail(email)` and `updateRefreshTokenHash(id, hash)` methods

## 3. Auth DTOs and Validation

- [ ] 3.1 Create `src/auth/dto/login.dto.ts` with `@IsEmail()` and `@IsString()` validators for `email` and `password`
- [ ] 3.2 Create `src/auth/dto/register.dto.ts` with validators for `email`, `password` (min 6), `name`, and `role` (enum: patient | doctor only)
- [ ] 3.3 Create `src/auth/dto/refresh.dto.ts` with `@IsString()` validator for `refreshToken`

## 4. Passport Strategies

- [ ] 4.1 Create `src/auth/strategies/local.strategy.ts` using `passport-local` — validates email/password via `AuthService.validateUser()`
- [ ] 4.2 Create `src/auth/strategies/jwt.strategy.ts` using `passport-jwt` — extracts Bearer token, returns `{ sub, email, role }` payload
- [ ] 4.3 Create `src/auth/strategies/jwt-refresh.strategy.ts` — validates refresh token from request body, verifies hash against stored value

## 5. Auth Guards and Decorators

- [ ] 5.1 Create `src/auth/decorators/public.decorator.ts` with `@Public()` decorator (sets `IS_PUBLIC_KEY` metadata)
- [ ] 5.2 Create `src/auth/decorators/roles.decorator.ts` with `@Roles(...roles)` decorator (sets `ROLES_KEY` metadata)
- [ ] 5.3 Create `src/auth/guards/jwt-auth.guard.ts` extending `AuthGuard('jwt')` — checks `IS_PUBLIC_KEY` to skip public routes
- [ ] 5.4 Create `src/auth/guards/roles.guard.ts` implementing `CanActivate` — reads `ROLES_KEY`, compares with `req.user.role`; admin bypasses all role checks

## 6. AuthService

- [ ] 6.1 Create `src/auth/auth.service.ts` with `validateUser(email, password)` — fetches user, compares password hash, returns user without password
- [ ] 6.2 Implement `login(user)` in `AuthService` — signs access + refresh tokens, stores refresh token hash, returns token pair + user profile
- [ ] 6.3 Implement `register(dto)` in `AuthService` — hashes password, creates User (and Doctor/Patient profile if applicable), calls `login()` to return tokens
- [ ] 6.4 Implement `refreshTokens(userId, refreshToken)` in `AuthService` — validates token against stored hash, rotates token pair
- [ ] 6.5 Implement `logout(userId)` in `AuthService` — clears `refreshTokenHash` on the User record

## 7. AuthController

- [ ] 7.1 Create `src/auth/auth.controller.ts` with `@Public()` on login, register, and refresh routes
- [ ] 7.2 Implement `POST /auth/login` using `LocalAuthGuard`, calls `authService.login(req.user)`
- [ ] 7.3 Implement `POST /auth/register` using `RegisterDto`, calls `authService.register(dto)`
- [ ] 7.4 Implement `POST /auth/refresh` using `RefreshDto` + `JwtRefreshGuard`, calls `authService.refreshTokens()`
- [ ] 7.5 Implement `GET /auth/profile` (protected) — returns `req.user` (id, email, name, role)
- [ ] 7.6 Implement `POST /auth/logout` (protected) — calls `authService.logout(req.user.sub)`

## 8. AuthModule

- [ ] 8.1 Create `src/auth/auth.module.ts` importing `UsersModule`, `PassportModule`, `JwtModule.registerAsync()` (reads secrets from ConfigService), registering all strategies and guards

## 9. Global Exception Filter

- [ ] 9.1 Create `src/common/filters/http-exception.filter.ts` implementing `ExceptionFilter` — maps `HttpException` to `{ message, code, details? }` shape; maps unknown errors to 500 with no stack trace

## 10. App Bootstrap

- [ ] 10.1 Update `src/app.module.ts` to import `ConfigModule` (global), `PrismaModule`, `UsersModule`, `ThrottlerModule`, `AuthModule`; register `JwtAuthGuard` and `RolesGuard` as global guards via `APP_GUARD`
- [ ] 10.2 Update `src/main.ts` to apply: `helmet()`, `enableCors({ origin: process.env.APP_ORIGIN })`, `ValidationPipe({ whitelist: true, transform: true })`, global `HttpExceptionFilter`
- [ ] 10.3 Apply `@Throttle({ default: { limit: 10, ttl: 60000 } })` decorator on `AuthController` (login and register routes)

## 11. Testing

- [ ] 11.1 Write unit tests for `AuthService.validateUser()` — mock `UsersService` and `bcrypt`
- [ ] 11.2 Write unit tests for `AuthService.login()` — verify token payload and refresh hash storage
- [ ] 11.3 Write unit tests for `RolesGuard` — verify admin bypass and role mismatch rejection
- [ ] 11.4 Write a basic e2e test: POST /auth/login → GET /auth/profile → POST /auth/refresh → POST /auth/logout
