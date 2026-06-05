import { useLocale } from '../i18n/locale';
import { getArmyDisplayName } from '../i18n/display';
import type { Army } from '../data/types';

export function RandomMatchupResultScreen({
  armies,
  onReroll,
  onBack,
}: {
  armies: [Army, Army];
  onReroll: () => void;
  onBack: () => void;
}) {
  const { t, locale } = useLocale();
  const [army0, army1] = armies;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div
        className="rounded-2xl border border-stone-700 overflow-hidden text-center"
        style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}
      >
        <div className="h-2 bg-amber-500" />
        <div className="p-8 sm:p-10 space-y-5">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-100">
            {t('randomMatchupResultTitle')}
          </h1>
          <p className="text-stone-400 max-w-2xl mx-auto leading-relaxed">
            {t('randomMatchupResultSubtitle')}
          </p>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto">
            {([army0, army1] as [Army, Army]).map((army, index) => (
              <div
                key={army.id}
                className="rounded-xl border border-stone-700 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)' }}
              >
                <div className="h-1.5" style={{ background: army.accentColor }} />
                <div className="p-4 flex flex-col items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    {index === 0 ? t('randomMatchupPlayer1') : t('randomMatchupPlayer2')}
                  </span>
                  {army.hqImageUrl ? (
                    <img
                      src={army.hqImageUrl}
                      alt={`${getArmyDisplayName(army, locale)} HQ`}
                      className="h-20 w-20 object-contain"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-amber-950/40 text-4xl">
                      🏛
                    </div>
                  )}
                  <span
                    className="text-sm font-bold leading-tight text-center"
                    style={{ color: army.accentColor }}
                  >
                    {getArmyDisplayName(army, locale)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={onReroll}
              className="rounded-xl bg-amber-600 px-6 py-3 font-bold text-white transition-all duration-200 hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              {t('randomMatchupReroll')}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-stone-600 bg-stone-900 px-6 py-3 font-semibold text-stone-300 transition-all duration-200 hover:border-stone-500 hover:text-stone-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              {t('randomMatchupBack')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
