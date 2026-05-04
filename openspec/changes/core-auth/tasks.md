## 1. Setup y Dependencias

- [ ] 1.1 Crear módulo auth (auth.module.ts, auth.controller.ts, auth.service.ts)
- [ ] 1.2 Crear estructura de carpetas: dto/, strategies/, guards/, decorators/
- [ ] 1.3 Verificar dependencias instaladas (@nestjs/jwt, passport, bcrypt)

## 2. DTOs y Validación

- [ ] 2.1 Crear LoginDto con @IsEmail(), @IsNotEmpty(), @MinLength()
- [ ] 2.2 Crear RegisterDto con email, password, name, role, specialty (opcional)
- [ ] 2.3 Configurar ValidationPipe global en main.ts

## 3. Servicio de Autenticación

- [ ] 3.1 Implementar método login(email, password) - validar credenciales con bcrypt
- [ ] 3.2 Implementar método register(data) - crear usuario y perfil (doctor/patient)
- [ ] 3.3 Implementar método generateTokens(userId, role) - generar access y refresh JWT
- [ ] 3.4 Implementar método refresh(refreshToken) - verificar y rotar token
- [ ] 3.5 Implementar método logout(userId) - invalidar refresh token

## 4. Estrategias JWT

- [ ] 4.1 Crear JwtStrategy para validar access token (passport-jwt)
- [ ] 4.2 Crear RefreshStrategy para validar refresh token
- [ ] 4.3 Configurar JWT module en auth.module.ts

## 5. RBAC (Roles y Guards)

- [ ] 5.1 Crear @Roles decorator que acepta roles como argumentos
- [ ] 5.2 Crear RolesGuard que verifica rol del usuario contra roles requeridos
- [ ] 5.3 Integrar CurrentUser decorator para obtener usuario del request

## 6. Controlador de Autenticación

- [ ] 6.1 Crear POST /auth/login - recibe credenciales, retorna tokens
- [ ] 6.2 Crear POST /auth/register - recibe datos, crea usuario
- [ ] 6.3 Crear POST /auth/refresh - recibe refresh token, retorna nuevos tokens
- [ ] 6.4 Crear GET /auth/profile - retorna datos del usuario autenticado
- [ ] 6.5 Proteger endpoints con @UseGuards(AuthGuard)

## 7. Seguridad Global

- [ ] 7.1 Configurar Helmet middleware en main.ts
- [ ] 7.2 Configurar CORS con APP_ORIGIN
- [ ] 7.3 Configurar rate limiting básico (ThrottlerModule)
- [ ] 7.4 Crear HttpExceptionFilter para respuestas consistentes

## 8. Testing

- [ ] 8.1 Test unitario de auth.service (login, register, refresh)
- [ ] 8.2 Test e2e de /auth/login con credenciales válidas e inválidas

## 9. Integración con App Module

- [ ] 9.1 Importar AuthModule en app.module.ts
- [ ] 9.2 Probar flujo completo: login → profile → logout