import type { Army } from '../types';

const BASE = 'https://neuroshimahex.pl/gfx/sandrunners';

export const sandRunners: Army = {
  id: 'sand-runners',
  name: 'Sand Runners',
  color: '#1a140a',
  accentColor: '#d4a574',
  description:
    'A desert tribe surviving in the wasteland. Sand Runners rely on Sandstorm tokens for area control, Field Medics for healing, and a mix of veterans and specialists — Amok, Old Guard, and Pruners hold the line.',
  hqAbility: 'All friendly adjacent units gain +1 armour.',
  hqImageUrl: `${BASE}/sandrunners-sztab.png`,
  tiles: [
    // Instant tokens
    { id: 'sr-move', name: 'Move', category: 'instant', count: 3, imageUrl: `${BASE}/sandrunners-ruch.png` },
    { id: 'sr-sandstorm', name: 'Sandstorm', category: 'instant', count: 5, imageUrl: `${BASE}/sandrunners-burzapiaskowa.png` },
    { id: 'sr-push', name: 'Push', category: 'instant', count: 2, imageUrl: `${BASE}/sandrunners-odepchniecie.png` },
    { id: 'sr-trigger', name: 'Trigger', category: 'instant', count: 1, imageUrl: `${BASE}/sandrunners-cyngiel.png` },

    // Soldiers
    { id: 'sr-amok', name: 'Amok', category: 'soldier', count: 3, imageUrl: `${BASE}/sandrunners-amok.png` },
    { id: 'sr-old-guard', name: 'Old Guard', category: 'soldier', count: 2, imageUrl: `${BASE}/sandrunners-staragwardia.png` },
    { id: 'sr-pile-driver', name: 'Pile Driver', category: 'soldier', count: 3, imageUrl: `${BASE}/sandrunners-kafar.png` },
    { id: 'sr-pruner', name: 'Pruner', category: 'soldier', count: 2, imageUrl: `${BASE}/sandrunners-sekator.png` },
    { id: 'sr-mirage', name: 'Mirage', category: 'soldier', count: 2, imageUrl: `${BASE}/sandrunners-fatamorgana.png` },

    // Modules
    { id: 'sr-field-medic-santa', name: 'Field Medic Santa', category: 'module', count: 1, imageUrl: `${BASE}/sandrunners-medykpolowysanta.png` },
    { id: 'sr-field-medic-lu', name: 'Field Medic Lu', category: 'module', count: 1, imageUrl: `${BASE}/sandrunners-medykpolowylu.png` },
    { id: 'sr-officer-1', name: 'Officer I', category: 'module', count: 2, imageUrl: `${BASE}/sandrunners-oficer1.png` },
    { id: 'sr-chief', name: 'Chief', category: 'module', count: 2, imageUrl: `${BASE}/sandrunners-wodz.png` },
    { id: 'sr-officer-2', name: 'Officer II', category: 'module', count: 1, imageUrl: `${BASE}/sandrunners-oficer2.png` },
    { id: 'sr-caravan', name: 'Caravan', category: 'module', count: 2, imageUrl: `${BASE}/sandrunners-karawana.png` },
    { id: 'sr-quicksand', name: 'Quicksand', category: 'module', count: 2, imageUrl: `${BASE}/sandrunners-ruchomepiaski.png` },
  ],
};
