## ADDED Requirements

### Requirement: Hook useFilterParams sincroniza filtros con la URL
El sistema SHALL proveer un hook `useFilterParams(keys: string[])` en `src/hooks/useFilterParams.ts`. El hook SHALL leer los valores iniciales de los filtros desde `useSearchParams()` al montar y SHALL devolver el estado actual de los filtros y una función `setFilters` que actualice el estado local y llame a `router.replace` con los nuevos query params de forma sincrónica (shallow, sin recarga). Los params con valor vacío o `undefined` SHALL ser eliminados de la URL.

#### Scenario: Inicialización desde URL
- **WHEN** la página monta y la URL contiene `?from=2024-01-01&to=2024-01-31`
- **THEN** el hook retorna `{ from: "2024-01-01", to: "2024-01-31" }` sin renders adicionales

#### Scenario: Actualizar filtros actualiza la URL
- **WHEN** se llama a `setFilters({ from: "2024-02-01", to: "" })`
- **THEN** la URL se actualiza a `?from=2024-02-01` (sin el param vacío) usando `router.replace`

#### Scenario: Limpiar filtros elimina todos los params
- **WHEN** se llama a `setFilters({})` o con todos los valores vacíos
- **THEN** la URL queda sin query params (`?` eliminado)

#### Scenario: Params desconocidos se preservan
- **WHEN** la URL contiene params no gestionados por el hook (e.g., `?tab=metrics`)
- **THEN** esos params se mantienen en la URL al actualizar los filtros del hook
