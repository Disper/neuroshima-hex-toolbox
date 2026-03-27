import { useLocale } from './locale';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();
  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-stone-700 bg-stone-900/80 px-1.5 py-0.5 text-xs"
      role="group"
      aria-label={t('langSwitcherAria')}
    >
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={[
          'px-2 py-0.5 rounded-md transition-colors',
          locale === 'en' ? 'bg-stone-600 text-stone-100 font-semibold' : 'text-stone-500 hover:text-stone-300',
        ].join(' ')}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale('pl')}
        className={[
          'px-2 py-0.5 rounded-md transition-colors',
          locale === 'pl' ? 'bg-stone-600 text-stone-100 font-semibold' : 'text-stone-500 hover:text-stone-300',
        ].join(' ')}
      >
        PL
      </button>
    </div>
  );
}
