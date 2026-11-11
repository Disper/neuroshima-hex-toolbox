## Context

`src/components/DeckSetup.tsx` renders a two-button mode toggle (`'new' | 'join'`). The join panel, with the `#code-input` element and `inputRef`, is rendered conditionally (`mode === 'join' && …`), so the input does not exist yet in the click handler that switches to join. `inputRef.current?.focus()` is already used after validation errors. The input currently uses `border-stone-600 … focus:outline-none focus:border-stone-400`.

`vite.config.ts` has no `server` block, so `npm run dev` / `make run` use Vite's fixed default port 5173.

## Goals / Non-Goals

**Goals:** auto-focus the code input when "Enter a Code" is selected; amber border while focused; dev server honours `DISP_PORT`.

**Non-Goals:** restyling the character boxes or the toggle; changing validation; adding a test framework (the project has none).

## Decisions

1. **Focus via a "focus request" flag plus `useEffect`, not `autoFocus`.**
   The input mounts only after the state update, so calling `focus()` in the click handler would find `inputRef.current === null`. Use a `useEffect` keyed on a counter (e.g. `focusRequest`) that the join button increments. The effect then runs after the input is mounted, and selecting "Enter a Code" again while already in join mode still refocuses (a plain `autoFocus` or a `[mode]` dependency would not).
   - Alternative `autoFocus` attribute: only works on mount, so re-selecting doesn't refocus. Rejected.
   - Alternative `flushSync` in handler: works but heavier and less idiomatic. Rejected.
   - The effect must not focus on initial render (mode starts as `'new'`, counter starts at 0, so guard with `focusRequest > 0`).

2. **Border colour: Tailwind `focus:border-amber-400`** in place of `focus:border-stone-400`. Amber is already the app's highlight yellow (Iron Gang 7th-char ring uses `amber-500`). `amber-400` reads as yellow on the `stone-800` background. Optionally add `focus:ring-1 focus:ring-amber-400/40` for a stronger cue. Keep `transition-colors`. Uses the `:focus` pseudo-class, so it covers keyboard, mouse and programmatic focus. `focus-visible` would hide it after a mouse-driven programmatic focus in some browsers, so it is not used.

3. **Port: read `process.env.DISP_PORT` in `vite.config.ts`.**
   ```ts
   const port = process.env.DISP_PORT ? Number(process.env.DISP_PORT) : undefined
   server: { port, strictPort: port !== undefined },
   preview: { port, strictPort: port !== undefined },
   ```
   `undefined` keeps Vite's default. `strictPort` when explicitly set makes a port clash fail loudly instead of silently moving to another port.

## Risks / Trade-offs

- iOS Safari only opens the keyboard on `focus()` when it happens inside a user gesture. The effect runs synchronously after the click-triggered commit, which normally still counts as the gesture. If it doesn't on some device, the input is still focused and styled. That is acceptable, so no workaround is planned.
- `scrollIntoView` side-effect of focus on small screens: the input is just below the toggle, so the scroll is small. Acceptable.
