# doctor-ui Specification

## Purpose
TBD - created by archiving change fase5-frontend. Update Purpose after archive.
## Requirements
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

### Requirement: Doctor creates a new prescription
The system SHALL provide `/doctor/prescriptions/new` with a form to create a prescription. The form SHALL include: patient selector (dropdown populated from `GET /patients`), optional notes, and a dynamic list of medication items (name, dosage, quantity, instructions) with add/remove controls. On submit it SHALL call `POST /prescriptions` and redirect to the new prescription's detail page on success.

#### Scenario: Valid form submission creates a prescription
- **WHEN** a doctor fills in patient, at least one item, and submits
- **THEN** a POST /prescriptions request is made and on success the doctor is redirected to the new prescription's detail page

#### Scenario: Form with no items cannot be submitted
- **WHEN** a doctor attempts to submit without adding any items
- **THEN** a validation error is shown and the form is not submitted

#### Scenario: API error is shown as a toast
- **WHEN** the API returns an error during creation
- **THEN** an error toast is displayed and the user stays on the form

### Requirement: Doctor views prescription detail
The system SHALL provide `/doctor/prescriptions/[id]` displaying the full prescription: code, status, createdAt, patient info, notes, and the complete list of items (name, dosage, quantity, instructions).

#### Scenario: Doctor views their own prescription
- **WHEN** a doctor navigates to `/doctor/prescriptions/[id]` for a prescription they authored
- **THEN** all prescription fields and items are displayed

#### Scenario: Detail page shows loading skeleton while fetching
- **WHEN** the page loads and the API call is in flight
- **THEN** a skeleton placeholder is shown in place of the content

