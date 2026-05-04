## ADDED Requirements

### Requirement: Access token JWT
El sistema DEBE generar un JWT de acceso con duración de 15 minutos (900 segundos) al iniciar sesión.

#### Scenario: Login exitoso genera access token
- **WHEN** el usuario envía credenciales válidas (email/password)
- **THEN** el sistema retorna un access token válido por 900 segundos

#### Scenario: Access token expira
- **WHEN** el access token supera los 900 segundos de vida
- **THEN** el servidor retorna 401 Unauthorized y el cliente debe usar el refresh token

### Requirement: Refresh token JWT
El sistema DEBE generar un refresh token con duración de 7 días al iniciar sesión.

#### Scenario: Login exitoso genera refresh token
- **WHEN** el usuario envía credenciales válidas
- **THEN** el sistema retorna un refresh token válido por 604800 segundos

#### Scenario: Refresh token renueva access token
- **WHEN** el cliente envía un refresh token válido
- **THEN** el sistema retorna un nuevo access token y rota el refresh token

#### Scenario: Refresh token inválido
- **WHEN** el cliente envía un refresh token修改 o vacío
- **THEN** el sistema retorna 401 Unauthorized

### Requirement: Rotación de refresh tokens
El sistema DEBE invalidar el refresh token anterior al generar uno nuevo.

#### Scenario: Refresh token usado genera nueva pareja
- **WHEN** el cliente envía un refresh token válido
- **THEN** el sistema retorna nuevo access token Y nuevo refresh token, invalidando el anterior

### Requirement: Logout invalida refresh token
El sistema DEBE invalidar el refresh token cuando el usuario hace logout.

#### Scenario: Logout exitoso
- **WHEN** el usuario llama al endpoint de logout
- **THEN** el refresh token es removido de la base de datos