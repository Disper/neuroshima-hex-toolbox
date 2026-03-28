import type { Army, TileDefinition } from '../data/types';
import type { Locale } from './localeTypes';
import { ARMY_DESCRIPTION_PL, ARMY_DISPLAY_NAME_PL, ARMY_HQ_ABILITY_PL } from './armyPl';
import { polishTileNameFromEnglish } from './enToPlTileNames';

const POLISH_TILE_NAME_OVERRIDES: Record<string, string> = {
  'borgo-mutek': 'Mutant',
  'borgo-knifer': 'Szpon',
  'borgo-strongman': 'Siłacz',
  'borgo-super-mutant': 'Super-Mutant',
  'borgo-super-officer': 'Super-Oficer',

  'beasts-scout': 'Zwiadowca',
  'beasts-cerberus': 'Cerber',

  'outpost-recon-centre': 'Centrum Rozpoznania',
  'outpost-liquidator': 'Likwidator',
  'outpost-powered-armour': 'Pancerz Wspomagany',
  'outpost-strongman': 'Siłacz',
  'outpost-scoper': 'Skoper',

  'heg-super-netter': 'Super-Sieciarz',
  'heg-universal-soldier': 'Uniwersalny Żołnierz',
  'heg-boss': 'Boss',

  'ig-ranged-netter': 'Sieciarz Dystansowy',

  'mephisto-jaws': 'Szczęki',
  'mephisto-appendages': 'Odnóża',
  'mephisto-drill': 'Świder',
  'mephisto-amplifier': 'Wzmacniacz',
  'mephisto-left-spike': 'Kolec Lewy',
  'mephisto-right-spike': 'Kolec Prawy',

  'mg-turret': 'Wieżyczka z Fotokomórką',
  'mg-chief': 'Naczelnik',

  'ms-toxic-bomb': 'Toksyczna Bomba',

  'moloch-bomb': 'Bomba',
  'moloch-cyborg': 'Cyborg',
  'moloch-armored-hunter': 'Opancerzony Łowca',
  'moloch-armored-sentry': 'Wartownik',
  'moloch-sentry': 'Opancerzony Wartownik',
  'moloch-mother': 'Matka',

  'ny-shotgun': 'Shotgun',
  'ny-spy-shooter': 'Szpieg-Strzelec',
  'ny-rocket-launcher': 'Wyrzutnia Rakietowa',
  'ny-cop': 'Gliniarz',
  'ny-steel-boxer': 'Stalowy Bokser',
  'ny-hammer': 'Młot',
  'ny-pusher': 'Odpychacz',
  'ny-spy-cleaner': 'Szpieg-Czyściciel',

  'nj-tangle': 'Kłębowisko',

  'part-guard-drone': 'Dron Strażnik',
  'part-veteran-scout': 'Zwiadowca Weteran',
  'part-bunker-manager': 'Zarządca Bunkra',

  'pirates-water-cannon': 'Działko Wodne',

  'sr-amok': 'Amok',
  'sr-old-guard': 'Stara Gwardia',
  'sr-mirage': 'Fatamorgana',
  'sr-field-medic-santa': 'Medyk Polowy Santa',
  'sr-field-medic-lu': 'Medyk Polowy Lu',

  'sp-executor': 'Egzekutor',
  'sp-pacifier': 'Pacyfikator',
  'sp-predator': 'Predator',
  'sp-brytan': 'Brytan',
  'sp-functionary': 'Funkcjonariusz',
  'sp-judge': 'Sędzia',
  'sp-wardog': 'Wardog',
  'sp-steel-net-launcher': 'Wyrzutnia Stalowej Sieci',
  'sp-sterydomat': 'Sterydomat',

  'trog-cannibalize': 'Skanibalizowanie Wroga',
  'trog-frost-matron': 'Mroźna Matrona',

  'uranopolis-ray': 'Promień',
  'uranopolis-electrowireman': 'Elektrosieciarz',
  'uranopolis-mechanic': 'Mechanik',
  'uranopolis-inferno': 'Inferno',
  'uranopolis-bulldozer': 'Buldożer',
  'uranopolis-drill': 'Świder',
  'uranopolis-hammerhead': 'Hammerhead',
  'uranopolis-demolisher': 'Wyburzacz',
  'uranopolis-speed-generator': 'Generator Przyspieszający',
  'uranopolis-combat-generator': 'Generator Bojowy',
  'uranopolis-doubler': 'Podwajacz',
  'uranopolis-gauss-transformer': 'Transformator Gaussa',
  'uranopolis-waste': 'Odpady',

  'wiremen-machine-killer': 'Zabójca Maszyn',
  'wiremen-scorpion': 'Skorpion',
  'wiremen-wasp': 'Osa',
  'wiremen-weeper': 'Płaczka',
  'wiremen-umo-soldier': 'Żołnierz UMO',
  'wiremen-wireman': 'Druciarz',
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
