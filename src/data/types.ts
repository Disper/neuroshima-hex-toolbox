export type TileCategory = 'hq' | 'instant' | 'soldier' | 'module';

export interface TileDefinition {
  id: string;
  name: string;
  category: TileCategory;
  count: number;
  description?: string;
  imageUrl?: string;
  /** If true, tile is shown in army list but excluded from the draw deck */
  excludeFromDeck?: boolean;
}

export interface Army {
  id: string;
  name: string;
  color: string;
  accentColor: string;
  description: string;
  hqAbility: string;
  hqImageUrl?: string;
  tiles: TileDefinition[];
}

export interface DrawnTile {
  instanceId: string;
  tile: TileDefinition;
  armyId: string;
  drawnAt: number;
}
