import { useState, useCallback, useRef } from 'react';
import type { Army } from '../data/types';
import { useLocale } from '../i18n/locale';
import type { UiMessageKey } from '../i18n/ui';
import {
  generateIronGangDeckCode,
  IRON_GANG_ARMY_ID,
  IRON_GANG_DECK_CODE_LEN,
  parseIronGangDeckCode,
  type IronGangParseError,
} from '../utils/ironGangDeck';
import { generateCode, codeToSeed } from '../utils/rng';

const STANDARD_CODE_LEN = 6;

function ironGangErrorMessage(err: IronGangParseError, t: (k: UiMessageKey) => string): string {
  switch (err.kind) {
    case 'wrong-length':
      return t('deckIgErrorWrongLength');
    case 'invalid-seed':
      return t('deckIgErrorInvalidSeed');
    case 'invalid-suffix':
      return t('deckIgErrorInvalidSuffix');
    default:
      return t('deckErrorInvalid');
  }
}

interface DeckSetupProps {
  army: Army;
  onStart: (code: string) => void;
  onBack: () => void;
}

export function DeckSetup({ army, onStart, onBack }: DeckSetupProps) {
  const { t } = useLocale();
  const isIronGang = army.id === IRON_GANG_ARMY_ID;
  const codeLen = isIronGang ? IRON_GANG_DECK_CODE_LEN : STANDARD_CODE_LEN;

  const [code, setCode] = useState<string>(() =>
    isIronGang ? generateIronGangDeckCode() : generateCode()
  );
  const [inputValue, setInputValue] = useState('');
  const [mode, setMode] = useState<'new' | 'join'>('new');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRegenerate = useCallback(() => {
    setCode(isIronGang ? generateIronGangDeckCode() : generateCode());
    setCopied(false);
  }, [isIronGang]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const allowedChars = isIronGang
        ? /[^0123456789ABCDEFGHJKMNPQRSTUVWXYZ_]/g
        : /[^23456789ABCDEFGHJKMNPQRSTUVWXYZ_]/g;
      const val = e.target.value.toUpperCase().replace(allowedChars, '');
      setInputValue(val.slice(0, codeLen));
      setError('');
    },
    [codeLen, isIronGang]
  );

  const handleStart = useCallback(() => {
    if (mode === 'new') {
      onStart(code);
    } else {
      if (inputValue.length !== codeLen) {
        setError(t('deckErrorCodeLength', { len: codeLen }));
        inputRef.current?.focus();
        return;
      }
      if (isIronGang) {
        const { error: parseErr } = parseIronGangDeckCode(inputValue);
        if (parseErr) {
          setError(ironGangErrorMessage(parseErr, t));
          inputRef.current?.focus();
          return;
        }
      } else {
        const seed = codeToSeed(inputValue);
        if (seed === null) {
          setError(t('deckErrorInvalid'));
          inputRef.current?.focus();
          return;
        }
      }
      onStart(inputValue);
    }
  }, [mode, code, inputValue, codeLen, isIronGang, onStart, t]);

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-stone-400 hover:text-stone-100 transition-colors text-sm font-medium"
      >
        {t('deckBack')}
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-100">{t('deckTitle')}</h1>
        <p className="text-stone-400 text-sm mt-1">
          {isIronGang ? t('deckBlurbIronGang') : t('deckBlurbStandard')}
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex rounded-xl overflow-hidden border border-stone-700 p-1 gap-1 bg-stone-900">
        {(['new', 'join'] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setError('');
            }}
            className={[
              'flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
              mode === m
                ? 'text-stone-950 shadow'
                : 'text-stone-400 hover:text-stone-200',
            ].join(' ')}
            style={mode === m ? { background: army.accentColor } : undefined}
          >
            {m === 'new' ? t('deckModeNew') : t('deckModeJoin')}
          </button>
        ))}
      </div>

      {/* New deck panel */}
      {mode === 'new' && (
        <div className="rounded-2xl border border-stone-700 bg-stone-900 p-6 space-y-5">
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-3">
              {t('deckYourCode')}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex gap-1.5">
                {code.split('').map((char, i) => (
                  <div
                    key={i}
                    className={[
                      'w-10 h-12 rounded-lg border border-stone-600 bg-stone-800 flex items-center justify-center text-xl font-mono font-bold text-stone-100',
                      isIronGang && i === 6
                        ? 'ring-2 ring-amber-500/40 border-amber-600/50'
                        : '',
                    ].join(' ')}
                  >
                    {char}
                  </div>
                ))}
              </div>
            </div>
            {isIronGang && (
              <p className="text-xs text-stone-500 mt-3">{t('deckIronGang7thNote')}</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleRegenerate}
              className="flex-1 py-2.5 rounded-xl border border-stone-600 text-stone-300 hover:border-stone-400 hover:text-stone-100 transition-all text-sm font-medium"
            >
              {t('deckRegenerate')}
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 rounded-xl border border-stone-600 text-stone-300 hover:border-stone-400 hover:text-stone-100 transition-all text-sm font-medium"
            >
              {copied ? t('deckCopied') : t('deckCopy')}
            </button>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed">
            {t('deckShareBlurb')}
            {isIronGang ? t('deckShareBlurbIgSuffix') : ''}.
          </p>
        </div>
      )}

      {/* Join panel */}
      {mode === 'join' && (
        <div className="rounded-2xl border border-stone-700 bg-stone-900 p-6 space-y-4">
          <div>
            <label
              htmlFor="code-input"
              className="text-xs text-stone-500 uppercase tracking-wider font-semibold block mb-3"
            >
              {t('deckEnterCode')}
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {Array.from({ length: codeLen }).map((_, i) => (
                <div
                  key={i}
                  className={[
                    'w-10 h-12 rounded-lg border flex items-center justify-center text-xl font-mono font-bold transition-colors',
                    inputValue[i]
                      ? 'border-stone-500 bg-stone-800 text-stone-100'
                      : 'border-stone-700 bg-stone-800/50 text-stone-600',
                    isIronGang && i === 6 ? 'ring-2 ring-amber-500/30' : '',
                  ].join(' ')}
                >
                  {inputValue[i] ?? '·'}
                </div>
              ))}
            </div>
            <input
              id="code-input"
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={isIronGang ? t('deckPlaceholderIg') : t('deckPlaceholderStd')}
              maxLength={codeLen}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              className="mt-3 w-full bg-stone-800 border border-stone-600 rounded-xl px-4 py-2.5 text-stone-100 text-base font-mono tracking-widest uppercase placeholder:text-stone-600 focus:outline-none focus:border-stone-400 transition-colors"
            />
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            {t('deckJoinBlurb')}
            {isIronGang ? t('deckJoinBlurbIg') : '.'}
          </p>
        </div>
      )}

      {/* Start button */}
      <button
        onClick={handleStart}
        className="w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-200 hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/30"
        style={{ background: army.accentColor, color: '#fff' }}
      >
        {t('deckStartDrawing')}
      </button>
    </div>
  );
}
