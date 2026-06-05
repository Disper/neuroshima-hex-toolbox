# Tile Counter — Split by Category Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Split by category" checkbox (default: on) to the Tile Counter options panel; when unchecked, all remaining tiles render in a single flat grid sorted by category order instead of per-category sections.

**Architecture:** Single new boolean state `splitByCategory` (default `true`) in `CounterMode`. When `false`, `CounterArmyFullPanel` and the wide-layout branch render a flat `COUNTER_TILE_GRID` instead of iterating `CategoryRemainingBlock` sections. Special blocks (Wiremen, Partisans) still render after the flat grid. No new components.

**Tech Stack:** React, TypeScript, Tailwind CSS v4

---

## File map

| File | What changes |
|------|-------------|
| `src/i18n/ui.ts` | Add `counterSplitByCategory` to EN and PL locales |
| `src/components/CounterMode.tsx` | Add state, checkbox, prop threading, flat render path |

---

### Task 1: Add i18n string

**Files:**
- Modify: `src/i18n/ui.ts:73-74` (EN), `src/i18n/ui.ts:244-245` (PL)

- [ ] **Step 1: Add EN string after `counterStackIdentical`**

In `src/i18n/ui.ts`, find line 73:
```ts
    counterStackIdentical: 'Stack identical tiles',
```
Add directly after it:
```ts
    counterSplitByCategory: 'Split by category',
```

- [ ] **Step 2: Add PL string after PL `counterStackIdentical`**

Find line 244:
```ts
    counterStackIdentical: 'Układaj identyczne żetony w stosy',
```
Add directly after it:
```ts
    counterSplitByCategory: 'Podziel na kategorie',
```

- [ ] **Step 3: Verify TypeScript is happy**

```bash
cd /Users/I316752/Private/Dev/neuroshima-hex-toolbox && npm run build 2>&1 | grep -E "error|warning" | head -20
```
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/i18n/ui.ts
git commit -m "Add counterSplitByCategory i18n string (EN + PL)"
```

---

### Task 2: Add state and checkbox to CounterMode

**Files:**
- Modify: `src/components/CounterMode.tsx:529` (state), `src/components/CounterMode.tsx:596-604` (options panel)

- [ ] **Step 1: Add `splitByCategory` state**

In `src/components/CounterMode.tsx`, find line 529:
```ts
  const [stackIdentical, setStackIdentical] = useState(true);
```
Add directly after it:
```ts
  const [splitByCategory, setSplitByCategory] = useState(true);
```

- [ ] **Step 2: Add the checkbox to the options panel**

Find the existing `stackIdentical` checkbox label (around line 596–604):
```tsx
        <label className="mt-4 flex items-center gap-2.5 cursor-pointer select-none text-sm text-stone-300 hover:text-stone-100">
          <input
            type="checkbox"
            className="rounded border-stone-600 bg-stone-800 text-amber-600 focus:ring-amber-500/40 focus:ring-offset-0"
            checked={stackIdentical}
            onChange={(e) => setStackIdentical(e.target.checked)}
          />
          <span>{t('counterStackIdentical')}</span>
        </label>
```
Replace with:
```tsx
        <div className="mt-4 flex flex-col gap-2">
          <label className="flex items-center gap-2.5 cursor-pointer select-none text-sm text-stone-300 hover:text-stone-100">
            <input
              type="checkbox"
              className="rounded border-stone-600 bg-stone-800 text-amber-600 focus:ring-amber-500/40 focus:ring-offset-0"
              checked={stackIdentical}
              onChange={(e) => setStackIdentical(e.target.checked)}
            />
            <span>{t('counterStackIdentical')}</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer select-none text-sm text-stone-300 hover:text-stone-100">
            <input
              type="checkbox"
              className="rounded border-stone-600 bg-stone-800 text-amber-600 focus:ring-amber-500/40 focus:ring-offset-0"
              checked={splitByCategory}
              onChange={(e) => setSplitByCategory(e.target.checked)}
            />
            <span>{t('counterSplitByCategory')}</span>
          </label>
        </div>
```

- [ ] **Step 3: Verify TypeScript is happy**

```bash
cd /Users/I316752/Private/Dev/neuroshima-hex-toolbox && npm run build 2>&1 | grep -E "error|warning" | head -20
```
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/CounterMode.tsx
git commit -m "Add splitByCategory state and checkbox to CounterMode options panel"
```

---

### Task 3: Thread `splitByCategory` into `CounterArmyFullPanel` and add flat render path

**Files:**
- Modify: `src/components/CounterMode.tsx` — `CounterArmyFullPanel` component (props interface + render) and its two call sites in the portrait layout

- [ ] **Step 1: Add `splitByCategory` to `CounterArmyFullPanel` props**

Find the `CounterArmyFullPanel` function signature (around line 441):
```tsx
function CounterArmyFullPanel({
  army,
  remaining,
  drawn,
  stackIdentical,
  usedTrapIds,
  onToggleTrap,
  onRemainingClick,
  onDrawnClick,
}: {
  army: Army;
  remaining: TileInstance[];
  drawn: TileInstance[];
  stackIdentical: boolean;
  usedTrapIds: Set<string>;
  onToggleTrap: (instanceId: string) => void;
  onRemainingClick: (instance: TileInstance) => void;
  onDrawnClick: (instance: TileInstance) => void;
})
```
Replace with:
```tsx
function CounterArmyFullPanel({
  army,
  remaining,
  drawn,
  stackIdentical,
  splitByCategory,
  usedTrapIds,
  onToggleTrap,
  onRemainingClick,
  onDrawnClick,
}: {
  army: Army;
  remaining: TileInstance[];
  drawn: TileInstance[];
  stackIdentical: boolean;
  splitByCategory: boolean;
  usedTrapIds: Set<string>;
  onToggleTrap: (instanceId: string) => void;
  onRemainingClick: (instance: TileInstance) => void;
  onDrawnClick: (instance: TileInstance) => void;
})
```

- [ ] **Step 2: Replace the remaining tiles section in `CounterArmyFullPanel` with a split/flat branch**

Find the remaining tiles section inside `CounterArmyFullPanel` (the `<div className="space-y-6">` block after `DrawnFoldable`, around line 474–501):
```tsx
      <div className="space-y-6">
        <h3 className="text-base font-semibold text-stone-400">
          {t('counterRemaining', { n: remaining.length })}
        </h3>
        <div className="space-y-8">
          {categories.map((cat) => (
            <div key={cat}>
              {cat === 'instant' ? <WiremenTechRemainingBlock army={army} remaining={remaining} /> : null}
              <div className="border-t border-stone-800/80 pt-6 first:border-t-0 first:pt-0">
                <CategoryRemainingBlock
                  army={army}
                  category={cat}
                  remaining={remaining}
                  stackIdentical={stackIdentical}
                  onRemainingClick={onRemainingClick}
                />
              </div>
              {cat === 'module' && army.id === PARTISANS_ARMY_ID ? (
                <div className="border-t border-stone-800/80 pt-6 mt-6">
                  <PartisanTrapsBlock usedTrapIds={usedTrapIds} onToggleTrap={onToggleTrap} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
```
Replace with:
```tsx
      <div className="space-y-6">
        <h3 className="text-base font-semibold text-stone-400">
          {t('counterRemaining', { n: remaining.length })}
        </h3>
        {splitByCategory ? (
          <div className="space-y-8">
            {categories.map((cat) => (
              <div key={cat}>
                {cat === 'instant' ? <WiremenTechRemainingBlock army={army} remaining={remaining} /> : null}
                <div className="border-t border-stone-800/80 pt-6 first:border-t-0 first:pt-0">
                  <CategoryRemainingBlock
                    army={army}
                    category={cat}
                    remaining={remaining}
                    stackIdentical={stackIdentical}
                    onRemainingClick={onRemainingClick}
                  />
                </div>
                {cat === 'module' && army.id === PARTISANS_ARMY_ID ? (
                  <div className="border-t border-stone-800/80 pt-6 mt-6">
                    <PartisanTrapsBlock usedTrapIds={usedTrapIds} onToggleTrap={onToggleTrap} />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className={COUNTER_TILE_GRID}>
              {(stackIdentical
                ? sortGroupsByCategory(groupInstancesByTileId(remaining.filter((i) => i.tile.category !== 'hq')))
                : sortByCategory(remaining.filter((i) => i.tile.category !== 'hq')).map((instance) => ({
                    tile: instance.tile,
                    instances: [instance],
                  }))
              ).map(({ tile, instances }) => (
                <TileCard
                  key={instances.map((i) => i.instanceId).join('|')}
                  tile={tile}
                  count={instances.length}
                  countInParentheses={stackIdentical && instances.length > 1}
                  small
                  onClick={() => onRemainingClick(instances[0])}
                />
              ))}
            </div>
            <WiremenTechRemainingBlock army={army} remaining={remaining} />
            {army.id === PARTISANS_ARMY_ID ? (
              <PartisanTrapsBlock usedTrapIds={usedTrapIds} onToggleTrap={onToggleTrap} />
            ) : null}
          </div>
        )}
      </div>
```

- [ ] **Step 3: Pass `splitByCategory` to both `CounterArmyFullPanel` call sites in the portrait layout**

Find the first call site (around line 703):
```tsx
        <CounterArmyFullPanel
          army={army0}
          remaining={remaining0}
          drawn={drawn0}
          stackIdentical={stackIdentical}
          usedTrapIds={usedTraps0}
          onToggleTrap={(id) => toggleUsedTrap(setUsedTraps0, id)}
          onRemainingClick={handleRemaining0}
          onDrawnClick={handleDrawn0}
        />
```
Replace with:
```tsx
        <CounterArmyFullPanel
          army={army0}
          remaining={remaining0}
          drawn={drawn0}
          stackIdentical={stackIdentical}
          splitByCategory={splitByCategory}
          usedTrapIds={usedTraps0}
          onToggleTrap={(id) => toggleUsedTrap(setUsedTraps0, id)}
          onRemainingClick={handleRemaining0}
          onDrawnClick={handleDrawn0}
        />
```
Find the second call site (around line 714):
```tsx
          <CounterArmyFullPanel
            army={army1}
            remaining={remaining1}
            drawn={drawn1}
            stackIdentical={stackIdentical}
            usedTrapIds={usedTraps1}
            onToggleTrap={(id) => toggleUsedTrap(setUsedTraps1, id)}
            onRemainingClick={handleRemaining1}
            onDrawnClick={handleDrawn1}
          />
```
Replace with:
```tsx
          <CounterArmyFullPanel
            army={army1}
            remaining={remaining1}
            drawn={drawn1}
            stackIdentical={stackIdentical}
            splitByCategory={splitByCategory}
            usedTrapIds={usedTraps1}
            onToggleTrap={(id) => toggleUsedTrap(setUsedTraps1, id)}
            onRemainingClick={handleRemaining1}
            onDrawnClick={handleDrawn1}
          />
```

- [ ] **Step 4: Verify TypeScript is happy**

```bash
cd /Users/I316752/Private/Dev/neuroshima-hex-toolbox && npm run build 2>&1 | grep -E "error|warning" | head -20
```
Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/CounterMode.tsx
git commit -m "Add flat render path to CounterArmyFullPanel when splitByCategory is false"
```

---

### Task 4: Thread `splitByCategory` into the wide (two-column) layout

**Files:**
- Modify: `src/components/CounterMode.tsx` — wide layout branch (the `wideLayout ? (...)` block, around line 608–700)

- [ ] **Step 1: Replace the per-category rows section in the wide layout with a split/flat branch**

Find the remaining tiles section in the wide layout (the `<div className="space-y-8">` block that maps `categoriesInEitherDeck`, around line 646–699):
```tsx
        <div className="space-y-8">
            {categoriesInEitherDeck.map((cat) => (
              <div key={cat}>
                {cat === 'instant' ? (
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start mb-6">
                    <WiremenTechRemainingBlock army={army0} remaining={remaining0} />
                    <div className={colClass}>
                      <WiremenTechRemainingBlock army={army1} remaining={remaining1} />
                    </div>
                  </div>
                ) : null}
                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start border-t border-stone-800/80 pt-6 first:border-t-0 first:pt-0">
                  <CategoryRemainingBlock
                    army={army0}
                    category={cat}
                    remaining={remaining0}
                    stackIdentical={stackIdentical}
                    onRemainingClick={handleRemaining0}
                  />
                  <div className={colClass}>
                    <CategoryRemainingBlock
                      army={army1}
                      category={cat}
                      remaining={remaining1}
                      stackIdentical={stackIdentical}
                      onRemainingClick={handleRemaining1}
                    />
                  </div>
                </div>
                {cat === 'module' &&
                (army0.id === PARTISANS_ARMY_ID || army1.id === PARTISANS_ARMY_ID) ? (
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start border-t border-stone-800/80 pt-6 mt-6">
                    <div className="min-w-0">
                      {army0.id === PARTISANS_ARMY_ID ? (
                        <PartisanTrapsBlock
                          usedTrapIds={usedTraps0}
                          onToggleTrap={(id) => toggleUsedTrap(setUsedTraps0, id)}
                        />
                      ) : null}
                    </div>
                    <div className={`min-w-0 ${colClass}`}>
                      {army1.id === PARTISANS_ARMY_ID ? (
                        <PartisanTrapsBlock
                          usedTrapIds={usedTraps1}
                          onToggleTrap={(id) => toggleUsedTrap(setUsedTraps1, id)}
                        />
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
```
Replace with:
```tsx
          {splitByCategory ? (
            <div className="space-y-8">
              {categoriesInEitherDeck.map((cat) => (
                <div key={cat}>
                  {cat === 'instant' ? (
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start mb-6">
                      <WiremenTechRemainingBlock army={army0} remaining={remaining0} />
                      <div className={colClass}>
                        <WiremenTechRemainingBlock army={army1} remaining={remaining1} />
                      </div>
                    </div>
                  ) : null}
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start border-t border-stone-800/80 pt-6 first:border-t-0 first:pt-0">
                    <CategoryRemainingBlock
                      army={army0}
                      category={cat}
                      remaining={remaining0}
                      stackIdentical={stackIdentical}
                      onRemainingClick={handleRemaining0}
                    />
                    <div className={colClass}>
                      <CategoryRemainingBlock
                        army={army1}
                        category={cat}
                        remaining={remaining1}
                        stackIdentical={stackIdentical}
                        onRemainingClick={handleRemaining1}
                      />
                    </div>
                  </div>
                  {cat === 'module' &&
                  (army0.id === PARTISANS_ARMY_ID || army1.id === PARTISANS_ARMY_ID) ? (
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start border-t border-stone-800/80 pt-6 mt-6">
                      <div className="min-w-0">
                        {army0.id === PARTISANS_ARMY_ID ? (
                          <PartisanTrapsBlock
                            usedTrapIds={usedTraps0}
                            onToggleTrap={(id) => toggleUsedTrap(setUsedTraps0, id)}
                          />
                        ) : null}
                      </div>
                      <div className={`min-w-0 ${colClass}`}>
                        {army1.id === PARTISANS_ARMY_ID ? (
                          <PartisanTrapsBlock
                            usedTrapIds={usedTraps1}
                            onToggleTrap={(id) => toggleUsedTrap(setUsedTraps1, id)}
                          />
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start">
              <div className="min-w-0 space-y-6">
                <div className={COUNTER_TILE_GRID}>
                  {(stackIdentical
                    ? sortGroupsByCategory(groupInstancesByTileId(remaining0.filter((i) => i.tile.category !== 'hq')))
                    : sortByCategory(remaining0.filter((i) => i.tile.category !== 'hq')).map((instance) => ({
                        tile: instance.tile,
                        instances: [instance],
                      }))
                  ).map(({ tile, instances }) => (
                    <TileCard
                      key={instances.map((i) => i.instanceId).join('|')}
                      tile={tile}
                      count={instances.length}
                      countInParentheses={stackIdentical && instances.length > 1}
                      small
                      onClick={() => handleRemaining0(instances[0])}
                    />
                  ))}
                </div>
                <WiremenTechRemainingBlock army={army0} remaining={remaining0} />
                {army0.id === PARTISANS_ARMY_ID ? (
                  <PartisanTrapsBlock
                    usedTrapIds={usedTraps0}
                    onToggleTrap={(id) => toggleUsedTrap(setUsedTraps0, id)}
                  />
                ) : null}
              </div>
              <div className={`min-w-0 ${colClass} space-y-6`}>
                <div className={COUNTER_TILE_GRID}>
                  {(stackIdentical
                    ? sortGroupsByCategory(groupInstancesByTileId(remaining1.filter((i) => i.tile.category !== 'hq')))
                    : sortByCategory(remaining1.filter((i) => i.tile.category !== 'hq')).map((instance) => ({
                        tile: instance.tile,
                        instances: [instance],
                      }))
                  ).map(({ tile, instances }) => (
                    <TileCard
                      key={instances.map((i) => i.instanceId).join('|')}
                      tile={tile}
                      count={instances.length}
                      countInParentheses={stackIdentical && instances.length > 1}
                      small
                      onClick={() => handleRemaining1(instances[0])}
                    />
                  ))}
                </div>
                <WiremenTechRemainingBlock army={army1} remaining={remaining1} />
                {army1.id === PARTISANS_ARMY_ID ? (
                  <PartisanTrapsBlock
                    usedTrapIds={usedTraps1}
                    onToggleTrap={(id) => toggleUsedTrap(setUsedTraps1, id)}
                  />
                ) : null}
              </div>
            </div>
          )}
```

- [ ] **Step 2: Verify TypeScript is happy**

```bash
cd /Users/I316752/Private/Dev/neuroshima-hex-toolbox && npm run build 2>&1 | grep -E "error|warning" | head -20
```
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/CounterMode.tsx
git commit -m "Add flat render path to wide layout when splitByCategory is false"
```

---

### Task 5: Manual verification

- [ ] **Step 1: Start dev server**

```bash
cd /Users/I316752/Private/Dev/neuroshima-hex-toolbox && npm run dev
```

- [ ] **Step 2: Verify split ON (default)**

Open the app, start a Tile Counter session with any two armies. Confirm:
- Both checkboxes appear in the options panel: "Stack identical tiles" and "Split by category", both checked
- Remaining tiles are shown in category sections with coloured headers (unchanged behaviour)

- [ ] **Step 3: Verify split OFF**

Uncheck "Split by category". Confirm:
- Remaining tiles for each army appear in a single flat grid
- Tiles are ordered Instant → Soldier → Implant → Foundation → Module
- No category headers
- Border colour still indicates tile category
- "Stack identical tiles" still works (stacking/unstacking tiles in the flat grid)
- Drawn section is unaffected

- [ ] **Step 4: Verify special armies**

Test with Wiremen (has tech bonus block) or Partisans (has trap block). With split OFF, confirm those blocks still appear after the flat tile grid.

- [ ] **Step 5: Verify wide layout**

On a wide screen (or landscape phone), confirm both split ON and split OFF work correctly in the two-column layout.
