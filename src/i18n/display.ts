import type { Army, TileDefinition } from '../data/types';
import type { Locale } from './localeTypes';
import { ARMY_DISPLAY_NAME_PL } from './armyPl';
import { polishTileNameFromEnglish } from './enToPlTileNames';

export function getArmyDisplayName(army: Army, locale: Locale): string {
  if (locale !== 'pl') return army.name;
  return ARMY_DISPLAY_NAME_PL[army.id] ?? army.name;
}

/** Search index: English + Polish official name when available. */
export function armySearchHaystack(army: Army): string {
  const pl = ARMY_DISPLAY_NAME_PL[army.id];
  return [army.name, pl].filter(Boolean).join(' ').toLowerCase();
}

export function getTileDisplayName(tile: TileDefinition, locale: Locale): string {
  if (locale !== 'pl') return tile.name;
  if (tile.name === 'HQ') return 'SZ';
  return polishTileNameFromEnglish(tile.name);
}

export function getImageOverlayLabel(tile: TileDefinition, locale: Locale): string | undefined {
  if (!tile.imageOverlayLabel) return undefined;
  if (locale !== 'pl') return tile.imageOverlayLabel;
  return polishTileNameFromEnglish(tile.imageOverlayLabel);
}
