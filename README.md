# Prueba Full-Stack - App de Prescripciones

Sistema de prescripciones médicas con 3 roles: Médico, Paciente, Admin.

## Stack

- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: Next.js + React + TailwindCSS
- **Auth**: JWT + Refresh Tokens

## Requisitos

- Node.js 18+
- PostgreSQL
- npm

## Setup

```bash
# Instalar dependencias
npm install

# Instalar dependencias de cada paquete
npm install --workspace=packages/backend
npm install --workspace=packages/frontend

# Database
cd packages/backend
cp .env.example .env  # Configurar DATABASE_URL
npx prisma migrate dev
npx prisma db seed

# Desarrollo
npm run dev          # Frontend en puerto 3000
npm run dev --workspace=packages/backend  # Backend en puerto 3001
```

## Credenciales de Prueba

| Email | Rol | Contraseña |
|-------|-----|------------|
| admin@test.com | admin | password123 |
| dr@test.com | doctor | password123 |
| patient@test.com | patient | password123 |

## Scripts

```bash
# Desarrollo
npm run dev              # Frontend :3000
npm run dev --workspace=packages/backend   # Backend :3001

# Tests
npm run test --workspace=packages/backend
npm run test:e2e --workspace=packages/backend
npm run test --workspace=packages/frontend

# Build
npm run build
npm run build --workspace=packages/backend
npm run build --workspace=packages/frontend
```

## API

- Base URL: `http://localhost:3001`
- Swagger: `http://localhost:3001/docs`

### Endpoints

- `POST /auth/login` - Autenticación
- `POST /auth/register` - Registro
- `POST /auth/refresh` - Refresh token
- `GET /auth/profile` - Perfil

- `GET /prescriptions` - Lista prescripciones
- `POST /prescriptions` - Crear prescripción
- `GET /prescriptions/:id` - Detalle
- `PUT /prescriptions/:id/consume` - Consumir
- `GET /prescriptions/:id/pdf` - Descargar PDF

- `GET /admin/metrics` - Métricas

## Decisiones Técnicas

- JWT + Refresh Tokens con rotación
- RBAC con Guards/Decorators
- PDF con QR para verificación
- Paginación y filtros en listados