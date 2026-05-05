# patient-ui Specification

## Purpose
TBD - created by archiving change fase5-frontend. Update Purpose after archive.
## Requirements
### Requirement: Patient sees a paginated list of their prescriptions
The system SHALL provide `/patient/prescriptions` showing all prescriptions assigned to the authenticated patient via `GET /me/prescriptions`. Each row SHALL display `code`, `doctor name`, `createdAt`, and `status`. The page SHALL support loading, error, and empty states.

#### Scenario: Patient views their prescription list
- **WHEN** a patient navigates to `/patient/prescriptions`
- **THEN** a list of their prescriptions is displayed with code, doctor name, date, and status badge

#### Scenario: Empty list shows an informative empty state
- **WHEN** the patient has no prescriptions
- **THEN** a message indicating no prescriptions are available is shown

### Requirement: Patient views prescription detail with consume and PDF actions
The system SHALL provide `/patient/prescriptions/[id]` displaying full prescription detail: code, status, createdAt, doctor info, notes, and item list. If status is `pending`, a "Marcar como consumida" button SHALL be visible. A "Descargar PDF" button SHALL always be visible and trigger `GET /prescriptions/:id/pdf`.

#### Scenario: Patient views their own prescription detail
- **WHEN** a patient navigates to `/patient/prescriptions/[id]`
- **THEN** all prescription fields, items, doctor info, and action buttons are displayed

#### Scenario: Consume button marks prescription as consumed
- **WHEN** a patient clicks "Marcar como consumida" on a pending prescription
- **THEN** a PUT /prescriptions/:id/consume request is made, a success toast is shown, and the status badge updates to "consumed"

#### Scenario: Already consumed prescription hides consume button
- **WHEN** a patient views a prescription with status `consumed`
- **THEN** the "Marcar como consumida" button is not rendered

#### Scenario: PDF download triggers browser download
- **WHEN** a patient clicks "Descargar PDF"
- **THEN** the PDF is fetched from GET /prescriptions/:id/pdf and a file download is initiated in the browser

#### Scenario: Detail page shows loading skeleton while fetching
- **WHEN** the page loads and the API call is in flight
- **THEN** a skeleton placeholder is shown in place of the content

