## ADDED Requirements

### Requirement: README with setup instructions
The project SHALL have a README with local setup instructions.

#### Scenario: New developer setup
- **WHEN** new developer reads README
- **THEN** can set up project locally following instructions

#### Scenario: Run backend
- **WHEN** developer follows instructions
- **THEN** backend runs on port 3001

#### Scenario: Run frontend
- **WHEN** developer follows instructions
- **THEN** frontend runs on port 3000

### Requirement: Test credentials documented
The system SHALL document test credentials for verification.

#### Scenario: Access test accounts
- **WHEN** developer reads README
- **THEN** knows how to login with test accounts

### Requirement: Swagger API documentation (Plus)
The system SHALL expose Swagger UI at /docs endpoint.

#### Scenario: Access Swagger
- **WHEN** developer navigates to /docs
- **THEN** sees API documentation