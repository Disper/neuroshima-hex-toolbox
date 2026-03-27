import { useCallback, useEffect, useRef, useState } from 'react';

import { useLocale } from '../i18n/locale';
import imgVulture from '../assets/beasts/bestie-sep.png';
import imgTails from '../assets/beasts/bestie-sztab.png';

type FlipPhase = 'idle' | 'animating' | 'done';
type Winner = 'vulture' | 'tails';

const WIN_SCALE = 1.2;
const LOSE_SCALE = 0.78;
const ANIM_MS = 3000;

/** Max pixel offset and degrees — kept small for a gentle shake */
const SHAKE_PX = 6;
const SHAKE_ROT = 2.5;

export function TileFlipMode() {
  const { t } = useLocale();
  const [phase, setPhase] = useState<FlipPhase>('idle');
  const [winner, setWinner] = useState<Winner | null>(null);
  const [transformVulture, setTransformVulture] = useState('scale(1)');
  const [transformTails, setTransformTails] = useState('scale(1)');

  const winnerRef = useRef<Winner | null>(null);
  const rafRef = useRef<number>(0);

  const runAnimation = useCallback(() => {
    winnerRef.current = Math.random() < 0.5 ? 'vulture' : 'tails';
    setWinner(null);
    setTransformVulture('scale(1)');
    setTransformTails('scale(1)');
    setPhase('animating');

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed < ANIM_MS) {
        const t = elapsed * 0.001;
        // Slow, smooth Lissajous-style shake (no random jitter)
        const vx = Math.sin(t * 2.1) * SHAKE_PX;
        const vy = Math.cos(t * 1.85) * (SHAKE_PX * 0.75);
        const vr = Math.sin(t * 2.4) * SHAKE_ROT;
        const tx = Math.sin(t * 1.95 + 1.1) * SHAKE_PX;
        const ty = Math.cos(t * 2.05 + 0.7) * (SHAKE_PX * 0.75);
        const tr = Math.sin(t * 2.35 + 0.9) * SHAKE_ROT;
        setTransformVulture(`translate(${vx}px, ${vy}px) rotate(${vr}deg) scale(1)`);
        setTransformTails(`translate(${tx}px, ${ty}px) rotate(${tr}deg) scale(1)`);
        rafRef.current = requestAnimationFrame(tick);
      } else {
        const w = winnerRef.current!;
        setWinner(w);
        setTransformVulture(`translate(0px, 0px) rotate(0deg) scale(${w === 'vulture' ? WIN_SCALE : LOSE_SCALE})`);
        setTransformTails(`translate(0px, 0px) rotate(0deg) scale(${w === 'tails' ? WIN_SCALE : LOSE_SCALE})`);
        setPhase('done');
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleFlip = () => {
    if (phase === 'animating') return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    runAnimation();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-100">{t('flipTitle')}</h2>
        <p className="text-stone-500 text-sm max-w-md mx-auto leading-relaxed">{t('flipSubtitle')}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
        <div className="flex flex-col items-center gap-3 w-full max-w-[200px]">
          <div
            className={[
              'w-full origin-center will-change-transform',
              phase === 'done' && winner === 'vulture' ? 'drop-shadow-[0_0_24px_rgba(132,204,22,0.4)]' : '',
              phase === 'done' && winner === 'tails' ? 'opacity-70' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{
              transform: transformVulture,
              transition:
                phase === 'animating'
                  ? 'none'
                  : 'transform 0.55s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.35s ease, filter 0.35s ease',
            }}
          >
            <div className="rounded-xl border border-lime-600/40 bg-stone-900/80 p-2 shadow-lg">
              <img
                src={imgVulture}
                alt={t('flipVulture')}
                className="w-full h-36 sm:h-40 object-contain"
                draggable={false}
              />
            </div>
          </div>
          <span className="text-sm font-semibold text-lime-200/90">{t('flipVulture')}</span>
        </div>

        <div className="hidden sm:flex text-stone-600 text-2xl font-light select-none" aria-hidden>
          |
        </div>

        <div className="flex flex-col items-center gap-3 w-full max-w-[200px]">
          <div
            className={[
              'w-full origin-center will-change-transform',
              phase === 'done' && winner === 'tails' ? 'drop-shadow-[0_0_24px_rgba(132,204,22,0.45)]' : '',
              phase === 'done' && winner === 'vulture' ? 'opacity-70' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{
              transform: transformTails,
              transition:
                phase === 'animating'
                  ? 'none'
                  : 'transform 0.55s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.35s ease, filter 0.35s ease',
            }}
          >
            <div className="rounded-xl border border-lime-600/40 bg-stone-900/80 p-2 shadow-lg">
              <img
                src={imgTails}
                alt={t('flipTails')}
                className="w-full h-36 sm:h-40 object-contain"
                draggable={false}
              />
            </div>
          </div>
          <span className="text-sm font-semibold text-lime-200/90">{t('flipTails')}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={handleFlip}
          disabled={phase === 'animating'}
          className={[
            'px-10 py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-white/25',
            phase === 'animating'
              ? 'bg-stone-700 text-stone-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-700 to-lime-700 text-white hover:brightness-110 active:scale-[0.98]',
          ].join(' ')}
        >
          {phase === 'animating' ? t('flipAnimating') : phase === 'done' ? t('flipAgain') : t('flipButton')}
        </button>

        {phase === 'done' && winner && (
          <p className="text-center text-stone-300 text-base">
            {t('flipResult')}{' '}
            <strong className={winner === 'vulture' ? 'text-lime-400' : 'text-emerald-400'}>
              {winner === 'vulture' ? t('flipVulture') : t('flipTails')}
            </strong>
          </p>
        )}
      </div>
    </div>
  );
}
