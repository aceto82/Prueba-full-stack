## MODIFIED Requirements

### Requirement: Doctor sees a paginated list of their prescriptions
The system SHALL provide `/doctor/prescriptions` showing all prescriptions authored by the authenticated doctor. The page SHALL support `status` filter (all / pending / consumed) and display `code`, `patient name`, `createdAt`, and `status` for each row. It SHALL handle loading, error, and empty states. The `status` filter value SHALL be persisted in the URL as `?status=<value>`, read on mount, and updated via `router.replace` on every filter change. Clearing the filter SHALL remove the `status` param from the URL.

#### Scenario: Doctor views their prescription list
- **WHEN** a doctor navigates to `/doctor/prescriptions`
- **THEN** a table or card list of their prescriptions is displayed with code, patient name, date, and status

#### Scenario: Status filter narrows results
- **WHEN** a doctor selects the "pending" filter
- **THEN** only prescriptions with status `pending` are shown and the URL updates to `?status=pending`

#### Scenario: Empty list shows an empty state message
- **WHEN** the doctor has no prescriptions
- **THEN** a message indicating no prescriptions exist is displayed along with a link to create one

#### Scenario: Status filter persists on page reload
- **WHEN** a user refreshes the page while the URL contains `?status=consumed`
- **THEN** the status filter selector shows "consumed" and the list is filtered accordingly

#### Scenario: Shareable URL loads correct filter state
- **WHEN** a user opens `/doctor/prescriptions?status=pending`
- **THEN** the page loads with the pending filter active
