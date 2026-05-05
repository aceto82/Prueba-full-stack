# theme-toggle Specification

## Purpose
TBD - created by archiving change theme-toggle. Update Purpose after archive.
## Requirements
### Requirement: User can toggle between light and dark theme
The system SHALL provide a toggle button in the Navbar that switches the active theme between `light` and `dark`. The button SHALL display a sun icon (☀) when the current theme is dark and a moon icon (🌙) when the current theme is light, so clicking it always moves toward the opposite state.

#### Scenario: User switches from light to dark
- **WHEN** the active theme is light and the user clicks the toggle button
- **THEN** the page switches to dark mode immediately without a full reload

#### Scenario: User switches from dark to light
- **WHEN** the active theme is dark and the user clicks the toggle button
- **THEN** the page switches to light mode immediately without a full reload

### Requirement: Theme preference is persisted in localStorage
The system SHALL store the user's chosen theme (`"light"` or `"dark"`) in `localStorage` under the key `"theme"`. On every page load the stored value SHALL be applied before the user interacts with the toggle.

#### Scenario: Stored dark preference is applied on reload
- **WHEN** a user who previously selected dark theme reloads the page
- **THEN** the page renders in dark mode without requiring the user to toggle again

#### Scenario: Stored light preference overrides OS dark mode
- **WHEN** the OS prefers dark and the user has stored `"light"` in localStorage
- **THEN** the page renders in light mode

### Requirement: Theme falls back to OS preference when no stored value exists
The system SHALL read `window.matchMedia('(prefers-color-scheme: dark)')` and apply dark mode when the result is `true` and no value is stored in `localStorage`.

#### Scenario: No preference stored, OS prefers dark
- **WHEN** localStorage has no `"theme"` key and the OS reports `prefers-color-scheme: dark`
- **THEN** the page loads in dark mode

#### Scenario: No preference stored, OS prefers light
- **WHEN** localStorage has no `"theme"` key and the OS reports `prefers-color-scheme: light`
- **THEN** the page loads in light mode

### Requirement: Dark mode applies consistent visual styles via CSS class
The system SHALL apply a `dark` class to the `<html>` element when dark mode is active and remove it when light mode is active. The `globals.css` SHALL define dark-mode color overrides inside a `.dark` selector so that all pages inherit the correct colors without page-specific changes.

#### Scenario: Dark class is present in dark mode
- **WHEN** the active theme is dark
- **THEN** the `<html>` element has the class `dark`

#### Scenario: Dark class is absent in light mode
- **WHEN** the active theme is light
- **THEN** the `<html>` element does not have the class `dark`

