import type { Army } from '../types';

const BASE = 'https://neuroshimahex.pl/gfx/piraci';

export const pirates: Army = {
  id: 'pirates',
  name: 'Pirates',
  color: '#0c1a2e',
  accentColor: '#f59e0b',
  description:
    'Ruthless river raiders who control the waterways of the wasteland. Pirates are a nimble, aggressive army with strong ranged firepower and tricks that move both their own units and enemy pieces across the board.',
  hqAbility: 'All friendly adjacent units gain +1 to ranged attack strength.',
  hqImageUrl: `${BASE}/piraci-sztab.jpg`,
  tiles: [
    // Instant tokens
    { id: 'pirates-battle', name: 'Battle', category: 'instant', count: 5, imageUrl: `${BASE}/piraci-bitwa.jpg` },
    { id: 'pirates-move', name: 'Move', category: 'instant', count: 3, imageUrl: `${BASE}/piraci-ruch.jpg` },
    { id: 'pirates-wave', name: 'Wave', category: 'instant', count: 1, imageUrl: `${BASE}/piraci-fala.jpg` },
    { id: 'pirates-tavern', name: 'Tavern', category: 'instant', count: 1, imageUrl: `${BASE}/piraci-tawerna.jpg` },

    // Soldiers
    { id: 'pirates-motorboat', name: 'Motorboat', category: 'soldier', count: 2, imageUrl: `${BASE}/piraci-motorowka.jpg` },
    { id: 'pirates-fisherman', name: 'Fisherman', category: 'soldier', count: 1, imageUrl: `${BASE}/piraci-wedkarz.jpg` },
    { id: 'pirates-harpoon', name: 'Harpoon', category: 'soldier', count: 2, imageUrl: `${BASE}/piraci-harpun.jpg` },
    { id: 'pirates-crocodile', name: 'Crocodile', category: 'soldier', count: 2, imageUrl: `${BASE}/piraci-krokodyl.jpg` },
    { id: 'pirates-helmsman', name: 'Helmsman', category: 'soldier', count: 3, imageUrl: `${BASE}/piraci-sternik.jpg` },
    { id: 'pirates-smuggler', name: 'Smuggler', category: 'soldier', count: 3, imageUrl: `${BASE}/piraci-szmugler.jpg` },
    { id: 'pirates-boatswain', name: 'Boatswain', category: 'soldier', count: 1, imageUrl: `${BASE}/piraci-bosman.jpg` },
    { id: 'pirates-water-cannon', name: 'Water Cannon', category: 'soldier', count: 1, imageUrl: `${BASE}/piraci-dzialko-wodne.jpg` },

    // Modules
    { id: 'pirates-mother', name: 'Mother', category: 'module', count: 2, imageUrl: `${BASE}/piraci-matka.jpg` },
    { id: 'pirates-officer', name: 'Officer I', category: 'module', count: 2, imageUrl: `${BASE}/piraci-oficer1.jpg` },
    { id: 'pirates-saboteur', name: 'Saboteur', category: 'module', count: 3, imageUrl: `${BASE}/piraci-dywersant.jpg` },
    { id: 'pirates-medic', name: 'Medic', category: 'module', count: 2, imageUrl: `${BASE}/piraci-medyk.jpg` },
  ],
};
