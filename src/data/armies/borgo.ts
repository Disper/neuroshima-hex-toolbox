import type { Army } from '../types';

const BASE = 'https://neuroshimahex.pl/gfx/borgo';

export const borgo: Army = {
  id: 'borgo',
  name: 'Borgo',
  color: '#1a0a0f',
  accentColor: '#f43f5e',
  description:
    'A savage mutant gang led by the towering Super-mutant. Borgo floods the board with cheap, aggressive fighters and overwhelms enemies through sheer numbers, backed by the highest Battle token count in the game.',
  hqAbility: 'All friendly adjacent units gain +1 melee attack strength.',
  hqImageUrl: `${BASE}/borgo-sztab.png`,
  tiles: [
    // Instant tokens
    { id: 'borgo-battle', name: 'Battle', category: 'instant', count: 6, imageUrl: `${BASE}/borgo-bitwa.png` },
    { id: 'borgo-move', name: 'Move', category: 'instant', count: 4, imageUrl: `${BASE}/borgo-ruch.png` },
    { id: 'borgo-grenade', name: 'Grenade', category: 'instant', count: 1, imageUrl: `${BASE}/borgo-granat.png` },

    // Soldiers
    { id: 'borgo-mutek', name: 'Mutek', category: 'soldier', count: 6, imageUrl: `${BASE}/borgo-mutek.png` },
    { id: 'borgo-knifer', name: 'Knifer', category: 'soldier', count: 4, imageUrl: `${BASE}/borgo-nozownik.png` },
    { id: 'borgo-netter', name: 'Netter', category: 'soldier', count: 2, imageUrl: `${BASE}/borgo-sieciarz.png` },
    { id: 'borgo-super-mutant', name: 'Super-mutant', category: 'soldier', count: 1, imageUrl: `${BASE}/borgo-supermutant.png` },
    { id: 'borgo-strongman', name: 'Strongman', category: 'soldier', count: 2, imageUrl: `${BASE}/borgo-silacz.png` },
    { id: 'borgo-assassin', name: 'Assassin', category: 'soldier', count: 2, imageUrl: `${BASE}/borgo-zabojca.png` },

    // Modules
    { id: 'borgo-medic', name: 'Medic', category: 'module', count: 1, imageUrl: `${BASE}/borgo-medyk.png` },
    { id: 'borgo-officer', name: 'Officer', category: 'module', count: 2, imageUrl: `${BASE}/borgo-oficer.png` },
    { id: 'borgo-super-officer', name: 'Super-officer', category: 'module', count: 1, imageUrl: `${BASE}/borgo-superoficer.png` },
    { id: 'borgo-scout', name: 'Scout', category: 'module', count: 2, imageUrl: `${BASE}/borgo-zwiadowca.png` },
  ],
};
