## ADDED Requirements

### Requirement: Verificación de rol en endpoints
El sistema DEBE verificar el rol del usuario antes de permitir acceso a recursos protegidos.

#### Scenario: Acceso con rol correcto
- **WHEN** un usuario con rol 'doctor' accede a /prescriptions (endpoint de doctor)
- **THEN** el sistema permite el acceso

#### Scenario: Acceso con rol incorrecto
- **WHEN** un usuario con rol 'patient' accede a /prescriptions (endpoint de doctor)
- **THEN** el sistema retorna 403 Forbidden

### Requirement: Decorador @Roles
El sistema DEBE proporcionar un decorador @Roles para especificar roles requeridos en controladores.

#### Scenario: Decorador aplicado correctamente
- **WHEN** se aplica @Roles('admin') a un endpoint
- **THEN** solo usuarios con rol 'admin' pueden acceder

#### Scenario: Múltiples roles permitidos
- **WHEN** se aplica @Roles('admin', 'doctor') a un endpoint
- **THEN** usuarios con rol 'admin' O 'doctor' pueden acceder

### Requirement: Roles hierarchy
El sistema DEBE permitir que el admin acceda a todos los recursos.

#### Scenario: Admin accede a cualquier recurso
- **WHEN** un usuario con rol 'admin' accede a cualquier endpoint
- **THEN** el sistema permite el acceso sin importar la protección de roles

### Requirement: Acceso a propio perfil
El sistema DEBE permitir que cualquier usuario autenticado acceda a su propio perfil.

#### Scenario: Usuario consulta su propio perfil
- **WHEN** un usuario autenticado llama a GET /auth/profile
- **THEN** el sistema retorna los datos del usuario y su rol