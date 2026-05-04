## Context

El proyecto es una aplicación de prescripciones médicas con:
- Backend: NestJS + Prisma + PostgreSQL (Neon)
- Frontend: Next.js + TailwindCSS
- Roles: admin, doctor, patient
- Fase 3 (Auth) completada

La Fase 3 creó el sistema de autenticación JWT. Ahora necesitamos implementar los módulos de negocio para completar el flujo de prescripciones.

## Goals / Non-Goals

**Goals:**
- Users Module: Listar doctors y patients con filtros
- Prescriptions Module: CRUD completo (crear, listar, detalhar, consumir, PDF)
- Admin Module: Métricas del sistema
- PDF Generation con QR code para cada prescripción

**Non-Goals:**
- No se implementará edición de prescripciones (solo consumir)
- No se implementará soft delete
- No se implementará búsqueda avanzada en items
- Panel de creación de usuarios (plus opcional)

## Decisions

### 1. Estructura de módulos separados
- **Decision**: Crear módulos separados (users, prescriptions, admin) en lugar de uno solo
- **Razón**: Separación de responsabilidades, más limpio para RBAC

### 2. Endpoints de prescriptions por rol
- **Decision**: `/prescriptions` para doctor (listado y creación), `/me/prescriptions` para paciente
- **Alternativa evaluada**: Un solo endpoint con query param `?role=doctor` → seleccionado no por confusion
- **Razón**: Endpoints claros por rol, mejor documentación

### 3. Paginación
- **Decision**: Offset-based con `page` y `limit`
- **Alternativa evaluada**: Cursor-based → no seleccionado por complejidad
- **Razón**: Simple, suficiente para MVP

### 4. Generación PDF
- **Decision**: PDFKit (ya instalado) + QRCode para enlace
- **Razón**: Dependencia ya existe, no agregar nouvelles librerías

### 5. Acceso a datos
- **Decision**: Filtros en servicio, no en controller
- **Alternativa evaluada**: Query params puros en controller → seleccionados los filtros
- **Razón**: Más testable, mejor separación

## Risks / Trade-offs

- [Risk] Paciente puede consumir prescripción de otro → [Mitigation] Verificar ownership en servicio
- [Risk] PDF con caracteres especiales → [Mitigation] Usar fuente compatible, sanitizar input
- [Risk] Métricas con mucho tráfico → [Mitigation] Cache simple o TTL corto

## Migration Plan

1. Crear Users module con listado por rol
2. Crear Prescriptions module (CRUD + PDF)
3. Crear Admin module (métricas)
4. Integrar en app.module.ts
5. Probar flujos por rol