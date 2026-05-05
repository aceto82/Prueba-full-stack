## Why

Los filtros de fecha en las páginas de admin, doctor y paciente se pierden al refrescar la página o al compartir la URL, obligando al usuario a reintroducirlos cada vez. Persistir los filtros en los query params de la URL los hace compartibles, navegables con el historial del navegador y resistentes a recargas.

## What Changes

- Los inputs de filtro (`from`, `to`, status, etc.) leen su valor inicial desde los query params de la URL al montar.
- Cualquier cambio en los filtros actualiza la URL de forma sincrónica (shallow push, sin recarga).
- Al limpiar filtros se eliminan los params de la URL.
- Las páginas afectadas: `/admin`, `/doctor/prescriptions`, `/patient/prescriptions`.

## Capabilities

### New Capabilities

- `filter-querystring-sync`: Sincronización bidireccional entre estado de filtros UI y query params de la URL (lectura inicial + escritura en cada cambio).

### Modified Capabilities

- `admin-ui`: El panel de admin pasa a leer/escribir filtros de fecha desde/hacia la URL.
- `doctor-ui`: La lista de prescripciones del doctor pasa a leer/escribir filtros desde/hacia la URL.
- `patient-ui`: La lista de prescripciones del paciente pasa a leer/escribir filtros desde/hacia la URL.

## Impact

- **Frontend únicamente** — no hay cambios en el backend ni en la API.
- Páginas afectadas: `app/admin/page.tsx`, `app/doctor/prescriptions/page.tsx`, `app/patient/prescriptions/page.tsx`.
- Dependencia: Next.js `useSearchParams` / `useRouter` (ya disponibles en Next.js 16, no requiere paquetes nuevos).
- Las páginas que usan estos filtros deben ser `'use client'` (ya lo son).
