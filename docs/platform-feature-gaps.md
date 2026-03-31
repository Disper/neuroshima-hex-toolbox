# Platform Feature Gaps

This file tracks user-visible features that are not available everywhere across the current:

- web app
- Android app
- iOS app

Status meanings:

- `Yes`: available
- `No`: not available
- `Partial`: some of the behavior exists, but not full parity

| Feature | Web | Android | iOS | Notes |
|---|---|---|---|---|
| Screen-state history / platform back-stack integration | Yes | Partial | Partial | Web uses `window.history` + `popstate` to move between app states. Native apps rely mostly on explicit in-screen buttons instead of a full navigation stack. |
| Header breadcrumb trail for current location | Yes | No | No | Web header shows navigation context like army/setup/draw/counter. Native headers currently only provide brand and locale controls. |
| Draw-mode progress bar | Yes | No | No | Web shows a visual progress bar plus drawn/remaining progress labels. Native apps only show text counters. |
| Draw-mode remaining-deck reveal/list | Yes | No | No | Web can reveal the remaining deck list. Native apps currently show the last drawn tile and drawn pile only. |
| Counter-mode category summary chips | Yes | No | No | Web shows per-category remaining counts such as instant/soldier/module summaries. Native apps do not. |
| Counter-mode category-grouped remaining sections | Yes | No | No | Web breaks remaining tiles into category sections with headings. Native apps show tile grids without those grouped headings. |
| Side-by-side wide counter layout | Yes | No | No | Web switches to a wide two-column counter layout on desktop / wide landscape. Native apps currently stack the two armies vertically. |
| Detailed Iron Gang validation messages | Yes | Partial | Partial | Web distinguishes wrong length, invalid seed, and invalid suffix. Native apps currently fall back to more generic validation messaging. |
| Full UI localization coverage | Yes | Partial | Partial | Core strings are localized everywhere, but native apps still contain hardcoded English section titles and some home/about text. |
| Footer author/version block | Yes | No | No | Web footer shows author + version. Native apps do not have an equivalent footer. |
| Home donation CTA | Yes | No | No | Web home screen includes the donation / support CTA. Native apps do not currently expose it. |
| Native home about/version card | No | Yes | Yes | Android and iOS show a native about/version block on the home screen; the web app does not have this as a card. |

## Maintenance Rule

Whenever parity changes, update this file instead of trying to infer gaps from commit history or chat context.
