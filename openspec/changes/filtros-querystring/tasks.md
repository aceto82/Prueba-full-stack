## 1. Hook compartido

- [ ] 1.1 Crear `packages/frontend/src/hooks/useFilterParams.ts` con la firma `useFilterParams(keys: string[])` que lea `useSearchParams()` para el estado inicial y exponga `filters` + `setFilters`
- [ ] 1.2 Implementar la lógica de `setFilters`: actualizar estado local y llamar `router.replace` con los params serializados (omitir valores vacíos/undefined)
- [ ] 1.3 Verificar que params ajenos a `keys` se preservan en la URL al hacer `setFilters`

## 2. Página Admin

- [ ] 2.1 Importar `useFilterParams` en `app/admin/page.tsx` y reemplazar los `useState` de `from`/`to` y `fromInput`/`toInput` por el hook
- [ ] 2.2 Inicializar los inputs de fecha con los valores leídos de la URL
- [ ] 2.3 Conectar `handleFilterSubmit` y el botón "Limpiar" para que llamen a `setFilters`
- [ ] 2.4 Verificar que al refrescar la página con `?from=...&to=...` los filtros se aplican correctamente

## 3. Página Doctor Prescriptions

- [ ] 3.1 Importar `useFilterParams` en `app/doctor/prescriptions/page.tsx` y reemplazar el `useState` del filtro `status` por el hook
- [ ] 3.2 Conectar el selector de status para que llame a `setFilters` en cada cambio
- [ ] 3.3 Verificar que al refrescar con `?status=pending` el filtro se restaura

## 4. Página Patient Prescriptions

- [ ] 4.1 Importar `useFilterParams` en `app/patient/prescriptions/page.tsx` y reemplazar el `useState` del filtro `status` por el hook (si existe; añadir si no hay filtro todavía)
- [ ] 4.2 Conectar el selector de status para que llame a `setFilters` en cada cambio
- [ ] 4.3 Verificar que al refrescar con `?status=consumed` el filtro se restaura

## 5. Suspense boundary (si aplica)

- [ ] 5.1 Verificar en tiempo de build/dev si Next.js 16 exige `<Suspense>` alrededor de páginas que usen `useSearchParams`; si lo hace, añadir el boundary mínimo necesario en cada página afectada
