## ADDED Requirements

### Requirement: Frontend tests execute with Vitest
The system SHALL run frontend tests using Vitest instead of Jest.

#### Scenario: Run tests
- **WHEN** developer runs `npm run test`
- **THEN** tests execute without errors

### Requirement: Login component has passing test
The system SHALL have at least one passing test for Login component.

#### Scenario: Login renders
- **WHEN** Login component renders
- **THEN** email and password inputs are present