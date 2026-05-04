## Purpose

Patient portal for viewing and consuming prescriptions.

## Requirements

### Requirement: Patient can view their prescriptions
The system SHALL display a list of prescriptions assigned to the logged-in patient.

#### Scenario: Display patient prescription list
- **WHEN** patient navigates to /patient/prescriptions
- **THEN** system shows list of prescriptions with code, doctor name, status, date

#### Scenario: Empty prescription list
- **WHEN** patient has no prescriptions
- **THEN** system displays "No hay prescripciones" message

### Requirement: Patient can view prescription detail
The system SHALL display full details of a prescription.

#### Scenario: View prescription detail
- **WHEN** patient clicks on a prescription in the list
- **THEN** system shows full prescription details with all items

### Requirement: Patient can mark prescription as consumed
The system SHALL allow patients to mark a prescription as consumed.

#### Scenario: Mark as consumed
- **WHEN** patient clicks "Marcar como consumida" button
- **THEN** system updates status and shows success toast

#### Scenario: Already consumed
- **WHEN** patient views prescription with status "consumed"
- **THEN** system shows "Ya consumida" badge, hides consume button

### Requirement: Patient can download PDF
The system SHALL allow patients to download a PDF of a prescription.

#### Scenario: Download PDF
- **WHEN** patient clicks "Descargar PDF" button
- **THEN** system triggers PDF download from /prescriptions/:id/pdf