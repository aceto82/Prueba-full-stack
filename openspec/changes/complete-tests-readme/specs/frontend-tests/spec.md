## ADDED Requirements

### Requirement: Frontend component tests
El sistema DEBE incluir tests para componentes críticos del frontendusando Vitest.

#### Scenario: Login form valida input
- **WHEN** usuario ingresa email inválido en login
- **THEN** sistema muestra mensaje de error de validación

#### Scenario: Prescription list carga datos
- **WHEN** página de prescripciones recibe datos del API
- **THEN** sistema renderiza lista de prescripciones