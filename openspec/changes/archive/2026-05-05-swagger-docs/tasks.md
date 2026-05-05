## 1. Instalación y configuración base

- [x] 1.1 Instalar `@nestjs/swagger` y `swagger-ui-express` en `packages/backend`
- [x] 1.2 Habilitar el plugin `@nestjs/swagger/plugin` en `nest-cli.json` para inferencia automática de schemas de DTOs
- [x] 1.3 Configurar `SwaggerModule` en `main.ts`: `DocumentBuilder` con título, descripción, versión y `addBearerAuth()`, setup en `/docs`

## 2. Decoración de controladores

- [x] 2.1 Decorar `AuthController` con `@ApiTags('auth')` y `@ApiOperation` + `@ApiResponse` por cada endpoint (login, register, refresh, profile, logout)
- [x] 2.2 Decorar `UsersController` con `@ApiTags('users')` y `@ApiBearerAuth`, añadir `@ApiResponse` para 200, 401, 403
- [x] 2.3 Decorar `PrescriptionsController` con `@ApiTags('prescriptions')` y `@ApiBearerAuth`, documentar cada endpoint incluyendo `@ApiProduces('application/pdf')` en el endpoint PDF
- [x] 2.4 Decorar `AdminController` con `@ApiTags('admin')` y `@ApiBearerAuth`, añadir `@ApiResponse` para métricas y listado

## 3. Decoración de DTOs

- [x] 3.1 Añadir `@ApiProperty` a campos de `LoginDto` y `RegisterDto` que el plugin no pueda inferir (enums de rol)
- [x] 3.2 Añadir `@ApiProperty` a `CreatePrescriptionDto` y `CreatePrescriptionItemDto` para campos opcionales y el array de ítems
- [x] 3.3 Añadir `@ApiPropertyOptional` a `ListPrescriptionsDto`, `AdminListPrescriptionsDto` y `MetricsQueryDto` para los filtros opcionales
- [x] 3.4 Revisar `PaginationDto` y añadir `@ApiPropertyOptional` con ejemplos para `page`, `limit` y `order`

## 4. Verificación

- [x] 4.1 Arrancar el backend y confirmar que `GET /docs` devuelve la UI con los 4 grupos de tags
- [x] 4.2 Verificar que `GET /docs-json` devuelve el documento OpenAPI válido
- [x] 4.3 Probar el flujo de autenticación en la UI: obtener token con `/auth/login` y usarlo en "Authorize" para llamar a un endpoint protegido
