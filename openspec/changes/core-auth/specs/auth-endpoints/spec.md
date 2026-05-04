## ADDED Requirements

### Requirement: POST /auth/login
El sistema DEBE validar credenciales y retornar tokens de acceso.

#### Scenario: Login con credenciales válidas
- **WHEN** se envía POST /auth/login con email y password correctos
- **THEN** retorna { accessToken, refreshToken } con código 200

#### Scenario: Login con email inexistente
- **WHEN** se envía POST /auth/login con email no registrado
- **THEN** retorna 401 Unauthorized con mensaje "Credenciales inválidas"

#### Scenario: Login con password incorrecto
- **WHEN** se envía POST /auth/login con password incorrecto
- **THEN** retorna 401 Unauthorized con mensaje "Credenciales inválidas"

#### Scenario: Login con datos incompletos
- **WHEN** se envía POST /auth/login sin email o sin password
- **THEN** retorna 400 Bad Request con errores de validación

### Requirement: POST /auth/register
El sistema DEBE registrar nuevos usuarios (doctor o patient).

#### Scenario: Registro exitoso de paciente
- **WHEN** se envía POST /auth/register con datos válidos y rol 'patient'
- **THEN** retorna 201 Created con datos del usuario creado

#### Scenario: Registro exitoso de doctor
- **WHEN** se envía POST /auth/register con datos válidos y rol 'doctor'
- **THEN** retorna 201 Created con datos del usuario y doctor creados

#### Scenario: Registro con email duplicado
- **WHEN** se envía POST /auth/register con email ya existente
- **THEN** retorna 409 Conflict con mensaje "El email ya está registrado"

#### Scenario: Registro con rol inválido
- **WHEN** se envía POST /auth/register con rol 'admin'
- **THEN** retorna 400 Bad Request con mensaje de error

### Requirement: POST /auth/refresh
El sistema DEBE renovar access token usando refresh token.

#### Scenario: Refresh exitoso
- **WHEN** se envía POST /auth/refresh con refresh token válido
- **THEN** retorna nuevo { accessToken, refreshToken }

#### Scenario: Refresh con token inválido
- **WHEN** se envía POST /auth/refresh con token modificado
- **THEN** retorna 401 Unauthorized

### Requirement: GET /auth/profile
El sistema DEBE retornar los datos del usuario autenticado.

#### Scenario: Profile exitoso
- **WHEN** se envía GET /auth/profile con token válido
- **THEN** retorna { id, email, name, role, ... } con código 200

#### Scenario: Profile sin token
- **WHEN** se envía GET /auth/profile sin Authorization header
- **THEN** retorna 401 Unauthorized