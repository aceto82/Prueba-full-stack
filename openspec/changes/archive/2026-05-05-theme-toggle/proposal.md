## Why

The app currently follows the OS `prefers-color-scheme` media query automatically, but users have no way to override this choice from within the UI. Persisting the preference means it survives page reloads without flash.

## What Changes

- Add a `ThemeContext` that reads the saved preference from `localStorage` (or falls back to the OS setting), exposes a `toggleTheme()` function, and applies a `dark` class to `<html>` accordingly.
- Wire `ThemeProvider` into the root layout so every page respects the active theme.
- Add a sun/moon icon button to `Navbar` that calls `toggleTheme()`.
- Update `globals.css` to drive dark-mode colors via the `.dark` class on `<html>` (TailwindCSS v4 `@variant dark` / `@custom-variant`) instead of the media query alone, so the manual toggle takes effect.

## Capabilities

### New Capabilities

- `theme-toggle`: ThemeContext with `theme` state (`"light" | "dark"`), `toggleTheme()`, and `ThemeProvider`; localStorage persistence; `dark` class applied to `<html>`; toggle button in Navbar; `globals.css` updated to support class-based dark mode alongside the existing media query fallback.

### Modified Capabilities

<!-- No existing backend specs change -->

## Impact

- **Frontend only**: `src/context/ThemeContext.tsx` (new), `src/app/layout.tsx` (wrap with `ThemeProvider`), `src/components/Navbar.tsx` (add toggle button), `src/app/globals.css` (class-based dark variant).
- **No new packages** — TailwindCSS v4's `@custom-variant` handles class-based dark mode natively; `localStorage` is already used for auth tokens.
- **No backend changes**.
