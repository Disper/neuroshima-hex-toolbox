# Random Matchup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "🎯 Random Matchup" tab that picks two distinct armies at random and shows them on a dedicated result screen with a Re-roll button.

**Architecture:** Three changes in sequence — (1) i18n strings, (2) new `RandomMatchupResultScreen` component, (3) `App.tsx` wiring (types, state, history, tab, render). The component has no dependencies on App internals; it receives armies and two callbacks (`onReroll`, `onBack`). App owns all state and navigation.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4

---

## File map

| File | What changes |
|------|-------------|
| `src/i18n/ui.ts` | Add 10 new keys to EN and PL locales |
| `src/components/RandomMatchupResultScreen.tsx` | New component — result screen with Re-roll and Back |
| `src/App.tsx` | Add `'random-matchup'` FeatureMode, `'random-matchup-result'` Screen, state, history, tab rendering, result screen render |

---

### Task 1: Add i18n strings

**Files:**
- Modify: `src/i18n/ui.ts`

- [ ] **Step 1: Add EN strings**

In `src/i18n/ui.ts`, find:
```ts
    selectionRevealButton: 'Reveal selection',
    selectionHideButton: 'Hide selection',
  },
```
Replace with:
```ts
    selectionRevealButton: 'Reveal selection',
    selectionHideButton: 'Hide selection',
    homeFeatureRandomMatchup: '🎯 Random Matchup',
    homeBlurbRandomMatchup: 'Pick two armies at random from all available.',
    homeRandomMatchupButton: 'Randomize!',
    homeRandomMatchupPool: '{n} armies in pool',
    randomMatchupResultTitle: 'Your Matchup',
    randomMatchupResultSubtitle: 'Two armies drawn at random',
    randomMatchupReroll: '🔄 Re-roll',
    randomMatchupBack: '← Back',
    randomMatchupPlayer1: 'Player 1',
    randomMatchupPlayer2: 'Player 2',
  },
```

- [ ] **Step 2: Add PL strings**

Find:
```ts
    selectionRevealButton: 'Ujawnij wybór',
    selectionHideButton: 'Ukryj wybór',
  },
```
Replace with:
```ts
    selectionRevealButton: 'Ujawnij wybór',
    selectionHideButton: 'Ukryj wybór',
    homeFeatureRandomMatchup: '🎯 Losowe starcie',
    homeBlurbRandomMatchup: 'Wylosuj dwie armie spośród wszystkich dostępnych.',
    homeRandomMatchupButton: 'Losuj!',
    homeRandomMatchupPool: 'Pula: {n} armii',
    randomMatchupResultTitle: 'Twoje starcie',
    randomMatchupResultSubtitle: 'Dwie armie wylosowane losowo',
    randomMatchupReroll: '🔄 Losuj ponownie',
    randomMatchupBack: '← Wróć',
    randomMatchupPlayer1: 'Gracz 1',
    randomMatchupPlayer2: 'Gracz 2',
  },
```

- [ ] **Step 3: Verify TypeScript build**

```bash
cd /Users/I316752/Private/Dev/neuroshima-hex-toolbox && npm run build 2>&1 | grep -i "^.*error" | head -10
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/i18n/ui.ts
git commit -m "Add i18n strings for Random Matchup feature"
```

---

### Task 2: Create RandomMatchupResultScreen component

**Files:**
- Create: `src/components/RandomMatchupResultScreen.tsx`

- [ ] **Step 1: Create the component**

Create `src/components/RandomMatchupResultScreen.tsx` with this content:

```tsx
import { useLocale } from '../i18n/locale';
import { getArmyDisplayName } from '../i18n/display';
import type { Army } from '../data/types';

export function RandomMatchupResultScreen({
  armies,
  onReroll,
  onBack,
}: {
  armies: [Army, Army];
  onReroll: () => void;
  onBack: () => void;
}) {
  const { t, locale } = useLocale();
  const [army0, army1] = armies;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div
        className="rounded-2xl border border-stone-700 overflow-hidden text-center"
        style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}
      >
        <div className="h-2 bg-amber-500" />
        <div className="p-8 sm:p-10 space-y-5">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-100">
            {t('randomMatchupResultTitle')}
          </h1>
          <p className="text-stone-400 max-w-2xl mx-auto leading-relaxed">
            {t('randomMatchupResultSubtitle')}
          </p>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto">
            {([army0, army1] as [Army, Army]).map((army, index) => (
              <div
                key={army.id}
                className="rounded-xl border border-stone-700 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}
              >
                <div className="h-1.5" style={{ background: army.accentColor }} />
                <div className="p-4 flex flex-col items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    {index === 0 ? t('randomMatchupPlayer1') : t('randomMatchupPlayer2')}
                  </span>
                  {army.hqImageUrl ? (
                    <img
                      src={army.hqImageUrl}
                      alt={`${getArmyDisplayName(army, locale)} HQ`}
                      className="h-20 w-20 object-contain"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-amber-950/40 text-4xl">
                      🏛
                    </div>
                  )}
                  <span
                    className="text-sm font-bold leading-tight text-center"
                    style={{ color: army.accentColor }}
                  >
                    {getArmyDisplayName(army, locale)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={onReroll}
              className="rounded-xl bg-amber-600 px-6 py-3 font-bold text-white transition-all duration-200 hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              {t('randomMatchupReroll')}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-stone-600 bg-stone-900 px-6 py-3 font-semibold text-stone-300 transition-all duration-200 hover:border-stone-500 hover:text-stone-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              {t('randomMatchupBack')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript build**

```bash
cd /Users/I316752/Private/Dev/neuroshima-hex-toolbox && npm run build 2>&1 | grep -i "^.*error" | head -10
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/RandomMatchupResultScreen.tsx
git commit -m "Add RandomMatchupResultScreen component"
```

---

### Task 3: Wire Random Matchup into App.tsx — types and state

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add import for RandomMatchupResultScreen**

Find:
```ts
import { TileFlipMode } from './components/TileFlipMode';
```
Replace with:
```ts
import { TileFlipMode } from './components/TileFlipMode';
import { RandomMatchupResultScreen } from './components/RandomMatchupResultScreen';
```

- [ ] **Step 2: Add `'random-matchup-result'` to the Screen union**

Find:
```ts
type Screen = 'home' | 'army' | 'setup' | 'draw' | 'counter' | 'selection-ready';
```
Replace with:
```ts
type Screen = 'home' | 'army' | 'setup' | 'draw' | 'counter' | 'selection-ready' | 'random-matchup-result';
```

- [ ] **Step 3: Add `'random-matchup'` to the FeatureMode union and constants**

Find:
```ts
type FeatureMode = 'counter' | 'tileflip' | 'selection' | 'randomizer';

/** Home tab order: counter default, randomizer last. */
const HOME_FEATURE_MODES: readonly FeatureMode[] = [
  'counter',
  'tileflip',
  'selection',
  'randomizer',
];

const HOME_FEATURE_MODE_LABELS: Record<FeatureMode, UiMessageKey> = {
  counter: 'homeFeatureCounter',
  tileflip: 'homeFeatureTileflip',
  selection: 'homeFeatureSelection',
  randomizer: 'homeFeatureRandomizer',
};
```
Replace with:
```ts
type FeatureMode = 'counter' | 'tileflip' | 'selection' | 'randomizer' | 'random-matchup';

/** Home tab order: counter default, randomizer last. */
const HOME_FEATURE_MODES: readonly FeatureMode[] = [
  'counter',
  'tileflip',
  'selection',
  'randomizer',
  'random-matchup',
];

const HOME_FEATURE_MODE_LABELS: Record<FeatureMode, UiMessageKey> = {
  counter: 'homeFeatureCounter',
  tileflip: 'homeFeatureTileflip',
  selection: 'homeFeatureSelection',
  randomizer: 'homeFeatureRandomizer',
  'random-matchup': 'homeFeatureRandomMatchup',
};
```

- [ ] **Step 4: Add `randomMatchupAId`/`randomMatchupBId` to `AppHistoryStateV1`**

Find:
```ts
type AppHistoryStateV1 = {
  v: 1;
  screen: Screen;
  featureMode: FeatureMode;
  selectedArmyId: string | null;
  deckCode: string;
  counterAId: string | null;
  counterBId: string | null;
  selectionAId: string | null;
  selectionBId: string | null;
};
```
Replace with:
```ts
type AppHistoryStateV1 = {
  v: 1;
  screen: Screen;
  featureMode: FeatureMode;
  selectedArmyId: string | null;
  deckCode: string;
  counterAId: string | null;
  counterBId: string | null;
  selectionAId: string | null;
  selectionBId: string | null;
  randomMatchupAId: string | null;
  randomMatchupBId: string | null;
};
```

- [ ] **Step 5: Update `parseAppHistoryState` to accept new Screen and FeatureMode values and parse new fields**

Find:
```ts
  if (
    screen !== 'home' &&
    screen !== 'army' &&
    screen !== 'setup' &&
    screen !== 'draw' &&
    screen !== 'counter' &&
    screen !== 'selection-ready'
  ) {
    return null;
  }
  if (
    featureMode !== 'randomizer' &&
    featureMode !== 'counter' &&
    featureMode !== 'tileflip' &&
    featureMode !== 'selection'
  ) {
    return null;
  }
  return {
    v: 1,
    screen,
    featureMode,
    selectedArmyId: typeof o.selectedArmyId === 'string' ? o.selectedArmyId : null,
    deckCode: typeof o.deckCode === 'string' ? o.deckCode : '',
    counterAId: typeof o.counterAId === 'string' ? o.counterAId : null,
    counterBId: typeof o.counterBId === 'string' ? o.counterBId : null,
    selectionAId: typeof o.selectionAId === 'string' ? o.selectionAId : null,
    selectionBId: typeof o.selectionBId === 'string' ? o.selectionBId : null,
  };
```
Replace with:
```ts
  if (
    screen !== 'home' &&
    screen !== 'army' &&
    screen !== 'setup' &&
    screen !== 'draw' &&
    screen !== 'counter' &&
    screen !== 'selection-ready' &&
    screen !== 'random-matchup-result'
  ) {
    return null;
  }
  if (
    featureMode !== 'randomizer' &&
    featureMode !== 'counter' &&
    featureMode !== 'tileflip' &&
    featureMode !== 'selection' &&
    featureMode !== 'random-matchup'
  ) {
    return null;
  }
  return {
    v: 1,
    screen,
    featureMode,
    selectedArmyId: typeof o.selectedArmyId === 'string' ? o.selectedArmyId : null,
    deckCode: typeof o.deckCode === 'string' ? o.deckCode : '',
    counterAId: typeof o.counterAId === 'string' ? o.counterAId : null,
    counterBId: typeof o.counterBId === 'string' ? o.counterBId : null,
    selectionAId: typeof o.selectionAId === 'string' ? o.selectionAId : null,
    selectionBId: typeof o.selectionBId === 'string' ? o.selectionBId : null,
    randomMatchupAId: typeof o.randomMatchupAId === 'string' ? o.randomMatchupAId : null,
    randomMatchupBId: typeof o.randomMatchupBId === 'string' ? o.randomMatchupBId : null,
  };
```

- [ ] **Step 6: Add `randomMatchupArmies` state to the App component**

Find:
```ts
  const [selectionArmies, setSelectionArmies] = useState<[Army | null, Army | null]>([null, null]);
```
Replace with:
```ts
  const [selectionArmies, setSelectionArmies] = useState<[Army | null, Army | null]>([null, null]);
  const [randomMatchupArmies, setRandomMatchupArmies] = useState<[Army | null, Army | null]>([null, null]);
```

- [ ] **Step 7: Verify TypeScript build**

```bash
cd /Users/I316752/Private/Dev/neuroshima-hex-toolbox && npm run build 2>&1 | grep -i "^.*error" | head -10
```
Expected: errors about missing snapshot fields and unhandled state — that's fine, they'll be fixed in the next steps.

- [ ] **Step 8: Commit**

```bash
git add src/App.tsx
git commit -m "Add Random Matchup types, state, and history shape to App.tsx"
```

---

### Task 4: Wire Random Matchup into App.tsx — navigation and history

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add `pickTwoArmies` helper after `findArmy`**

Find:
```ts
function findArmy(id: string | null): Army | null {
  if (!id) return null;
  return armies.find((a) => a.id === id) ?? null;
}
```
Replace with:
```ts
function findArmy(id: string | null): Army | null {
  if (!id) return null;
  return armies.find((a) => a.id === id) ?? null;
}

function pickTwoArmies(): [Army, Army] {
  const pool = [...armies];
  const idxA = Math.floor(Math.random() * pool.length);
  const a = pool[idxA];
  pool.splice(idxA, 1);
  const idxB = Math.floor(Math.random() * pool.length);
  return [a, pool[idxB]];
}
```

- [ ] **Step 2: Update `goHome` to reset `randomMatchupArmies`**

Find:
```ts
  const goHome = useCallback(() => {
    setScreen('home');
    setSelectedArmy(null);
    setDeckCode('');
    setCounterArmies([null, null]);
    setSelectionArmies([null, null]);
  }, []);
```
Replace with:
```ts
  const goHome = useCallback(() => {
    setScreen('home');
    setSelectedArmy(null);
    setDeckCode('');
    setCounterArmies([null, null]);
    setSelectionArmies([null, null]);
    setRandomMatchupArmies([null, null]);
  }, []);
```

- [ ] **Step 3: Update `applyHistorySnapshot` to handle `random-matchup-result` and restore `randomMatchupArmies`**

Find:
```ts
    if (nextScreen === 'counter' && (!ca || !cb)) nextScreen = 'home';
    if (nextScreen === 'selection-ready' && (!sa || !sb)) nextScreen = 'home';

    setFeatureMode(s.featureMode);
    setDeckCode(s.deckCode);
    setScreen(nextScreen);
    setSelectedArmy(sel);
    if (nextScreen === 'home' && s.featureMode !== 'counter') {
      setCounterArmies([null, null]);
    } else if (nextScreen === 'counter' || s.featureMode === 'counter') {
      setCounterArmies([ca, cb]);
    } else {
      setCounterArmies([null, null]);
    }
    if (nextScreen === 'home' && s.featureMode !== 'selection') {
      setSelectionArmies([null, null]);
    } else if (nextScreen === 'selection-ready' || s.featureMode === 'selection') {
      setSelectionArmies([sa, sb]);
    } else {
      setSelectionArmies([null, null]);
    }
  }, []);
```
Replace with:
```ts
    if (nextScreen === 'counter' && (!ca || !cb)) nextScreen = 'home';
    if (nextScreen === 'selection-ready' && (!sa || !sb)) nextScreen = 'home';
    const rma = findArmy(s.randomMatchupAId);
    const rmb = findArmy(s.randomMatchupBId);
    if (nextScreen === 'random-matchup-result' && (!rma || !rmb)) nextScreen = 'home';

    setFeatureMode(s.featureMode);
    setDeckCode(s.deckCode);
    setScreen(nextScreen);
    setSelectedArmy(sel);
    if (nextScreen === 'home' && s.featureMode !== 'counter') {
      setCounterArmies([null, null]);
    } else if (nextScreen === 'counter' || s.featureMode === 'counter') {
      setCounterArmies([ca, cb]);
    } else {
      setCounterArmies([null, null]);
    }
    if (nextScreen === 'home' && s.featureMode !== 'selection') {
      setSelectionArmies([null, null]);
    } else if (nextScreen === 'selection-ready' || s.featureMode === 'selection') {
      setSelectionArmies([sa, sb]);
    } else {
      setSelectionArmies([null, null]);
    }
    if (nextScreen === 'random-matchup-result' || s.featureMode === 'random-matchup') {
      setRandomMatchupArmies([rma, rmb]);
    } else {
      setRandomMatchupArmies([null, null]);
    }
  }, []);
```

- [ ] **Step 4: Add `randomMatchupAId`/`randomMatchupBId` derived values and include them in the history snapshot**

Find:
```ts
  const selectedArmyId = selectedArmy?.id ?? null;
  const counterAId = counterArmies[0]?.id ?? null;
  const counterBId = counterArmies[1]?.id ?? null;
  const selectionAId = selectionArmies[0]?.id ?? null;
  const selectionBId = selectionArmies[1]?.id ?? null;

  useEffect(() => {
    if (applyingPopStateRef.current) {
      applyingPopStateRef.current = false;
      return;
    }
    const snapshot: AppHistoryStateV1 = {
      v: 1,
      screen,
      featureMode,
      selectedArmyId,
      deckCode,
      counterAId,
      counterBId,
      selectionAId,
      selectionBId,
    };
    const next = JSON.stringify(snapshot);
    const cur = window.history.state;
    const curJson = cur === null || cur === undefined ? null : JSON.stringify(cur);
    if (curJson === next) return;
    if (cur === null || cur === undefined) {
      window.history.replaceState(snapshot, '');
      return;
    }
    window.history.pushState(snapshot, '');
  }, [screen, featureMode, selectedArmyId, deckCode, counterAId, counterBId, selectionAId, selectionBId]);
```
Replace with:
```ts
  const selectedArmyId = selectedArmy?.id ?? null;
  const counterAId = counterArmies[0]?.id ?? null;
  const counterBId = counterArmies[1]?.id ?? null;
  const selectionAId = selectionArmies[0]?.id ?? null;
  const selectionBId = selectionArmies[1]?.id ?? null;
  const randomMatchupAId = randomMatchupArmies[0]?.id ?? null;
  const randomMatchupBId = randomMatchupArmies[1]?.id ?? null;

  useEffect(() => {
    if (applyingPopStateRef.current) {
      applyingPopStateRef.current = false;
      return;
    }
    const snapshot: AppHistoryStateV1 = {
      v: 1,
      screen,
      featureMode,
      selectedArmyId,
      deckCode,
      counterAId,
      counterBId,
      selectionAId,
      selectionBId,
      randomMatchupAId,
      randomMatchupBId,
    };
    const next = JSON.stringify(snapshot);
    const cur = window.history.state;
    const curJson = cur === null || cur === undefined ? null : JSON.stringify(cur);
    if (curJson === next) return;
    if (cur === null || cur === undefined) {
      window.history.replaceState(snapshot, '');
      return;
    }
    window.history.pushState(snapshot, '');
  }, [screen, featureMode, selectedArmyId, deckCode, counterAId, counterBId, selectionAId, selectionBId, randomMatchupAId, randomMatchupBId]);
```

- [ ] **Step 5: Verify TypeScript build**

```bash
cd /Users/I316752/Private/Dev/neuroshima-hex-toolbox && npm run build 2>&1 | grep -i "^.*error" | head -10
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx
git commit -m "Wire Random Matchup navigation and history into App.tsx"
```

---

### Task 5: Wire Random Matchup into App.tsx — HomeScreen and result render

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Add `onRandomize` prop to `HomeScreen` call site and pass it through**

Find the `HomeScreen` render in `App`'s JSX:
```tsx
        {screen === 'home' && (
          <HomeScreen
            armies={armies}
            featureMode={featureMode}
            counterArmies={counterArmies}
            selectionArmies={selectionArmies}
            onFeatureModeChange={(m) => {
              setFeatureMode(m);
              if (m !== 'counter') setCounterArmies([null, null]);
              if (m !== 'selection') setSelectionArmies([null, null]);
            }}
            onSelectArmy={selectArmy}
            onSelectionReady={() => setScreen('selection-ready')}
          />
        )}
```
Replace with:
```tsx
        {screen === 'home' && (
          <HomeScreen
            armies={armies}
            featureMode={featureMode}
            counterArmies={counterArmies}
            selectionArmies={selectionArmies}
            onFeatureModeChange={(m) => {
              setFeatureMode(m);
              if (m !== 'counter') setCounterArmies([null, null]);
              if (m !== 'selection') setSelectionArmies([null, null]);
              if (m !== 'random-matchup') setRandomMatchupArmies([null, null]);
            }}
            onSelectArmy={selectArmy}
            onSelectionReady={() => setScreen('selection-ready')}
            onRandomize={() => {
              const [a, b] = pickTwoArmies();
              setRandomMatchupArmies([a, b]);
              setScreen('random-matchup-result');
            }}
          />
        )}
```

- [ ] **Step 2: Add result screen render after `selection-ready`**

Find:
```tsx
        {screen === 'selection-ready' && selectionArmies[0] && selectionArmies[1] && (
          <ArmySelectionReadyView armies={[selectionArmies[0], selectionArmies[1]]} />
        )}
```
Replace with:
```tsx
        {screen === 'selection-ready' && selectionArmies[0] && selectionArmies[1] && (
          <ArmySelectionReadyView armies={[selectionArmies[0], selectionArmies[1]]} />
        )}
        {screen === 'random-matchup-result' && randomMatchupArmies[0] && randomMatchupArmies[1] && (
          <RandomMatchupResultScreen
            armies={[randomMatchupArmies[0], randomMatchupArmies[1]]}
            onReroll={() => {
              const [a, b] = pickTwoArmies();
              setRandomMatchupArmies([a, b]);
            }}
            onBack={() => {
              setScreen('home');
              setRandomMatchupArmies([null, null]);
            }}
          />
        )}
```

- [ ] **Step 3: Update `HomeScreen` function signature to add `onRandomize` prop**

Find:
```ts
function HomeScreen({
  armies,
  featureMode,
  counterArmies,
  selectionArmies,
  onFeatureModeChange,
  onSelectArmy,
  onSelectionReady,
}: {
  armies: Army[];
  featureMode: FeatureMode;
  counterArmies: [Army | null, Army | null];
  selectionArmies: [Army | null, Army | null];
  onFeatureModeChange: (m: FeatureMode) => void;
  onSelectArmy: (a: Army) => void;
  onSelectionReady: () => void;
}) {
```
Replace with:
```ts
function HomeScreen({
  armies,
  featureMode,
  counterArmies,
  selectionArmies,
  onFeatureModeChange,
  onSelectArmy,
  onSelectionReady,
  onRandomize,
}: {
  armies: Army[];
  featureMode: FeatureMode;
  counterArmies: [Army | null, Army | null];
  selectionArmies: [Army | null, Army | null];
  onFeatureModeChange: (m: FeatureMode) => void;
  onSelectArmy: (a: Army) => void;
  onSelectionReady: () => void;
  onRandomize: () => void;
}) {
```

- [ ] **Step 4: Add Random Matchup tab content in `HomeScreen`'s render**

The `HomeScreen` JSX has a large conditional block. The blurb section currently is:
```tsx
      {featureMode === 'tileflip' ? (
        <TileFlipMode />
      ) : (
        <>
          <div className="space-y-2">
            <p className="text-stone-500 text-sm text-center">
              {featureMode === 'randomizer'
                ? t('homeBlurbRandomizer')
                : featureMode === 'counter'
                  ? t('homeBlurbCounter')
                  : featureMode === 'selection'
                    ? t('homeBlurbSelection')
                  : ''}
            </p>
```
Replace with:
```tsx
      {featureMode === 'tileflip' ? (
        <TileFlipMode />
      ) : featureMode === 'random-matchup' ? (
        <div className="flex flex-col items-center gap-6 py-6">
          <p className="text-stone-500 text-sm text-center">{t('homeBlurbRandomMatchup')}</p>
          <button
            type="button"
            onClick={onRandomize}
            className="rounded-xl bg-amber-600 px-8 py-4 text-lg font-extrabold text-white transition-all duration-200 hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            {t('homeRandomMatchupButton')}
          </button>
          <p className="text-stone-600 text-xs">{t('homeRandomMatchupPool', { n: armies.length })}</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <p className="text-stone-500 text-sm text-center">
              {featureMode === 'randomizer'
                ? t('homeBlurbRandomizer')
                : featureMode === 'counter'
                  ? t('homeBlurbCounter')
                  : featureMode === 'selection'
                    ? t('homeBlurbSelection')
                  : ''}
            </p>
```

- [ ] **Step 5: Close the new ternary — find the closing of the old else block**

Find (at the very end of the non-tileflip branch, after the army grid):
```tsx
        </>
      )}
    </div>
  );
}
```
Replace with:
```tsx
        </>
      )}
    </div>
  );
}
```
_(No change needed here — the extra `</>` and `)}` already close correctly because we only added a new middle branch in the ternary chain. Verify visually after the build passes.)_

- [ ] **Step 6: Verify TypeScript build**

```bash
cd /Users/I316752/Private/Dev/neuroshima-hex-toolbox && npm run build 2>&1 | grep -i "^.*error" | head -10
```
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx
git commit -m "Add Random Matchup tab content and result screen render to App.tsx"
```

---

### Task 6: Manual verification

- [ ] **Step 1: Start dev server (if not already running)**

```bash
cd /Users/I316752/Private/Dev/neuroshima-hex-toolbox && npm run dev
```

- [ ] **Step 2: Verify the new tab appears**

Open http://localhost:5173. Confirm a "🎯 Random Matchup" tab appears after "🎲 Tile Randomizer" in the tab bar.

- [ ] **Step 3: Verify Randomize flow**

Click "🎯 Random Matchup". Confirm:
- Blurb text and "Randomize!" button appear; no army list
- "26 armies in pool" note is visible
- Clicking "Randomize!" navigates to the result screen
- Result screen shows two different armies with Player 1 / Player 2 labels and their accent colors

- [ ] **Step 4: Verify Re-roll**

Click "🔄 Re-roll". Confirm:
- Two new armies appear (browser does not navigate back)
- The back button is still available

- [ ] **Step 5: Verify Back and browser Back**

Click "← Back". Confirm you return to the Random Matchup tab on the home screen.
Press the browser/device Back button from the result screen. Confirm it returns to the home screen.

- [ ] **Step 6: Verify other tabs unaffected**

Switch to "📋 Tile Counter", "🪖 Army Selection", and "🎲 Tile Randomizer". Confirm all work as before.
