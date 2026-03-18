import type { Army } from '../types';

const BASE = 'https://neuroshimahex.pl/gfx/hegemonia';

export const hegemony: Army = {
  id: 'hegemony',
  name: 'Hegemony',
  color: '#1a1005',
  accentColor: '#fb923c',
  description:
    'A ruthless criminal empire that controls the wasteland through fear and firepower. Hegemony combines cheap, abundant Gangers with elite specialists and powerful support modules to dominate the mid-game.',
  hqAbility: 'All friendly adjacent units gain +1 to ranged attack strength.',
  hqImageUrl: `${BASE}/hegemonia-sztab.png`,
  tiles: [
    // Instant tokens
    { id: 'heg-battle', name: 'Battle', category: 'instant', count: 5, imageUrl: `${BASE}/hegemonia-bitwa.png` },
    { id: 'heg-move', name: 'Move', category: 'instant', count: 3, imageUrl: `${BASE}/hegemonia-ruch.png` },
    { id: 'heg-push', name: 'Push', category: 'instant', count: 2, imageUrl: `${BASE}/hegemonia-odepchniecie.png` },
    { id: 'heg-sniper', name: 'Sniper', category: 'instant', count: 1, imageUrl: `${BASE}/hegemonia-snajper.png` },

    // Soldiers
    { id: 'heg-runner', name: 'Runner', category: 'soldier', count: 3, imageUrl: `${BASE}/hegemonia-biegacz.png` },
    { id: 'heg-brute', name: 'Brute', category: 'soldier', count: 1, imageUrl: `${BASE}/hegemonia-bydlak.png` },
    { id: 'heg-ganger', name: 'Ganger', category: 'soldier', count: 4, imageUrl: `${BASE}/hegemonia-ganger.png` },
    { id: 'heg-gladiator', name: 'Gladiator', category: 'soldier', count: 1, imageUrl: `${BASE}/hegemonia-gladiator.png` },
    { id: 'heg-netter', name: 'Netter', category: 'soldier', count: 2, imageUrl: `${BASE}/hegemonia-sieciarz.png` },
    { id: 'heg-guardian', name: 'Guardian', category: 'soldier', count: 1, imageUrl: `${BASE}/hegemonia-straznik.png` },
    { id: 'heg-super-netter', name: 'Super-netter', category: 'soldier', count: 1, imageUrl: `${BASE}/hegemonia-supersieciarz.png` },
    { id: 'heg-universal-soldier', name: 'Universal Soldier', category: 'soldier', count: 3, imageUrl: `${BASE}/hegemonia-uniwersalnyzolnierz.png` },

    // Modules
    { id: 'heg-boss', name: 'Boss', category: 'module', count: 1, imageUrl: `${BASE}/hegemonia-boss.png` },
    { id: 'heg-quartermaster', name: 'Quartermaster', category: 'module', count: 1, imageUrl: `${BASE}/hegemonia-kwatermistrz.png` },
    { id: 'heg-officer-1', name: 'Officer I', category: 'module', count: 2, imageUrl: `${BASE}/hegemonia-oficer1.png` },
    { id: 'heg-officer-2', name: 'Officer II', category: 'module', count: 1, imageUrl: `${BASE}/hegemonia-oficer2.png` },
    { id: 'heg-transport', name: 'Transport', category: 'module', count: 1, imageUrl: `${BASE}/hegemonia-transport.png` },
    { id: 'heg-scout', name: 'Scout', category: 'module', count: 1, imageUrl: `${BASE}/hegemonia-zwiadowca.png` },
  ],
};
