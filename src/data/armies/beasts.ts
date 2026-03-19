import type { Army } from '../types';

const BASE = 'https://neuroshimahex.pl/gfx/bestie';

export const beasts: Army = {
  id: 'beasts',
  name: 'Beasts',
  color: '#14200f',
  accentColor: '#84cc16',
  description:
    'Feral mutants and monstrous creatures that roam the wasteland. Beasts overwhelm enemies with raw numbers and relentless aggression — fast, hard-hitting swarms backed by a surprisingly large Battle token pool.',
  hqAbility: 'All friendly adjacent units gain +1 melee attack strength.',
  hqImageUrl: `${BASE}/bestie-sztab.png`,
  tiles: [
    // Instant tokens
    { id: 'beasts-move', name: 'Move', category: 'instant', count: 2, imageUrl: `${BASE}/bestie-ruch.png` },
    { id: 'beasts-battle', name: 'Battle', category: 'instant', count: 6, imageUrl: `${BASE}/bestie-bitwa.png` },
    { id: 'beasts-hunt', name: 'Hunt', category: 'instant', count: 1, imageUrl: `${BASE}/bestie-polowanie.png` },
    { id: 'beasts-pull', name: 'Pull', category: 'instant', count: 3, imageUrl: `${BASE}/bestie-przyciagniecie.png` },

    // Soldiers
    { id: 'beasts-cerberus', name: 'Cerberus', category: 'soldier', count: 1, imageUrl: `${BASE}/bestie-cerber.png`, excludeFromDeck: true },
    { id: 'beasts-alpha', name: 'Alpha', category: 'soldier', count: 1, imageUrl: `${BASE}/bestie-alfa.png` },
    { id: 'beasts-swarm', name: 'Swarm', category: 'soldier', count: 2, imageUrl: `${BASE}/bestie-roj.png` },
    { id: 'beasts-ram', name: 'Ram', category: 'soldier', count: 4, imageUrl: `${BASE}/bestie-taran.png` },
    { id: 'beasts-acid-spitter', name: 'Acid Spitter', category: 'soldier', count: 2, imageUrl: `${BASE}/bestie-kwasopluj.png` },
    { id: 'beasts-bug', name: 'Bug', category: 'soldier', count: 2, imageUrl: `${BASE}/bestie-robal.png` },
    { id: 'beasts-urchin', name: 'Urchin', category: 'soldier', count: 2, imageUrl: `${BASE}/bestie-jezowiec.png` },
    { id: 'beasts-vulture', name: 'Vulture', category: 'soldier', count: 2, imageUrl: `${BASE}/bestie-sep.png` },
    { id: 'beasts-arachnoid', name: 'Arachnoid', category: 'soldier', count: 1, imageUrl: `${BASE}/bestie-arachnoid.png` },

    // Modules
    { id: 'beasts-scout', name: 'Scout', category: 'module', count: 3, imageUrl: `${BASE}/bestie-zwiadowca.png` },
    { id: 'beasts-officer', name: 'Officer I', category: 'module', count: 2, imageUrl: `${BASE}/bestie-oficer1.png` },
    { id: 'beasts-ripper', name: 'Ripper', category: 'module', count: 1, imageUrl: `${BASE}/bestie-szarpak.png` },
  ],
};
