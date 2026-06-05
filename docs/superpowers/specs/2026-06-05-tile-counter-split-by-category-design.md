# Tile Counter — "Split by category" toggle

**Date:** 2026-06-05
**Status:** Approved

## Overview

Add a "Split by category" checkbox to the Tile Counter options panel, directly below the existing "Stack identical tiles" checkbox. When checked (default), tiles are shown in separate sections per category as today. When unchecked, all remaining tiles appear in a single flat grid sorted by category order, with no section headers.

## Feature behaviour

### New state

- `splitByCategory: boolean` — default `true`
- Lives alongside `stackIdentical` in `CounterMode` component state

### Controls panel

The existing options panel gains a second checkbox:

```
☑ Stack identical tiles
☑ Split by category
```

Both checkboxes are independent. All four combinations are valid.

### Remaining tiles — split ON (default, unchanged)

Tiles are grouped under coloured category headers (Instant, Soldier, Implant, Foundation, Module) exactly as today. `CategoryRemainingBlock` renders each section.

### Remaining tiles — split OFF (flat view)

All remaining tiles for an army flow into a single `COUNTER_TILE_GRID` grid. Tiles are sorted by category order (Instant → Soldier → Implant → Foundation → Module), then by tile id within each category. The `stackIdentical` flag still applies — identical tiles are stacked or shown individually as usual. No section headers are shown; tile category is indicated only by the existing border colour on each `TileCard`.

Special blocks (Wiremen tech, Partisan traps) are still shown when applicable, positioned after the flat tile grid.

### Drawn tiles — unaffected

The drawn section is not affected by `splitByCategory`. It always shows a flat grid (existing behaviour).

### Wide layout (two-column desktop / landscape)

Both armies use the same `splitByCategory` value (single shared state). When split is OFF, each army column shows its own flat grid instead of the per-category rows.

## Implementation scope

| File | Change |
|------|--------|
| `src/components/CounterMode.tsx` | Add `splitByCategory` state; add checkbox to options panel; thread prop through `CounterArmyFullPanel` and the wide-layout branch; add flat-render path in `CounterArmyFullPanel` and the wide layout |
| `src/i18n/ui.ts` | Add `counterSplitByCategory` key (EN + PL) |

No new components needed. The flat render path is a new branch inside existing layout logic.

## i18n strings

| Key | English | Polish |
|-----|---------|--------|
| `counterSplitByCategory` | `Split by category` | `Podziel na kategorie` |

## Out of scope

- Persisting toggle state across sessions (no localStorage)
- Affecting the drawn section
- Per-army split setting (both armies share one toggle)
