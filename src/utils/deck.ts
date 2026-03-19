import type { Army, DrawnTile, TileDefinition } from '../data/types';

export interface TileInstance {
  instanceId: string;
  tile: TileDefinition;
  armyId: string;
}

export function buildDeck(army: Army): TileInstance[] {
  const instances: TileInstance[] = [];

  // Expand each tile definition by count (HQ excluded — placed separately by players)
  for (const tile of army.tiles) {
    if (tile.excludeFromDeck) continue;
    for (let i = 0; i < tile.count; i++) {
      instances.push({
        instanceId: `${tile.id}-${i}`,
        tile,
        armyId: army.id,
      });
    }
  }

  return instances;
}

export function shuffleDeck(deck: TileInstance[]): TileInstance[] {
  const copy = [...deck];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function drawRandom(remaining: TileInstance[]): {
  drawn: TileInstance;
  rest: TileInstance[];
} | null {
  if (remaining.length === 0) return null;
  const idx = Math.floor(Math.random() * remaining.length);
  const drawn = remaining[idx];
  const rest = remaining.filter((_, i) => i !== idx);
  return { drawn, rest };
}

export function toDrawnTile(instance: TileInstance): DrawnTile {
  return {
    instanceId: instance.instanceId,
    tile: instance.tile,
    armyId: instance.armyId,
    drawnAt: Date.now(),
  };
}
