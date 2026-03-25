import { useState, useEffect } from 'react';
import type { TileDefinition, TileCategory } from '../data/types';

interface TileCardProps {
  tile: TileDefinition;
  /** Override displayed count (e.g. always show 1 for drawn instances) */
  count?: number;
  /** When true with count above 1, show "Name (count)" in the label instead of name + ×count badge */
  countInParentheses?: boolean;
  dimmed?: boolean;
  /** Compact mode for grids of many tiles */
  small?: boolean;
  /** Larger art area — e.g. DrawMode “Last Drawn” spotlight */
  spotlight?: boolean;
  /** Light red wash — e.g. Tile Counter “Drawn” pile */
  drawnOverlay?: boolean;
  onClick?: () => void;
}

const categoryConfig: Record<
  TileCategory,
  { label: string; border: string; badge: string; fallbackBg: string }
> = {
  hq: {
    label: 'HQ',
    border: 'border-amber-500/50',
    badge: 'bg-amber-500 text-amber-950',
    fallbackBg: 'bg-amber-950/60',
  },
  instant: {
    label: 'Instant',
    border: 'border-red-500/40',
    badge: 'bg-red-500 text-red-950',
    fallbackBg: 'bg-red-950/50',
  },
  soldier: {
    label: 'Soldier',
    border: 'border-blue-500/40',
    badge: 'bg-blue-500 text-blue-950',
    fallbackBg: 'bg-blue-950/50',
  },
  implant: {
    label: 'Implant',
    border: 'border-violet-500/40',
    badge: 'bg-violet-500 text-violet-950',
    fallbackBg: 'bg-violet-950/50',
  },
  foundation: {
    label: 'Foundation',
    border: 'border-slate-500/40',
    badge: 'bg-slate-500 text-slate-950',
    fallbackBg: 'bg-slate-950/50',
  },
  module: {
    label: 'Module',
    border: 'border-emerald-500/40',
    badge: 'bg-emerald-500 text-emerald-950',
    fallbackBg: 'bg-emerald-950/50',
  },
};

const categoryIcon: Record<TileCategory, string> = {
  hq: '🏛',
  instant: '⚡',
  soldier: '⚔',
  implant: '🧬',
  foundation: '🧱',
  module: '⚙',
};

export function TileCard({
  tile,
  count,
  countInParentheses,
  dimmed,
  small,
  spotlight,
  drawnOverlay,
  onClick,
}: TileCardProps) {
  const cfg = categoryConfig[tile.category];
  const displayCount = count ?? tile.count;
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [tile.id, tile.imageUrl, tile.imageOverlayLabel]);

  const hasImage = !!tile.imageUrl && !imgError;

  const imageBoxClass = small
    ? 'h-20'
    : spotlight
      ? 'h-44 sm:h-48'
      : 'h-32';
  const overlayTextClass = small
    ? 'text-base'
    : spotlight
      ? 'text-3xl sm:text-4xl'
      : 'text-2xl';

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={[
        'relative w-full rounded-xl border text-left transition-all duration-200 select-none overflow-hidden flex flex-col',
        cfg.border,
        'bg-stone-900',
        dimmed ? 'opacity-30 scale-95' : 'opacity-100 scale-100',
        onClick
          ? 'cursor-pointer hover:scale-105 hover:brightness-125 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30'
          : 'cursor-default',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Image area */}
      <div
        className={[
          'w-full flex items-center justify-center',
          hasImage ? '' : cfg.fallbackBg,
          small ? 'p-1' : 'p-2',
        ].join(' ')}
      >
        {hasImage ? (
          tile.imageOverlayLabel ? (
            <div
              className={[
                'relative w-full overflow-hidden rounded-lg bg-black',
                imageBoxClass,
              ].join(' ')}
            >
              <img
                src={tile.imageUrl}
                alt={tile.name}
                loading="lazy"
                onError={() => setImgError(true)}
                className="absolute inset-0 m-auto max-h-full max-w-full object-contain brightness-[0.2] contrast-90"
              />
              <div className="absolute inset-0 bg-black/65" aria-hidden />
              <span
                className={[
                  'absolute inset-0 flex items-center justify-center font-black tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]',
                  overlayTextClass,
                ].join(' ')}
              >
                {tile.imageOverlayLabel}
              </span>
            </div>
          ) : (
            <img
              src={tile.imageUrl}
              alt={tile.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className={['object-contain w-full', imageBoxClass].join(' ')}
            />
          )
        ) : (
          <div
            className={[
              'flex items-center justify-center text-stone-400',
              small ? 'h-20 text-3xl' : `${imageBoxClass} text-5xl`,
            ].join(' ')}
          >
            {categoryIcon[tile.category]}
          </div>
        )}
      </div>

      {/* Label bar */}
      <div className="px-2 py-1.5 flex items-center justify-between gap-1 border-t border-stone-700/60 bg-stone-950/60">
        <span
          className={[
            'font-semibold text-stone-100 leading-tight truncate',
            small ? 'text-xs' : 'text-sm',
          ].join(' ')}
          title={
            countInParentheses && displayCount > 1
              ? `${tile.name} (${displayCount})`
              : tile.name
          }
        >
          {countInParentheses && displayCount > 1
            ? `${tile.name} (${displayCount})`
            : tile.name}
        </span>
        {!countInParentheses && displayCount > 1 && (
          <span
            className={[
              'shrink-0 rounded-full font-bold leading-none',
              cfg.badge,
              'text-xs px-1.5 py-0.5',
            ].join(' ')}
          >
            ×{displayCount}
          </span>
        )}
      </div>

      {/* Category badge — only on full size */}
      {!small && (
        <div className="px-2 pb-2">
          <span className={['text-xs font-medium rounded px-1.5 py-0.5', cfg.badge].join(' ')}>
            {cfg.label}
          </span>
        </div>
      )}
      {drawnOverlay && (
        <div
          className="pointer-events-none absolute inset-0 rounded-xl bg-red-500/10 ring-inset ring-1 ring-red-400/20"
          aria-hidden
        />
      )}
    </button>
  );
}
