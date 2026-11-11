## Why

In Randomizer mode (`DeckSetup`), switching to **"Enter a Code"** leaves focus on the mode button, so the player has to tap the code input before typing. The input also has only a faint grey focus border (`focus:border-stone-400`), so it is hard to see where to type.

## What Changes

- Selecting the **"Enter a Code"** (join) mode moves keyboard focus to the code input. On mobile this opens the on-screen keyboard.
- While focused, the code input shows a **yellow (amber) border** in place of the current grey one. The border goes back to the normal grey when the input loses focus. The colour is the same amber on every army, not the army accent.
- The Vite dev/preview server listens on `$DISP_PORT` when it is set, so parallel worktrees don't fight over Vite's fixed default port 5173. When `DISP_PORT` is unset, the current default behaviour stays.

Out of scope: the "New Deck" panel, the code-character boxes above the input, validation logic, and Start-button behaviour.

## Capabilities

### New Capabilities
- `deck-code-entry`: focus and focus-styling behaviour of the Randomizer's "Enter a Code" input.

### Modified Capabilities
<!-- none: openspec/specs/ is empty -->

## Impact

- `src/components/DeckSetup.tsx`: mode-toggle handler and the input's className.
- `vite.config.ts`: `server.port` and `preview.port` read `DISP_PORT`.
- No new dependencies and no i18n changes.
