## 1. Foundation — API Client and Auth Context

- [ ] 1.1 Create `src/lib/api.ts` with `apiFetch(path, options)` — attaches `Authorization: Bearer` header from localStorage, handles 401 → refresh → retry, throws on second failure and clears tokens
- [ ] 1.2 Create `src/lib/auth.ts` with token helpers: `getTokens()`, `setTokens(access, refresh)`, `clearTokens()` reading/writing localStorage
- [ ] 1.3 Create `src/context/AuthContext.tsx` — React Context with `user`, `login(email, password)`, `logout()`, `isLoading`; reads tokens from localStorage on mount, fetches `GET /auth/profile` to populate user, shows spinner while initializing
- [ ] 1.4 Wrap the root layout (`src/app/layout.tsx`) with `AuthProvider`

## 2. Shared Components

- [ ] 2.1 Create `src/components/AuthGuard.tsx` — accepts `role` prop, redirects to `/login` if unauthenticated, redirects to role home if role mismatch, shows spinner during auth init
- [ ] 2.2 Create `src/components/Toast.tsx` and `src/context/ToastContext.tsx` — simple toast notification system with `showToast(message, type)` and auto-dismiss after 4 seconds
- [ ] 2.3 Create `src/components/Skeleton.tsx` — reusable skeleton placeholder component for loading states
- [ ] 2.4 Create `src/components/Navbar.tsx` — shows app name, user name + role badge, and a logout button; uses `AuthContext`

## 3. Login Page

- [ ] 3.1 Create `src/app/login/page.tsx` — login form with email and password fields; calls `AuthContext.login()`; redirects authenticated users away; shows inline API error message

## 4. Doctor Pages

- [ ] 4.1 Create `src/app/doctor/prescriptions/page.tsx` — fetches `GET /prescriptions` with status filter; renders prescription list (code, patient name, date, status badge); handles loading skeleton, error, and empty states; wrapped with `<AuthGuard role="doctor">`
- [ ] 4.2 Create `src/app/doctor/prescriptions/new/page.tsx` — form with patient dropdown (`GET /patients`), optional notes, dynamic item list (add/remove rows with name, dosage, quantity, instructions); submits `POST /prescriptions`; on success redirects to new prescription detail; error shown as toast
- [ ] 4.3 Create `src/app/doctor/prescriptions/[id]/page.tsx` — fetches `GET /prescriptions/:id`; displays full detail (code, status, date, patient info, notes, items list); loading skeleton; wrapped with `<AuthGuard role="doctor">`

## 5. Patient Pages

- [ ] 5.1 Create `src/app/patient/prescriptions/page.tsx` — fetches `GET /me/prescriptions`; renders list (code, doctor name, date, status badge); loading skeleton, error, and empty states; wrapped with `<AuthGuard role="patient">`
- [ ] 5.2 Create `src/app/patient/prescriptions/[id]/page.tsx` — fetches `GET /prescriptions/:id`; displays full detail with doctor info and items; shows "Marcar como consumida" button only if status is `pending`; consume calls `PUT /prescriptions/:id/consume` and shows success toast; "Descargar PDF" fetches blob from `GET /prescriptions/:id/pdf` and triggers browser download; loading skeleton; wrapped with `<AuthGuard role="patient">`

## 6. Admin Dashboard

- [ ] 6.1 Create `src/app/admin/page.tsx` — fetches `GET /admin/metrics` with optional `from`/`to` date params; displays totals cards (doctors, patients, prescriptions), by-status counts (pending/consumed), by-day list (date + count), top-doctors table (name + count); date range inputs that re-trigger fetch on submit; loading skeleton; error state with retry; wrapped with `<AuthGuard role="admin">`

## 7. Root Route and Navigation

- [ ] 7.1 Update `src/app/page.tsx` — redirect authenticated users to their role home; redirect unauthenticated users to `/login`
- [ ] 7.2 Set `NEXT_PUBLIC_API_URL` in `packages/frontend/.env.local` to `http://localhost:3000` (document in CLAUDE.md if not already present)
