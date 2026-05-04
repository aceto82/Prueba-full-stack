## Context

El proyecto actual no tiene tests ni documentación de setup. Las fases anteriores completaron el MVP funcional. Fase 6 要求 tests básicos para garantizar calidad y entrega según criterios de evaluación.

## Goals / Non-Goals

**Goals:**
- Tests unitarios de servicios backend (auth, prescriptions)
- Tests e2e básicos para flujos críticos (login, create prescription, consume)
- Test de componente React crítico
- README con setup local
- Swagger en backend (plus)

**Non-Goals:**
- Cobertura completa (solo casos críticos)
- Testing de integración entre servicios
- Documentación extensa (solo lo esencial)

## Decisions

1. **Testing Framework**: Jest + Supertest (backend), Jest + Testing Library (frontend)
   - Alternativa: Vitest (más rápido pero requiere configuración adicional)
   - Justificación: Jest viene con NestJS por defecto

2. **Scope de tests**:
   - Unitarios: AuthService, PrescriptionsService
   - E2E: /auth/login, POST /prescriptions, PUT /prescriptions/:id/consume
   - Frontend: componente Login o AuthContext

3. **README estructura**:
   - Requisitos
   - Setup (npm install, migrate, seed)
   - Ejecutar desarrollo
   - Credenciales de prueba
   - Stack y decisiones técnicas

## Risks / Trade-offs

- **Riesgo**: Tests e2e fallan por timing → Mitigation: usar await adequado
- **Riesgo**: Configuración de base de datos de test → Mitigation: SQLite en memoria para tests