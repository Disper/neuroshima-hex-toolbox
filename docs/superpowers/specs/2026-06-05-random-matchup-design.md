# Random Matchup Feature Design

**Date:** 2026-06-05
**Status:** Approved

## Overview

Add a new "Random Matchup" tab to the home screen feature selector. The tab shows a single "Randomize!" button that picks two different armies at random from all available armies. After picking, the app navigates to a dedicated result screen showing both armies side-by-side with a Re-roll button and a Back button.

## New tab

- Label: `🎯 Random Matchup` (key: `homeFeatureRandomMatchup`)
- New `FeatureMode` value: `'random-matchup'`
- Positioned last in `HOME_FEATURE_MODES` (after `'randomizer'`)
- Tab content: a short blurb and a prominent "Randomize!" button
- No army list, no search input shown when this tab is active

## Randomize action

- Picks 2 distinct armies at random from the full `armies` array using `Math.random()`
- Both army IDs are stored in app state (`randomMatchupArmies: [Army | null, Army | null]`)
- On click, navigates to a new `'random-matchup-result'` screen

## Result screen (`RandomMatchupResultScreen`)

A new component in `src/components/RandomMatchupResultScreen.tsx`.

### Layout

- Amber top strip on the card (`h-2 bg-amber-500`)
- Title: "Your Matchup" (`randomMatchupResultTitle`)
- Subtitle: "Two armies drawn at random" (`randomMatchupResultSubtitle`)
- Two army cards side by side in a `grid grid-cols-2` layout:
  - "Player 1" / "Player 2" label above each
  - Thin accent color strip (army `accentColor`)
  - HQ image (or fallback placeholder)
  - Army name in accent color
- Two action buttons below:
  - **Re-roll** (amber, primary): picks two new different armies, stays on result screen
  - **Back** (secondary, stone border): returns to home screen on the `random-matchup` tab

### Re-roll

Re-roll picks two new distinct armies (different from each other; not required to differ from the previous roll). Updates `randomMatchupArmies` state in place — no navigation, no history push.

## State and navigation

### New `Screen` value
`'random-matchup-result'` added to the `Screen` union.

### New `FeatureMode` value
`'random-matchup'` added to the `FeatureMode` union.

### `AppHistoryStateV1` changes
Two new fields added to the history snapshot:
```ts
randomMatchupAId: string | null;
randomMatchupBId: string | null;
```
The history state version stays at `v: 1` (additive fields with null fallback are backwards-compatible — `parseAppHistoryState` already returns `null` if the version doesn't match, and these fields default to `null` if absent).

### Navigation
- Home tab → Randomize button → `'random-matchup-result'` screen (history push)
- Re-roll → updates `randomMatchupArmies` in place (no navigation, no history push)
- Back button → `goHome()` which resets to `'home'` screen on `'random-matchup'` tab

### `applyHistorySnapshot`
- Validates `random-matchup-result` screen: requires both army IDs; falls back to `'home'` if either is missing
- Restores `randomMatchupArmies` from snapshot

### `goHome` / tab change
- Switching away from `'random-matchup'` tab resets `randomMatchupArmies` to `[null, null]`
- `goHome()` resets `randomMatchupArmies` to `[null, null]`

## i18n strings

| Key | English | Polish |
|-----|---------|--------|
| `homeFeatureRandomMatchup` | `🎯 Random Matchup` | `🎯 Losowe starcie` |
| `homeBlurbRandomMatchup` | `Pick two armies at random from all available.` | `Wylosuj dwie armie spośród wszystkich dostępnych.` |
| `homeRandomMatchupButton` | `Randomize!` | `Losuj!` |
| `homeRandomMatchupPool` | `{n} armies in pool` | `Pula: {n} armii` |
| `randomMatchupResultTitle` | `Your Matchup` | `Twoje starcie` |
| `randomMatchupResultSubtitle` | `Two armies drawn at random` | `Dwie armie wylosowane losowo` |
| `randomMatchupReroll` | `🔄 Re-roll` | `🔄 Losuj ponownie` |
| `randomMatchupBack` | `← Back` | `← Wróć` |
| `randomMatchupPlayer1` | `Player 1` | `Gracz 1` |
| `randomMatchupPlayer2` | `Player 2` | `Gracz 2` |

## Files changed

| File | Change |
|------|--------|
| `src/App.tsx` | Add `'random-matchup'` to `FeatureMode`, `'random-matchup-result'` to `Screen`, new state + history fields, tab rendering, result screen render, navigation handlers |
| `src/components/RandomMatchupResultScreen.tsx` | New component |
| `src/i18n/ui.ts` | Add 10 new keys to EN and PL locales |

## Out of scope

- Filtering armies (always picks from all 26)
- Persisting last result across sessions
- Animation on randomize/re-roll
