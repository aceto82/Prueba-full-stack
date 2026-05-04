## Context

Frontend usa TailwindCSS 4. TailwindCSS 4 tiene soporte nativo para dark mode via CSS.

## Goals / Non-Goals

**Goals:**
- Toggle dark/light en header
- Persistir preferencia en localStorage
- Aplicar tema globalmente

**Non-Goals:**
- Tema por sistema operativo (solo manual)
- Transiciones complejas

## Decisions

1. **Usar TailwindCSS dark mode con data-theme**
   - Alternativa: class-based dark mode
   - Justificación: TailwindCSS 4 usa data-theme attribute

2. **ThemeContext + localStorage**
   - Context global para tema
   - Hook useTheme() para acceder
   - localStorage clave: 'theme-preference'

3. **Tailwind config para dark colors**
   - Usar CSS custom properties para colores
   - Sofrcode: definir en globals.css

## Risks / Trade-offs

- **Riesgo**: Conflictos con colores existentes
- **Mitigation**: Usar override con data-theme attribute

- **Riesgo**: Flash tema al cargar (FOUC)
- **Mitigation**: Script en head del HTML