## ADDED Requirements

### Requirement: List doctors
El sistema DEBE permitir listar doctores con paginación.

#### Scenario: List doctors successful
- **WHEN** GET /doctors se envía sin parámetros
- **THEN** retorna lista de doctores con paginación por defecto (page=1, limit=10)

#### Scenario: List doctors with pagination
- **WHEN** GET /doctors?page=2&limit=20
- **THEN** retorna página 2 con máximo 20 doctores

#### Scenario: List doctors filtered by specialty
- **WHEN** GET /doctors?specialty=Cardiología
- **THEN** retorna solo doctores con especialidad Cardiología

### Requirement: List patients
El sistema DEBE permitir listar pacientes con paginación.

#### Scenario: List patients successful
- **WHEN** GET /patients se envía sin parámetros
- **THEN** retorna lista de pacientes con paginación por defecto (page=1, limit=10)

#### Scenario: List patients with pagination
- **WHEN** GET /patients?page=1&limit=5
- **THEN** retorna página 1 con máximo 5 pacientes

### Requirement: List users by role
El sistema DEBE permitir listar usuarios filtrados por rol.

#### Scenario: Filter users by role doctor
- **WHEN** GET /users?role=doctor
- **THEN** retorna solo usuarios con rol doctor

#### Scenario: Filter users by role patient
- **WHEN** GET /users?role=patient
- **THEN** retorna solo usuarios con rol patient