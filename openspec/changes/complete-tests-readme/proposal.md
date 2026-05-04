## Why

El proyecto tiene tests unitarios básicos pero faltan tests e2e y falta verificar/actualizar el README. Es necesario completar la Fase 6 de testing según proyecto.md y verificar que el README sea suficiente para levantar el proyecto en menos de 15 minutos.

## What Changes

- Agregar tests e2e para flujos críticos (auth, prescriptions)
- Agregar coverage report al proyecto
- Verificar y mejorar README con setup completo
- Asegurar que las cuentas de prueba estén documentadas

## Capabilities

### New Capabilities
- `backend-tests`: Tests unitarios y e2e del backend
- `frontend-tests`: Tests de componentes del frontend
- `documentation`: README completo con setup

### Modified Capabilities
- user-auth: Agregar tests e2e de login/refresh
- doctor-portal: Agregar tests e2e de creación de prescripciones
- patient-portal: Agregar tests e2e de consumo de prescripciones

## Impact

- packages/backend/ - agregar archivos de test e2e
- packages/frontend/ - agregar tests de componentes
- Root directory - README.md existente requiere actualizaciones