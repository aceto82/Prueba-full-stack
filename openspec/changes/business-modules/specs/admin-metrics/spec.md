## ADDED Requirements

### Requirement: Get system metrics
El sistema DEBE retornar métricas del sistema para el admin.

#### Scenario: Get totals metrics
- **WHEN** GET /admin/metrics
- **THEN** retorna { doctors, patients, prescriptions } con totales

#### Scenario: Get metrics by status
- **WHEN** GET /admin/metrics
- **THEN** retorna { pending, consumed } con conteo por estado

#### Scenario: Get metrics by day
- **WHEN** GET /admin/metrics
- **THEN** retorna array por día con cantidad de prescripciones

#### Scenario: Get top doctors
- **WHEN** GET /admin/metrics
- **THEN** retorna array de doctores con más prescripciones

### Requirement: Filter metrics by date
El sistema DEBE permitir filtrar métricas por rango de fechas.

#### Scenario: Filter metrics by from date
- **WHEN** GET /admin/metrics?from=2026-01-01
- **THEN** retorna métricas desde esa fecha

#### Scenario: Filter metrics by to date
- **WHEN** GET /admin/metrics?to=2026-01-31
- **THEN** retorna métricas hasta esa fecha

#### Scenario: Filter metrics by date range
- **WHEN** GET /admin/metrics?from=2026-01-01&to=2026-01-31
- **THEN** retorna métricas del rango especificado

### Requirement: Admin only access
El sistema DEBE permitir acceso a métricas solo para admin.

#### Scenario: Doctor cannot access metrics
- **WHEN** GET /admin/metrics con rol doctor
- **THEN** retorna 403 Forbidden

#### Scenario: Patient cannot access metrics
- **WHEN** GET /admin/metrics con rol patient
- **THEN** retorna 403 Forbidden