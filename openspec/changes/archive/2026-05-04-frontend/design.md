## Context

Backend is complete with NestJS on port 3001 exposing REST APIs. Frontend needs to consume these APIs and provide UI for 3 roles. Uses Next.js App Router with TailwindCSS.

## Goals / Non-Goals

**Goals:**
- Create working frontend with login, doctor, patient, and admin portals
- Integrate with existing backend APIs
- Role-based route protection
- Responsive design with loading/error/empty states

**Non-Goals:**
- Real-time WebSocket updates (Phase 6 optional)
- Complex state management (use React Context/simplified store)
- Testing suite (minimal Phase 6)

## Decisions

1. **Routing**: Next.js App Router with route groups `(/doctor)`, `(/patient)`, `(/admin)` for protection
2. **Auth Storage**: localStorage for tokens, React Context for auth state
3. **Data Fetching**: fetch API with custom hooks (no React Query to minimize deps)
4. **Styling**: TailwindCSS with shadcn/ui-like components
5. **Charts**: Simple Recharts for admin dashboard

### Alternatives Considered
- *Pages Router*: App Router is more modern
- *Zustand*: Simple Context sufficient for MVP
- *React Query*: Adds complexity, use custom hooks

## Risks / Trade-offs

- **Risk**: Backend API changes → Mitigation: Document API contracts
- **Risk**: Session expiry → Mitigation: Token refresh logic
- **Risk**: Route protection bypass → Mitigation: middleware.ts checks

## Open Questions

- Should we add Swagger integration for API docs?
- Dark mode toggle for Phase 6?