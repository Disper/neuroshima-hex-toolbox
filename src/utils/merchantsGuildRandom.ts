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
    name: n === 1 ? 'Respawn 1' : 'Respawn 2',
    category: 'instant',
    count: 1,
    description: 'Random mode only — shuffled into the deck after a Squad Leader is drawn.',
    imageUrl: imgSquadLeader,
    imageOverlayLabel: n === 1 ? 'R1' : 'R2',
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

export function maybeInjectMerchantsGuildRespawns(
  deck: TileInstance[],
  firstRemainingIndex: number,
  justDrawnTileId: string,
  armyId: string,
  seed: number | null
): TileInstance[] {
  if (armyId !== MERCHANTS_GUILD_ARMY_ID) return deck;
  if (justDrawnTileId !== MG_SQUAD_LEADER_TILE_ID) return deck;

  const drawn = deck.slice(0, firstRemainingIndex);
  const squadLeadersDrawn = drawn.filter(
    (t) => t.tile.id === MG_SQUAD_LEADER_TILE_ID
  ).length;

  if (squadLeadersDrawn === 1) {
    return insertIntoRemainingDeck(
      deck,
      firstRemainingIndex,
      createMerchantsGuildRespawnInstance(1, armyId),
      seed,
      SALT_RESPAWN_1
    );
  }
  if (squadLeadersDrawn === 2) {
    return insertIntoRemainingDeck(
      deck,
      firstRemainingIndex,
      createMerchantsGuildRespawnInstance(2, armyId),
      seed,
      SALT_RESPAWN_2
    );
  }
  return deck;
}
