## Context

The backend exposes a REST API at `http://localhost:3000` protected by JWT. The frontend is a Next.js 16 / React 19 / TailwindCSS v4 app (scaffold only). The backend issues short-lived access tokens (15 min) and long-lived refresh tokens (7 days, stored as bcrypt hashes in the DB). Three roles exist: `admin`, `doctor`, `patient`, each with distinct route sets.

## Goals / Non-Goals

**Goals:**
- Implement all pages from the Phase 5 plan: login, doctor views, patient views, admin dashboard
- Protect routes by role using Next.js middleware or layout-level guards
- Handle token refresh transparently on 401 responses
- Show loading, error, and empty states on every data-fetching page
- Provide toast feedback for mutations (create prescription, consume, logout)

**Non-Goals:**
- Server-side rendering with forwarded cookies (MVP uses client-side fetch only)
- OAuth / social login
- Dark mode (optional Plus)
- Real-time dashboard updates via SSE/WebSocket (optional Plus)
- Unit tests for frontend components (Phase 6)

## Decisions

### 1. Token storage: localStorage for access token, localStorage for refresh token (MVP simplicity)
- **Decision**: Store both tokens in `localStorage`. On app load, read tokens and attach the access token as a `Bearer` header. On 401, call `/auth/refresh` with the stored refresh token, update storage, retry.
- **Alternative considered**: HTTP-only cookie for refresh token (more secure) — rejected for MVP because it requires same-origin cookie setup or CORS credentials, adding complexity.
- **Reason**: Simpler to implement; acceptable for a local MVP. Note in code that this should be upgraded to HTTP-only cookies for production.

### 2. API client: thin fetch wrapper in `src/lib/api.ts`
- **Decision**: A single `apiFetch(path, options)` function that injects the Authorization header, handles 401 → refresh → retry, and throws typed errors.
- **Alternative considered**: React Query or SWR — rejected to keep the dependency footprint at zero new packages.
- **Reason**: The backend is small enough that a custom fetch wrapper is maintainable. Can be swapped for SWR in Phase 6.

### 3. Route protection: Next.js middleware (`middleware.ts`)
- **Decision**: A `middleware.ts` at the root checks `localStorage` for a token… but since middleware runs on the server/edge and can't access localStorage, use a client-side guard instead: a `<AuthGuard role="doctor">` component that redirects when the stored role doesn't match.
- **Alternative considered**: Next.js middleware with cookies — requires cookie-based auth (see decision 1).
- **Reason**: Consistent with the localStorage token approach. All page components wrap their content in `<AuthGuard>`.

### 4. State management: React Context for auth state
- **Decision**: A single `AuthContext` (user object, tokens, login/logout functions) provided at the root layout. No external state library.
- **Reason**: The auth state is the only global state needed. Everything else is local to each page via `useState` + `useEffect`.

### 5. UI components: Tailwind utility classes only, no component library
- **Decision**: Build all UI with TailwindCSS v4 utilities. No shadcn/ui or similar.
- **Reason**: No new packages needed; TailwindCSS v4 is already installed.

### 6. Next.js 16 app router with client components for interactive pages
- **Decision**: Use the App Router (`src/app/`). Mark interactive pages with `'use client'`. Data fetching happens inside `useEffect` (client-side only, consistent with localStorage auth).
- **Reason**: App Router is the current Next.js standard. Server Components can't access localStorage, so all authenticated pages are client components.

## Risks / Trade-offs

- [Risk] localStorage tokens are vulnerable to XSS → [Mitigation] Noted in code; upgrade path to HTTP-only cookies documented for Phase 6.
- [Risk] No token refresh before expiry (only on 401) → [Mitigation] 15-min access token is short; refresh on 401 covers the common case. Background refresh can be added later.
- [Risk] No loading state between localStorage read and first render → [Mitigation] Show a spinner while auth state is being initialized to avoid flash of unauthenticated content.
- [Risk] Next.js 16 may have API differences from training data → [Mitigation] Read `node_modules/next/dist/docs/` before writing any Next.js-specific code.
