import { useState, useCallback } from 'react';
import type { Army, TileCategory } from '../data/types';
import type { TileInstance } from '../utils/deck';
import { buildDeck } from '../utils/deck';
import { TileCard } from './TileCard';

const CATEGORY_ORDER: Record<TileCategory, number> = {
  hq: 0,
  instant: 1,
  soldier: 2,
  module: 3,
};

const DECK_CATEGORIES: Exclude<TileCategory, 'hq'>[] = ['instant', 'soldier', 'module'];

const CATEGORY_LABELS: Record<Exclude<TileCategory, 'hq'>, string> = {
  instant: 'Instant',
  soldier: 'Soldier',
  module: 'Module',
};

const CATEGORY_STYLES: Record<Exclude<TileCategory, 'hq'>, string> = {
  instant: 'bg-red-950/60 border-red-500/30 text-red-400',
  soldier: 'bg-blue-950/60 border-blue-500/30 text-blue-400',
  module: 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400',
};

function sortByCategory(instances: TileInstance[]): TileInstance[] {
  return [...instances].sort(
    (a, b) => CATEGORY_ORDER[a.tile.category] - CATEGORY_ORDER[b.tile.category]
  );
}

function countByCategory(instances: TileInstance[]): Record<Exclude<TileCategory, 'hq'>, number> {
  const counts = { instant: 0, soldier: 0, module: 0 } as Record<
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

interface CounterModeProps {
  army: Army;
  onBack: () => void;
}

export function CounterMode({ army, onBack }: CounterModeProps) {
  const [remaining, setRemaining] = useState<TileInstance[]>(() => buildDeck(army));
  const [drawn, setDrawn] = useState<TileInstance[]>([]);

  const handleRemainingClick = useCallback((instance: TileInstance) => {
    setRemaining((prev) => prev.filter((i) => i.instanceId !== instance.instanceId));
    setDrawn((prev) => [...prev, instance]);
  }, []);

  const handleDrawnClick = useCallback((instance: TileInstance) => {
    setDrawn((prev) => prev.filter((i) => i.instanceId !== instance.instanceId));
    setRemaining((prev) => [...prev, instance]);
  }, []);

  const handleReset = useCallback(() => {
    setRemaining(buildDeck(army));
    setDrawn([]);
  }, [army]);

  const totalTiles = remaining.length + drawn.length;
  const drawnCount = drawn.length;
  const remainingByCategory = countByCategory(remaining);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-stone-400 hover:text-stone-100 transition-colors text-sm font-medium"
        >
          ← Army List
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-stone-400 hover:text-red-400 transition-colors text-sm font-medium"
        >
          ↺ Reset
        </button>
      </div>

      {/* Summary */}
      <div
        className="rounded-2xl border border-stone-700 overflow-hidden p-6"
        style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: army.accentColor }}>
            {army.name} — Tile Counter
          </h1>
          <div className="text-right">
            <span className="text-2xl font-bold text-stone-100">{drawnCount}</span>
            <span className="text-stone-500 text-sm"> / {totalTiles} drawn</span>
          </div>
        </div>
        <p className="text-stone-500 text-sm mt-2">
          Click a tile to move it between Remaining and Drawn.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {DECK_CATEGORIES.map((cat) => (
            <span
              key={cat}
              className={`px-2.5 py-1 rounded border text-sm font-medium ${CATEGORY_STYLES[cat]}`}
            >
              {CATEGORY_LABELS[cat]}: {remainingByCategory[cat]} remaining
            </span>
          ))}
        </div>
      </div>

      {/* Drawn section */}
      {drawn.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-stone-400 mb-3">
            Drawn ({drawn.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {sortByCategory(drawn).map((instance) => (
              <TileCard
                key={instance.instanceId}
                tile={instance.tile}
                count={1}
                small
                onClick={() => handleDrawnClick(instance)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Remaining section — grouped by category */}
      <section>
        <h2 className="text-base font-semibold text-stone-400 mb-3">
          Remaining ({remaining.length})
        </h2>
        {DECK_CATEGORIES.map((cat) => {
          const tiles = remaining.filter((i) => i.tile.category === cat);
          if (tiles.length === 0) return null;
          return (
            <div key={cat} className="mb-6 last:mb-0">
              <h3
                className={`text-sm font-semibold mb-2 inline-flex items-center gap-2 px-2.5 py-1 rounded border ${CATEGORY_STYLES[cat]}`}
              >
                {CATEGORY_LABELS[cat]} — {tiles.length} remaining
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                {tiles.map((instance) => (
                  <TileCard
                    key={instance.instanceId}
                    tile={instance.tile}
                    count={1}
                    small
                    onClick={() => handleRemainingClick(instance)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
