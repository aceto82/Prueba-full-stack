## Why

With the auth layer complete (Phase 3), the core domain logic is still missing: doctors cannot create prescriptions, patients cannot view or consume them, and admins have no metrics. These are the primary workflows of the MVP and must be built before the frontend can be connected.

## What Changes

- New `UsersModule` endpoints: list users/patients/doctors with pagination and filters (for admin and internal use)
- New `PrescriptionsModule` with full CRUD for the prescription lifecycle: create (doctor), list/detail, consume (patient), PDF download (patient)
- New `AdminModule` with a metrics endpoint aggregating totals, status breakdown, daily counts, and top-doctors
- Soft pagination and filtering (`status`, `from`, `to`, `page`, `limit`, `order`) on all list endpoints
- PDF generation backend using `pdfkit` with QR code embed using `qrcode`
- Role-based access enforcement on every new endpoint via existing `@Roles()` + `RolesGuard`

## Capabilities

### New Capabilities
- `users-api`: Paginated listing of users, patients, and doctors with role-based access
- `prescriptions-api`: Full prescription lifecycle — create, list, detail, consume, PDF download
- `admin-metrics`: Admin-only aggregated metrics endpoint (totals, by-status, by-day, top-doctors)

### Modified Capabilities
<!-- No existing specs change requirements — new modules only -->

## Impact

- **Backend**: New NestJS modules `src/users/`, `src/prescriptions/`, `src/admin/` with controllers, services, and DTOs
- **APIs**: 10+ new endpoints, all protected by `JwtAuthGuard` + role guards
- **Dependencies**: `pdfkit` and `qrcode` already installed; no new packages needed
- **DB**: No schema changes — uses existing `Prescription`, `PrescriptionItem`, `Doctor`, `Patient`, `User` models
- **Auth integration**: All endpoints use the guards and decorators from Phase 3
