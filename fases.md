# Fases del Proyecto - App de Prescripciones

## Fase 1: Setup Base ✅

### Infraestructura
- **Tipo**: Servicios locales + Neon (cloud PostgreSQL)
- **Estructura**: packages/backend/ + packages/frontend/ (workspaces)

### Paquetes instalados
- **Backend**: NestJS + Prisma + class-validator + bcrypt + JWT + Passport + PDFKit + QRCode
- **Frontend**: Next.js + TailwindCSS

### Schema de Base de Datos
```prisma
enum Role { admin, doctor, patient }
enum PrescriptionStatus { pending, consumed }

model User
model Doctor
model Patient
model Prescription
model PrescriptionItem
```

### Variables de entorno
- `packages/backend/.env` - DATABASE_URL, JWT secrets, APP_PORT, APP_ORIGIN
- `packages/frontend/.env.local` - NEXT_PUBLIC_API_URL

### Migración
- `prisma migrate dev` aplicado con índices en `Prescription(status, createdAt)`, `Prescription(patientId)`, `Prescription(authorId)`

---

## Fase 2: Seed de Prueba ✅

### Usuarios creados
| Email | Rol | Contraseña |
|-------|-----|------------|
| admin@test.com | admin | password123 |
| dr@test.com | doctor | password123 |
| patient@test.com | patient | password123 |

### Datos de ejemplo
- 1 doctor: Dr. Juan Pérez (especialidad: Medicina General)
- 1 paciente: Carlos López (birthDate: 1990-05-15)
- 5 prescripciones:
  - RX-001: pending (Amoxicilina + Paracetamol)
  - RX-002: consumed (Ibuprofeno)
  - RX-003: pending (Vitamina C + Omeprazol)
  - RX-004: consumed (Dipirona)
  - RX-005: pending (Loratadina)

---

## Fase 3: Core Auth ✅

### Implementado
- [x] Módulo de autenticación JWT + Refresh Tokens (acceso 15 min, refresh 7 días)
- [x] Refresh tokens almacenados como hash bcrypt en `User.refreshTokenHash`
- [x] `JwtAuthGuard` global + `RolesGuard` global (via `APP_GUARD`)
- [x] Decorator `@Public()` para rutas sin auth, `@Roles()` para RBAC
- [x] Endpoints: `POST /auth/login`, `POST /auth/register`, `POST /auth/refresh`, `GET /auth/profile`, `POST /auth/logout`
- [x] DTOs con class-validator (whitelist + transform)
- [x] `HttpExceptionFilter` global — respuestas `{ message, code, details? }`
- [x] Helmet, CORS, `ThrottlerModule` (100 req/60s global; 10 req/60s en auth)

---

## Fase 4: Módulos de Negocio ✅

### Users Module ✅
- [x] `GET /users?role=&query=&page=&limit=` (paginado)
- [x] `GET /patients?page=&limit=`
- [x] `GET /doctors?page=&limit=`

### Prescriptions Module ✅
- [x] `POST /prescriptions` (doctor — crea con ítems manuales)
- [x] `GET /prescriptions?status=&from=&to=&page=&limit=&order=` (doctor — sólo las propias)
- [x] `GET /prescriptions/:id` (doctor + paciente propietario + admin)
- [x] `GET /me/prescriptions?status=&page=&limit=` (paciente)
- [x] `PUT /prescriptions/:id/consume` (paciente)
- [x] `GET /prescriptions/:id/pdf` (paciente + admin) — PDF con QR ✅
- [x] `GET /admin/prescriptions?status=&doctorId=&patientId=&from=&to=&page=&limit=`

### Admin Module ✅
- [x] `GET /admin/metrics?from=&to=` — totals, byStatus, byDay, topDoctors

---

## Fase 5: Frontend ✅

### Páginas implementadas
- [x] `/login` — autenticación email/password, redirección por rol
- [x] `/doctor/prescriptions` — listado propio, filtro por estado, skeleton loading
- [x] `/doctor/prescriptions/new` — formulario con ítems dinámicos add/remove
- [x] `/doctor/prescriptions/[id]` — detalle de prescripción
- [x] `/patient/prescriptions` — listado de prescripciones propias
- [x] `/patient/prescriptions/[id]` — detalle, botón "Marcar consumida", botón "Descargar PDF"
- [x] `/admin` — dashboard: tarjetas de totales, por estado, top 10 doctores, prescripciones por día, filtros por fecha

### Features UX ✅
- [x] Protección de rutas por rol (`AuthGuard`)
- [x] Toasts para feedback (creado, consumido, error, logout)
- [x] Estados de carga (Skeleton), error y vacío en todos los listados
- [x] Responsive (grid/cards)
- [x] Dark/Light theme con botón toggle y persistencia en localStorage ✅ (Plus)

### Pendiente en frontend
- [ ] Persistencia de filtros en querystring (URL params)
- [ ] Controles de paginación en listados (actualmente carga hasta 50 registros)

---

## Fase 6: Testing y Documentación ✅

### Backend — Tests unitarios
- [x] `auth.service.spec.ts`
- [x] `prescriptions.service.spec.ts`
- [x] `admin.service.spec.ts`
- [x] `roles.guard.spec.ts`
- [x] `app.controller.spec.ts`

### Backend — Tests e2e
- [x] `test/app.e2e-spec.ts`
- [x] `test/prescriptions.e2e-spec.ts`

### Frontend — Tests de componentes
- [x] `AuthGuard.test.tsx`
- [x] `Navbar.test.tsx`

### Documentación
- [x] `README.md` con setup local, variables de entorno, scripts, cuentas de prueba
- [ ] Swagger / OpenAPI en `/docs` — **pendiente**

---

## Plus (Opcionales)

| Feature | Estado |
|---------|--------|
| PDF con QR apuntando a `/patient/prescriptions/:id` | ✅ Implementado |
| Dark/Light theme con persistencia | ✅ Implementado |
| Swagger en `/docs` | ⬜ Pendiente |
| Panel admin para crear usuarios | ⬜ Pendiente (seeds cubren el requisito mínimo) |
| Auditoría de cambios de estado | ⬜ Pendiente |
| Notificaciones por email | ⬜ Pendiente |
| Búsqueda avanzada (texto libre en ítems/notas) | ⬜ Pendiente |
| SSE/WebSocket para métricas en vivo | ⬜ Pendiente |
