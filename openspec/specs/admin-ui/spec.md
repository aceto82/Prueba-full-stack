# admin-ui Specification

## Purpose
TBD - created by archiving change fase5-frontend. Update Purpose after archive.
## Requirements
### Requirement: Admin dashboard shows aggregated metrics
The system SHALL provide `/admin` displaying metrics from `GET /admin/metrics`. The page SHALL show: totals cards (doctors, patients, prescriptions), a by-status breakdown (pending vs consumed counts), a by-day timeline (list or simple chart), and a top-10 doctors table (name + prescription count).

#### Scenario: Admin views the metrics dashboard
- **WHEN** an admin navigates to `/admin`
- **THEN** the page displays totals cards, by-status counts, by-day entries, and the top-doctors list

#### Scenario: Dashboard shows loading state while fetching
- **WHEN** the page loads and the API call is in flight
- **THEN** skeleton cards are displayed in place of the metric values

#### Scenario: Dashboard shows error state on API failure
- **WHEN** the metrics API call fails
- **THEN** an error message with a retry button is displayed

### Requirement: Admin can filter metrics by date range
The system SHALL provide `from` and `to` date inputs on the admin dashboard that scope `byStatus`, `byDay`, and `topDoctors` metrics. Changing the date inputs SHALL trigger a new API call with the updated parameters. The filter values SHALL be persisted in the URL as query params (`?from=YYYY-MM-DD&to=YYYY-MM-DD`), read on mount, and updated via `router.replace` on every filter change. Clearing filters SHALL remove the query params from the URL.

#### Scenario: Admin filters metrics by date range
- **WHEN** an admin sets a `from` and `to` date and submits
- **THEN** the dashboard re-fetches metrics with those parameters, updates all metric sections, and the URL reflects `?from=...&to=...`

#### Scenario: Clearing dates resets to default (last 30 days for byDay)
- **WHEN** an admin clears the date inputs
- **THEN** the dashboard fetches metrics without date parameters, showing last-30-day data for byDay, and the URL has no `from`/`to` params

#### Scenario: Filters persist on page reload
- **WHEN** a user refreshes the page while the URL contains `?from=2024-01-01&to=2024-01-31`
- **THEN** the date inputs are pre-filled with those values and the dashboard fetches metrics with those params

#### Scenario: Shareable URL loads correct filter state
- **WHEN** a user opens the URL `/admin?from=2024-01-01&to=2024-01-31`
- **THEN** the page displays with the filters pre-applied and metrics scoped to that date range

