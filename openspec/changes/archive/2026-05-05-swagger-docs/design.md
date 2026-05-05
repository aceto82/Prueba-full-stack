## Context

El backend NestJS expone 5 controladores (`AppController`, `AuthController`, `UsersController`, `PrescriptionsController`, `AdminController`) y 9 DTOs sin ninguna anotación Swagger. El evaluador debe leer el código fuente para conocer los contratos de la API. La librería `@nestjs/swagger` se integra directamente con el sistema de decoradores de NestJS y genera el documento OpenAPI desde los metadatos existentes (class-validator, TypeScript types) con mínima fricción.

## Goals / Non-Goals

**Goals:**
- Servir la UI interactiva de Swagger en `GET /docs`.
- Documentar todos los endpoints con tags, operaciones, respuestas esperadas y esquemas de request/response.
- Habilitar el flujo de autenticación Bearer en la UI (campo "Authorize" con JWT).
- Marcar los endpoints públicos vs protegidos correctamente.

**Non-Goals:**
- Restricción de `/docs` en producción (fuera del alcance MVP).
- Generar colección Postman/Insomnia automáticamente.
- Versionado de la API.

## Decisions

### 1. Librería: `@nestjs/swagger` + `swagger-ui-express`

`@nestjs/swagger` es el wrapper oficial de NestJS para OpenAPI 3.0. Reutiliza los decoradores de `class-validator` (`@IsString`, `@IsEmail`, etc.) mediante el plugin de Nest para inferir el schema de los DTOs sin tener que duplicar `@ApiProperty` en cada campo. Alternativa descartada: generar YAML manualmente (demasiado mantenimiento).

**Plugin del compilador**: Se habilitará `@nestjs/swagger/plugin` en `nest-cli.json` para que el esquema de los DTOs se infiera automáticamente de los tipos TypeScript y decoradores class-validator, reduciendo la cantidad de `@ApiProperty` manuales necesarios.

### 2. Configuración en `main.ts`

```
DocumentBuilder → SwaggerModule.createDocument → SwaggerModule.setup('/docs', app, document)
```

Se configura antes de `app.listen()`. El token de seguridad se declara como `addBearerAuth()` para que la UI muestre el botón "Authorize".

### 3. Decoración por módulo

| Archivo | Decoradores añadidos |
|---|---|
| `auth.controller.ts` | `@ApiTags('auth')`, `@ApiOperation`, `@ApiResponse` por endpoint, `@Public()` ya marcado |
| `users.controller.ts` | `@ApiTags('users')`, `@ApiBearerAuth`, `@ApiResponse` |
| `prescriptions.controller.ts` | `@ApiTags('prescriptions')`, `@ApiBearerAuth`, `@ApiResponse` |
| `admin.controller.ts` | `@ApiTags('admin')`, `@ApiBearerAuth`, `@ApiResponse` |
| DTOs | `@ApiProperty` solo donde el plugin no pueda inferir (campos opcionales con tipos complejos) |

### 4. Respuesta del endpoint PDF

`GET /prescriptions/:id/pdf` devuelve un buffer binario. Se documenta con `@ApiProduces('application/pdf')` y `@ApiResponse({ status: 200, description: 'PDF file' })` sin schema de body.

## Risks / Trade-offs

- **Plugin de compilador**: Requiere modificar `nest-cli.json`. Si no se activa, todos los campos de DTO quedan sin tipo en Swagger → se mitiga añadiendo el plugin en el paso de configuración inicial.
- **`@ApiProperty` manual residual**: Campos con tipos unión o enums de Prisma necesitan decoración explícita porque el plugin no puede inferirlos → se resuelve caso a caso durante la decoración de DTOs.
- **Endpoint PDF en Swagger UI**: No se puede probar directamente desde la UI (descarga binaria) → se documenta correctamente pero se indica en la descripción que debe usarse con curl o el cliente HTTP.
