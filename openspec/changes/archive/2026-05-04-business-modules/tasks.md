## 1. Users Module

- [x] 1.1 Crear users.module.ts, users.controller.ts, users.service.ts
- [x] 1.2 Implementar GET /doctors con paginación y filtro por specialty
- [x] 1.3 Implementar GET /patients con paginación
- [x] 1.4 Implementar GET /users?role=doctor|patient con filtros

## 2. Prescriptions Module - Core

- [x] 2.1 Crear prescriptions.module.ts, prescriptions.controller.ts, prescriptions.service.ts
- [x] 2.2 Implementar DTOs (CreatePrescriptionDto, ConsumePrescriptionDto, PrescriptionQueryDto)
- [x] 2.3 Implementar POST /prescriptions - crear prescripción con ítems
- [x] 2.4 Implementar GET /prescriptions?mine=true - listar propias con filtros
- [x] 2.5 Implementar GET /prescriptions/:id - detalhar prescripción

## 3. Prescriptions Module - Paciente

- [x] 3.1 Implementar GET /me/prescriptions - listar prescripciones del paciente
- [x] 3.2 Implementar PUT /prescriptions/:id/consume - marcar como consumida
- [x] 3.3 Validar ownership en endpoints de paciente

## 4. PDF Generation

- [x] 4.1 Implementar servicio de generación PDF con PDFKit
- [x] 4.2 Incluir datos de paciente, médico, fecha, código
- [x] 4.3 Incluir lista de ítems
- [x] 4.4 Generar QR code con código de prescripción
- [x] 4.5 Implementar GET /prescriptions/:id/pdf

## 5. Admin Module

- [x] 5.1 Crear admin.module.ts, admin.controller.ts, admin.service.ts
- [x] 5.2 Implementar GET /admin/metrics - totales
- [x] 5.3 Implementar métricas por estado (pending, consumed)
- [x] 5.4 Implementar métricas por día (últimos 30 días)
- [x] 5.5 Implementar top doctors por volumen
- [x] 5.6 Proteger con @Roles('admin')

## 6. Integración

- [x] 6.1 Importar UsersModule en app.module.ts
- [x] 6.2 Importar PrescriptionsModule en app.module.ts
- [x] 6.3 Importar AdminModule en app.module.ts
- [x] 6.4 Probar flujos por rol