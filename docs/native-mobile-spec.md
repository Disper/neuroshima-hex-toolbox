# Native Mobile Behavior Spec

This document freezes the current web behavior so the native Android and iOS apps can target parity instead of reinterpreting the rules later.

## Product Scope

The current app is a single-page React application with three top-level feature modes:

- `randomizer`
- `counter`
- `tileflip`

Primary screens and transitions are orchestrated in `src/App.tsx`.

## Navigation Model

The web app behaves like a single document with internal screens:

- `home`
- `army`
- `setup`
- `draw`
- `counter`

Behavioral rules:

- The app starts on `home`.
- Selecting an army in `randomizer` opens `army`.
- Starting a draw session opens `setup`.
- Starting from setup opens `draw`.
- Selecting two different armies in `counter` mode opens `counter`.
- Browser Back and Forward are mapped to internal state snapshots using the History API.
- Invalid or incomplete history state falls back to `home`.

Native parity target:

- Replace History API snapshots with a real navigation stack.
- Preserve the same guarded transitions and fallbacks.

## Feature 1: Army Browser

The army browser is the app landing experience.

Behavior:

- User can switch locale between English and Polish.
- User can search armies by English or Polish display name.
- Army ordering comes from `src/data/armies/index.ts` and should remain stable.
- Each army card summarizes counts by category.
- In `randomizer` mode, selecting an army opens the army detail screen.
- In `counter` mode, first tap selects army A, second tap must be a different army B.

Native parity target:

- Keep the release-order sort.
- Preserve search across both English and Polish names.
- Preserve the “pick two different armies” constraint for counter mode.

## Feature 2: Army Detail

Army detail is defined by `src/components/ArmyView.tsx`.

Behavior:

- Show localized army name, description, and HQ ability.
- Show the HQ section first.
- For regular armies, render a synthetic HQ tile plus any tiles marked `displayWithHq`.
- For multi-headquarters armies, render the actual HQ-category tiles instead of a synthetic HQ tile.
- Keep category ordering:
  - `hq`
  - `instant`
  - `soldier`
  - `implant`
  - `module`
  - `foundation`
- Show tile counts per section.
- “Start Drawing Tiles” enters deck setup for the selected army.

## Feature 3: Deck Setup

Deck setup is defined by `src/components/DeckSetup.tsx`.

Behavior:

- Standard armies use a 6-character deck code.
- Iron Gang uses a 7-character deck code.
- Standard deck alphabet is `23456789ABCDEFGHJKMNPQRSTUVWXYZ_`.
- Iron Gang deck codes use the same first 6 characters plus a 7th numeric suffix:
  - `0` = no Hook
  - `1` = replace Mountain
  - `2` = replace Boss
  - `3` = replace Officer
  - `4` = replace Order
  - `5` = replace Biker
  - `6` = replace Doubled Move
  - `7` = replace Fanatic
  - `8` = replace Ranged Net Fighter
  - `9` = replace Lumberjack
- Setup has two modes:
  - generate a new random deck code
  - join an existing deck code
- Validation is strict:
  - exact code length
  - valid seed characters in the first 6 positions
  - valid Iron Gang suffix when required
- Copying code uses the system clipboard.

Native parity target:

- Preserve exact code parsing and validation behavior.
- Preserve Iron Gang’s suffix semantics exactly.

## Feature 4: Draw Mode

Draw mode is defined by `src/components/DrawMode.tsx`.

Behavior:

- A deck is built from all tiles except HQ and any `excludeFromDeck` tiles.
- Standard shuffle is deterministic from the 6-character seed using `mulberry32` and Fisher-Yates.
- Draw mode advances through a prebuilt shuffled deck using an index, not by removing random elements after every draw.
- Reset returns to the same starting order for the same code.
- Copy code writes the current deck code to the system clipboard.

### Iron Gang Special Rule

Defined in `src/utils/ironGangDeck.ts`.

Behavior:

- Hook handling happens before shuffle.
- `no-hook` removes Hook from the deck.
- Replacement modes remove the first instance of the designated tile so Hook can remain in the random deck.
- The 7th code character is the sole source of Hook mode.

### Merchants Guild Special Rule

Defined in `src/utils/merchantsGuildRandom.ts`.

Behavior:

- Reconnaissance 1 and Reconnaissance 2 are not present at deck start.
- After the required Squad Leader draw threshold is met, the player can insert the corresponding Reconnaissance tile.
- Insert position is deterministic from deck seed XOR a fixed salt.
- The tile is inserted uniformly into the remaining deck, including the bottom-most position.

### Display Rules

Behavior:

- Show code banner and current progress.
- Show the last drawn tile prominently.
- Show drawn pile and optionally remaining tiles.
- Special banners appear for Iron Gang and Merchants Guild.

## Feature 5: Counter Mode

Counter mode is defined by `src/components/CounterMode.tsx`.

Behavior:

- Two distinct armies are required.
- Each army starts with a full unshuffled deck produced by `buildDeck`.
- Tapping a tile moves one instance between Remaining and Drawn.
- The UI can stack identical tiles, but the underlying counts are per tile instance.
- Category summaries are computed from remaining tiles only.

### Wiremen Special Rule

Defined in `src/utils/wiremenTechBonuses.ts`.

Behavior:

- Technology bonus pools are computed from remaining instant tiles.
- Bonus counters update immediately when a Technology tile moves to Drawn.
- Full-deck totals are fixed and displayed alongside remaining totals.

## Feature 6: Tile Flip

Tile flip mode is defined by `src/components/TileFlipMode.tsx`.

Behavior:

- The result is a simple 50/50 random choice between Vulture and Tails.
- The web version uses `Math.random()` and a timed animation.
- The result is revealed by enlarging the winner and shrinking the loser.

Native parity target:

- Preserve the 50/50 outcome and overall feedback loop.
- Exact animation curves do not need to match, but the interaction should feel deliberate and finish in about the same time window.

## Localization

Localization data currently lives in:

- `src/i18n/ui.ts`
- `src/i18n/display.ts`
- `src/i18n/armyPl.ts`
- `src/i18n/enToPlTileNames.ts`

Behavior:

- Locale defaults to browser language, with English fallback.
- User-selected locale is persisted.
- Polish names use explicit overrides and fallback translation tables.

Native parity target:

- Default to OS locale.
- Persist user-selected locale locally.
- Reuse the same English and Polish string content where possible.

## Browser APIs To Replace Natively

- `window.history` and `popstate` -> native navigation stack
- `localStorage` -> `UserDefaults` / `DataStore`
- `navigator.language` -> OS locale APIs
- `navigator.clipboard` -> native clipboard APIs
- `document.title` -> native screen titles or navigation titles
- `window.matchMedia` -> adaptive layout based on native size classes/window metrics

## Acceptance Criteria

Native parity is acceptable when:

- the same deck code produces the same shuffled order
- Iron Gang mode parsing and deck mutation exactly match the web app
- Merchants Guild deterministic insert positions match the web app
- Wiremen remaining bonus totals match the web app
- army ordering, naming, and category grouping remain stable
- all core flows are available without a web view
