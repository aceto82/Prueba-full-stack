## Purpose

Doctor portal for managing prescriptions.

## Requirements

### Requirement: Doctor can view prescription list
The system SHALL display a paginated list of prescriptions authored by the logged-in doctor.

#### Scenario: Display prescription list
- **WHEN** doctor navigates to /doctor/prescriptions
- **THEN** system shows list of prescriptions with code, patient name, status, date

#### Scenario: Empty prescription list
- **WHEN** doctor has no prescriptions
- **THEN** system displays "No hay prescripciones" message

#### Scenario: Pagination
- **WHEN** prescriptions exceed 10 items per page
- **THEN** system shows pagination controls

### Requirement: Doctor can filter prescriptions
The system SHALL allow filtering prescriptions by status and date.

#### Scenario: Filter by status
- **WHEN** doctor selects status filter (pending/consumed)
- **THEN** system shows only prescriptions matching that status

#### Scenario: Filter by date range
- **WHEN** doctor enters from/to dates
- **THEN** system shows only prescriptions within that range

### Requirement: Doctor can create new prescription
The system SHALL provide a form to create prescriptions with patient and items.

#### Scenario: Create prescription with items
- **WHEN** doctor fills patient, notes, multiple items and submits
- **THEN** system creates prescription and shows success toast

#### Scenario: Add multiple items
- **WHEN** doctor clicks "Agregar ítem"
- **THEN** system adds new empty item row

#### Scenario: Remove item
- **WHEN** doctor clicks remove on an item
- **THEN** system removes that item from the form

#### Scenario: Validation error
- **WHEN** doctor submits without required fields
- **THEN** system displays validation errors

### Requirement: Doctor can view prescription detail
The system SHALL display full details of a prescription.

#### Scenario: View prescription detail
- **WHEN** doctor clicks on a prescription in the list
- **THEN** system shows full prescription details with all items