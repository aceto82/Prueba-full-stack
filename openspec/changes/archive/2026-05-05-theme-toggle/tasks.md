## 1. CSS — class-based dark mode

- [x] 1.1 In `src/app/globals.css`, add `@custom-variant dark (&:is(.dark *))` after the `@import "tailwindcss"` line to register the class-based dark variant for TailwindCSS v4
- [x] 1.2 Replace the `@media (prefers-color-scheme: dark)` block in `globals.css` with a `.dark { --background: #0a0a0a; --foreground: #ededed; }` rule so the class takes effect; keep the media query as a separate fallback for users without JS

## 2. ThemeContext

- [x] 2.1 Create `src/context/ThemeContext.tsx` with `'use client'`; export `ThemeContext`, `ThemeProvider`, and `useTheme`
- [x] 2.2 In `ThemeProvider`, on mount read `localStorage.getItem('theme')`; if absent, read `window.matchMedia('(prefers-color-scheme: dark)').matches`; set `theme` state to `"dark"` or `"light"` accordingly
- [x] 2.3 In `ThemeProvider`, add a `useEffect` that synchronises `theme` state → `document.documentElement.classList.toggle('dark', theme === 'dark')` and writes `localStorage.setItem('theme', theme)` on every theme change
- [x] 2.4 Expose `toggleTheme()` that calls `setTheme(prev => prev === 'dark' ? 'light' : 'dark')`

## 3. Root layout wiring

- [x] 3.1 Import `ThemeProvider` in `src/app/layout.tsx` and wrap it as the outermost provider, outside `AuthProvider` and `ToastProvider`

## 4. Navbar toggle button

- [x] 4.1 In `src/components/Navbar.tsx`, import `useTheme` and add a `<button>` that calls `toggleTheme()`; display `☀` when `theme === 'dark'` and `🌙` when `theme === 'light'`; place it to the left of the logout button
