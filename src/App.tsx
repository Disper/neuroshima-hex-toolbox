import { useState, useEffect } from 'react';
import { armies } from './data/armies';
import type { Army, TileCategory } from './data/types';
import { APP_VERSION_FULL } from './version';
import { ArmyView } from './components/ArmyView';
import { CounterMode } from './components/CounterMode';
import { DeckSetup } from './components/DeckSetup';
import { DrawMode } from './components/DrawMode';
import { TileFlipMode } from './components/TileFlipMode';

type Screen = 'home' | 'army' | 'setup' | 'draw' | 'counter';
type FeatureMode = 'randomizer' | 'counter' | 'tileflip';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedArmy, setSelectedArmy] = useState<Army | null>(null);
  const [deckCode, setDeckCode] = useState<string>('');
  const [featureMode, setFeatureMode] = useState<FeatureMode>('randomizer');
  const [counterArmies, setCounterArmies] = useState<[Army | null, Army | null]>([null, null]);

  const goHome = () => {
    setScreen('home');
    setSelectedArmy(null);
    setDeckCode('');
    setCounterArmies([null, null]);
  };

  const selectArmy = (army: Army) => {
    if (featureMode === 'counter') {
      setCounterArmies(([a, b]) => {
        if (!a) return [army, null];
        if (!b && army.id !== a.id) return [a, army];
        return [a, b];
      });
      return;
    }
    setSelectedArmy(army);
    setScreen('army');
  };

  useEffect(() => {
    if (featureMode !== 'counter') return;
    const [a, b] = counterArmies;
    if (a && b && screen === 'home') {
      setScreen('counter');
    }
  }, [featureMode, counterArmies, screen]);

  const handleStartDraw = () => setScreen('setup');

  const handleSetupStart = (code: string) => {
    setDeckCode(code);
    setScreen('draw');
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col">
      {/* Nav bar */}
      <header className="sticky top-0 z-20 border-b border-stone-800 bg-stone-950/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={goHome}
            className="flex items-center gap-2 font-bold text-stone-100 hover:text-white transition-colors"
          >
            <span className="text-lg">🎲</span>
            <span className="hidden sm:inline">Neuroshima Hex Toolbox</span>
            <span className="sm:hidden">NH Toolbox</span>
          </button>

          {(selectedArmy ||
            (screen === 'counter' && counterArmies[0] && counterArmies[1])) && (
            <nav className="flex items-center gap-2 text-sm text-stone-500 flex-wrap justify-end">
              <button onClick={goHome} className="hover:text-stone-300 transition-colors">
                Armies
              </button>
              {screen === 'counter' && counterArmies[0] && counterArmies[1] ? (
                <>
                  <span>/</span>
                  <span style={{ color: counterArmies[0].accentColor }}>{counterArmies[0].name}</span>
                  <span className="text-stone-600">vs</span>
                  <span style={{ color: counterArmies[1].accentColor }}>{counterArmies[1].name}</span>
                  <span>/</span>
                  <span className="text-stone-400">Tile Counter</span>
                </>
              ) : (
                selectedArmy && (
                  <>
                    <span>/</span>
                    <button
                      onClick={() => setScreen(featureMode === 'counter' ? 'counter' : 'army')}
                      className="hover:text-stone-300 transition-colors"
                      style={
                        screen === 'army' || screen === 'counter'
                          ? { color: selectedArmy.accentColor }
                          : undefined
                      }
                    >
                      {selectedArmy.name}
                    </button>
                    {(screen === 'setup' || screen === 'draw') && (
                      <>
                        <span>/</span>
                        {screen === 'draw' ? (
                          <>
                            <button
                              onClick={() => setScreen('setup')}
                              className="hover:text-stone-300 transition-colors"
                            >
                              Setup
                            </button>
                            <span>/</span>
                            <span style={{ color: selectedArmy.accentColor }}>Draw</span>
                          </>
                        ) : (
                          <span style={{ color: selectedArmy.accentColor }}>Setup</span>
                        )}
                      </>
                    )}
                    {screen === 'counter' && (
                      <>
                        <span>/</span>
                        <span style={{ color: selectedArmy.accentColor }}>Tile Counter</span>
                      </>
                    )}
                  </>
                )
              )}
            </nav>
          )}
        </div>
      </header>

      <main>
        {screen === 'home' && (
          <HomeScreen
            armies={armies}
            featureMode={featureMode}
            counterArmies={counterArmies}
            onFeatureModeChange={(m) => {
              setFeatureMode(m);
              if (m !== 'counter') setCounterArmies([null, null]);
            }}
            onSelectArmy={selectArmy}
          />
        )}
        {screen === 'army' && selectedArmy && (
          <ArmyView army={selectedArmy} onStartDraw={handleStartDraw} />
        )}
        {screen === 'setup' && selectedArmy && (
          <DeckSetup
            army={selectedArmy}
            onStart={handleSetupStart}
            onBack={() => setScreen('army')}
          />
        )}
        {screen === 'draw' && selectedArmy && deckCode && (
          <DrawMode
            key={`${selectedArmy.id}-${deckCode}`}
            army={selectedArmy}
            deckCode={deckCode}
            onBack={() => setScreen('army')}
            onBackToSetup={() => setScreen('setup')}
          />
        )}
        {screen === 'counter' && counterArmies[0] && counterArmies[1] && (
          <CounterMode
            key={`${counterArmies[0].id}-${counterArmies[1].id}`}
            armies={[counterArmies[0], counterArmies[1]]}
            onBack={() => {
              setScreen('home');
              setCounterArmies([null, null]);
            }}
          />
        )}
      </main>

      <footer className="mt-auto border-t border-stone-800 py-4">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-sm text-stone-500">
          <span>App made by Disper</span>
          <span className="hidden sm:inline">·</span>
          <span>v{APP_VERSION_FULL}</span>
        </div>
      </footer>
    </div>
  );
}

function HomeScreen({
  armies,
  featureMode,
  counterArmies,
  onFeatureModeChange,
  onSelectArmy,
}: {
  armies: Army[];
  featureMode: FeatureMode;
  counterArmies: [Army | null, Army | null];
  onFeatureModeChange: (m: FeatureMode) => void;
  onSelectArmy: (a: Army) => void;
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-100 tracking-tight">
          Neuroshima Hex
        </h1>
        <p className="text-stone-500 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
          Browse army tile lists and track or draw tiles.
        </p>
      </div>

      {/* Feature selector */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
        <button
          onClick={() => onFeatureModeChange('randomizer')}
          className={[
            'px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 border',
            featureMode === 'randomizer'
              ? 'bg-stone-700 border-stone-500 text-stone-100'
              : 'border-stone-700 text-stone-500 hover:border-stone-600 hover:text-stone-300',
          ].join(' ')}
        >
          🎲 Tile Randomizer
        </button>
        <button
          onClick={() => onFeatureModeChange('counter')}
          className={[
            'px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 border',
            featureMode === 'counter'
              ? 'bg-stone-700 border-stone-500 text-stone-100'
              : 'border-stone-700 text-stone-500 hover:border-stone-600 hover:text-stone-300',
          ].join(' ')}
        >
          📋 Tile Counter
        </button>
        <button
          onClick={() => onFeatureModeChange('tileflip')}
          className={[
            'px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 border',
            featureMode === 'tileflip'
              ? 'bg-stone-700 border-stone-500 text-stone-100'
              : 'border-stone-700 text-stone-500 hover:border-stone-600 hover:text-stone-300',
          ].join(' ')}
        >
          🪙 Tile flip
        </button>
      </div>

      {featureMode === 'tileflip' ? (
        <TileFlipMode />
      ) : (
        <>
          <div className="space-y-2">
            <p className="text-stone-500 text-sm text-center">
              {featureMode === 'randomizer'
                ? 'Draw tiles one by one using a shareable deck code — so all players draw in the same order.'
                : featureMode === 'counter'
                  ? 'Select two different armies (first, then second). Then track remaining tiles for both side by side.'
                  : ''}
            </p>
            {featureMode === 'counter' && (
              <p className="text-stone-400 text-sm text-center">
                {!counterArmies[0] && 'Step 1: choose the first army.'}
                {counterArmies[0] && !counterArmies[1] && (
                  <>
                    Step 2: choose a <strong className="text-stone-300">different</strong> army (the
                    first is already selected).
                  </>
                )}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {armies.map((army) => {
              const counterPickFirst = counterArmies[0]?.id === army.id;
              const counterBlockDuplicate =
                featureMode === 'counter' &&
                Boolean(counterArmies[0]) &&
                !counterArmies[1] &&
                counterArmies[0]!.id === army.id;
              return (
                <ArmyCard
                  key={army.id}
                  army={army}
                  disabled={counterBlockDuplicate}
                  selectedRing={featureMode === 'counter' && counterPickFirst && Boolean(counterArmies[0])}
                  onClick={() => onSelectArmy(army)}
                />
              );
            })}
            <a
              href="https://www.siepomaga.pl/na-pomoc-dla-julki"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-dashed border-stone-600 p-6 flex flex-col items-center justify-center text-center text-stone-400 hover:border-stone-500 hover:text-stone-300 transition-all duration-200 group"
            >
              <span className="text-sm font-medium group-hover:underline">
                Enjoying the app? Join Partisants today
              </span>
            </a>
          </div>
        </>
      )}
    </div>
  );
}

function deckTileCount(army: Army, category: TileCategory): number {
  return army.tiles
    .filter((t) => t.category === category && !t.excludeFromDeck)
    .reduce((s, t) => s + t.count, 0);
}

function ArmyCard({
  army,
  onClick,
  disabled = false,
  selectedRing = false,
}: {
  army: Army;
  onClick: () => void;
  disabled?: boolean;
  selectedRing?: boolean;
}) {
  const categoryBadges = [
    {
      category: 'instant' as const,
      label: 'instant',
      className: 'px-2 py-0.5 rounded bg-red-950/60 border border-red-500/30 text-red-400',
    },
    {
      category: 'soldier' as const,
      label: 'soldiers',
      className: 'px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/30 text-blue-400',
    },
    {
      category: 'implant' as const,
      label: 'implants',
      className: 'px-2 py-0.5 rounded bg-violet-950/60 border border-violet-500/30 text-violet-400',
    },
    {
      category: 'module' as const,
      label: 'modules',
      className: 'px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400',
    },
    {
      category: 'foundation' as const,
      label: 'foundations',
      className: 'px-2 py-0.5 rounded bg-slate-950/60 border border-slate-500/30 text-slate-400',
    },
  ]
    .map((row) => ({ ...row, count: deckTileCount(army, row.category) }))
    .filter((row) => row.count > 0);

  return (
    <button
      type="button"
      onClick={() => {
        if (!disabled) onClick();
      }}
      disabled={disabled}
      className={[
        'text-left rounded-2xl border border-stone-700 overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 group',
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:border-stone-500 hover:scale-[1.02] active:scale-95',
        selectedRing ? 'ring-2 ring-amber-500/70 ring-offset-2 ring-offset-stone-950' : '',
      ].join(' ')}
      style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}
    >
      <div className="h-1.5 w-full" style={{ background: army.accentColor }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              className="text-xl font-bold tracking-tight group-hover:brightness-110 transition-all"
              style={{ color: army.accentColor }}
            >
              {army.name}
            </h2>
            <p className="text-stone-400 text-sm mt-1 leading-relaxed line-clamp-3">
              {army.description}
            </p>
          </div>
          {army.hqImageUrl && (
            <img
              src={army.hqImageUrl}
              alt={`${army.name} HQ`}
              className="shrink-0 w-20 h-20 object-contain"
            />
          )}
        </div>

        {categoryBadges.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-stone-500">
            {categoryBadges.map(({ category, label, className, count }) => (
              <span key={category} className={className}>
                {count} {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
