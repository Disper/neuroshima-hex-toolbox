import type { TileInstance } from './deck';
import { codeToSeed, seedToCode } from './rng';

export const IRON_GANG_ARMY_ID = 'iron-gang';

/** How Hook interacts with the random deck (Iron Gang random mode only). */
export type IronGangHookMode =
  | 'no-hook'
  | 'replace-officer'
  | 'replace-order'
  | 'replace-motorcyclist';

/** 7th character of an Iron Gang deck code (after the 6-char shuffle seed). */
const HOOK_SUFFIX_TO_MODE: Record<string, IronGangHookMode> = {
  '2': 'no-hook',
  '3': 'replace-officer',
  '4': 'replace-order',
  '5': 'replace-motorcyclist',
};

export const HOOK_MODE_TO_SUFFIX: Record<IronGangHookMode, string> = {
  'no-hook': '2',
  'replace-officer': '3',
  'replace-order': '4',
  'replace-motorcyclist': '5',
};

/** Iron Gang deck codes are 6 chars (seed) + 1 char (Hook mode). */
export const IRON_GANG_DECK_CODE_LEN = 7;

export function generateIronGangDeckCode(): string {
  const seed = (Math.random() * 0xffffffff) >>> 0;
  const suffixes = Object.keys(HOOK_SUFFIX_TO_MODE);
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]!;
  return seedToCode(seed) + suffix;
}

/**
 * Parse Iron Gang 7-character deck code: seed is first 6 chars, Hook mode is 7th.
 */
export function parseIronGangDeckCode(code: string): {
  mode: IronGangHookMode | null;
  error: string | null;
} {
  const upper = code.toUpperCase().trim();
  if (upper.length !== IRON_GANG_DECK_CODE_LEN) {
    return {
      mode: null,
      error: `Iron Gang deck code must be exactly ${IRON_GANG_DECK_CODE_LEN} characters (6 for shuffle + 1 for Hook mode).`,
    };
  }
  if (codeToSeed(upper) === null) {
    return {
      mode: null,
      error: 'Invalid characters in the first 6 positions (shuffle seed).',
    };
  }
  const suffix = upper[6];
  const mode = HOOK_SUFFIX_TO_MODE[suffix];
  if (!mode) {
    return {
      mode: null,
      error:
        'Invalid 7th character (Hook mode). Use 2 = no Hook, 3 = Officer, 4 = Order, 5 = Motorcyclist.',
    };
  }
  return { mode, error: null };
}

export function getIronGangHookModeFromDeckCode(deckCode: string): IronGangHookMode | null {
  return parseIronGangDeckCode(deckCode).mode;
}

const TILE_HOOK = 'ig-hook';
const TILE_OFFICER = 'ig-officer';
const TILE_ORDER = 'ig-order';
const TILE_MOTORCYCLIST = 'ig-motorcyclist';

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
  switch (mode) {
    case 'no-hook':
      return deck.filter((t) => t.tile.id !== TILE_HOOK);
    case 'replace-officer':
      return removeFirstInstance(deck, TILE_OFFICER);
    case 'replace-order':
      return removeFirstInstance(deck, TILE_ORDER);
    case 'replace-motorcyclist':
      return removeFirstInstance(deck, TILE_MOTORCYCLIST);
    default:
      return deck;
  }
}

/** Short explanation shown on the draw screen. */
export function getIronGangHookBanner(mode: IronGangHookMode): string {
  switch (mode) {
    case 'no-hook':
      return 'This deck does not contain Hook.';
    case 'replace-officer':
      return 'This deck contains Hook. One Officer was removed so Hook can be shuffled instead.';
    case 'replace-order':
      return 'This deck contains Hook. One Order was removed so Hook can be shuffled instead.';
    case 'replace-motorcyclist':
      return 'This deck contains Hook. One Motorcyclist was removed so Hook can be shuffled instead.';
    default:
      return '';
  }
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
  {
    mode: 'replace-officer',
    label: 'Hook instead of an Officer',
    description: 'One Officer is removed; Hook is shuffled in its place.',
  },
  {
    mode: 'replace-order',
    label: 'Hook instead of an Order',
    description: 'One Order is removed; Hook is shuffled in its place.',
  },
  {
    mode: 'replace-motorcyclist',
    label: 'Hook instead of a Motorcyclist',
    description: 'One Motorcyclist is removed; Hook is shuffled in its place.',
  },
];
