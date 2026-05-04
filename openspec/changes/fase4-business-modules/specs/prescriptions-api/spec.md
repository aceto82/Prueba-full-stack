## ADDED Requirements

### Requirement: Doctor creates a prescription
The system SHALL allow a doctor to create a prescription via `POST /prescriptions`. The body SHALL include `patientId`, optional `notes`, and an `items` array (each with `name`, optional `dosage`, `quantity`, `instructions`). The system SHALL auto-generate a unique `code` for the prescription. The prescription is associated with the authenticated doctor's `Doctor` record.

#### Scenario: Successful prescription creation
- **WHEN** a doctor posts a valid body to `POST /prescriptions`
- **THEN** the response is HTTP 201 with the created prescription including its `code`, `status: "pending"`, and the full `items` array

#### Scenario: Non-doctor is forbidden
- **WHEN** a patient calls `POST /prescriptions`
- **THEN** the response is HTTP 403

#### Scenario: Invalid patient ID returns 404
- **WHEN** the `patientId` does not correspond to an existing patient
- **THEN** the response is HTTP 404

#### Scenario: Items array is required and non-empty
- **WHEN** `POST /prescriptions` is called with an empty `items` array
- **THEN** the response is HTTP 400

### Requirement: Doctor lists own prescriptions
The system SHALL provide `GET /prescriptions` for doctors, returning only prescriptions authored by the authenticated doctor. Supports filters: `status` (pending|consumed), `from`, `to` (ISO date strings), `page`, `limit`, `order`. Default order is `createdAt DESC`.

#### Scenario: Doctor sees only own prescriptions
- **WHEN** a doctor calls `GET /prescriptions`
- **THEN** only prescriptions where `authorId` matches the doctor's `Doctor.id` are returned

#### Scenario: Status filter works
- **WHEN** a doctor calls `GET /prescriptions?status=pending`
- **THEN** only prescriptions with `status: "pending"` are returned

#### Scenario: Date range filter works
- **WHEN** a doctor calls `GET /prescriptions?from=2025-01-01&to=2025-12-31`
- **THEN** only prescriptions created within that range are returned

### Requirement: Get prescription detail
The system SHALL provide `GET /prescriptions/:id` returning a prescription with its items, patient info, and doctor info. Doctors see only their own; patients see only theirs; admins see all.

#### Scenario: Doctor gets own prescription detail
- **WHEN** a doctor calls `GET /prescriptions/:id` for a prescription they authored
- **THEN** the response is HTTP 200 with full prescription detail including `items`, `patient.user.name`, and `author.user.name`

#### Scenario: Access to another doctor's prescription is forbidden
- **WHEN** a doctor calls `GET /prescriptions/:id` for a prescription authored by a different doctor
- **THEN** the response is HTTP 403

### Requirement: Patient lists own prescriptions
The system SHALL provide `GET /me/prescriptions` for patients, returning only prescriptions assigned to the authenticated patient. Supports `status`, `page`, `limit`, `order` filters.

#### Scenario: Patient sees only own prescriptions
- **WHEN** a patient calls `GET /me/prescriptions`
- **THEN** only prescriptions where `patientId` matches the patient's `Patient.id` are returned

### Requirement: Patient consumes a prescription
The system SHALL allow a patient to change a prescription's status from `pending` to `consumed` via `PUT /prescriptions/:id/consume`. The prescription MUST belong to the authenticated patient. `consumedAt` SHALL be set to the current timestamp. Already-consumed prescriptions SHALL return HTTP 409.

#### Scenario: Patient consumes own pending prescription
- **WHEN** a patient calls `PUT /prescriptions/:id/consume` for a pending prescription they own
- **THEN** the response is HTTP 200, `status` is `"consumed"`, and `consumedAt` is set

#### Scenario: Already consumed prescription returns conflict
- **WHEN** a patient calls `PUT /prescriptions/:id/consume` for an already-consumed prescription
- **THEN** the response is HTTP 409

#### Scenario: Patient cannot consume another patient's prescription
- **WHEN** a patient calls `PUT /prescriptions/:id/consume` for a prescription belonging to a different patient
- **THEN** the response is HTTP 403

### Requirement: Patient downloads prescription PDF
The system SHALL provide `GET /prescriptions/:id/pdf` returning a PDF file with the prescription details. The PDF SHALL include: patient name, doctor name and specialty, prescription code, creation date, status, list of items (name, dosage, quantity, instructions), and a QR code linking to `/patient/prescriptions/:id`. The prescription MUST belong to the authenticated patient (or the user is admin).

#### Scenario: Patient downloads own prescription PDF
- **WHEN** a patient calls `GET /prescriptions/:id/pdf` for their own prescription
- **THEN** the response is HTTP 200 with `Content-Type: application/pdf` and a valid PDF body

#### Scenario: Patient cannot download another patient's prescription PDF
- **WHEN** a patient calls `GET /prescriptions/:id/pdf` for a prescription belonging to another patient
- **THEN** the response is HTTP 403

### Requirement: Admin lists all prescriptions
The system SHALL provide `GET /admin/prescriptions` for admins, returning all prescriptions with filters: `status`, `doctorId`, `patientId`, `from`, `to`, `page`, `limit`.

#### Scenario: Admin lists all prescriptions
- **WHEN** an admin calls `GET /admin/prescriptions`
- **THEN** prescriptions from all doctors and patients are returned with pagination

#### Scenario: Admin filters by doctor
- **WHEN** an admin calls `GET /admin/prescriptions?doctorId=<id>`
- **THEN** only prescriptions authored by that doctor are returned
