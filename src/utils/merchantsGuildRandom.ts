import type { TileDefinition } from '../data/types';
import type { TileInstance } from './deck';
import imgSquadLeader from '../assets/merchantsguild/gildiakupcow-lider-zwiadu.jpg';
import { mulberry32 } from './rng';

export const MERCHANTS_GUILD_ARMY_ID = 'merchants-guild';
export const MG_SQUAD_LEADER_TILE_ID = 'mg-squad-leader';

/** Salt values — deterministic insert positions per deck code */
const SALT_RESPAWN_1 = 0x52e571;
const SALT_RESPAWN_2 = 0x52e572;

function respawnTileDef(n: 1 | 2): TileDefinition {
  return {
    id: n === 1 ? 'mg-respawn-1' : 'mg-respawn-2',
    name: n === 1 ? 'Reconnaissance 1' : 'Reconnaissance 2',
    category: 'instant',
    count: 1,
    description:
      'Random mode only — tap Shuffle Reconnaissance after the required Squad Leader(s) are drawn.',
    imageUrl: imgSquadLeader,
    imageOverlayLabel: n === 1 ? 'RC1' : 'RC2',
  };
}

export function createMerchantsGuildRespawnInstance(n: 1 | 2, armyId: string): TileInstance {
  const id = n === 1 ? 'mg-respawn-1' : 'mg-respawn-2';
  const tile = respawnTileDef(n);
  return {
    instanceId: `${id}-0`,
    tile,
    armyId,
  };
}

/**
 * Insert a tile at a uniform random position among the not-yet-drawn cards (inclusive of “bottom”).
 * `firstRemainingIndex` is the index of the next card to draw (length of drawn pile).
 */
export function insertIntoRemainingDeck(
  deck: TileInstance[],
  firstRemainingIndex: number,
  insert: TileInstance,
  seed: number | null,
  salt: number
): TileInstance[] {
  const remaining = deck.length - firstRemainingIndex;
  const rand =
    seed !== null ? mulberry32((seed ^ salt) >>> 0) : () => Math.random();
  const offset = remaining === 0 ? 0 : Math.floor(rand() * (remaining + 1));
  const pos = firstRemainingIndex + offset;
  const copy = [...deck];
  copy.splice(pos, 0, insert);
  return copy;
}

/**
 * Insert Reconnaissance 1 or 2 into the remaining deck at a random position (seeded from deck code).
 * Used when the player taps "Shuffle Reconnaissance" after the corresponding Squad Leader(s) have been drawn.
 */
export function insertMerchantsGuildReconnaissance(
  deck: TileInstance[],
  firstRemainingIndex: number,
  which: 1 | 2,
  armyId: string,
  seed: number | null
): TileInstance[] {
  if (armyId !== MERCHANTS_GUILD_ARMY_ID) return deck;
  const salt = which === 1 ? SALT_RESPAWN_1 : SALT_RESPAWN_2;
  return insertIntoRemainingDeck(
    deck,
    firstRemainingIndex,
    createMerchantsGuildRespawnInstance(which, armyId),
    seed,
    salt
  );
}
