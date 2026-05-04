## ADDED Requirements

### Requirement: Generate PDF for prescription
El sistema DEBE generar un PDF con los datos de la prescripción.

#### Scenario: Generate PDF for own prescription
- **WHEN** GET /prescriptions/:id/pdf para prescripción propia
- **THEN** retorna un PDF con datos de la prescripción

#### Scenario: Generate PDF for patient's prescription
- **WHEN** GET /prescriptions/:id/pdf para prescripción del paciente
- **THEN** retorna el PDF

#### Scenario: Generate PDF unauthorized
- **WHEN** GET /prescriptions/:id/pdf sin token
- **THEN** retorna 401 Unauthorized

### Requirement: PDF contains required information
El contenido del PDF DEBE incluir todos los datos de la prescripción.

#### Scenario: PDF includes patient data
- **WHEN** se genera el PDF
- **THEN** incluye nombre del paciente y fecha de nacimiento

#### Scenario: PDF includes doctor data
- **WHEN** se genera el PDF
- **THEN** incluye nombre del médico, especialidad y código profesional

#### Scenario: PDF includes items
- **WHEN** se genera el PDF
- **THEN** incluye lista de ítems con nombre, dosis, cantidad e instrucciones

#### Scenario: PDF includes QR code
- **WHEN** se genera el PDF
- **THEN** incluye QR code con código de prescripción para validación