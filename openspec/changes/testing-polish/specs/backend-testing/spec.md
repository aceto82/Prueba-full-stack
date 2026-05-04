## ADDED Requirements

### Requirement: Backend has unit tests for AuthService
The system SHALL have unit tests for AuthService covering login and register.

#### Scenario: Login with valid credentials
- **WHEN** login is called with valid credentials
- **THEN** returns accessToken and refreshToken

#### Scenario: Login with invalid credentials
- **WHEN** login is called with invalid credentials
- **THEN** throws UnauthorizedException

### Requirement: Backend has unit tests for PrescriptionsService
The system SHALL have unit tests for PrescriptionsService covering create and consume.

#### Scenario: Create prescription
- **WHEN** createPrescription is called with valid data
- **THEN** returns created prescription with code

#### Scenario: Consume prescription
- **WHEN** consumePrescription is called for pending prescription
- **THEN** updates status to consumed

### Requirement: Backend has e2e tests
The system SHALL have e2e tests for critical API endpoints.

#### Scenario: POST /auth/login e2e
- **WHEN** POST /auth/login is called with valid credentials
- **THEN** returns 200 with tokens

#### Scenario: POST /prescriptions e2e
- **WHEN** doctor creates prescription
- **THEN** returns 201 with prescription data

#### Scenario: PUT /prescriptions/:id/consume e2e
- **WHEN** patient consumes prescription
- **THEN** returns 200 with updated status