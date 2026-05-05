## 1. Instalación y configuración base

- [ ] 1.1 Instalar `@nestjs/swagger` y `swagger-ui-express` en `packages/backend`
- [ ] 1.2 Habilitar el plugin `@nestjs/swagger/plugin` en `nest-cli.json` para inferencia automática de schemas de DTOs
- [ ] 1.3 Configurar `SwaggerModule` en `main.ts`: `DocumentBuilder` con título, descripción, versión y `addBearerAuth()`, setup en `/docs`

## 2. Decoración de controladores

- [ ] 2.1 Decorar `AuthController` con `@ApiTags('auth')` y `@ApiOperation` + `@ApiResponse` por cada endpoint (login, register, refresh, profile, logout)
- [ ] 2.2 Decorar `UsersController` con `@ApiTags('users')` y `@ApiBearerAuth`, añadir `@ApiResponse` para 200, 401, 403
- [ ] 2.3 Decorar `PrescriptionsController` con `@ApiTags('prescriptions')` y `@ApiBearerAuth`, documentar cada endpoint incluyendo `@ApiProduces('application/pdf')` en el endpoint PDF
- [ ] 2.4 Decorar `AdminController` con `@ApiTags('admin')` y `@ApiBearerAuth`, añadir `@ApiResponse` para métricas y listado

## 3. Decoración de DTOs

- [ ] 3.1 Añadir `@ApiProperty` a campos de `LoginDto` y `RegisterDto` que el plugin no pueda inferir (enums de rol)
- [ ] 3.2 Añadir `@ApiProperty` a `CreatePrescriptionDto` y `CreatePrescriptionItemDto` para campos opcionales y el array de ítems
- [ ] 3.3 Añadir `@ApiPropertyOptional` a `ListPrescriptionsDto`, `AdminListPrescriptionsDto` y `MetricsQueryDto` para los filtros opcionales
- [ ] 3.4 Revisar `PaginationDto` y añadir `@ApiPropertyOptional` con ejemplos para `page`, `limit` y `order`

## 4. Verificación

- [ ] 4.1 Arrancar el backend y confirmar que `GET /docs` devuelve la UI con los 4 grupos de tags
- [ ] 4.2 Verificar que `GET /docs-json` devuelve el documento OpenAPI válido
- [ ] 4.3 Probar el flujo de autenticación en la UI: obtener token con `/auth/login` y usarlo en "Authorize" para llamar a un endpoint protegido
