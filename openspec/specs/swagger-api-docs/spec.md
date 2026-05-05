# swagger-api-docs Specification

## Purpose
TBD - created by archiving change swagger-docs. Update Purpose after archive.
## Requirements
### Requirement: Swagger UI disponible en /docs
El sistema SHALL exponer una interfaz interactiva OpenAPI 3.0 en `GET /docs` que liste todos los endpoints de la API agrupados por módulo.

#### Scenario: Acceso a la documentación
- **WHEN** un usuario navega a `GET /docs`
- **THEN** el sistema responde con la UI de Swagger UI con estado HTTP 200

#### Scenario: Documento JSON disponible
- **WHEN** un cliente solicita `GET /docs-json`
- **THEN** el sistema devuelve el documento OpenAPI 3.0 en formato JSON

### Requirement: Endpoints agrupados por tag
El sistema SHALL agrupar los endpoints en la UI de Swagger por los tags: `auth`, `users`, `prescriptions`, `admin`.

#### Scenario: Tag auth presente
- **WHEN** el usuario abre la UI de Swagger
- **THEN** existe el grupo `auth` con los endpoints login, register, refresh, profile y logout

#### Scenario: Tag prescriptions presente
- **WHEN** el usuario abre la UI de Swagger
- **THEN** existe el grupo `prescriptions` con todos los endpoints de prescripciones

### Requirement: Autenticación Bearer en la UI
El sistema SHALL ofrecer un botón "Authorize" en la UI que permita introducir un JWT Bearer token para autenticar las peticiones de prueba.

#### Scenario: Autorización con token válido
- **WHEN** el usuario introduce un `accessToken` válido en el campo "Authorize"
- **THEN** las peticiones realizadas desde la UI incluyen el header `Authorization: Bearer <token>`

#### Scenario: Endpoints protegidos marcados
- **WHEN** el usuario visualiza un endpoint que requiere autenticación
- **THEN** ese endpoint muestra el icono de candado (🔒) en la UI

### Requirement: Schemas de request y response documentados
Los DTOs de request SHALL tener sus campos documentados con tipos, descripciones y si son opcionales u obligatorios. Las responses SHALL documentar los códigos HTTP esperados (200, 201, 400, 401, 403, 404, 409).

#### Scenario: Schema de CreatePrescriptionDto visible
- **WHEN** el usuario expande el endpoint `POST /prescriptions`
- **THEN** la UI muestra el schema del body con los campos `patientId`, `notes` (opcional) e `items` (array)

#### Scenario: Respuestas de error documentadas
- **WHEN** el usuario revisa cualquier endpoint protegido
- **THEN** la UI lista al menos las respuestas 401 (no autenticado) y 403 (sin permiso)

### Requirement: Endpoint PDF documentado correctamente
El endpoint `GET /prescriptions/:id/pdf` SHALL estar documentado indicando que produce `application/pdf`.

#### Scenario: Content-type PDF en la documentación
- **WHEN** el usuario revisa `GET /prescriptions/:id/pdf` en la UI
- **THEN** la descripción indica que la respuesta es un archivo PDF binario

