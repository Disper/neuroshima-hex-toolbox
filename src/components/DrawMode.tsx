import { useState, useCallback } from 'react';
import type { Army, TileCategory } from '../data/types';

const CATEGORY_ORDER: Record<TileCategory, number> = {
  hq: 0,
  instant: 1,
  soldier: 2,
  module: 3,
};
import type { TileInstance } from '../utils/deck';
import { buildDeck } from '../utils/deck';
import { codeToSeed, seededShuffle } from '../utils/rng';
import { TileCard } from './TileCard';

interface DrawModeProps {
  army: Army;
  deckCode: string;
  onBack: () => void;
  onBackToSetup: () => void;
}

function buildShuffledDeck(army: Army, code: string): TileInstance[] {
  const seed = codeToSeed(code);
  if (seed === null) return buildDeck(army);
  return seededShuffle(buildDeck(army), seed);
}

export function DrawMode({ army, deckCode, onBack, onBackToSetup }: DrawModeProps) {
  const [deck] = useState<TileInstance[]>(() => buildShuffledDeck(army, deckCode));
  const [drawIndex, setDrawIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const totalTiles = deck.length;
  const drawn = deck.slice(0, drawIndex);
  const remaining = deck.slice(drawIndex);
  const lastDrawn = drawn.length > 0 ? drawn[drawn.length - 1] : null;
  const isDone = drawIndex >= totalTiles;

  const handleDraw = useCallback(() => {
    if (drawIndex < totalTiles) {
      setDrawIndex((i) => i + 1);
    }
  }, [drawIndex, totalTiles]);

  const handleReset = useCallback(() => {
    setDrawIndex(0);
  }, []);

  const handleCopyCode = useCallback(async () => {
    await navigator.clipboard.writeText(deckCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [deckCode]);

  const progressPct = totalTiles > 0 ? (drawIndex / totalTiles) * 100 : 0;

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

      {/* Deck code banner */}
      <div className="rounded-2xl border border-stone-700 bg-stone-900 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">
            Deck Code — share this to draw in the same order
          </p>
          <div className="flex gap-1.5 items-center">
            {deckCode.split('').map((char, i) => (
              <div
                key={i}
                className="w-8 h-9 sm:w-10 sm:h-11 rounded-lg border border-stone-600 bg-stone-800 flex items-center justify-center text-base sm:text-xl font-mono font-bold text-stone-100"
              >
                {char}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleCopyCode}
            className="px-4 py-2 rounded-xl border border-stone-600 text-stone-300 hover:border-stone-400 hover:text-stone-100 transition-all text-sm font-medium"
          >
            {copied ? '✓ Copied!' : '⧉ Copy'}
          </button>
          <button
            onClick={onBackToSetup}
            className="px-4 py-2 rounded-xl border border-stone-600 text-stone-300 hover:border-stone-400 hover:text-stone-100 transition-all text-sm font-medium"
          >
            Change Code
          </button>
        </div>
      </div>

      {/* Progress */}
      <div
        className="rounded-2xl border border-stone-700 overflow-hidden p-6"
        style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold" style={{ color: army.accentColor }}>
            {army.name}
          </h1>
          <div className="text-right">
            <span className="text-2xl font-bold text-stone-100">{remaining.length}</span>
            <span className="text-stone-500 text-sm"> / {totalTiles} left</span>
          </div>
        </div>
        <div className="w-full bg-stone-800 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, background: army.accentColor }}
          />
        </div>
        <div className="flex justify-between text-xs text-stone-500 mt-1.5">
          <span>{drawIndex} drawn</span>
          <span>{remaining.length} remaining</span>
        </div>
      </div>

      {/* Draw button / done */}
      {isDone ? (
        <div className="text-center py-8 space-y-4">
          <div className="text-6xl">🎲</div>
          <p className="text-xl font-semibold text-stone-200">All tiles drawn!</p>
          <p className="text-stone-500 text-sm">The deck is empty.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleReset}
              className="px-8 py-3 rounded-xl font-bold text-base transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{ background: army.accentColor, color: '#fff' }}
            >
              Draw Again (Same Order)
            </button>
            <button
              onClick={onBackToSetup}
              className="px-8 py-3 rounded-xl font-bold text-base border border-stone-600 text-stone-300 hover:text-stone-100 hover:border-stone-400 transition-all duration-200 active:scale-95"
            >
              New Deck
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleDraw}
          className="w-full py-5 rounded-xl font-bold text-xl tracking-wide transition-all duration-200 hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30"
          style={{ background: army.accentColor, color: '#fff' }}
        >
          {drawIndex === 0
            ? 'Draw First Tile'
            : `Draw Tile (${remaining.length} left)`}
        </button>
      )}

      {/* Last drawn spotlight */}
      {lastDrawn && (
        <div className="rounded-2xl border border-stone-600 bg-stone-800/60 p-6">
          <p className="text-xs text-stone-500 uppercase tracking-wider mb-3 font-semibold">
            Last Drawn — tile {drawIndex} of {totalTiles}
          </p>
          <div className="max-w-xs">
            <TileCard tile={lastDrawn.tile} count={1} />
          </div>
        </div>
      )}

      {/* Drawn tiles history */}
      {drawn.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-stone-400 mb-3">
            Drawn ({drawn.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {[...drawn].reverse().map((instance, idx) => (
              <TileCard
                key={instance.instanceId}
                tile={instance.tile}
                count={1}
                small
                dimmed={idx > 0}
              />
            ))}
          </div>
        </section>
      )}

      {/* Remaining tiles (collapsible, sorted by category) */}
      {remaining.length > 0 && drawIndex > 0 && (
        <details className="group">
          <summary className="cursor-pointer text-sm text-stone-500 hover:text-stone-300 transition-colors select-none list-none flex items-center gap-2">
            <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
            Show remaining {remaining.length} tile{remaining.length !== 1 ? 's' : ''} in deck
          </summary>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {[...remaining]
              .sort(
                (a, b) =>
                  CATEGORY_ORDER[a.tile.category] - CATEGORY_ORDER[b.tile.category] ||
                  a.tile.id.localeCompare(b.tile.id) ||
                  a.instanceId.localeCompare(b.instanceId)
              )
              .map((instance) => (
                <TileCard key={instance.instanceId} tile={instance.tile} count={1} small />
              ))}
          </div>
        </details>
      )}
    </div>
  );
}
