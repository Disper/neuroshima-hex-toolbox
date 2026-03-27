import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { UiMessageKey } from './ui';
import { UI_STRINGS } from './ui';
import type { Locale } from './localeTypes';

export type { Locale } from './localeTypes';

const STORAGE_KEY = 'nh-toolbox-locale';

function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en';
  const lang = navigator.language?.split('-')[0]?.toLowerCase();
  return lang === 'pl' ? 'pl' : 'en';
}

function readStoredLocale(): Locale | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'en' || raw === 'pl') return raw;
  } catch {
    /* ignore */
  }
  return null;
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: UiMessageKey, params?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale() ?? detectBrowserLocale());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = locale === 'pl' ? 'pl' : 'en';
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);

  const t = useCallback(
    (key: UiMessageKey, params?: Record<string, string | number>) => {
      const table = UI_STRINGS[locale] as Record<string, string>;
      let s = table[key] ?? (UI_STRINGS.en as Record<string, string>)[key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          s = s.replaceAll(`{${k}}`, String(v));
        }
      }
      return s;
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
