## 1. Auto-focus the code input

- [x] 1.1 In `src/components/DeckSetup.tsx`, add `useEffect` to the React import and a `focusRequest` state counter (initial `0`)
- [x] 1.2 In the mode-toggle `onClick`, when `m === 'join'`, increment `focusRequest` (alongside `setMode` / `setError`)
- [x] 1.3 Add `useEffect(() => { if (focusRequest > 0) inputRef.current?.focus(); }, [focusRequest])`

## 2. Yellow focus border

- [x] 2.1 On `#code-input`, replace `focus:border-stone-400` with `focus:border-amber-400` (keep `border-stone-600`, `focus:outline-none`, `transition-colors`)

## 3. DISP_PORT for the dev server

- [x] 3.1 In `vite.config.ts`, read `DISP_PORT` and set `server.port` / `preview.port` (with `strictPort` when set), leaving defaults when unset

## 4. Verify

- [x] 4.1 `npm ci && npm run build` passes
- [x] 4.2 `DISP_PORT=36524 npm run dev` listens on 36524. In the browser, Randomizer → pick an army → "Enter a Code": the input is focused and has an amber border, typing goes straight in, clicking elsewhere turns the border grey, and re-selecting "Enter a Code" refocuses it. Selecting "New Deck" does not focus anything. Check a standard army and Iron Gang.
