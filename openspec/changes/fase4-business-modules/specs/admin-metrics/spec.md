## ADDED Requirements

### Requirement: Admin retrieves aggregated metrics
The system SHALL provide `GET /admin/metrics` accessible only by the `admin` role. The endpoint SHALL accept optional `from` and `to` ISO date query parameters to scope metrics by prescription `createdAt`. The response SHALL include:
- `totals`: counts of doctors, patients, and prescriptions
- `byStatus`: count of prescriptions grouped by status (`pending`, `consumed`)
- `byDay`: array of `{ date: string, count: number }` for each day with at least one prescription (within the date range, or last 30 days by default)
- `topDoctors`: array of `{ doctorId, name, count }` for the top 10 doctors by prescription volume

#### Scenario: Admin gets metrics without date filter
- **WHEN** an admin calls `GET /admin/metrics`
- **THEN** the response is HTTP 200 with `totals`, `byStatus`, `byDay` (last 30 days), and `topDoctors`

#### Scenario: Admin gets metrics with date range
- **WHEN** an admin calls `GET /admin/metrics?from=2025-01-01&to=2025-12-31`
- **THEN** `byStatus`, `byDay`, and `topDoctors` are scoped to prescriptions created within that range; `totals` reflect all-time counts

#### Scenario: Non-admin access is forbidden
- **WHEN** a doctor or patient calls `GET /admin/metrics`
- **THEN** the response is HTTP 403

### Requirement: Metrics response structure is consistent
The system SHALL always return all four top-level keys (`totals`, `byStatus`, `byDay`, `topDoctors`) even when counts are zero. Empty arrays are valid for `byDay` and `topDoctors`.

#### Scenario: Zero prescriptions returns empty arrays
- **WHEN** there are no prescriptions in the requested date range
- **THEN** `byDay` is `[]`, `topDoctors` is `[]`, and `byStatus` shows `{ pending: 0, consumed: 0 }`
