import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { flushSync } from 'react-dom';
import { armies } from './data/armies';
import type { Army, TileCategory } from './data/types';
import { NH_OFFLINE_READY_EVENT, hardRefreshApp } from './pwa-register';
import { armySearchHaystack, getArmyDescription, getArmyDisplayName } from './i18n/display';
import { useLocale } from './i18n/locale';
import { LanguageSwitcher } from './i18n/LanguageSwitcher';
import type { UiMessageKey } from './i18n/ui';
import { ArmyView } from './components/ArmyView';
import { CounterMode } from './components/CounterMode';
import { DeckSetup } from './components/DeckSetup';
import { DrawMode } from './components/DrawMode';
import { FooterVersionNotes } from './components/FooterVersionNotes';
import { TileFlipMode } from './components/TileFlipMode';
import { RandomMatchupResultScreen } from './components/RandomMatchupResultScreen';

type Screen = 'home' | 'army' | 'setup' | 'draw' | 'counter' | 'selection-ready' | 'random-matchup-result';
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
  randomMatchupAId: string | null;
  randomMatchupBId: string | null;
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
}

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

export default function App() {
  const { t, locale } = useLocale();

  useEffect(() => {
    document.title = t('appHtmlTitle');
  }, [t]);

  const [screen, setScreen] = useState<Screen>('home');
  const [selectedArmy, setSelectedArmy] = useState<Army | null>(null);
  const [deckCode, setDeckCode] = useState<string>('');
  const [featureMode, setFeatureMode] = useState<FeatureMode>('counter');
  const [counterArmies, setCounterArmies] = useState<[Army | null, Army | null]>([null, null]);
  const [selectionArmies, setSelectionArmies] = useState<[Army | null, Army | null]>([null, null]);
  const [randomMatchupArmies, setRandomMatchupArmies] = useState<[Army | null, Army | null]>([null, null]);

  const applyingPopStateRef = useRef(false);
  const rerollingRef = useRef(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleHardRefresh = useCallback(() => {
    if (refreshing) return;
    setRefreshing(true);
    void hardRefreshApp().catch(() => {
      setRefreshing(false);
      window.location.reload();
    });
  }, [refreshing]);

  useEffect(() => {
    if (!import.meta.env.PROD) return;
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const apply = () => setOfflineReady(true);

    if (window.__NH_OFFLINE_READY__) {
      apply();
      return;
    }

    window.addEventListener(NH_OFFLINE_READY_EVENT, apply, { passive: true });
    return () => window.removeEventListener(NH_OFFLINE_READY_EVENT, apply);
  }, []);

  const goHome = useCallback(() => {
    setScreen('home');
    setSelectedArmy(null);
    setDeckCode('');
    setCounterArmies([null, null]);
    setSelectionArmies([null, null]);
    setRandomMatchupArmies([null, null]);
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
    if (cur === null || cur === undefined || rerollingRef.current) {
      rerollingRef.current = false;
      window.history.replaceState(snapshot, '');
      return;
    }
    window.history.pushState(snapshot, '');
  }, [screen, featureMode, selectedArmyId, deckCode, counterAId, counterBId, selectionAId, selectionBId, randomMatchupAId, randomMatchupBId]);

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
            <img
              src={`${import.meta.env.BASE_URL}app-icon-source.png`}
              alt=""
              width={32}
              height={32}
              decoding="async"
              className="h-8 w-8 shrink-0 rounded-lg object-cover shadow-sm ring-1 ring-white/10"
            />
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
        {screen === 'random-matchup-result' && randomMatchupArmies[0] && randomMatchupArmies[1] && (
          <RandomMatchupResultScreen
            armies={[randomMatchupArmies[0], randomMatchupArmies[1]]}
            onReroll={() => {
              rerollingRef.current = true;
              const [a, b] = pickTwoArmies();
              setRandomMatchupArmies([a, b]);
            }}
            onBack={() => {
              setScreen('home');
              setRandomMatchupArmies([null, null]);
            }}
          />
        )}
      </main>

      <footer className="mt-auto border-t border-stone-800 py-4">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-x-2 sm:gap-y-1 text-sm text-stone-500">
          <span>
            {(() => {
              const parts = t('footerAuthor', { author: '\u0000' }).split('\u0000');
              return (
                <>
                  {parts[0]}
                  <a
                    href="https://disper.github.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-300 underline decoration-stone-600 underline-offset-2 transition-colors hover:text-amber-300 hover:decoration-amber-400/70"
                  >
                    Disper
                  </a>
                  {parts[1] ?? ''}
                </>
              );
            })()}
          </span>
          <span className="hidden sm:inline">·</span>
          <FooterVersionNotes />
          {offlineReady && (
            <>
              <span className="hidden sm:inline">·</span>
              <span
                role="status"
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-950/35 px-2.5 py-1 text-xs font-medium text-emerald-200/95"
              >
                <svg
                  className="h-3.5 w-3.5 shrink-0 text-emerald-400/95"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {t('footerOfflineBadge')}
              </span>
            </>
          )}
          <span className="hidden sm:inline">·</span>
          <button
            type="button"
            onClick={handleHardRefresh}
            disabled={refreshing}
            aria-label={t('footerHardRefreshAria')}
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-600/50 bg-stone-900/50 px-2.5 py-1 text-xs font-medium text-stone-300 transition-colors hover:border-stone-500 hover:text-stone-100 active:scale-95 disabled:opacity-60 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <svg
              className={['h-3.5 w-3.5 shrink-0', refreshing ? 'animate-spin' : ''].join(' ')}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24" />
              <path d="M21 3v6h-6" />
            </svg>
            {t('footerHardRefresh')}
          </button>
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
  const { t } = useLocale();
  const [armySearch, setArmySearch] = useState('');
  const armySearchRef = useRef<HTMLInputElement>(null);
  const filteredArmies = useMemo(() => {
    const q = armySearch.trim().toLowerCase();
    if (!q) return armies;
    return armies.filter((a) => armySearchHaystack(a).includes(q));
  }, [armies, armySearch]);

  const focusArmySearchInput = () => {
    const input =
      armySearchRef.current ??
      (document.getElementById('army-search') as HTMLInputElement | null);
    if (!input) return;
    input.scrollIntoView({ behavior: 'auto', block: 'start' });
    input.focus({ preventScroll: true });
  };

  const handleSelectArmy = (army: Army) => {
    const shouldFocusSearch =
      featureMode === 'counter' && !counterArmies[0] && !counterArmies[1];

    flushSync(() => {
      if (featureMode === 'counter' || featureMode === 'selection') {
        setArmySearch('');
      }
      onSelectArmy(army);
    });

    if (shouldFocusSearch) {
      focusArmySearchInput();
    }
  };

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
        {HOME_FEATURE_MODES.map((mode) => (
          <button
            key={mode}
            onClick={() => onFeatureModeChange(mode)}
            className={[
              'px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 border',
              featureMode === mode
                ? 'bg-stone-700 border-stone-500 text-stone-100'
                : 'border-stone-700 text-stone-500 hover:border-stone-600 hover:text-stone-300',
            ].join(' ')}
          >
            {t(HOME_FEATURE_MODE_LABELS[mode])}
          </button>
        ))}
      </div>

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
              ref={armySearchRef}
              id="army-search"
              type="text"
              inputMode="search"
              enterKeyHint="search"
              value={armySearch}
              onChange={(e) => setArmySearch(e.target.value)}
              placeholder={t('homeSearchPlaceholder')}
              autoComplete="off"
              spellCheck={false}
              style={{ scrollMarginTop: '72px' }}
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
                      onClick={() => handleSelectArmy(army)}
                    />
                  ) : (
                    <ArmyCard
                      key={army.id}
                      army={army}
                      disabled={counterBlockDuplicate}
                      preventFocusSteal={featureMode === 'counter' && !counterArmies[1]}
                      selectedRing={
                        featureMode === 'counter' && counterPickFirst && Boolean(counterArmies[0])
                      }
                      onClick={() => handleSelectArmy(army)}
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
  preventFocusSteal = false,
}: {
  army: Army;
  onClick: () => void;
  disabled?: boolean;
  selectedRing?: boolean;
  preventFocusSteal?: boolean;
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

  const cardClassName = [
    'text-left rounded-2xl border border-stone-700 overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 group w-full',
    disabled
      ? 'opacity-40 cursor-not-allowed'
      : 'hover:border-stone-500 hover:scale-[1.02] active:scale-95 cursor-pointer',
    selectedRing ? 'ring-2 ring-amber-500/70 ring-offset-2 ring-offset-stone-950' : '',
  ].join(' ');
  const cardStyle = { background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' };

  const activate = () => {
    if (!disabled) onClick();
  };

  const cardBody = (
    <>
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
    </>
  );

  if (preventFocusSteal) {
    return (
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        onClick={activate}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activate();
          }
        }}
        className={cardClassName}
        style={cardStyle}
      >
        {cardBody}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={activate}
      disabled={disabled}
      className={cardClassName}
      style={cardStyle}
    >
      {cardBody}
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
