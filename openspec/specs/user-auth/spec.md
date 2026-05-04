## Purpose

Frontend authentication and session management for all user roles.

## Requirements

### Requirement: User can log in with email and password
The login page SHALL accept email and password credentials and authenticate against the backend API.

#### Scenario: Successful login
- **WHEN** user enters valid email and password and clicks "Ingresar"
- **THEN** system receives accessToken and refreshToken, stores them, and redirects to role-based dashboard

#### Scenario: Invalid credentials
- **WHEN** user enters invalid email or password
- **THEN** system displays error message "Credenciales inválidas"

### Requirement: User session persists
The system SHALL maintain user session across browser refreshes.

#### Scenario: Returning user
- **WHEN** user returns to app with valid accessToken in localStorage
- **THEN** system redirects to role-based dashboard without login

#### Scenario: Expired token
- **WHEN** accessToken is expired but refreshToken is valid
- **THEN** system attempts token refresh; if successful continues session

#### Scenario: Invalid tokens
- **WHEN** both tokens are invalid or missing
- **THEN** system redirects to /login

### Requirement: User can log out
The system SHALL allow users to log out and clear session data.

#### Scenario: User logs out
- **WHEN** user clicks "Cerrar sesión" button
- **THEN** system clears tokens and redirects to /login

### Requirement: User role determines routes
The system SHALL protect routes based on user role.

#### Scenario: Unauthorized role access
- **WHEN** patient accesses /doctor/prescriptions route
- **THEN** system redirects to /patient/prescriptions

#### Scenario: Unauthorized role access
- **WHEN** doctor accesses /admin route
- **THEN** system redirects to /doctor/prescriptions