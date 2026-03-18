import type { Army } from '../types';

const BASE = 'https://neuroshimahex.pl/gfx/mephisto';

export const mephisto: Army = {
  id: 'mephisto',
  name: 'Mephisto',
  color: '#1a0505',
  accentColor: '#ef4444',
  description:
    'A colossal bio-mechanical demon assembled from interchangeable body parts. Mephisto\'s tiles are its own limbs and organs — each one a combat piece that snaps onto the growing creature on the board.',
  hqAbility: 'All friendly adjacent units with a melee attack gain +1 to that attack.',
  hqImageUrl: `${BASE}/mephisto-sztab.png`,
  tiles: [
    // Instant tokens
    { id: 'mephisto-castling', name: 'Castling', category: 'instant', count: 2, imageUrl: `${BASE}/mephisto-roszada.png` },
    { id: 'mephisto-battle', name: 'Battle', category: 'instant', count: 3, imageUrl: `${BASE}/mephisto-bitwa.png` },
    { id: 'mephisto-move', name: 'Move', category: 'instant', count: 2, imageUrl: `${BASE}/mephisto-ruch.png` },

    // Soldiers (body parts / combat units)
    { id: 'mephisto-incubator', name: 'Incubator', category: 'soldier', count: 3, imageUrl: `${BASE}/mephisto-inkubator.png` },
    { id: 'mephisto-transmitter', name: 'Transmitter', category: 'soldier', count: 1, imageUrl: `${BASE}/mephisto-transmiter.png` },
    { id: 'mephisto-jaws', name: 'Jaws', category: 'soldier', count: 2, imageUrl: `${BASE}/mephisto-szczeki.png` },
    { id: 'mephisto-tail', name: 'Tail', category: 'soldier', count: 2, imageUrl: `${BASE}/mephisto-ogon.png` },
    { id: 'mephisto-left-spike', name: 'Left Spike', category: 'soldier', count: 1, imageUrl: `${BASE}/mephisto-koleclewy.png` },
    { id: 'mephisto-right-spike', name: 'Right Spike', category: 'soldier', count: 1, imageUrl: `${BASE}/mephisto-kolecprawy.png` },
    { id: 'mephisto-tentacles', name: 'Tentacles', category: 'soldier', count: 2, imageUrl: `${BASE}/mephisto-macki.png` },
    { id: 'mephisto-appendages', name: 'Appendages', category: 'soldier', count: 2, imageUrl: `${BASE}/mephisto-odnoza.png` },
    { id: 'mephisto-drill', name: 'Drill', category: 'soldier', count: 1, imageUrl: `${BASE}/mephisto-swider.png` },

    // Modules
    { id: 'mephisto-amplifier', name: 'Amplifier', category: 'module', count: 2, imageUrl: `${BASE}/mephisto-wzmacniacz.png` },
    { id: 'mephisto-probe', name: 'Probe', category: 'module', count: 2, imageUrl: `${BASE}/mephisto-sonda.png` },
    { id: 'mephisto-maw', name: 'Maw', category: 'module', count: 1, imageUrl: `${BASE}/mephisto-paszcza.png` },
    { id: 'mephisto-claw', name: 'Claw', category: 'module', count: 4, imageUrl: `${BASE}/mephisto-szpon.png` },
    { id: 'mephisto-accelerator', name: 'Accelerator', category: 'module', count: 3, imageUrl: `${BASE}/mephisto-akcelerator.png` },
  ],
};
