## Why

La aplicación de prescripciones médicas necesita módulos de negocio para completar el flujo principal: médicos crean prescripciones, pacientes las consumen y ven, y admins ven métricas. Sin estos módulos, el sistema no cumple su propósito core.

## What Changes

- **Users Module**: Endpoints para listar usuarios por rol (doctors, patients) - necesario para que el médico selectable pacientes al crear prescripciones
- **Prescriptions Module**: CRUD completo de prescripciones - crear, listar, detalhar, consumir, PDF
- **Admin Module**: Métricas totales del sistema
- **PDF Generation**: Generación de PDF con datos de prescripción (utilizando PDFKit ya instalado)

## Capabilities

### New Capabilities
- `user-listings`: Listado de usuarios con filtros por rol (doctors, patients)
- `prescription-management`: Crear, listar, detalhar, consumir prescripciones
- `prescription-pdf`: Generación de PDF de prescripción
- `admin-metrics`: Dashboard de métricas para admin

### Modified Capabilities
- (Ninguno - autenticación ya completada en Fase 3)

## Impact

- Backend: Nuevo módulo `src/users/`, `src/prescriptions/`, `src/admin/`
- APIs afectadas: Todas las de prescripciones y usuarios
- Dependencias: PDFKit (ya instalado), QRCode (ya instalado)
- Frontend: Necesita consumir estos endpoints