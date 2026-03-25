---
name: neuroshima-hex-ui-style
description: >-
  Applies the Neuroshima Hex Randomizer UI conventions — dark stone palette, army accent colors,
  tile category chrome, card shells, and typography. Use when building or restyling React/Tailwind
  components in this repo, adding new screens, or matching existing ArmyView / TileCard / CounterMode
  patterns.
---

# Neuroshima Hex Randomizer — UI design style

Stack: **React**, **Tailwind CSS v4** (`@import "tailwindcss"` in `src/index.css`), no separate design-system package.

## Global base

- **Page**: `min-h-screen bg-stone-950 text-stone-100`; body already sets this in `index.css`.
- **Font**: `system-ui, Segoe UI, Roboto` (from base layer); `-webkit-font-smoothing: antialiased`.
- **Content width**: `max-w-4xl mx-auto px-4` for main columns (header, home, army views).
- **Nav**: `sticky top-0 z-20 border-b border-stone-800 bg-stone-950/90 backdrop-blur-sm`; breadcrumb text `text-stone-500`, hover `text-stone-300`.

## Army accent color

Each army has `accentColor` (hex). Use for:

- Page titles (`h1` / `h2`) on army screens: `style={{ color: army.accentColor }}`
- Primary CTAs: `style={{ background: army.accentColor, color: '#fff' }}` with `rounded-xl`, `font-bold`, `hover:brightness-110`, `active:scale-95`, `focus:ring-2 focus:ring-white/30`
- Breadcrumb current segment
- Thin top strip on cards: `className="h-1.5"` or `h-2` with `style={{ background: army.accentColor }}`

Do **not** invent a second accent per screen; reuse `army.accentColor`.

## Card shells (panels)

Default “elevated panel” used on home army cards, ArmyView header, Counter summary:

```txt
rounded-2xl border border-stone-700 overflow-hidden
background: linear-gradient(135deg, #1c1917 0%, #292524 100%)
```

Inner padding: `p-5`–`p-8` depending on density.

## HQ ability callout

Amber-tinted sub-panel (not army accent):

- `rounded-lg border border-amber-500/30 bg-amber-950/30 px-4 py-3`
- Label: `text-amber-400 text-xs font-semibold uppercase tracking-wider` — e.g. `HQ Special Ability`
- Body: `text-stone-300 text-sm`

## Tile categories (instant / soldier / implant / foundation / module / hq)

Border + badge colors are centralized in `TileCard.tsx` (`categoryConfig`). When building lists, chips, or legends, **reuse the same Tailwind tokens**:

| Category   | Border              | Badge / chip text              |
|-----------|---------------------|--------------------------------|
| HQ        | `border-amber-500/50` | `bg-amber-500 text-amber-950` |
| Instant   | `border-red-500/40`   | `bg-red-500 text-red-950`     |
| Soldier   | `border-blue-500/40`  | `bg-blue-500 text-blue-950`   |
| Implant   | `border-violet-500/40`| `bg-violet-500 text-violet-950` |
| Foundation| `border-slate-500/40` | `bg-slate-500 text-slate-950` |
| Module    | `border-emerald-500/40` | `bg-emerald-500 text-emerald-950` |

Chip pattern (e.g. CounterMode): `px-2.5 py-1 rounded border text-sm font-medium` + category row style above.

Fallback image area uses matching `bg-*-950/50` or `bg-*-950/60` from the same config.

## TileCard buttons

- Full card is a `button` with `rounded-xl border`, category border color, `bg-stone-900`, optional hover when clickable.
- Label bar: `border-t border-stone-700/60 bg-stone-950/60`, title `text-stone-100`, count badge uses category `badge` colors.

## Typography

- **Titles**: `font-bold tracking-tight`; army name can be `text-3xl sm:text-4xl`.
- **Secondary / help**: `text-stone-400` or `text-stone-500 text-sm`; keep `leading-relaxed` on paragraphs.
- **Section headings**: `text-lg font-semibold text-stone-200` or `text-base font-semibold text-stone-400` for subsections.

## Interactive feedback

- Transitions: `transition-all duration-200` or `transition-colors` on hovers.
- Focus: `focus:outline-none focus:ring-2 focus:ring-white/20` or `focus:ring-white/30` on primary actions.
- Cards on home: `hover:border-stone-500 hover:scale-[1.02] active:scale-95`.

## Wiremen-specific callout (example of “accent panel”)

For special informational blocks tied to an army feature (not global):

- `rounded-xl border border-teal-500/25 bg-teal-950/20 px-4 py-3`
- Title: `text-teal-300/90 text-xs font-semibold uppercase tracking-wider`
- Supporting text: `text-stone-500 text-xs`

Use a **single** such accent per feature area; don’t mix teal with category reds/blues in the same row without hierarchy.

## What to avoid

- Light theme backgrounds for main content.
- Rainbow or unrelated accent colors not tied to `army.accentColor` or the fixed category palette.
- Replacing stone grays with pure black/white for large surfaces.
- Dropping the gradient panel pattern for major content blocks without a good reason.

## File references

- Global base: `src/index.css`
- Category chrome: `src/components/TileCard.tsx` (`categoryConfig`)
- Panel + HQ pattern: `src/components/ArmyView.tsx`
- Home + nav: `src/App.tsx`
- Category chips: `src/components/CounterMode.tsx`
