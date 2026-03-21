import { useState } from 'react';
import { armies } from './data/armies';
import type { Army } from './data/types';
import { APP_VERSION_FULL } from './version';
import { ArmyView } from './components/ArmyView';
import { CounterMode } from './components/CounterMode';
import { DeckSetup } from './components/DeckSetup';
import { DrawMode } from './components/DrawMode';

type Screen = 'home' | 'army' | 'setup' | 'draw' | 'counter';
type FeatureMode = 'randomizer' | 'counter';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [selectedArmy, setSelectedArmy] = useState<Army | null>(null);
  const [deckCode, setDeckCode] = useState<string>('');
  const [featureMode, setFeatureMode] = useState<FeatureMode>('randomizer');

  const goHome = () => {
    setScreen('home');
    setSelectedArmy(null);
    setDeckCode('');
  };

  const selectArmy = (army: Army) => {
    setSelectedArmy(army);
    if (featureMode === 'counter') {
      setScreen('counter');
    } else {
      setScreen('army');
    }
  };

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
            <span className="hidden sm:inline">Neuroshima Hex Randomizer</span>
            <span className="sm:hidden">NH Randomizer</span>
          </button>

          {selectedArmy && (
            <nav className="flex items-center gap-2 text-sm text-stone-500">
              <button onClick={goHome} className="hover:text-stone-300 transition-colors">
                Armies
              </button>
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
            </nav>
          )}
        </div>
      </header>

      <main>
        {screen === 'home' && (
          <HomeScreen
            armies={armies}
            featureMode={featureMode}
            onFeatureModeChange={setFeatureMode}
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
        {screen === 'counter' && selectedArmy && (
          <CounterMode army={selectedArmy} onBack={() => setScreen('home')} />
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
  onFeatureModeChange,
  onSelectArmy,
}: {
  armies: Army[];
  featureMode: FeatureMode;
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
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => onFeatureModeChange('randomizer')}
          className={[
            'px-6 py-3 rounded-xl font-semibold text-base transition-all duration-200 border',
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
            'px-6 py-3 rounded-xl font-semibold text-base transition-all duration-200 border',
            featureMode === 'counter'
              ? 'bg-stone-700 border-stone-500 text-stone-100'
              : 'border-stone-700 text-stone-500 hover:border-stone-600 hover:text-stone-300',
          ].join(' ')}
        >
          📋 Tile Counter
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-stone-500 text-sm text-center">
          {featureMode === 'randomizer'
            ? 'Draw tiles one by one using a shareable deck code — so all players draw in the same order.'
            : 'Manually count tiles by clicking to move them between Remaining and Drawn.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {armies.map((army) => (
          <ArmyCard key={army.id} army={army} onClick={() => onSelectArmy(army)} />
        ))}
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
    </div>
  );
}

function ArmyCard({ army, onClick }: { army: Army; onClick: () => void }) {

  return (
    <button
      onClick={onClick}
      className="text-left rounded-2xl border border-stone-700 overflow-hidden transition-all duration-200 hover:border-stone-500 hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/20 group"
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

        <div className="mt-4 flex items-center gap-2 text-xs text-stone-500">
          <span className="px-2 py-0.5 rounded bg-red-950/60 border border-red-500/30 text-red-400">
            {army.tiles
              .filter((t) => t.category === 'instant' && !t.excludeFromDeck)
              .reduce((s, t) => s + t.count, 0)}{' '}
            instant
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/30 text-blue-400">
            {army.tiles
              .filter((t) => t.category === 'soldier' && !t.excludeFromDeck)
              .reduce((s, t) => s + t.count, 0)}{' '}
            soldiers
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            {army.tiles
              .filter((t) => t.category === 'module' && !t.excludeFromDeck)
              .reduce((s, t) => s + t.count, 0)}{' '}
            modules
          </span>
        </div>
      </div>
    </button>
  );
}
