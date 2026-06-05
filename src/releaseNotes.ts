/** Recent release notes — keep in sync when bumping APP_VERSION (newest first, max 5 shown). */

export interface ReleaseNote {
  version: string;
  date: string;
  summaryEn: string;
  summaryPl: string;
}

export const RELEASE_NOTES: readonly ReleaseNote[] = [
  {
    version: '1.6.2',
    date: '2026-06-05',
    summaryEn: 'Tile Counter: drawn tiles section is collapsed by default.',
    summaryPl: 'Licznik żetonów: sekcja zagranych żetonów domyślnie zwinięta.',
  },
  {
    version: '1.6.1',
    date: '2026-06-05',
    summaryEn: 'Tile Counter: after selecting the first army, page scrolls to the search input instead of the top.',
    summaryPl: 'Licznik żetonów: po wybraniu pierwszej armii strona przewija do pola wyszukiwania zamiast na górę.',
  },
  {
    version: '1.6.0',
    date: '2026-06-05',
    summaryEn: 'New “Random Matchup” tab — pick two armies at random with a Re-roll button.',
    summaryPl: 'Nowa zakładka „Losowe starcie” — wylosuj dwie armie z możliwością ponownego losowania.',
  },
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
];

export const RELEASE_NOTES_DISPLAY_COUNT = 5;
