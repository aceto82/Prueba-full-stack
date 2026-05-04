## Context

Proyecto full-stack con NestJS backend y Next.js frontend. Ya existen 11 tests unitarios en backend y 2 en frontend. Falta:
1. Tests e2e para flujos críticos
2. Coverage report
3. README completo

## Goals / Non-Goals

**Goals:**
- Completar tests e2e para auth, prescriptions (doctor y patient)
- Agregar coverage report configurado
- Verificar/mejorar README

**Non-Goals:**
- No es necesario coverage 100%
- No es necesario testear cada edge case
- No es necesario Swagger (ya existe según faseline)

## Decisions

1. **Testing Framework Backend**: Usar Jest + Supertest (ya instalados)
2. **Testing Framework Frontend**: Usar Vitest (ya instalado)
3. **E2E Approach**: Tests de integración via endpoint calls, no browser automation
4. **README Structure**: Secciones estándar con setup, variables, credenciales, comandos

## Risks / Trade-offs

- [Risk] DB de test puede tener estado :: [Mitigation] Cada test e2e limpia datos relevantes
- [Risk] Tests pueden ser lentos :: [Mitigation] Ejecutar en paralelo donde sea posible