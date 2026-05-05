# project-readme Specification

## Purpose
TBD - created by archiving change fase6. Update Purpose after archive.
## Requirements
### Requirement: Repository has a root README with setup and usage instructions
The system SHALL have a `README.md` at the repository root. The README SHALL include: a one-paragraph description of the project, a prerequisites section (Node.js version, PostgreSQL), an environment variables section listing all required variables for both packages with example values, a seed data table showing the three test users (email, role, password), and a commands reference covering all `npm run` scripts available from the root (`dev`, `dev:backend`, `dev:frontend`, `build`, `test`, and the database commands). The README SHALL be written in English.

#### Scenario: New developer can find database setup instructions
- **WHEN** a developer opens the README for the first time
- **THEN** they can find the `DATABASE_URL` format, the migration command, and the seed command without reading any other file

#### Scenario: New developer can find the test credentials
- **WHEN** a developer opens the README
- **THEN** they can find the email, role, and password for all three seed users in a table

#### Scenario: New developer can start the full stack from the README alone
- **WHEN** a developer follows only the README instructions in order
- **THEN** they can run `npm run dev` and access both the backend (port 3000) and frontend (port 3001) without consulting any other file

