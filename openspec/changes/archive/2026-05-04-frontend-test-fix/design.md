## Context

Frontend tiene dependencias de testing instaladas (@testing-library/react, jest) pero la config de Jest no funciona con Next.js 16 + ESM.

Errores actuales:
- SyntaxError: Cannot use import statement outside a module
- Jest busca jest.config.js pero Next.js usa ESM

## Goals / Non-Goals

**Goals:**
- Tests ejecutables con `npm run test`
- Al menos 1 test passing

**Non-Goals:**
- Coverage completo
- Config de e2e

## Decisions

1. **Usar Vitest en vez de Jest**
   - Alternativa: Arreglar config de Jest con transform
   - Justificación: Vitest funciona mejor con ESM y Next.js 16
   - Más moderno, menos configuración

2. **No usar supertest (frontend)**
   - Alternativa: Testing de componentes con Testing Library
   - Justificación: No hay API calls en frontend tests, solo render

## Risks / Trade-offs

- **Riesgo**: Cambiar de Jest a Vitest puede afectar otros configs
- **Mitigation**: Es solo frontend, backend sigue con Jest

- **Riesgo**: Configuración de jsdom
- **Mitigation**: Vitest tiene jsdom built-in