## Context

The frontend uses TailwindCSS v4 (configured entirely in `globals.css`, no `tailwind.config.js`). Dark mode currently relies solely on `@media (prefers-color-scheme: dark)` — the user has no way to override it from the UI and no preference is persisted across sessions.

TailwindCSS v4 supports class-based dark mode via `@custom-variant dark (&:is(.dark *))` or `@variant dark (.dark &)` in the CSS file. No config file change is needed.

## Goals / Non-Goals

**Goals:**
- Let users switch between light and dark explicitly via a toggle button in the Navbar.
- Persist the chosen theme in `localStorage` across page reloads.
- Fall back to `prefers-color-scheme` when no preference is stored.
- Apply the theme immediately on mount without flash of incorrect theme (FOIT).

**Non-Goals:**
- Re-theming every existing Tailwind utility class to use explicit `dark:` variants — existing pages use semantic CSS variables (`--background`, `--foreground`) which already switch with the theme.
- System-level sync (if the OS changes while the app is open, the override stays until the user clears it).
- Server-side rendering of the correct theme (MVP is client-side only, consistent with the rest of the app).

## Decisions

### 1. Class-based dark mode on `<html>` via TailwindCSS v4 `@custom-variant`

**Decision**: Add `@custom-variant dark (&:is(.dark *))` to `globals.css` and toggle a `dark` class on `<html>`. The existing CSS variables (`--background`, `--foreground`) are redefined inside `.dark { ... }` instead of `@media (prefers-color-scheme: dark)`. Both the media query and the class will work simultaneously — the class takes priority when present.

**Alternative considered**: Keeping media query only and not supporting manual toggle. Rejected because it was the explicit request.

**Alternative considered**: CSS `color-scheme` property. More limited; doesn't integrate cleanly with TailwindCSS v4's variant system.

### 2. ThemeContext manages state; `<html>` class is the source of truth for CSS

**Decision**: A `ThemeContext` exposes `theme: "light" | "dark"` and `toggleTheme()`. On mount it reads from `localStorage`, falls back to `window.matchMedia('(prefers-color-scheme: dark)')`, and adds/removes `dark` from `document.documentElement.classList`. The React state stays in sync with the DOM class.

**Alternative considered**: Inline script in `<head>` to set the class before React hydrates (eliminates flash). Rejected for MVP — the app is fully client-side rendered, so there's no SSR flash problem. Can be added later.

**Alternative considered**: `next-themes` library. Rejected to keep the zero-new-packages constraint from the design document.

### 3. Toggle button in Navbar — icon only (sun / moon), no external icon library

**Decision**: Render `☀` / `🌙` as Unicode text characters wrapped in a `<button>`. No new icon library needed.

**Alternative considered**: SVG icons inline. More flexible but adds markup; Unicode is sufficient for an MVP toggle.

### 4. `ThemeProvider` wraps inside `AuthProvider`/`ToastProvider` in `layout.tsx`

**Decision**: Wrap the root layout with `<ThemeProvider>` as the outermost provider (before `AuthProvider`). Theme is independent of auth state and should apply regardless of login status.

## Risks / Trade-offs

- [Risk] Brief flash of default (light) theme on first load when a dark preference is stored → [Mitigation] The `useEffect` in `ThemeProvider` runs before the first paint in most cases; acceptable for an MVP client-only app. An inline `<script>` can eliminate this in a future iteration.
- [Risk] `localStorage` not available in SSR / Next.js Server Components → [Mitigation] `ThemeProvider` is a `'use client'` component and reads `localStorage` only inside `useEffect`.
