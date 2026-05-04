## ADDED Requirements

### Requirement: Auth e2e tests
El sistema DEBE incluir tests e2e para flujos de autenticacióncubriendo login exitosoy fallido, y refresh token.

#### Scenario: Login exitoso
- **WHEN** usuario envía credenciales válidas a POST /auth/login
- **THEN** sistema devuelve accessToken y refreshToken con código 200

#### Scenario: Login fallido
- **WHEN** usuario envía credenciales inválidas a POST /auth/login
- **THEN** sistema devuelve error 401

#### Scenario: Refresh token exitoso
- **WHEN** usuario envía refreshToken válido a POST /auth/refresh
- **THEN** sistema devuelve nuevo accessToken con código 200

### Requirement: Prescription e2e tests
El sistema DEBE incluir tests e2e para creación y consumo de prescripciones.

#### Scenario: Doctor crea prescripción
- **WHEN** doctor autenticado envía POST /prescriptions con datos válidos
- **THEN** sistema crea prescripción y devuelve código 201

#### Scenario: Paciente consume prescripción
- **WHEN** paciente autenticado envía PUT /prescriptions/:id/consume
- **THEN** sistema marca prescripción como consumed

### Requirement: Coverage report
El sistema DEBE generar coverage report ejecutable con npm run test:cov.

#### Scenario: Coverage ejecutable
- **WHEN** se ejecuta npm run test:cov
- **THEN** sistema genera reporte de cobertura en formato text/HTML