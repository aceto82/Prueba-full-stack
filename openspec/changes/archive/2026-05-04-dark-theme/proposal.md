## Why

El proyecto solo tiene modo claro. Agregar dark/light theme con preferencia persistida mejora la UX yAccessibility. Es un featureplus común en apps modernas.

## What Changes

- Agregar ThemeContext para estado global del tema
- Toggle en UI para cambiar entre dark/light
- Persistir preferencia en localStorage
- Aplicar tema con CSS/Tailwind

## Capabilities

### New Capabilities
- `dark-theme`: Toggle dark/light con preferencia persistida

### Modified Capabilities
- (ninguno - es feature plus)

## Impact

- packages/frontend: ThemeContext, estilos