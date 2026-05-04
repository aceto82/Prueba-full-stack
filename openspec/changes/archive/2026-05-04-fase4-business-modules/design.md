## Context

Phase 3 delivered a fully functional auth layer: `JwtAuthGuard` is global (all routes protected by default), `RolesGuard` is global, and the `PrismaService` is available everywhere via the global `PrismaModule`. The `UsersService` already exists with `findByEmail` and `findById` — it will be extended here.

The Prisma schema has all necessary models: `User`, `Doctor`, `Patient`, `Prescription`, `PrescriptionItem`. No schema changes are required for Phase 4.

PDFKit and qrcode are already installed. The prescription `code` field (unique) is the QR payload.

## Goals / Non-Goals

**Goals:**
- Paginated, filterable list endpoints for users, patients, doctors (admin/doctor-scoped)
- Full prescription lifecycle: create → list → detail → consume → PDF
- Admin metrics aggregation using Prisma aggregates and `groupBy`
- PDF with patient/doctor info, prescription items, QR code linking to the patient view

**Non-Goals:**
- Frontend integration (Phase 5)
- Email notifications (optional Plus)
- Audit log table (optional Plus)
- Real-time metrics via SSE/WebSocket (optional Plus)
- User creation via admin panel (seed is sufficient per spec)

## Decisions

### 1. Module layout: separate UsersModule expansion, PrescriptionsModule, AdminModule
Each module gets its own folder. `UsersModule` gains a controller and additional service methods. `PrescriptionsModule` is self-contained. `AdminModule` has a single controller+service for metrics.

### 2. Pagination via a shared `PaginationDto`
A reusable DTO in `src/common/dto/pagination.dto.ts` with `page` (default 1), `limit` (default 10, max 100), `order` (`asc`|`desc`, default `desc`). All list endpoints extend or include this DTO.

### 3. Doctor identity via JWT sub → Doctor record lookup
When a doctor calls `POST /prescriptions`, the controller reads `req.user.sub` (the User ID from the JWT), then the service looks up the corresponding `Doctor` record by `userId`. This avoids requiring the client to know the `doctorId`.

### 4. Patient identity for `GET /me/prescriptions` and `PUT /prescriptions/:id/consume`
Same pattern: JWT `sub` → Patient record lookup. The service verifies ownership before allowing consume or PDF download.

### 5. PDF generation: synchronous `pdfkit` stream piped to response
`pdfkit` creates a `PDFDocument`, pipes it directly to the HTTP response with `Content-Type: application/pdf`. QR code is rendered as a PNG `Buffer` via `qrcode.toBuffer()` and embedded in the PDF with `doc.image()`. No temp files needed.

### 6. Metrics via raw Prisma `groupBy` + `count`
`AdminService` runs three parallel queries: total counts (`prisma.user.count` per role), status groupBy, and daily groupBy (`createdAt` truncated to date). `topDoctors` uses `prisma.prescription.groupBy` by `authorId` ordered by `_count.id` desc, limited to 10.

### 7. `from` / `to` date filters on list endpoints
Parsed as ISO date strings, converted to `Date` objects, and used as Prisma `gte`/`lte` filters on `createdAt`. Invalid dates return HTTP 400 via `ValidationPipe` with `@IsDateString()` decorator.

## Risks / Trade-offs

- **Daily groupBy in Postgres**: Prisma's `groupBy` doesn't support date truncation directly. We use a raw query (`$queryRaw`) for the `byDay` metric to truncate `createdAt` to a date. Mitigation: typed with Prisma's `Sql` template tag.
- **PDF generation blocking the event loop**: `pdfkit` is synchronous. For this MVP scale it's acceptable; at high load a worker thread would be needed.
- **Doctor/Patient lookup on every request**: Two extra DB reads per protected request (user→doctor, user→patient). Acceptable at MVP scale; can be cached later.

## Migration Plan

No DB migrations required. Steps:
1. Expand `UsersService` with new query methods
2. Add `UsersController` with paginated endpoints
3. Build `PrescriptionsModule` (service → controller → module)
4. Build `AdminModule` (service → controller → module)
5. Register new modules in `AppModule`
6. Add unit tests for services
