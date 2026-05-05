## Context

Las tres páginas de listado/métricas (`/admin`, `/doctor/prescriptions`, `/patient/prescriptions`) gestionan filtros con estado React local. Esos filtros no se reflejan en la URL, por lo que se pierden al recargar y no se pueden compartir. Next.js 16 proporciona `useSearchParams` y `useRouter` (con `router.replace` / `router.push`) para sincronizar estado con la URL de forma declarativa sin recargar la página.

## Goals / Non-Goals

**Goals:**
- Leer los valores iniciales de los filtros desde los query params al montar cada página.
- Escribir en la URL (shallow replace) cuando el usuario cambia cualquier filtro.
- Eliminar los params al limpiar filtros.
- No romper el comportamiento existente de fetch cuando cambia el estado de filtros.

**Non-Goals:**
- Paginación persistida en URL (fuera de este cambio).
- Filtros en páginas de detalle (`/[id]`).
- Historial de filtros (push vs replace — se usa replace para no saturar el historial).
- SSR / Server Components (las páginas ya son `'use client'`).

## Decisions

### D1 — `router.replace` en lugar de `router.push`
Usar `replace` evita acumular entradas en el historial por cada keystroke o cambio de filtro. El usuario puede retroceder a la página anterior, pero no navegar a cada estado intermedio de filtro.  
**Alternativa descartada**: `push` — infla el historial y resulta en comportamiento inesperado con el botón "Atrás".

### D2 — Sincronización via `useEffect` sobre el estado de filtros
Cada vez que cambia el estado local de los filtros (`from`, `to`, `status`…), un `useEffect` construye los `URLSearchParams` y llama a `router.replace`. Esto mantiene el fetch actual intacto (sigue dependiendo del estado React) y añade la URL como efecto secundario.  
**Alternativa descartada**: Eliminar el estado local y leer siempre de `searchParams` directamente — requiere más refactor y puede causar re-renders inconsistentes en Next.js 16.

### D3 — Inicialización sincrónica en `useState`
El valor inicial de cada filtro se calcula leyendo `searchParams.get(key)` en el inicializador de `useState`. Esto evita un render extra con valores vacíos seguido de un render con los valores de la URL.  
**Alternativa descartada**: `useEffect` para leer params al montar — provoca un flash de estado vacío antes de cargar los filtros.

### D4 — Un hook compartido `useFilterParams`
Extraer la lógica de lectura/escritura de params a un hook `useFilterParams(keys)` reutilizable en las tres páginas, evitando duplicación.

## Risks / Trade-offs

- **`useSearchParams` requiere Suspense boundary en Next.js 16** → Cada página que use el hook debe estar envuelta en `<Suspense>` o ser ella misma el boundary. Las páginas ya son `'use client'`, lo que satisface el requisito; si Next.js 16 lo exige explícitamente, se añade un wrapper.
- **Sincronización circular** (URL → estado → URL): mitigado porque `useEffect` sólo escribe en URL, nunca vuelve a leer; la lectura ocurre sólo en la inicialización de `useState`.
- **Filtros con valor vacío generan params vacíos**: se limpian del objeto `URLSearchParams` (no se serializa `?from=&to=`).
