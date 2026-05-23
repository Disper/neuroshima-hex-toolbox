import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale } from '../i18n/locale';
import { RELEASE_NOTES, RELEASE_NOTES_DISPLAY_COUNT } from '../releaseNotes';
import { APP_VERSION_FULL } from '../version';

export function FooterVersionNotes() {
  const { locale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(
    typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches
  );

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onDocPointer = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (rootRef.current && target && !rootRef.current.contains(target)) {
        close();
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onDocPointer);
    document.addEventListener('touchstart', onDocPointer, { passive: true });
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocPointer);
      document.removeEventListener('touchstart', onDocPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  const notes = RELEASE_NOTES.slice(0, RELEASE_NOTES_DISPLAY_COUNT);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => hoverRef.current && setOpen(true)}
      onMouseLeave={() => hoverRef.current && setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={t('footerReleaseNotesAria')}
        className="rounded px-0.5 text-stone-500 underline decoration-stone-700 decoration-dotted underline-offset-2 transition-colors hover:text-stone-300 hover:decoration-stone-500 focus:outline-none focus:ring-2 focus:ring-white/20"
      >
        {t('footerVersion', { version: APP_VERSION_FULL })}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label={t('footerReleaseNotesTitle')}
          className="absolute bottom-full left-1/2 z-50 mb-2 w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-stone-700 bg-stone-900 px-3 py-3 text-left shadow-xl shadow-black/40"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2.5">
            {t('footerReleaseNotesTitle')}
          </p>
          <ul className="space-y-2.5">
            {notes.map((note) => (
              <li key={note.version} className="text-xs leading-relaxed">
                <span className="font-semibold tabular-nums text-stone-200">v{note.version}</span>
                <span className="text-stone-600"> · </span>
                <span className="text-stone-500 tabular-nums">{note.date}</span>
                <p className="mt-0.5 text-stone-400">
                  {locale === 'pl' ? note.summaryPl : note.summaryEn}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
