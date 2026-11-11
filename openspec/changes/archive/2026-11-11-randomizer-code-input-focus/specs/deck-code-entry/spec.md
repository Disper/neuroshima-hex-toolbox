## ADDED Requirements

### Requirement: Selecting "Enter a Code" focuses the code input
When the user selects the "Enter a Code" mode in the Randomizer deck setup, the system SHALL move keyboard focus to the code input field.

#### Scenario: Switching from New Deck to Enter a Code
- **WHEN** the user is on the "New Deck" mode and clicks or taps "Enter a Code"
- **THEN** the code input is rendered and receives focus, so typed characters go into it without another click

#### Scenario: Re-selecting Enter a Code while already in that mode
- **WHEN** the user is already in "Enter a Code" mode, the input has lost focus, and the user selects "Enter a Code" again
- **THEN** the code input receives focus again

#### Scenario: Selecting New Deck does not steal focus
- **WHEN** the user selects "New Deck"
- **THEN** focus is not moved to any input

### Requirement: Focused code input has a yellow border
The code input SHALL show a yellow (amber) border while it has focus, and its normal grey border when it does not. The yellow SHALL be the same for all armies.

#### Scenario: Input focused
- **WHEN** the code input has focus (automatically or via click/tap)
- **THEN** its border is amber/yellow

#### Scenario: Input blurred
- **WHEN** focus leaves the code input
- **THEN** its border goes back to the default grey (`stone-600`)

#### Scenario: Any army
- **WHEN** the deck setup is opened for any army, including Iron Gang
- **THEN** the focused border colour is the same amber, not the army's accent colour

### Requirement: Dev server port is configurable via DISP_PORT
The Vite dev and preview servers SHALL listen on the port given by the `DISP_PORT` environment variable when it is set, and SHALL keep Vite's default behaviour when it is not.

#### Scenario: DISP_PORT set
- **WHEN** `DISP_PORT=36524 npm run dev` is run
- **THEN** the dev server listens on port 36524

#### Scenario: DISP_PORT unset
- **WHEN** `npm run dev` is run without `DISP_PORT`
- **THEN** the dev server starts on Vite's default port as before
