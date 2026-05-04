## 1. Shared Common DTOs

- [ ] 1.1 Create `src/common/dto/pagination.dto.ts` with `page` (default 1), `limit` (default 10, max 100), `order` (`asc`|`desc`, default `desc`) using class-validator decorators

## 2. UsersModule — Expand Service and Add Controller

- [ ] 2.1 Add `findAll(filters: { role?, query?, page, limit, order })` to `src/users/users.service.ts` — paginated query with optional role and name/email partial match
- [ ] 2.2 Add `findAllPatients(page, limit, order)` and `findAllDoctors(page, limit, order)` to `UsersService` — includes nested `user` relation
- [ ] 2.3 Create `src/users/users.controller.ts` with `GET /users` (admin only), `GET /patients` (admin|doctor), `GET /doctors` (admin only), all using `@Roles()` decorator
- [ ] 2.4 Register `UsersController` in `src/users/users.module.ts`

## 3. PrescriptionsModule — DTOs

- [ ] 3.1 Create `src/prescriptions/dto/create-prescription.dto.ts` with `patientId`, optional `notes`, and `items` array (validated: non-empty, each item has `name`, optional `dosage`/`quantity`/`instructions`)
- [ ] 3.2 Create `src/prescriptions/dto/list-prescriptions.dto.ts` extending `PaginationDto` with optional `status` (enum), `from`, `to` (ISO date strings via `@IsDateString()`)
- [ ] 3.3 Create `src/prescriptions/dto/admin-list-prescriptions.dto.ts` extending `ListPrescriptionsDto` with optional `doctorId` and `patientId`

## 4. PrescriptionsModule — Service

- [ ] 4.1 Create `src/prescriptions/prescriptions.service.ts` with `create(doctorUserId, dto)` — looks up Doctor by userId, verifies Patient exists, generates unique `code` (UUID prefix), creates Prescription with items in a transaction
- [ ] 4.2 Add `findAllForDoctor(doctorUserId, filters)` to `PrescriptionsService` — filters by authorId, status, date range, paginated
- [ ] 4.3 Add `findOne(id, requestingUser)` to `PrescriptionsService` — returns full detail (items + patient.user + author.user), enforces ownership (doctor sees own, patient sees own, admin sees all)
- [ ] 4.4 Add `findAllForPatient(patientUserId, filters)` to `PrescriptionsService` — filters by patientId, status, paginated
- [ ] 4.5 Add `consume(id, patientUserId)` to `PrescriptionsService` — verifies ownership and `pending` status, sets `status: consumed` and `consumedAt: now()`, throws 409 if already consumed
- [ ] 4.6 Add `generatePdf(id, requestingUser)` to `PrescriptionsService` — verifies ownership (patient or admin), fetches full prescription, builds PDF Buffer using pdfkit + qrcode
- [ ] 4.7 Add `findAllAdmin(filters)` to `PrescriptionsService` — no ownership filter, supports `doctorId`/`patientId` extra filters, paginated

## 5. PrescriptionsModule — Controller

- [ ] 5.1 Create `src/prescriptions/prescriptions.controller.ts` with route `POST /prescriptions` — `@Roles('doctor')`, calls `service.create(req.user.sub, dto)`
- [ ] 5.2 Add `GET /prescriptions` route — `@Roles('doctor')`, calls `service.findAllForDoctor(req.user.sub, query)`
- [ ] 5.3 Add `GET /prescriptions/:id` route — `@Roles('doctor', 'patient', 'admin')`, calls `service.findOne(id, req.user)`
- [ ] 5.4 Add `GET /me/prescriptions` route — `@Roles('patient')`, calls `service.findAllForPatient(req.user.sub, query)`
- [ ] 5.5 Add `PUT /prescriptions/:id/consume` route — `@Roles('patient')`, calls `service.consume(id, req.user.sub)`
- [ ] 5.6 Add `GET /prescriptions/:id/pdf` route — `@Roles('patient', 'admin')`, calls `service.generatePdf(id, req.user)`, streams response with `Content-Type: application/pdf` and `Content-Disposition: attachment`
- [ ] 5.7 Add `GET /admin/prescriptions` route — `@Roles('admin')`, calls `service.findAllAdmin(query)`

## 6. PrescriptionsModule — Wire Up

- [ ] 6.1 Create `src/prescriptions/prescriptions.module.ts` importing `PrismaModule` (global, no explicit import needed) and registering `PrescriptionsService` and `PrescriptionsController`
- [ ] 6.2 Add `PrescriptionsModule` to imports in `src/app.module.ts`

## 7. AdminModule — Metrics

- [ ] 7.1 Create `src/admin/admin.service.ts` with `getMetrics(from?, to?)`:
  - `totals`: parallel `prisma.user.count` for each role + `prisma.prescription.count`
  - `byStatus`: `prisma.prescription.groupBy` by `status` with optional date filter
  - `byDay`: `prisma.$queryRaw` to group by date (truncate `createdAt` to day), scoped to date range or last 30 days
  - `topDoctors`: `prisma.prescription.groupBy` by `authorId` ordered by `_count.id desc`, limit 10, joined with doctor name
- [ ] 7.2 Create `src/admin/dto/metrics-query.dto.ts` with optional `from` and `to` `@IsDateString()` fields
- [ ] 7.3 Create `src/admin/admin.controller.ts` with `GET /admin/metrics` — `@Roles('admin')`, calls `adminService.getMetrics(query.from, query.to)`
- [ ] 7.4 Create `src/admin/admin.module.ts` registering `AdminService` and `AdminController`
- [ ] 7.5 Add `AdminModule` to imports in `src/app.module.ts`

## 8. Testing

- [ ] 8.1 Write unit tests for `PrescriptionsService.create()` — mock PrismaService, verify Doctor lookup, Patient existence check, code generation, and item creation
- [ ] 8.2 Write unit tests for `PrescriptionsService.consume()` — verify ownership check, 409 on already-consumed, and `consumedAt` is set
- [ ] 8.3 Write unit tests for `AdminService.getMetrics()` — mock Prisma calls, verify response shape has all four keys
