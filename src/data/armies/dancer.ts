import type { Army } from '../types';

const BASE = 'https://neuroshimahex.pl/gfx/dancer';

export const dancer: Army = {
  id: 'dancer',
  name: 'Dancer',
  color: '#0a0a1a',
  accentColor: '#8b5cf6',
  description:
    'An enigmatic faction built around three Objects — Blue, Red, and Yellow. Dancer has the highest instant token count in the game: massive stacks of Action, Battle, Push, and Move let it control the flow of play.',
  hqAbility: 'Blue Object — special rules apply.',
  hqImageUrl: `${BASE}/dancer-obiektniebieski.png`,
  tiles: [
    // Instant tokens
    { id: 'dancer-action', name: 'Action', category: 'instant', count: 7, imageUrl: `${BASE}/dancer-akcja.png` },
    { id: 'dancer-battle', name: 'Battle', category: 'instant', count: 8, imageUrl: `${BASE}/dancer-bitwa.png` },
    { id: 'dancer-push', name: 'Push', category: 'instant', count: 7, imageUrl: `${BASE}/dancer-odepchniecie.png` },
    { id: 'dancer-move', name: 'Move', category: 'instant', count: 10, imageUrl: `${BASE}/dancer-ruch.png` },

    // HQ Objects (placed separately, not in draw deck)
    { id: 'dancer-red-object', name: 'Red Object', category: 'hq', count: 1, imageUrl: `${BASE}/dancer-obiektczerwony.png`, excludeFromDeck: true },
    { id: 'dancer-yellow-object', name: 'Yellow Object', category: 'hq', count: 1, imageUrl: `${BASE}/dancer-obiektzolty.png`, excludeFromDeck: true },
  ],
};
