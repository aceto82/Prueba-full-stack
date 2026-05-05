## Why

El proyecto expone una API REST completa pero carece de documentación interactiva; los evaluadores y consumidores deben leer el código fuente para conocer los contratos. Swagger/OpenAPI en `/docs` cubre el checklist del evaluador y suma puntos en el criterio de documentación técnica.

## What Changes

- Instalar `@nestjs/swagger` y `swagger-ui-express` en el backend.
- Configurar `SwaggerModule` en `main.ts` para generar el documento OpenAPI y servirlo en `/docs`.
- Decorar todos los controladores y DTOs existentes con los decorators de Swagger (`@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiBearerAuth`, `@ApiProperty`, etc.).
- Proteger `/docs` en producción (acceso público en dev, opcionalmente restringido en prod).

## Capabilities

### New Capabilities

- `swagger-api-docs`: Endpoint `/docs` que sirve la UI de Swagger con todos los endpoints documentados, esquemas de request/response y soporte de autenticación Bearer.

### Modified Capabilities

<!-- No hay cambios en los requisitos funcionales de los specs existentes; solo se añaden metadatos de documentación a los endpoints ya especificados. -->

## Impact

- **Backend**: `main.ts` (setup del módulo), todos los controllers (`auth`, `users`, `prescriptions`, `admin`), todos los DTOs bajo `src/**/dto/`.
- **Dependencias**: `@nestjs/swagger`, `swagger-ui-express`.
- **Sin cambios** en lógica de negocio, base de datos, ni frontend.
