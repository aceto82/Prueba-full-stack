## Why

Fase 1-4 completed the backend with NestJS, Prisma, JWT auth, and all business modules (users, prescriptions, patient, admin with PDF). The frontend is needed to provide the UI for users to interact with the system - doctors create prescriptions, patients view/consume/download PDF, admin views metrics.

## What Changes

- Create Next.js frontend with App Router
- Implement authentication pages (login)
- Implement Doctor portal (list, create, detail prescriptions)
- Implement Patient portal (list, consume, detail, PDF download)
- Implement Admin dashboard with metrics
- Add role-based route protection
- Add toast notifications, loading/error/empty states
- Responsive design with TailwindCSS

## Capabilities

### New Capabilities
- `user-auth`: Login page with email/password, token storage, session management
- `doctor-portal`: Doctor prescription management (list, create, detail)
- `patient-portal`: Patient prescription portal (list, consume action, PDF download)
- `admin-dashboard`: Admin metrics dashboard with cards and charts

### Modified Capabilities
- None - backend already complete

## Impact

- Frontend: packages/frontend/ (Next.js + TailwindCSS)
- Integration with backend API at localhost:3001
- Routes: /login, /doctor/prescriptions, /patient/prescriptions, /admin
- Auth context: JWT tokens stored in localStorage
- Role protection: middleware/guard for route access