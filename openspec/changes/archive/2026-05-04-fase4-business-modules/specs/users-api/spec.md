## ADDED Requirements

### Requirement: List users with pagination and role filter
The system SHALL provide `GET /users` returning a paginated list of users. The endpoint SHALL accept `role` (admin|doctor|patient), `query` (partial name/email match), `page`, `limit`, and `order` query parameters. Only users with role `admin` SHALL access this endpoint.

#### Scenario: Admin lists all users
- **WHEN** an admin calls `GET /users`
- **THEN** the response is HTTP 200 with `{ data: User[], total, page, limit }`

#### Scenario: Admin filters by role
- **WHEN** an admin calls `GET /users?role=doctor`
- **THEN** only users with role `doctor` are returned

#### Scenario: Non-admin access is forbidden
- **WHEN** a doctor or patient calls `GET /users`
- **THEN** the response is HTTP 403

### Requirement: List patients with pagination
The system SHALL provide `GET /patients` returning a paginated list of patients including their associated `User` fields (name, email). Accessible by `admin` and `doctor` roles.

#### Scenario: Doctor lists patients
- **WHEN** a doctor calls `GET /patients`
- **THEN** the response is HTTP 200 with paginated patient records including `user.name` and `user.email`

#### Scenario: Patient role is forbidden
- **WHEN** a patient calls `GET /patients`
- **THEN** the response is HTTP 403

### Requirement: List doctors with pagination
The system SHALL provide `GET /doctors` returning a paginated list of doctors including `User` fields and `specialty`. Accessible by `admin` role only.

#### Scenario: Admin lists doctors
- **WHEN** an admin calls `GET /doctors`
- **THEN** the response is HTTP 200 with paginated doctor records including `user.name`, `user.email`, and `specialty`

#### Scenario: Non-admin access is forbidden
- **WHEN** a doctor or patient calls `GET /doctors`
- **THEN** the response is HTTP 403
