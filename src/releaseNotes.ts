/** Recent release notes — keep in sync when bumping APP_VERSION (newest first, max 5 shown). */

export interface ReleaseNote {
  version: string;
  date: string;
  summaryEn: string;
  summaryPl: string;
}

export const RELEASE_NOTES: readonly ReleaseNote[] = [
  {
    version: '1.5.0',
    date: '2026-06-05',
    summaryEn: 'Tile Counter: “Split by category” toggle — view all remaining tiles in a flat grid.',
    summaryPl: 'Licznik żetonów: przełącznik „Podziel na kategorie” — widok wszystkich żetonów w jednej siatce.',
  },
  {
    version: '1.4.4',
    date: '2026-06-05',
    summaryEn: 'Stack identical tiles enabled by default in Tile Counter.',
    summaryPl: 'Układanie identycznych żetonów w stosy domyślnie włączone w liczniku.',
  },
  {
    version: '1.4.3',
    date: '2026-05-23',
    summaryEn: 'Release notes popover on the footer version (hover or tap).',
    summaryPl: 'Notatki wydania przy numerze wersji w stopce (najechanie lub dotknięcie).',
  },
  {
    version: '1.4.2',
    date: '2026-05-23',
    summaryEn: 'Footer reload button for mobile browsers (hard refresh without keyboard).',
    summaryPl: 'Przycisk odświeżania w stopce dla przeglądarek mobilnych (twarde odświeżenie bez skrótu klawiszowego).',
  },
  {
    version: '1.4.1',
    date: '2026-05-23',
    summaryEn: 'Partisans trap tracker in Tile Counter; Polish “Wszczep” for implant tiles.',
    summaryPl: 'Śledzenie pułapek Partyzantów w liczniku żetonów; polska etykieta „Wszczep” zamiast implantów.',
  },
];

export const RELEASE_NOTES_DISPLAY_COUNT = 5;
