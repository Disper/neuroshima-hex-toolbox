import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { armies } from './data/armies';
import type { Army, TileCategory } from './data/types';
import { APP_VERSION_FULL } from './version';
import { armySearchHaystack, getArmyDescription, getArmyDisplayName } from './i18n/display';
import { useLocale } from './i18n/locale';
import { LanguageSwitcher } from './i18n/LanguageSwitcher';
import type { UiMessageKey } from './i18n/ui';
import { ArmyView } from './components/ArmyView';
import { CounterMode } from './components/CounterMode';
import { DeckSetup } from './components/DeckSetup';
import { DrawMode } from './components/DrawMode';
import { TileFlipMode } from './components/TileFlipMode';

type Screen = 'home' | 'army' | 'setup' | 'draw' | 'counter' | 'selection-ready';
type FeatureMode = 'randomizer' | 'counter' | 'tileflip' | 'selection';

/** Serialized app state for History API — lets mobile Back step inside the SPA instead of closing the tab. */
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

function parseAppHistoryState(raw: unknown): AppHistoryStateV1 | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (o.v !== 1) return null;
  const screen = o.screen;
  const featureMode = o.featureMode;
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
}

function findArmy(id: string | null): Army | null {
  if (!id) return null;
  return armies.find((a) => a.id === id) ?? null;
}

export default function App() {
  const { t, locale } = useLocale();

  useEffect(() => {
    document.title = t('appHtmlTitle');
  }, [t]);

  const [screen, setScreen] = useState<Screen>('home');
  const [selectedArmy, setSelectedArmy] = useState<Army | null>(null);
  const [deckCode, setDeckCode] = useState<string>('');
  const [featureMode, setFeatureMode] = useState<FeatureMode>('randomizer');
  const [counterArmies, setCounterArmies] = useState<[Army | null, Army | null]>([null, null]);
  const [selectionArmies, setSelectionArmies] = useState<[Army | null, Army | null]>([null, null]);

  const applyingPopStateRef = useRef(false);

  const goHome = useCallback(() => {
    setScreen('home');
    setSelectedArmy(null);
    setDeckCode('');
    setCounterArmies([null, null]);
    setSelectionArmies([null, null]);
  }, []);

  const applyHistorySnapshot = useCallback((s: AppHistoryStateV1) => {
    let nextScreen = s.screen;
    const sel = findArmy(s.selectedArmyId);
    const ca = findArmy(s.counterAId);
    const cb = findArmy(s.counterBId);
    const sa = findArmy(s.selectionAId);
    const sb = findArmy(s.selectionBId);
    if (nextScreen === 'army' || nextScreen === 'setup' || nextScreen === 'draw') {
      if (!sel) nextScreen = 'home';
    }
    if (nextScreen === 'draw' && !s.deckCode) nextScreen = 'setup';
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

  const selectArmy = (army: Army) => {
    if (featureMode === 'counter') {
      setCounterArmies(([a, b]) => {
        if (!a) return [army, null];
        if (!b && army.id !== a.id) return [a, army];
        return [a, b];
      });
      return;
    }
    if (featureMode === 'selection') {
      setSelectionArmies(([a, b]) => {
        if (a?.id === army.id) return [b, null];
        if (b?.id === army.id) return [a, null];
        if (!a) return [army, null];
        if (!b) return [a, army];
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

  /** Sync History API so Back/Forward map to app state (especially mobile system Back). */
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      applyingPopStateRef.current = true;
      const parsed = parseAppHistoryState(e.state);
      if (!parsed) {
        goHome();
        return;
      }
      applyHistorySnapshot(parsed);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [goHome, applyHistorySnapshot]);

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

  /** Reset scroll when switching home feature tabs or navigating between screens (same document scroll). */
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [screen, featureMode]);

  const handleStartDraw = () => setScreen('setup');

  const handleSetupStart = (code: string) => {
    setDeckCode(code);
    setScreen('draw');
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col">
      {/* Nav bar */}
      <header className="sticky top-0 z-20 border-b border-stone-800 bg-stone-950/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <button
            onClick={goHome}
            className="flex items-center gap-2 font-bold text-stone-100 hover:text-white transition-colors min-w-0"
          >
            <span className="text-lg shrink-0">🎲</span>
            <span className="hidden sm:inline truncate">{t('brandFull')}</span>
            <span className="sm:hidden truncate">{t('brandShort')}</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3 min-w-0 justify-end">
            <LanguageSwitcher />
            {(selectedArmy ||
              (screen === 'counter' && counterArmies[0] && counterArmies[1])) && (
              <nav className="flex items-center gap-2 text-sm text-stone-500 flex-wrap justify-end">
                <button onClick={goHome} className="hover:text-stone-300 transition-colors">
                  {t('navArmies')}
                </button>
                {screen === 'counter' && counterArmies[0] && counterArmies[1] ? (
                  <>
                    <span>/</span>
                    <span style={{ color: counterArmies[0].accentColor }}>
                      {getArmyDisplayName(counterArmies[0], locale)}
                    </span>
                    <span className="text-stone-600">{t('navVs')}</span>
                    <span style={{ color: counterArmies[1].accentColor }}>
                      {getArmyDisplayName(counterArmies[1], locale)}
                    </span>
                    <span>/</span>
                    <span className="text-stone-400">{t('navTileCounter')}</span>
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
                        {getArmyDisplayName(selectedArmy, locale)}
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
                                {t('navSetup')}
                              </button>
                              <span>/</span>
                              <span style={{ color: selectedArmy.accentColor }}>{t('navDraw')}</span>
                            </>
                          ) : (
                            <span style={{ color: selectedArmy.accentColor }}>{t('navSetup')}</span>
                          )}
                        </>
                      )}
                      {screen === 'counter' && (
                        <>
                          <span>/</span>
                          <span style={{ color: selectedArmy.accentColor }}>{t('navTileCounter')}</span>
                        </>
                      )}
                    </>
                  )
                )}
              </nav>
            )}
          </div>
        </div>
      </header>

      <main>
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
        {screen === 'selection-ready' && selectionArmies[0] && selectionArmies[1] && (
          <ArmySelectionReadyView armies={[selectionArmies[0], selectionArmies[1]]} />
        )}
      </main>

      <footer className="mt-auto border-t border-stone-800 py-4">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-sm text-stone-500">
          <span>{t('footerAuthor')}</span>
          <span className="hidden sm:inline">·</span>
          <span>{t('footerVersion', { version: APP_VERSION_FULL })}</span>
        </div>
      </footer>
    </div>
  );
}

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
  const { t } = useLocale();
  const [armySearch, setArmySearch] = useState('');
  const filteredArmies = useMemo(() => {
    const q = armySearch.trim().toLowerCase();
    if (!q) return armies;
    return armies.filter((a) => armySearchHaystack(a).includes(q));
  }, [armies, armySearch]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-100 tracking-tight">
          {t('homeHeroTitle')}
        </h1>
        <p className="text-stone-500 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
          {t('homeHeroSubtitle')}
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
          {t('homeFeatureRandomizer')}
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
          {t('homeFeatureCounter')}
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
          {t('homeFeatureTileflip')}
        </button>
        <button
          onClick={() => onFeatureModeChange('selection')}
          className={[
            'px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 border',
            featureMode === 'selection'
              ? 'bg-stone-700 border-stone-500 text-stone-100'
              : 'border-stone-700 text-stone-500 hover:border-stone-600 hover:text-stone-300',
          ].join(' ')}
        >
          {t('homeFeatureSelection')}
        </button>
      </div>

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
            {featureMode === 'counter' && (
              <p className="text-stone-400 text-sm text-center">
                {!counterArmies[0] && t('homeCounterStep1')}
                {counterArmies[0] && !counterArmies[1] && (
                  <>
                    {t('homeCounterStep2Prefix')}
                    <strong className="text-stone-300">{t('homeCounterStep2Emphasis')}</strong>
                    {t('homeCounterStep2Suffix')}
                  </>
                )}
              </p>
            )}
            {featureMode === 'selection' && (
              <div className="space-y-4">
                <p className="text-stone-400 text-sm text-center">
                  {!selectionArmies[0] && t('homeSelectionStep1')}
                  {selectionArmies[0] && !selectionArmies[1] && t('homeSelectionStep2')}
                  {selectionArmies[0] && selectionArmies[1] && t('homeSelectionComplete')}
                </p>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={onSelectionReady}
                    disabled={!selectionArmies[0] || !selectionArmies[1]}
                    className={[
                      'rounded-xl px-5 py-3 text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30',
                      selectionArmies[0] && selectionArmies[1]
                        ? 'bg-amber-600 text-white hover:brightness-110 active:scale-95'
                        : 'cursor-not-allowed border border-stone-700 bg-stone-900 text-stone-500',
                    ].join(' ')}
                  >
                    {t('homeSelectionReady')}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="max-w-md mx-auto w-full">
            <label htmlFor="army-search" className="sr-only">
              {t('homeFilterLabel')}
            </label>
            <input
              id="army-search"
              type="search"
              value={armySearch}
              onChange={(e) => setArmySearch(e.target.value)}
              placeholder={t('homeSearchPlaceholder')}
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-lg border border-stone-600 bg-stone-900/80 px-3 py-2 text-sm text-stone-100 placeholder:text-stone-500 shadow-inner focus:border-amber-600/60 focus:outline-none focus:ring-2 focus:ring-amber-500/25"
            />
          </div>

          <div
            className={
              featureMode === 'selection'
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'
                : 'grid grid-cols-1 sm:grid-cols-2 gap-4'
            }
          >
            {filteredArmies.length === 0 ? (
              <p className="col-span-full text-center text-stone-500 text-sm py-6">
                {t('homeNoMatch', { query: armySearch.trim() })}
              </p>
            ) : (
              filteredArmies.map((army) => {
                const counterPickFirst = counterArmies[0]?.id === army.id;
                const counterBlockDuplicate =
                  featureMode === 'counter' &&
                  Boolean(counterArmies[0]) &&
                  !counterArmies[1] &&
                  counterArmies[0]!.id === army.id;
                const selectionIndex = selectionArmies[0]?.id === army.id ? 1 : selectionArmies[1]?.id === army.id ? 2 : null;
                const selectionAtLimit =
                  featureMode === 'selection' &&
                  !selectionIndex &&
                  Boolean(selectionArmies[0]) &&
                  Boolean(selectionArmies[1]);
                return (
                  featureMode === 'selection' ? (
                    <ArmySelectionCard
                      key={army.id}
                      army={army}
                      disabled={selectionAtLimit}
                      selectedIndex={selectionIndex}
                      onClick={() => onSelectArmy(army)}
                    />
                  ) : (
                    <ArmyCard
                      key={army.id}
                      army={army}
                      disabled={counterBlockDuplicate}
                      selectedRing={
                        featureMode === 'counter' && counterPickFirst && Boolean(counterArmies[0])
                      }
                      onClick={() => onSelectArmy(army)}
                    />
                  )
                );
              })
            )}
            {featureMode !== 'selection' && (
              <a
                href="https://www.siepomaga.pl/na-pomoc-dla-julki"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-dashed border-stone-600 p-6 flex flex-col items-center justify-center text-center text-stone-400 hover:border-stone-500 hover:text-stone-300 transition-all duration-200 group"
              >
                <span className="text-sm font-medium group-hover:underline">{t('homeDonation')}</span>
              </a>
            )}
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

const HOME_DECK_LABEL_KEY: Record<
  'instant' | 'soldier' | 'implant' | 'module' | 'foundation',
  UiMessageKey
> = {
  instant: 'homeArmyDeckInstant',
  soldier: 'homeArmyDeckSoldier',
  implant: 'homeArmyDeckImplant',
  module: 'homeArmyDeckModule',
  foundation: 'homeArmyDeckFoundation',
};

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
  const { t, locale } = useLocale();
  const displayName = getArmyDisplayName(army, locale);
  const description = getArmyDescription(army, locale);
  const categoryBadges = [
    {
      category: 'instant' as const,
      className: 'px-2 py-0.5 rounded bg-red-950/60 border border-red-500/30 text-red-400',
    },
    {
      category: 'soldier' as const,
      className: 'px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/30 text-blue-400',
    },
    {
      category: 'implant' as const,
      className: 'px-2 py-0.5 rounded bg-violet-950/60 border border-violet-500/30 text-violet-400',
    },
    {
      category: 'module' as const,
      className: 'px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400',
    },
    {
      category: 'foundation' as const,
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
              {displayName}
            </h2>
            <p className="text-stone-400 text-sm mt-1 leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>
          {army.hqImageUrl && (
            <img
              src={army.hqImageUrl}
              alt={`${displayName} HQ`}
              className="shrink-0 w-20 h-20 object-contain"
            />
          )}
        </div>

        {categoryBadges.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-stone-500">
            {categoryBadges.map(({ category, className, count }) => (
              <span key={category} className={className}>
                {t(HOME_DECK_LABEL_KEY[category], { n: count })}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

function ArmySelectionCard({
  army,
  onClick,
  disabled = false,
  selectedIndex,
}: {
  army: Army;
  onClick: () => void;
  disabled?: boolean;
  selectedIndex: 1 | 2 | null;
}) {
  const { locale } = useLocale();
  const displayName = getArmyDisplayName(army, locale);

  return (
    <button
      type="button"
      onClick={() => {
        if (!disabled || selectedIndex) onClick();
      }}
      disabled={disabled && !selectedIndex}
      className={[
        'relative overflow-hidden rounded-2xl border border-stone-700 p-4 text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20',
        selectedIndex
          ? 'scale-[1.02] border-amber-500/70 ring-2 ring-amber-500/70 ring-offset-2 ring-offset-stone-950'
          : disabled
            ? 'cursor-not-allowed opacity-40'
            : 'hover:border-stone-500 hover:scale-[1.02] active:scale-95',
      ].join(' ')}
      style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}
    >
      <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: army.accentColor }} />
      {selectedIndex && (
        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-amber-300/40 bg-amber-500 text-sm font-black text-amber-950 shadow-lg shadow-amber-900/30">
          {selectedIndex}
        </div>
      )}
      <div className="flex min-h-40 flex-col items-center justify-center gap-3 pt-2">
        {army.hqImageUrl ? (
          <img src={army.hqImageUrl} alt={`${displayName} HQ`} className="h-24 w-24 object-contain" />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-amber-950/40 text-4xl">
            🏛
          </div>
        )}
        <span className="text-sm font-bold leading-tight text-stone-100">{displayName}</span>
      </div>
    </button>
  );
}

function ArmySelectionReadyView({ armies }: { armies: [Army, Army] }) {
  const { t, locale } = useLocale();
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div
        className="rounded-2xl border border-stone-700 overflow-hidden text-center"
        style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}
      >
        <div className="h-2 bg-amber-500" />
        <div className="p-8 sm:p-10 space-y-5">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-stone-100">
            {t('selectionReadyTitle')}
          </h1>
          <p className="text-stone-400 max-w-2xl mx-auto leading-relaxed">
            {t('selectionReadySubtitle')}
          </p>
          <button
            type="button"
            onClick={() => setRevealed((current) => !current)}
            className="rounded-xl bg-amber-600 px-6 py-3 font-bold text-white transition-all duration-200 hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            {t(revealed ? 'selectionHideButton' : 'selectionRevealButton')}
          </button>
        </div>
      </div>

      {revealed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {armies.map((army, index) => (
            (() => {
              const markerClassName =
                index === 0
                  ? 'border-stone-100/70 bg-stone-50 text-stone-950 shadow-stone-100/10'
                  : 'border-stone-500/60 bg-stone-700/40 text-stone-200 shadow-stone-950/40';

              return (
            <div
              key={army.id}
              className="rounded-2xl border border-stone-700 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}
            >
              <div className="h-1.5" style={{ background: army.accentColor }} />
              <div className="p-6 flex flex-col items-center text-center gap-5">
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-stretch">
                  <div
                    className={[
                      'flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl border text-6xl font-black shadow-lg',
                      markerClassName,
                    ].join(' ')}
                  >
                    {index + 1}
                  </div>
                  {army.hqImageUrl ? (
                    <img
                      src={army.hqImageUrl}
                      alt={`${getArmyDisplayName(army, locale)} HQ`}
                      className="h-32 w-32 shrink-0 object-contain"
                    />
                  ) : (
                    <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-amber-950/40 text-5xl">
                      🏛
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <h2
                    className="text-2xl font-bold tracking-tight"
                    style={{ color: army.accentColor }}
                  >
                    {getArmyDisplayName(army, locale)}
                  </h2>
                </div>
              </div>
            </div>
              );
            })()
          ))}
        </div>
      )}
    </div>
  );
}
