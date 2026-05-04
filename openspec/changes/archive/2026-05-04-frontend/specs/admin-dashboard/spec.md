## ADDED Requirements

### Requirement: Admin can view metrics dashboard
The system SHALL display an admin dashboard with key metrics.

#### Scenario: View metrics
- **WHEN** admin navigates to /admin
- **THEN** system shows total doctors, patients, prescriptions counts

#### Scenario: View by status chart
- **WHEN** admin views dashboard
- **THEN** system displays chart showing pending vs consumed prescriptions

#### Scenario: View by day chart
- **WHEN** admin views dashboard
- **THEN** system displays line chart showing prescriptions by day (last 30 days)

#### Scenario: View top doctors
- **WHEN** admin views dashboard
- **THEN** system displays list of top doctors by prescription count