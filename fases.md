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
- `packages/backend/.env` - DATABASE_URL, JWT secrets, APP_PORT
- `packages/frontend/.env.local` - NEXT_PUBLIC_API_URL

### Migración
- `prisma migrate dev` aplicado

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

### Objetivos completados
- [x] Módulo de autenticación JWT + Refresh Tokens
- [x] Estrategia de login/logout
- [x] Guards de RBAC (@Roles decorator)
- [x] Endpoints: /auth/login, /auth/register, /auth/refresh, /auth/profile
- [x] DTOs con class-validator
- [x] Filtro de excepciones global
- [x] Configuración: Helmet, CORS, rate limit

### Archivos creados
```
src/auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── dto/
│   ├── login.dto.ts
│   └── register.dto.ts
├── strategies/
│   ├── jwt.strategy.ts
│   └── refresh.strategy.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   └── roles.guard.ts
├── decorators/
│   ├── roles.decorator.ts
│   └── current-user.decorator.ts
└── filters/
    └── http-exception.filter.ts
```

---

## Fase 4: Módulos de Negocio ✅

### Users Module
- [x] GET /users (listado con filtros)
- [x] GET /patients, GET /doctors

### Prescriptions Module
- [x] POST /prescriptions (crear prescripción con ítems)
- [x] GET /prescriptions (listado con paginación/filtros)
- [x] GET /prescriptions/:id
- [x] PUT /prescriptions/:id/consume (marcar consumida)
- [x] GET /prescriptions/:id/pdf (descargar PDF)

### Admin Module
- [x] GET /admin/metrics (totales, por estado, por día, top doctors)

### Archivos creados
```
src/users/
├── users.module.ts
├── users.controller.ts
└── users.service.ts

src/prescriptions/
├── prescriptions.module.ts
├── prescriptions.controller.ts
├── patient-prescriptions.controller.ts
├── prescriptions.service.ts
├── pdf.service.ts
└── dto/
    └── prescription.dto.ts

src/admin/
├── admin.module.ts
├── admin.controller.ts
└── admin.service.ts
```

---

## Fase 5: Frontend ✅

### Páginas
- [x] `/login` - Autenticación
- [x] `/doctor/prescriptions` - Listado prescripciones
- [x] `/doctor/prescriptions/new` - Crear prescripción
- [x] `/doctor/prescriptions/[id]` - Detalle
- [x] `/patient/prescriptions` - Listado paciente
- [x] `/patient/prescriptions/[id]` - Detalle
- [x] `/admin` - Dashboard con métricas

### Features
- [x] Protección de rutas por rol
- [x] Toasts para feedback
- [x] Estados: loading, error, empty
- [x] Responsive design

### Archivos creados
```
src/
├── lib/api.ts
├── contexts/
│   ├── AuthContext.tsx
│   └── ToastContext.tsx
├── components/
│   └── SessionProvider.tsx
└── app/
    ├── login/
    ├── doctor/prescriptions/
    ├── patient/prescriptions/
    └── admin/
```

---

## Fase 6: Testing y Polish (Pendiente)

### Backend
- Tests unitarios de servicios
- Tests e2e básicos

### Frontend
- Test de componente crítico

### Documentación
- README con setup
- Swagger (plus)

---

## Plus (Opcionales)
- [x] PDF con QR y firma del médico
- [ ] Auditoría de cambios de estado
- [ ] Notificaciones por email
- [ ] Búsqueda avanzada
- [ ] Dark/Light theme
- [ ] SSE/WebSocket para métricas en vivo