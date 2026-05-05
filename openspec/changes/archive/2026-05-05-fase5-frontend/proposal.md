## Why

The backend API (auth, prescriptions, users, admin modules) is fully implemented but there is no frontend — the Next.js app is a blank scaffold. Without a UI, the system cannot be used by doctors, patients, or admins.

## What Changes

- Replace the blank Next.js scaffold with a working application
- Implement JWT auth flow: login page, token storage, automatic refresh, logout
- Doctor views: prescription list (filterable), create prescription form, prescription detail
- Patient views: prescription list, prescription detail with consume action and PDF download
- Admin dashboard: metrics overview (totals, by-status chart, by-day chart, top doctors)
- Role-based route protection: redirect to `/login` when unauthenticated; redirect to role-specific home when role mismatches
- Shared UI: loading skeletons, empty states, error boundaries, toast notifications

## Capabilities

### New Capabilities

- `auth-ui`: Login page, JWT token lifecycle (access + refresh rotation), role-based redirect after login, logout, protected route wrapper
- `doctor-ui`: Doctor-facing prescription list with filters, create prescription form with dynamic item rows, prescription detail view
- `patient-ui`: Patient-facing prescription list, prescription detail with consume button and PDF download link
- `admin-ui`: Admin dashboard showing aggregated metrics (totals cards, by-status breakdown, by-day timeline, top-doctors list)

### Modified Capabilities

<!-- No existing backend specs change requirements -->

## Impact

- **Frontend**: `packages/frontend/src/` — all pages and components are new
- **APIs consumed**: All backend endpoints from phases 3 & 4 (`/auth/*`, `/prescriptions/*`, `/me/prescriptions`, `/admin/*`, `/patients`, `/doctors`)
- **Dependencies**: Next.js 16, TailwindCSS v4, React 19 — all already installed; no new packages required for MVP
- **Auth integration**: Frontend stores access token in memory and refresh token in an HTTP-only cookie (or localStorage for MVP simplicity); token refresh on 401
