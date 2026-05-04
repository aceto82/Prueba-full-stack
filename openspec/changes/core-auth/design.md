## Context

El proyecto es una aplicación de prescripciones médicas con:
- Backend: NestJS + Prisma + PostgreSQL (Neon)
- Frontend: Next.js + TailwindCSS
- Roles: admin, doctor, patient

La Fase 1 (Setup) y Fase 2 (Seed) están completadas. Existe un schema de Prisma con modelos User, Doctor, Patient, Prescription, PrescriptionItem. El seed ya creó usuarios de prueba con password hash bcrypt.

## Goals / Non-Goals

**Goals:**
- Implementar autenticación JWT con access token (15 min TTL) y refresh token (7 días TTL) con rotación
- Crear sistema RBAC con guards y decorators para proteger endpoints según rol
- Endpoints: POST /auth/login, POST /auth/register, POST /auth/refresh, GET /auth/profile
- Validación de DTOs con class-validator
- Manejo de errores con exception filters
- Seguridad: Helmet, CORS, rate limiting básico

**Non-Goals:**
- No se implementará OAuth social (Google, etc.)
- No se implementará 2FA
- No se implementará recuperación de contraseña por email (MVP)
- No se implementará panel de administración de usuarios (plus opcional)

## Decisions

### 1. JWT Strategy: Access + Refresh tokens con rotación
- **Decision**: Access token en Authorization header (Bearer), Refresh token en cookie HTTP-only
- **Alternativa evaluada**: JWT en cookie para ambos → seleccionado no por complejidad con CORS
- **Razón**: Separar tokens permite diferente lifecycle y mayor seguridad para el refresh

### 2. Almacenamiento de refresh tokens
- **Decision**: Store en DB (tabla implicit o extensión Prisma)
- **Alternativa evaluada**: Redis → no seleccionado por simplicidad en MVP
- **Razón**: Prisma ya está configurado, evita agregar Redis al stack

### 3. Password hashing
- **Decision**: bcrypt con salt rounds 10
- **Razón**: Necesario para el seed existente que usa bcrypt

### 4. RBAC con decorators
- **Decision**: @Roles('admin'|'doctor'|'patient') decorator + RolesGuard
- **Alternativa evaluada**: Policies (Casl) → no seleccionado por sobreingeniería para MVP
- **Razón**: Simple y cumple con el requerimiento del spec

### 5. Validación de DTOs
- **Decision**: class-validator + class-transformer en pipes globales
- **Razón**: Estándar en NestJS, cumple con el spec

## Risks / Trade-offs

- [Risk] Refresh token rotation requiere sincronización → [Mitigation] Guardar refresh token en DB, invalidar en logout
- [Risk] JWT secret en variables de entorno → [Mitigation] Generar secrets fuertes, documentar en README
- [Risk] Rate limiting puede bloquear requests legítimos → [Mitigation] Configuración permisiva inicial (100 req/min)

## Migration Plan

1. Crear módulo auth con estructura base
2. Implementar auth.service con login/register/refresh
3. Crear estrategias JWT (access y refresh)
4. Implementar RolesGuard y @Roles decorator
5. Agregar endpoints al controller
6. Configurar pipes y filtros globales en main.ts
7. Probar con usuarios del seed

## Open Questions

- ¿Usar cookies HTTP-only para refresh token o storage del lado del cliente? → Decisión: cookies
- ¿Cómo manejar el logout (blacklist de tokens vs simple remove)? → Pendiente de decidir en implementación