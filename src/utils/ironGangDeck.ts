import type { TileInstance } from './deck';
import { codeToSeed, seedToCode } from './rng';

export const IRON_GANG_ARMY_ID = 'iron-gang';

/** How Hook interacts with the random deck (Iron Gang random mode only). */
const TILE_HOOK = 'ig-hook';
const TILE_DOUBLE_MOVE = 'ig-double-move';
const TILE_ORDER = 'ig-order';
const TILE_FANATIC = 'ig-fanatic';
const TILE_RANGED_NETTER = 'ig-ranged-netter';
const TILE_LUMBERJACK = 'ig-lumberjack';
const TILE_MOUNTAIN = 'ig-mountain';
const TILE_MOTORCYCLIST = 'ig-motorcyclist';
const TILE_OFFICER = 'ig-officer';
const TILE_BOSS = 'ig-boss';

const HOOK_REPLACEMENT_SPECS = [
  { suffix: '1', replacedTileId: TILE_MOUNTAIN, label: 'Mountain', weight: 1 },
  { suffix: '2', replacedTileId: TILE_BOSS, label: 'Boss', weight: 1 },
  { suffix: '3', replacedTileId: TILE_OFFICER, label: 'Officer', weight: 2 },
  { suffix: '4', replacedTileId: TILE_ORDER, label: 'Order', weight: 2 },
  { suffix: '5', replacedTileId: TILE_MOTORCYCLIST, label: 'Biker', weight: 2 },
  { suffix: '6', replacedTileId: TILE_DOUBLE_MOVE, label: 'Doubled Move', weight: 1 },
  { suffix: '7', replacedTileId: TILE_FANATIC, label: 'Fanatic', weight: 1 },
  { suffix: '8', replacedTileId: TILE_RANGED_NETTER, label: 'Ranged Net Fighter', weight: 1 },
  { suffix: '9', replacedTileId: TILE_LUMBERJACK, label: 'Lumberjack', weight: 1 },
] as const;

type IronGangHookReplacementTileId = (typeof HOOK_REPLACEMENT_SPECS)[number]['replacedTileId'];
type IronGangHookReplacementMode = `replace:${IronGangHookReplacementTileId}`;
export type IronGangHookMode = 'no-hook' | IronGangHookReplacementMode;

function modeFromReplacementTileId(tileId: IronGangHookReplacementTileId): IronGangHookReplacementMode {
  return `replace:${tileId}`;
}

function replacementTileIdFromMode(mode: IronGangHookMode): IronGangHookReplacementTileId | null {
  if (mode === 'no-hook') return null;
  return mode.slice('replace:'.length) as IronGangHookReplacementTileId;
}

function getReplacementSpecFromMode(mode: IronGangHookMode) {
  const replacedTileId = replacementTileIdFromMode(mode);
  return replacedTileId
    ? HOOK_REPLACEMENT_SPECS.find((spec) => spec.replacedTileId === replacedTileId) ?? null
    : null;
}

/** 7th character of an Iron Gang deck code (after the 6-char shuffle seed). */
const HOOK_SUFFIX_TO_MODE: Record<string, IronGangHookMode> = (() => {
  const map: Record<string, IronGangHookMode> = { '0': 'no-hook' };
  for (const { suffix, replacedTileId } of HOOK_REPLACEMENT_SPECS) {
    map[suffix] = modeFromReplacementTileId(replacedTileId);
  }
  return map;
})();

export const HOOK_MODE_TO_SUFFIX: Record<IronGangHookMode, string> = (() => {
  const map = { 'no-hook': '0' } as Record<IronGangHookMode, string>;
  for (const { suffix, replacedTileId } of HOOK_REPLACEMENT_SPECS) {
    map[modeFromReplacementTileId(replacedTileId)] = suffix;
  }
  return map;
})();

/** Iron Gang deck codes are 6 chars (seed) + 1 char (Hook mode). */
export const IRON_GANG_DECK_CODE_LEN = 7;

export function generateIronGangDeckCode(): string {
  const seed = (Math.random() * 0xffffffff) >>> 0;
  const suffix = pickRandomHookSuffix();
  return seedToCode(seed) + suffix;
}

function pickRandomHookSuffix(): string {
  const weightedSuffixes = [
    { suffix: '0', weight: 1 },
    ...HOOK_REPLACEMENT_SPECS.map(({ suffix, weight }) => ({ suffix, weight })),
  ];
  const totalWeight = weightedSuffixes.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const entry of weightedSuffixes) {
    roll -= entry.weight;
    if (roll < 0) return entry.suffix;
  }
  return weightedSuffixes[weightedSuffixes.length - 1]!.suffix;
}

/** Structured parse failure for i18n (see ui keys deck.igError.*). */
export type IronGangParseError =
  | { kind: 'wrong-length' }
  | { kind: 'invalid-seed' }
  | { kind: 'invalid-suffix' };

/**
 * Parse Iron Gang 7-character deck code: seed is first 6 chars, Hook mode is 7th.
 */
export function parseIronGangDeckCode(code: string): {
  mode: IronGangHookMode | null;
  error: IronGangParseError | null;
} {
  const upper = code.toUpperCase().trim();
  if (upper.length !== IRON_GANG_DECK_CODE_LEN) {
    return { mode: null, error: { kind: 'wrong-length' } };
  }
  if (codeToSeed(upper) === null) {
    return { mode: null, error: { kind: 'invalid-seed' } };
  }
  const suffix = upper[6];
  const mode = HOOK_SUFFIX_TO_MODE[suffix];
  if (!mode) {
    return { mode: null, error: { kind: 'invalid-suffix' } };
  }
  return { mode, error: null };
}

export function getIronGangHookModeFromDeckCode(deckCode: string): IronGangHookMode | null {
  return parseIronGangDeckCode(deckCode).mode;
}

export function getIronGangHookReplacementTileId(mode: IronGangHookMode): string | null {
  return replacementTileIdFromMode(mode);
}

function removeFirstInstance(deck: TileInstance[], tileId: string): TileInstance[] {
  const idx = deck.findIndex((t) => t.tile.id === tileId);
  if (idx === -1) return [...deck];
  return [...deck.slice(0, idx), ...deck.slice(idx + 1)];
}

/**
 * Adjust the built deck for Iron Gang Hook rules before shuffling.
 */
export function applyIronGangHookMode(
  deck: TileInstance[],
  mode: IronGangHookMode
): TileInstance[] {
  if (mode === 'no-hook') {
    return deck.filter((t) => t.tile.id !== TILE_HOOK);
  }
  const replacedTileId = replacementTileIdFromMode(mode);
  return replacedTileId ? removeFirstInstance(deck, replacedTileId) : deck;
}

/** Short explanation shown on the draw screen. */
export function getIronGangHookBanner(mode: IronGangHookMode): string {
  if (mode === 'no-hook') {
    return 'This deck does not contain Hook.';
  }
  const replacement = getReplacementSpecFromMode(mode);
  return replacement
    ? `This deck contains Hook. One ${replacement.label} was removed so Hook can be shuffled instead.`
    : '';
}

export const IRON_GANG_HOOK_OPTIONS: {
  mode: IronGangHookMode;
  label: string;
  description: string;
}[] = [
  {
    mode: 'no-hook',
    label: 'Deck without Hook',
    description: 'Hook is not included in the random deck.',
  },
  ...HOOK_REPLACEMENT_SPECS.map(({ replacedTileId, label }) => ({
    mode: modeFromReplacementTileId(replacedTileId),
    label: `Hook instead of ${label}`,
    description: `One ${label} tile is removed; Hook is shuffled in its place.`,
  })),
];
