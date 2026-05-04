## 1. Users Module

- [ ] 1.1 Crear users.module.ts, users.controller.ts, users.service.ts
- [ ] 1.2 Implementar GET /doctors con paginación y filtro por specialty
- [ ] 1.3 Implementar GET /patients con paginación
- [ ] 1.4 Implementar GET /users?role=doctor|patient con filtros

## 2. Prescriptions Module - Core

- [ ] 2.1 Crear prescriptions.module.ts, prescriptions.controller.ts, prescriptions.service.ts
- [ ] 2.2 Implementar DTOs (CreatePrescriptionDto, ConsumePrescriptionDto, PrescriptionQueryDto)
- [ ] 2.3 Implementar POST /prescriptions - crear prescripción con ítems
- [ ] 2.4 Implementar GET /prescriptions?mine=true - listar propias con filtros
- [ ] 2.5 Implementar GET /prescriptions/:id - detalhar prescripción

## 3. Prescriptions Module - Paciente

- [ ] 3.1 Implementar GET /me/prescriptions - listar prescripciones del paciente
- [ ] 3.2 Implementar PUT /prescriptions/:id/consume - marcar como consumida
- [ ] 3.3 Validar ownership en endpoints de paciente

## 4. PDF Generation

- [ ] 4.1 Implementar servicio de generación PDF con PDFKit
- [ ] 4.2 Incluir datos de paciente, médico, fecha, código
- [ ] 4.3 Incluir lista de ítems
- [ ] 4.4 Generar QR code con código de prescripción
- [ ] 4.5 Implementar GET /prescriptions/:id/pdf

## 5. Admin Module

- [ ] 5.1 Crear admin.module.ts, admin.controller.ts, admin.service.ts
- [ ] 5.2 Implementar GET /admin/metrics - totales
- [ ] 5.3 Implementar métricas por estado (pending, consumed)
- [ ] 5.4 Implementar métricas por día (últimos 30 días)
- [ ] 5.5 Implementar top doctors por volumen
- [ ] 5.6 Proteger con @Roles('admin')

## 6. Integración

- [ ] 6.1 Importar UsersModule en app.module.ts
- [ ] 6.2 Importar PrescriptionsModule en app.module.ts
- [ ] 6.3 Importar AdminModule en app.module.ts
- [ ] 6.4 Probar flujos por rol