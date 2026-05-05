## MODIFIED Requirements

### Requirement: Patient sees a paginated list of their prescriptions
The system SHALL provide `/patient/prescriptions` showing all prescriptions assigned to the authenticated patient via `GET /me/prescriptions`. Each row SHALL display `code`, `doctor name`, `createdAt`, and `status`. The page SHALL support loading, error, and empty states. The `status` filter value SHALL be persisted in the URL as `?status=<value>`, read on mount, and updated via `router.replace` on every filter change. Clearing the filter SHALL remove the `status` param from the URL.

#### Scenario: Patient views their prescription list
- **WHEN** a patient navigates to `/patient/prescriptions`
- **THEN** a list of their prescriptions is displayed with code, doctor name, date, and status badge

#### Scenario: Empty list shows an informative empty state
- **WHEN** the patient has no prescriptions
- **THEN** a message indicating no prescriptions are available is shown

#### Scenario: Status filter persists on page reload
- **WHEN** a user refreshes the page while the URL contains `?status=pending`
- **THEN** the status filter selector shows "pending" and the list is filtered accordingly

#### Scenario: Shareable URL loads correct filter state
- **WHEN** a user opens `/patient/prescriptions?status=consumed`
- **THEN** the page loads with the consumed filter active
