import type { Army, TileDefinition } from '../data/types';
import type { Locale } from './localeTypes';
import { ARMY_DESCRIPTION_PL, ARMY_DISPLAY_NAME_PL, ARMY_HQ_ABILITY_PL } from './armyPl';
import { polishTileNameFromEnglish } from './enToPlTileNames';

const POLISH_TILE_NAME_OVERRIDES: Record<string, string> = {
  'borgo-mutek': 'Mutek',
  'borgo-knifer': 'Nożownik',
  'borgo-strongman': 'Siłacz',

  'beasts-scout': 'Zwiadowca',

  'outpost-liquidator': 'Likwidator',
  'outpost-powered-armour': 'Pancerz wspomagany',
  'outpost-strongman': 'Siłacz',
  'outpost-scoper': 'Skoper',

  'ig-ranged-netter': 'Sieciarz dystansowy',

  'mephisto-jaws': 'Szczęki',
  'mephisto-appendages': 'Odnóża',
  'mephisto-drill': 'Świder',
  'mephisto-amplifier': 'Wzmacniacz',

  'mg-turret': 'Wieżyczka z Fotokomórką',
  'mg-chief': 'Naczelnik',

  'ms-toxic-bomb': 'Toksyczna Bomba',

  'moloch-bomb': 'Bomba',
  'moloch-cyborg': 'Cyborg',
  'moloch-armored-sentry': 'Opancerzony Wartownik',
  'moloch-sentry': 'Wartownik',
  'moloch-mother': 'Matka',

  'ny-shotgun': 'Shotgun',
  'ny-spy-shooter': 'Szpieg-strzelec',
  'ny-rocket-launcher': 'Wyrzutnia rakiet',
  'ny-cop': 'Gliniarz',
  'ny-steel-boxer': 'Stalowy bokser',
  'ny-hammer': 'Młot',
  'ny-pusher': 'Odpychacz',
  'ny-spy-cleaner': 'Szpieg-czyściciel',

  'sr-amok': 'Amok',
  'sr-old-guard': 'Stara Gwardia',
  'sr-mirage': 'Fatamorgana',

  'uranopolis-drill': 'Świder',
};

export function getArmyDisplayName(army: Army, locale: Locale): string {
  if (locale !== 'pl') return army.name;
  return ARMY_DISPLAY_NAME_PL[army.id] ?? army.name;
}

export function getArmyDescription(army: Army, locale: Locale): string {
  if (locale !== 'pl') return army.description;
  return ARMY_DESCRIPTION_PL[army.id] ?? army.description;
}

export function getArmyHqAbility(army: Army, locale: Locale): string {
  if (locale !== 'pl') return army.hqAbility;
  return ARMY_HQ_ABILITY_PL[army.id] ?? army.hqAbility;
}

/** Search index: English + Polish official name when available. */
export function armySearchHaystack(army: Army): string {
  const pl = ARMY_DISPLAY_NAME_PL[army.id];
  return [army.name, pl].filter(Boolean).join(' ').toLowerCase();
}

export function getTileDisplayName(tile: TileDefinition, locale: Locale): string {
  if (locale !== 'pl') return tile.name;
  if (tile.name === 'HQ') return 'Sztab';
  const override = POLISH_TILE_NAME_OVERRIDES[tile.id];
  if (override) return override;
  return polishTileNameFromEnglish(tile.name);
}

export function getImageOverlayLabel(tile: TileDefinition, locale: Locale): string | undefined {
  if (!tile.imageOverlayLabel) return undefined;
  if (locale !== 'pl') return tile.imageOverlayLabel;
  return polishTileNameFromEnglish(tile.imageOverlayLabel);
}
