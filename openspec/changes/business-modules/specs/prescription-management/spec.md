## ADDED Requirements

### Requirement: Create prescription
El sistema DEBE permitir crear una prescripción para un paciente existente.

#### Scenario: Create prescription successful
- **WHEN** POST /prescriptions se envía con patientId, notes y items válidos
- **THEN** retorna 201 Created con la prescripción creada

#### Scenario: Create prescription with items
- **WHEN** POST /prescriptions con array de items (name, dosage, quantity, instructions)
- **THEN** cada item se asocia a la prescripción

#### Scenario: Create prescription for non-existent patient
- **WHEN** POST /prescriptions con patientId inexistente
- **THEN** retorna 404 Not Found

#### Scenario: Create prescription without items
- **WHEN** POST /prescriptions sin items
- **THEN** retorna 400 Bad Request (al menos un item requerido)

### Requirement: List prescriptions for doctor
El sistema DEBE listar las prescripciones creadas por el médico autenticado.

#### Scenario: List my prescriptions
- **WHEN** GET /prescriptions?mine=true
- **THEN** retorna solo prescripciones del médico logueado

#### Scenario: List prescriptions with status filter
- **WHEN** GET /prescriptions?mine=true&status=pending
- **THEN** retorna solo prescripciones pendientes

#### Scenario: List prescriptions with date filter
- **WHEN** GET /prescriptions?mine=true&from=2026-01-01&to=2026-01-31
- **THEN** retorna prescripciones del rango de fechas

#### Scenario: List prescriptions with pagination
- **WHEN** GET /prescriptions?mine=true&page=1&limit=10&order=createdAt:desc
- **THEN** retorna página 1 ordenada por fecha descendente

### Requirement: Get prescription detail
El sistema DEBE retornar el detalle de una prescripción.

#### Scenario: Get own prescription detail
- **WHEN** GET /prescriptions/:id para prescripción propia
- **THEN** retorna la prescripción con todos sus items

#### Scenario: Get another doctor's prescription
- **WHEN** GET /prescriptions/:id de otro doctor
- **THEN** retorna 403 Forbidden

### Requirement: Consume prescription
El sistema DEBE permitir marcar una prescripción como consumida.

#### Scenario: Consume own prescription
- **WHEN** PUT /prescriptions/:id/consume para prescripción propia de paciente
- **THEN** retorna 200 OK con status actualizado a consumed

#### Scenario: Consume already consumed prescription
- **WHEN** PUT /prescriptions/:id/consume para prescripción ya consumida
- **THEN** retorna 400 Bad Request

#### Scenario: Consume another patient's prescription
- **WHEN** PUT /prescriptions/:id/consume para prescripción de otro paciente
- **THEN** retorna 403 Forbidden

### Requirement: List prescriptions for patient
El sistema DEBE listar las prescripciones del paciente autenticado.

#### Scenario: List my prescriptions as patient
- **WHEN** GET /me/prescriptions
- **THEN** retorna solo prescripciones del paciente logueado

#### Scenario: List patient prescriptions with status filter
- **WHEN** GET /me/prescriptions?status=pending
- **THEN** retorna solo prescripciones pendientes