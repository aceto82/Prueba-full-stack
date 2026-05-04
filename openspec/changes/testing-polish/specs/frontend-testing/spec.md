## ADDED Requirements

### Requirement: Frontend has component tests
The system SHALL have component tests for critical React components.

#### Scenario: Login form renders
- **WHEN** login page renders
- **THEN** shows email and password inputs

#### Scenario: Login form validation
- **WHEN** user submits without credentials
- **THEN** shows validation errors

#### Scenario: Successful login redirects
- **WHEN** user logs in successfully
- **THEN** redirects to role-based dashboard