import { useState, useCallback, useMemo, useEffect, useId } from 'react';
import type { Army, TileCategory, TileDefinition } from '../data/types';
import { getArmyDisplayName } from '../i18n/display';
import { useLocale } from '../i18n/locale';
import type { UiMessageKey } from '../i18n/ui';
import type { TileInstance } from '../utils/deck';
import { buildDeck } from '../utils/deck';
import {
  WIREMEN_TECH_BONUS_ORDER,
  type WiremenTechBonusKey,
  wiremenTechBonusesFullDeck,
  wiremenTechBonusesRemaining,
} from '../utils/wiremenTechBonuses';
import { TileCard } from './TileCard';

/** Three columns below lg (narrower on phones); four from lg up; slightly tighter gap on small screens */
const COUNTER_TILE_GRID = 'grid grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2';

/**
 * Side-by-side armies: desktop (lg+) or phone/tablet held horizontally once wide enough.
 * Without the landscape clause, phones stay stacked because width stays under 1024px.
 */
const COUNTER_WIDE_LAYOUT_MQ =
  '(min-width: 1024px), (orientation: landscape) and (min-width: 560px)';

/** Single layout branch — avoids duplicate tile grids in the DOM */
function useCounterWideLayout(): boolean {
  const [wide, setWide] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(COUNTER_WIDE_LAYOUT_MQ).matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia(COUNTER_WIDE_LAYOUT_MQ);
    const fn = () => setWide(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return wide;
}

const CATEGORY_ORDER: Record<TileCategory, number> = {
  hq: 0,
  instant: 1,
  soldier: 2,
  implant: 3,
  foundation: 4,
  module: 5,
};

const DECK_CATEGORIES: Exclude<TileCategory, 'hq'>[] = [
  'instant',
  'soldier',
  'implant',
  'module',
  'foundation',
];

const CATEGORY_LABEL_KEY: Record<Exclude<TileCategory, 'hq'>, UiMessageKey> = {
  instant: 'tileCatInstant',
  soldier: 'tileCatSoldier',
  implant: 'tileCatImplant',
  foundation: 'tileCatFoundation',
  module: 'tileCatModule',
};

const WIREMEN_BONUS_KEY: Record<WiremenTechBonusKey, UiMessageKey> = {
  ini0: 'wiremenBonusIni0',
  iniPlus1: 'wiremenBonusIniPlus1',
  matka: 'wiremenBonusMatka',
  meleePlus1: 'wiremenBonusMeleePlus1',
  rangedPlus1: 'wiremenBonusRangedPlus1',
};

const CATEGORY_STYLES: Record<Exclude<TileCategory, 'hq'>, string> = {
  instant: 'bg-red-950/60 border-red-500/30 text-red-400',
  soldier: 'bg-blue-950/60 border-blue-500/30 text-blue-400',
  implant: 'bg-violet-950/60 border-violet-500/30 text-violet-400',
  foundation: 'bg-slate-950/60 border-slate-500/30 text-slate-400',
  module: 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400',
};

function sortByCategory(instances: TileInstance[]): TileInstance[] {
  return [...instances].sort(
    (a, b) => CATEGORY_ORDER[a.tile.category] - CATEGORY_ORDER[b.tile.category]
  );
}

/** Group instances by tile id; order of groups follows first occurrence in `instances`. */
function groupInstancesByTileId(instances: TileInstance[]): {
  tile: TileDefinition;
  instances: TileInstance[];
}[] {
  const byId = new Map<string, TileInstance[]>();
  const order: string[] = [];
  for (const inst of instances) {
    const id = inst.tile.id;
    if (!byId.has(id)) {
      byId.set(id, []);
      order.push(id);
    }
    byId.get(id)!.push(inst);
  }
  return order.map((id) => ({
    tile: byId.get(id)![0].tile,
    instances: byId.get(id)!,
  }));
}

function sortGroupsByCategory(
  groups: { tile: TileDefinition; instances: TileInstance[] }[]
): { tile: TileDefinition; instances: TileInstance[] }[] {
  return [...groups].sort((a, b) => {
    const oa = CATEGORY_ORDER[a.tile.category];
    const ob = CATEGORY_ORDER[b.tile.category];
    if (oa !== ob) return oa - ob;
    return a.tile.id.localeCompare(b.tile.id);
  });
}

function countByCategory(instances: TileInstance[]): Record<Exclude<TileCategory, 'hq'>, number> {
  const counts = { instant: 0, soldier: 0, implant: 0, foundation: 0, module: 0 } as Record<
    Exclude<TileCategory, 'hq'>,
    number
  >;
  for (const inst of instances) {
    if (inst.tile.category !== 'hq') {
      counts[inst.tile.category]++;
    }
  }
  return counts;
}

/** Deck tile totals per category for this army (excludes HQ and excludeFromDeck). */
function deckTotalsByCategory(army: Army): Record<Exclude<TileCategory, 'hq'>, number> {
  const counts = { instant: 0, soldier: 0, implant: 0, foundation: 0, module: 0 } as Record<
    Exclude<TileCategory, 'hq'>,
    number
  >;
  for (const t of army.tiles) {
    if (t.excludeFromDeck || t.category === 'hq') continue;
    counts[t.category] += t.count;
  }
  return counts;
}

function CounterArmySummary({
  army,
  remaining,
  drawn,
}: {
  army: Army;
  remaining: TileInstance[];
  drawn: TileInstance[];
}) {
  const { locale, t } = useLocale();
  const totalTiles = remaining.length + drawn.length;
  const drawnCount = drawn.length;
  const remainingByCategory = countByCategory(remaining);
  const summaryCategories = useMemo(() => {
    const totals = deckTotalsByCategory(army);
    return DECK_CATEGORIES.filter((cat) => totals[cat] > 0);
  }, [army]);

  return (
    <div
      className="rounded-2xl border border-stone-700 overflow-hidden p-4 sm:p-6 min-w-0"
      style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="text-xl font-bold" style={{ color: army.accentColor }}>
          {getArmyDisplayName(army, locale)}
        </h2>
        <div className="text-right shrink-0">
          <span className="text-2xl font-bold text-stone-100">{drawnCount}</span>
          <span className="text-stone-500 text-sm">
            {' '}
            {t('counterDrawnOfTotal', { drawn: drawnCount, total: totalTiles })}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {summaryCategories.map((cat) => (
          <span
            key={cat}
            className={`px-2.5 py-1 rounded border text-sm font-medium ${CATEGORY_STYLES[cat]}`}
          >
            {t('counterCategorySummary', {
              cat: t(CATEGORY_LABEL_KEY[cat]),
              n: remainingByCategory[cat],
            })}
          </span>
        ))}
      </div>
    </div>
  );
}

function CounterDrawnColumn({
  drawn,
  stackIdentical,
  onDrawnClick,
}: {
  drawn: TileInstance[];
  stackIdentical: boolean;
  onDrawnClick: (instance: TileInstance) => void;
}) {
  const { t } = useLocale();
  if (drawn.length === 0) {
    return (
      <div className="min-h-[2.5rem] flex items-start text-stone-600 text-sm py-1">
        <span className="opacity-70">{t('counterNoTilesDrawn')}</span>
      </div>
    );
  }
  return (
    <div className={COUNTER_TILE_GRID}>
      {(stackIdentical
        ? sortGroupsByCategory(groupInstancesByTileId(drawn))
        : sortByCategory(drawn).map((instance) => ({
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
          drawnOverlay
          onClick={() => onDrawnClick(instances[0])}
        />
      ))}
    </div>
  );
}

function DrawnFoldable({
  drawn,
  stackIdentical,
  onDrawnClick,
}: {
  drawn: TileInstance[];
  stackIdentical: boolean;
  onDrawnClick: (instance: TileInstance) => void;
}) {
  const { t } = useLocale();
  const [open, setOpen] = useState(true);
  const panelId = useId();
  const triggerId = `${panelId}-drawn-trigger`;

  return (
    <div className="space-y-3 min-w-0">
      <button
        type="button"
        id={triggerId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center justify-between gap-2 rounded-lg text-left py-1 -mx-1 px-1 focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        <span className="text-base font-semibold text-stone-400 group-hover:text-stone-200">
          {t('counterDrawn', { n: drawn.length })}
        </span>
        <span
          className="text-stone-500 text-xs font-normal shrink-0 group-hover:text-stone-400"
          aria-hidden
        >
          {open ? t('counterFoldOpen') : t('counterFoldClosed')}
        </span>
      </button>
      <div id={panelId} role="region" aria-labelledby={triggerId} hidden={!open}>
        {open ? (
          <CounterDrawnColumn
            drawn={drawn}
            stackIdentical={stackIdentical}
            onDrawnClick={onDrawnClick}
          />
        ) : null}
      </div>
    </div>
  );
}

function CategoryRemainingBlock({
  army,
  category,
  remaining,
  stackIdentical,
  onRemainingClick,
}: {
  army: Army;
  category: Exclude<TileCategory, 'hq'>;
  remaining: TileInstance[];
  stackIdentical: boolean;
  onRemainingClick: (instance: TileInstance) => void;
}) {
  const { t } = useLocale();
  const deckTotals = useMemo(() => deckTotalsByCategory(army), [army]);
  const wiremenTechRemaining = useMemo(
    () => (army.id === 'wiremen' ? wiremenTechBonusesRemaining(remaining) : null),
    [army.id, remaining]
  );
  const wiremenTechFull = useMemo(
    () => (army.id === 'wiremen' ? wiremenTechBonusesFullDeck() : null),
    [army.id]
  );

  if (deckTotals[category] === 0) {
    return (
      <div className="min-w-0 text-stone-600 text-sm py-2 border border-transparent rounded-lg min-h-[3rem] flex items-center">
        <span className="text-stone-600">—</span>
        <span className="sr-only">
          {t('counterSrNoCategoryTiles', { cat: t(CATEGORY_LABEL_KEY[category]) })}
        </span>
      </div>
    );
  }

  const tiles = remaining.filter((i) => i.tile.category === category);

  return (
    <div className="min-w-0">
      <h4
        className={`text-sm font-semibold mb-2 inline-flex items-center gap-2 px-2.5 py-1 rounded border ${CATEGORY_STYLES[category]}`}
      >
        {t('counterCatRemainHeading', {
          cat: t(CATEGORY_LABEL_KEY[category]),
          n: tiles.length,
        })}
      </h4>
      {category === 'instant' && army.id === 'wiremen' && wiremenTechRemaining && wiremenTechFull && (
        <div className="mb-3 rounded-xl border border-teal-500/25 bg-teal-950/20 px-4 py-3">
          <p className="text-teal-300/90 text-xs font-semibold uppercase tracking-wider mb-2">
            {t('counterWiremenTechTitle')}
          </p>
          <p className="text-stone-500 text-xs mb-3 leading-relaxed">{t('counterWiremenTechBlurb')}</p>
          <div className="flex flex-wrap gap-2">
            {WIREMEN_TECH_BONUS_ORDER.map((key) => {
              const cur = wiremenTechRemaining[key];
              const max = wiremenTechFull[key];
              if (max === 0) return null;
              return (
                <span
                  key={key}
                  className="inline-flex items-baseline gap-1 rounded-lg border border-teal-600/35 bg-stone-900/60 px-2.5 py-1.5 text-sm"
                >
                  <span className="text-stone-300">{t(WIREMEN_BONUS_KEY[key])}</span>
                  <span className="font-bold tabular-nums text-teal-200">{cur}</span>
                  <span className="text-stone-600 text-xs">/ {max}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}
      <div className={`${COUNTER_TILE_GRID} mt-2`}>
        {(stackIdentical
          ? sortGroupsByCategory(groupInstancesByTileId(tiles))
          : tiles.map((instance) => ({
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
    </div>
  );
}

/** One army: summary, drawn, then all remaining categories (for stacked mobile layout) */
function CounterArmyFullPanel({
  army,
  remaining,
  drawn,
  stackIdentical,
  onRemainingClick,
  onDrawnClick,
}: {
  army: Army;
  remaining: TileInstance[];
  drawn: TileInstance[];
  stackIdentical: boolean;
  onRemainingClick: (instance: TileInstance) => void;
  onDrawnClick: (instance: TileInstance) => void;
}) {
  const { t } = useLocale();
  const categories = useMemo(() => {
    const totals = deckTotalsByCategory(army);
    return DECK_CATEGORIES.filter((cat) => totals[cat] > 0);
  }, [army]);

  return (
    <section className="space-y-6 min-w-0">
      <CounterArmySummary army={army} remaining={remaining} drawn={drawn} />
      <DrawnFoldable
        drawn={drawn}
        stackIdentical={stackIdentical}
        onDrawnClick={onDrawnClick}
      />
      <div className="space-y-6">
        <h3 className="text-base font-semibold text-stone-400">
          {t('counterRemaining', { n: remaining.length })}
        </h3>
        <div className="space-y-8">
          {categories.map((cat) => (
            <div
              key={cat}
              className="border-t border-stone-800/80 pt-6 first:border-t-0 first:pt-0"
            >
              <CategoryRemainingBlock
                army={army}
                category={cat}
                remaining={remaining}
                stackIdentical={stackIdentical}
                onRemainingClick={onRemainingClick}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface CounterModeProps {
  armies: [Army, Army];
  onBack: () => void;
}

export function CounterMode({ armies, onBack }: CounterModeProps) {
  const { t } = useLocale();
  const [army0, army1] = armies;

  const [remaining0, setRemaining0] = useState<TileInstance[]>(() => buildDeck(army0));
  const [drawn0, setDrawn0] = useState<TileInstance[]>([]);
  const [remaining1, setRemaining1] = useState<TileInstance[]>(() => buildDeck(army1));
  const [drawn1, setDrawn1] = useState<TileInstance[]>([]);
  const [stackIdentical, setStackIdentical] = useState(false);

  const categoriesInEitherDeck = useMemo(() => {
    const t0 = deckTotalsByCategory(army0);
    const t1 = deckTotalsByCategory(army1);
    return DECK_CATEGORIES.filter((cat) => t0[cat] > 0 || t1[cat] > 0);
  }, [army0, army1]);

  const handleRemaining0 = useCallback((instance: TileInstance) => {
    setRemaining0((prev) => prev.filter((i) => i.instanceId !== instance.instanceId));
    setDrawn0((prev) => [...prev, instance]);
  }, []);

  const handleDrawn0 = useCallback((instance: TileInstance) => {
    setDrawn0((prev) => prev.filter((i) => i.instanceId !== instance.instanceId));
    setRemaining0((prev) => [...prev, instance]);
  }, []);

  const handleRemaining1 = useCallback((instance: TileInstance) => {
    setRemaining1((prev) => prev.filter((i) => i.instanceId !== instance.instanceId));
    setDrawn1((prev) => [...prev, instance]);
  }, []);

  const handleDrawn1 = useCallback((instance: TileInstance) => {
    setDrawn1((prev) => prev.filter((i) => i.instanceId !== instance.instanceId));
    setRemaining1((prev) => [...prev, instance]);
  }, []);

  const handleReset = useCallback(() => {
    setRemaining0(buildDeck(army0));
    setDrawn0([]);
    setRemaining1(buildDeck(army1));
    setDrawn1([]);
  }, [army0, army1]);

  const wideLayout = useCounterWideLayout();

  /** Second column when wide branch is active (includes landscape phone; always 2-col there) */
  const colClass = 'min-w-0 border-l border-stone-800 pl-8';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-stone-400 hover:text-stone-100 transition-colors text-sm font-medium"
        >
          {t('counterBackArmies')}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-stone-400 hover:text-red-400 transition-colors text-sm font-medium"
        >
          {t('counterResetBoth')}
        </button>
      </div>

      <div
        className="rounded-2xl border border-stone-700 overflow-hidden p-4 sm:p-6"
        style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}
      >
        <h1 className="text-2xl font-bold text-stone-100">{t('counterTitle')}</h1>
        <p className="text-stone-500 text-sm mt-2">{t('counterInstruction')}</p>
        <label className="mt-4 flex items-center gap-2.5 cursor-pointer select-none text-sm text-stone-300 hover:text-stone-100">
          <input
            type="checkbox"
            className="rounded border-stone-600 bg-stone-800 text-amber-600 focus:ring-amber-500/40 focus:ring-offset-0"
            checked={stackIdentical}
            onChange={(e) => setStackIdentical(e.target.checked)}
          />
          <span>{t('counterStackIdentical')}</span>
        </label>
      </div>

      {/* Stacked portrait phone; wide: side-by-side (desktop lg+ or landscape with room) */}
      {wideLayout ? (
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <CounterArmySummary army={army0} remaining={remaining0} drawn={drawn0} />
          <div className={colClass}>
            <CounterArmySummary army={army1} remaining={remaining1} drawn={drawn1} />
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start">
            <div className="min-w-0">
              <DrawnFoldable
                drawn={drawn0}
                stackIdentical={stackIdentical}
                onDrawnClick={handleDrawn0}
              />
            </div>
            <div className={`min-w-0 ${colClass}`}>
              <DrawnFoldable
                drawn={drawn1}
                stackIdentical={stackIdentical}
                onDrawnClick={handleDrawn1}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start mb-6">
            <h3 className="text-base font-semibold text-stone-400">
              {t('counterRemaining', { n: remaining0.length })}
            </h3>
            <h3 className={`text-base font-semibold text-stone-400 ${colClass}`}>
              {t('counterRemaining', { n: remaining1.length })}
            </h3>
          </div>

          <div className="space-y-8">
            {categoriesInEitherDeck.map((cat) => (
              <div
                key={cat}
                className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start border-t border-stone-800/80 pt-6 first:border-t-0 first:pt-0"
              >
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
            ))}
          </div>
        </div>
      </div>
      ) : (
      <div className="space-y-10">
        <CounterArmyFullPanel
          army={army0}
          remaining={remaining0}
          drawn={drawn0}
          stackIdentical={stackIdentical}
          onRemainingClick={handleRemaining0}
          onDrawnClick={handleDrawn0}
        />
        <div className="border-t border-stone-700 pt-10">
          <CounterArmyFullPanel
            army={army1}
            remaining={remaining1}
            drawn={drawn1}
            stackIdentical={stackIdentical}
            onRemainingClick={handleRemaining1}
            onDrawnClick={handleDrawn1}
          />
        </div>
      </div>
      )}
    </div>
  );
}
