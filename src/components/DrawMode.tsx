import { useState, useCallback, useMemo } from 'react';
import type { Army, TileCategory } from '../data/types';

const CATEGORY_ORDER: Record<TileCategory, number> = {
  hq: 0,
  instant: 1,
  soldier: 2,
  implant: 3,
  foundation: 4,
  module: 5,
};
import type { TileInstance } from '../utils/deck';
import { buildDeck } from '../utils/deck';
import {
  applyIronGangHookMode,
  getIronGangHookBanner,
  IRON_GANG_ARMY_ID,
  parseIronGangDeckCode,
  type IronGangHookMode,
} from '../utils/ironGangDeck';
import {
  insertMerchantsGuildReconnaissance,
  MERCHANTS_GUILD_ARMY_ID,
  MG_SQUAD_LEADER_TILE_ID,
} from '../utils/merchantsGuildRandom';
import { codeToSeed, seededShuffle } from '../utils/rng';
import { TileCard } from './TileCard';

interface DrawModeProps {
  army: Army;
  deckCode: string;
  onBack: () => void;
  onBackToSetup: () => void;
}

function buildShuffledDeck(
  army: Army,
  code: string,
  ironGangHookMode?: IronGangHookMode | null
): TileInstance[] {
  let base = buildDeck(army);
  if (army.id === IRON_GANG_ARMY_ID && ironGangHookMode != null) {
    base = applyIronGangHookMode(base, ironGangHookMode);
  }
  const seed = codeToSeed(code);
  if (seed === null) return base;
  return seededShuffle(base, seed);
}

export function DrawMode({ army, deckCode, onBack, onBackToSetup }: DrawModeProps) {
  const igParsed = useMemo(
    () => (army.id === IRON_GANG_ARMY_ID ? parseIronGangDeckCode(deckCode) : null),
    [army.id, deckCode]
  );
  const ironGangHookMode = igParsed?.mode ?? null;
  const ironGangCodeError = igParsed?.error ?? null;

  const [deck, setDeck] = useState<TileInstance[]>(() =>
    buildShuffledDeck(
      army,
      deckCode,
      army.id === IRON_GANG_ARMY_ID ? parseIronGangDeckCode(deckCode).mode : null
    )
  );
  const [drawIndex, setDrawIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  /** Merchants Guild: user has tapped shuffle for each Reconnaissance (reset with deck reset). */
  const [mgRecon1Shuffled, setMgRecon1Shuffled] = useState(false);
  const [mgRecon2Shuffled, setMgRecon2Shuffled] = useState(false);

  const totalTiles = deck.length;
  const drawn = deck.slice(0, drawIndex);
  const remaining = deck.slice(drawIndex);

  const squadLeadersDrawn = useMemo(() => {
    if (army.id !== MERCHANTS_GUILD_ARMY_ID) return 0;
    return drawn.filter((t) => t.tile.id === MG_SQUAD_LEADER_TILE_ID).length;
  }, [army.id, drawn]);
  const lastDrawn = drawn.length > 0 ? drawn[drawn.length - 1] : null;
  const isDone = drawIndex >= totalTiles;

  const handleDraw = useCallback(() => {
    if (drawIndex >= deck.length) return;
    setDrawIndex((i) => i + 1);
  }, [deck.length, drawIndex]);

  const handleShuffleReconnaissance = useCallback(
    (which: 1 | 2) => {
      if (army.id !== MERCHANTS_GUILD_ARMY_ID) return;
      const seed = codeToSeed(deckCode);
      setDeck((prev) =>
        insertMerchantsGuildReconnaissance(prev, drawIndex, which, army.id, seed)
      );
      if (which === 1) setMgRecon1Shuffled(true);
      else setMgRecon2Shuffled(true);
    },
    [army.id, deckCode, drawIndex]
  );

  const handleReset = useCallback(() => {
    const mode =
      army.id === IRON_GANG_ARMY_ID ? parseIronGangDeckCode(deckCode).mode : null;
    setDeck(buildShuffledDeck(army, deckCode, mode));
    setDrawIndex(0);
    setMgRecon1Shuffled(false);
    setMgRecon2Shuffled(false);
  }, [army, deckCode]);

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

      {ironGangCodeError && (
        <div className="rounded-2xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {ironGangCodeError}
        </div>
      )}

      {/* Merchants Guild — Reconnaissance tiles */}
      {army.id === MERCHANTS_GUILD_ARMY_ID && (
        <div className="rounded-2xl border border-stone-600 bg-stone-900/80 px-4 py-3 text-sm text-stone-400">
          <span className="font-semibold text-stone-300">Merchants Guild (random mode):</span>{' '}
          <strong className="text-stone-200">Reconnaissance 1</strong> and{' '}
          <strong className="text-stone-200">Reconnaissance 2</strong> are not in the deck at start. After
          the <strong className="text-stone-200">first</strong> Squad Leader is drawn, use{' '}
          <strong className="text-stone-200">Shuffle Reconnaissance 1</strong>; after the{' '}
          <strong className="text-stone-200">second</strong> Squad Leader, use{' '}
          <strong className="text-stone-200">Shuffle Reconnaissance 2</strong>. Each inserts that tile at a
          random position in the remaining deck (position is deterministic from the deck code).
        </div>
      )}

      {/* Iron Gang — Hook deck rule */}
      {army.id === IRON_GANG_ARMY_ID && !ironGangCodeError && ironGangHookMode != null && (
        <div className="rounded-2xl border border-stone-600 bg-stone-900/80 px-4 py-3 text-sm text-stone-400">
          <span className="font-semibold text-stone-300">Iron Gang (this deck):</span>{' '}
          {getIronGangHookBanner(ironGangHookMode)}{' '}
          <span className="text-stone-500">
            (7th character of the code encodes Hook: 2 = no Hook, 3 = Officer, 4 = Order, 5 =
            Motorcyclist.)
          </span>
        </div>
      )}

      {/* Deck code banner */}
      <div className="rounded-2xl border border-stone-700 bg-stone-900 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">
            {army.id === IRON_GANG_ARMY_ID
              ? 'Deck Code — first 6 characters = shuffle; 7th = Hook mode (2–5)'
              : 'Deck Code — share this to draw in the same order'}
          </p>
          <div className="flex gap-1.5 items-center flex-wrap">
            {deckCode.split('').map((char, i) => (
              <div
                key={i}
                className={[
                  'w-8 h-9 sm:w-10 sm:h-11 rounded-lg border border-stone-600 bg-stone-800 flex items-center justify-center text-base sm:text-xl font-mono font-bold text-stone-100',
                  army.id === IRON_GANG_ARMY_ID && i === 6
                    ? 'ml-1 ring-2 ring-amber-500/40 border-amber-600/50'
                    : '',
                ].join(' ')}
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

      {/* Merchants Guild — manual Reconnaissance shuffle */}
      {army.id === MERCHANTS_GUILD_ARMY_ID &&
      ((squadLeadersDrawn >= 1 && !mgRecon1Shuffled) ||
        (squadLeadersDrawn >= 2 && !mgRecon2Shuffled)) ? (
        <div className="flex flex-wrap gap-2">
          {squadLeadersDrawn >= 1 && !mgRecon1Shuffled && (
            <button
              type="button"
              onClick={() => handleShuffleReconnaissance(1)}
              className="flex-1 min-w-[200px] py-3 px-4 rounded-xl font-semibold text-sm border-2 border-orange-500/50 bg-orange-950/40 text-orange-200 hover:bg-orange-900/50 hover:border-orange-400 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/40"
            >
              Shuffle Reconnaissance 1
            </button>
          )}
          {squadLeadersDrawn >= 2 && !mgRecon2Shuffled && (
            <button
              type="button"
              onClick={() => handleShuffleReconnaissance(2)}
              className="flex-1 min-w-[200px] py-3 px-4 rounded-xl font-semibold text-sm border-2 border-orange-500/50 bg-orange-950/40 text-orange-200 hover:bg-orange-900/50 hover:border-orange-400 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/40"
            >
              Shuffle Reconnaissance 2
            </button>
          )}
        </div>
      ) : null}

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
          {/* Same grid as “Drawn” below so width matches a single tile column */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            <TileCard
              key={lastDrawn.instanceId}
              tile={lastDrawn.tile}
              count={1}
              spotlight
            />
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
