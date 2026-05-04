## Why

Los tests del frontend no ejecutan correctamente. Hay errores de configuración de Jest (SyntaxError con ESM, transform no configurado) que evitan que los tests unitarios de React funcionen. Esto impide cumplir el requerimiento de testing mínimo del proyecto.

## What Changes

- Corregir configuración de Jest para Next.js 16
- Instalar dependencias necesarias (@babel/preset-react, babel-jest)
- Crear archivo de test funcional para LoginPage

## Capabilities

### New Capabilities
- `frontend-testing`: Tests ejecutables de componentes React

### Modified Capabilities
- (ninguno - es corrección de config existente)

## Impact

- packages/frontend: configuración de testing