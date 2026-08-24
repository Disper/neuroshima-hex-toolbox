/** Recent release notes — keep in sync when bumping APP_VERSION (newest first, max 7 shown). */

export interface ReleaseNote {
  version: string;
  date: string;
  summaryEn: string;
  summaryPl: string;
}

export const RELEASE_NOTES: readonly ReleaseNote[] = [
  {
    version: '1.7.0',
    date: '2026-08-24',
    summaryEn: 'New army: Purifiers — a pyromaniac faction that spreads Fire tokens across the board. HQ ability: Scorch (left behind after destroying enemies). Weakness: Fire disappears at the start of Battle.',
    summaryPl: 'Nowa armia: Czyściciele — piratoryczna frakcja rozprzestrzeniająca znaczniki Ognia na planszy. Zdolność Sztabu: Przypalanie (pozostawia Ogień po zniszczeniu wrogów). Słabość: Ogień znika na początku Bitwy.',
  },
  {
    version: '1.6.5',
    date: '2026-06-05',
    summaryEn: 'Release notes popover now shows the last 7 versions.',
    summaryPl: 'Popover z notatkami wydania pokazuje teraz ostatnie 7 wersji.',
  },
  {
    version: '1.6.4',
    date: '2026-06-05',
    summaryEn: 'Army search: scrolls to the search input on first keystroke so it stays visible as the list filters.',
    summaryPl: 'Wyszukiwanie armii: przewija do pola wyszukiwania przy pierwszym znaku, aby pozostało widoczne podczas filtrowania.',
  },
  {
    version: '1.6.3',
    date: '2026-06-05',
    summaryEn: 'Result screens now have an "Open Tile Counter" button that loads the counter with the matched armies. Split by category is disabled by default.',
    summaryPl: 'Ekrany wyników mają teraz przycisk „Otwórz licznik żetonów" ładujący licznik z dobranymi armiami. Podział na kategorie domyślnie wyłączony.',
  },
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
    summaryEn: 'New "Random Matchup" tab — pick two armies at random with a Re-roll button.',
    summaryPl: 'Nowa zakładka „Losowe starcie" — wylosuj dwie armie z możliwością ponownego losowania.',
  },
  {
    version: '1.5.0',
    date: '2026-06-05',
    summaryEn: 'Tile Counter: "Split by category" toggle — view all remaining tiles in a flat grid.',
    summaryPl: 'Licznik żetonów: przełącznik „Podziel na kategorie" — widok wszystkich żetonów w jednej siatce.',
  },
];

export const RELEASE_NOTES_DISPLAY_COUNT = 7;
