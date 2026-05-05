## ADDED Requirements

### Requirement: Prescriptions API has e2e test coverage
The system SHALL have e2e tests for the prescriptions API using the seeded test database. Tests SHALL cover creating a prescription (as doctor), listing prescriptions, retrieving prescription detail, marking a prescription as consumed (as patient), and downloading the PDF. Tests SHALL assert HTTP status codes and key response body fields. Tests SHALL run without resetting the database, operating on seeded records plus records they create themselves.

#### Scenario: Doctor creates a prescription
- **WHEN** a POST /prescriptions request is made with a valid doctor token, a known patientId, and at least one item
- **THEN** the response is 201 and the body contains `id`, `code` starting with `RX-`, and `status: "pending"`

#### Scenario: Doctor lists their prescriptions
- **WHEN** a GET /prescriptions request is made with a valid doctor token
- **THEN** the response is 200 and the body contains a `data` array and a `total` count

#### Scenario: Status filter returns only matching prescriptions
- **WHEN** a GET /prescriptions?status=pending request is made with a valid doctor token
- **THEN** every item in the returned `data` array has `status: "pending"`

#### Scenario: Doctor retrieves prescription detail
- **WHEN** a GET /prescriptions/:id request is made with a valid doctor token for an existing prescription
- **THEN** the response is 200 and the body contains `code`, `status`, `patient`, `author`, and `items`

#### Scenario: Unauthenticated request is rejected
- **WHEN** a GET /prescriptions request is made without an Authorization header
- **THEN** the response is 401

#### Scenario: Patient consumes a pending prescription
- **WHEN** a PUT /prescriptions/:id/consume request is made with a valid patient token for a pending prescription belonging to that patient
- **THEN** the response is 200 and the returned prescription has `status: "consumed"` and a non-null `consumedAt`

#### Scenario: Consuming an already-consumed prescription is rejected
- **WHEN** a PUT /prescriptions/:id/consume request is made for a prescription that is already consumed
- **THEN** the response is 409

#### Scenario: PDF download returns a PDF binary
- **WHEN** a GET /prescriptions/:id/pdf request is made with a valid token for an existing prescription
- **THEN** the response is 200 and the `content-type` header contains `application/pdf`

### Requirement: Admin metrics API has e2e test coverage
The system SHALL have e2e tests for the admin metrics endpoint. Tests SHALL cover the default (no filters) response shape and a date-filtered request. Tests SHALL assert that only admin users can access the endpoint.

#### Scenario: Admin retrieves metrics without date filter
- **WHEN** a GET /admin/metrics request is made with a valid admin token
- **THEN** the response is 200 and the body contains `totals`, `byStatus`, `byDay`, and `topDoctors`

#### Scenario: Metrics totals contain all three counts
- **WHEN** a GET /admin/metrics request is made with a valid admin token
- **THEN** `totals.doctors`, `totals.patients`, and `totals.prescriptions` are all non-negative integers

#### Scenario: Date-filtered metrics request is accepted
- **WHEN** a GET /admin/metrics?from=2020-01-01&to=2030-12-31 request is made with a valid admin token
- **THEN** the response is 200 and the body shape is identical to the unfiltered response

#### Scenario: Non-admin is forbidden from accessing metrics
- **WHEN** a GET /admin/metrics request is made with a valid doctor token
- **THEN** the response is 403

#### Scenario: Unauthenticated metrics request is rejected
- **WHEN** a GET /admin/metrics request is made without an Authorization header
- **THEN** the response is 401
