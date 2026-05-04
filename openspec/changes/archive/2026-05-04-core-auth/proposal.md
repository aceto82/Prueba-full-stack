## Why

El sistema de prescripciones necesita un sistema de autenticación y autorización robusto para soportar los 3 roles (admin, doctor, patient) definidos en los requerimientos. Sin autenticación, no es posible proteger las rutas ni implementar el flujo completo de prescripciones.

## What Changes

- Implementar módulo de autenticación JWT con refresh tokens
- Crear estrategia de login/logout con validación de credenciales
- Implementar sistema RBAC con guards y decorators
- Agregar endpoints de autenticación: /auth/login, /auth/register, /auth/refresh, /auth/profile
- Configurar seguridad básica: Helmet, CORS, rate limiting
- Agregar filtros de excepciones global para manejo de errores consistente

## Capabilities

### New Capabilities

- `jwt-auth`: Autenticación con JWT de acceso y refresh tokens con rotación
- `rbac`: Sistema de control de acceso basado en roles (admin, doctor, patient)
- `auth-endpoints`: API de autenticación con login, register, refresh y profile

### Modified Capabilities

- (Ninguno - es la primera implementación de autenticación)

## Impact

- Backend: Nuevo módulo `src/auth/` con controller, service, strategies, guards y decorators
- APIs afectadas: Todos los endpoints de prescripciones y usuarios necesitan autenticación
- Dependencias: @nestjs/jwt, @nestjs/passport, passport, passport-jwt, bcrypt