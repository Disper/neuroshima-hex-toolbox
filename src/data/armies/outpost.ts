import type { Army } from '../types';

const BASE = 'https://neuroshimahex.pl/gfx/posterunek';

export const outpost: Army = {
  id: 'outpost',
  name: 'Outpost',
  color: '#0d1a10',
  accentColor: '#34d399',
  description:
    'A disciplined human military unit holding the line against all threats. Outpost has the most Move tokens in the game, letting it reposition constantly, and fields highly versatile Commandos that excel in any situation.',
  hqAbility: 'All friendly adjacent units gain +1 to all attacks.',
  hqImageUrl: `${BASE}/posterunek-sztab.png`,
  tiles: [
    // Instant tokens
    { id: 'outpost-battle', name: 'Battle', category: 'instant', count: 6, imageUrl: `${BASE}/posterunek-bitwa.png` },
    { id: 'outpost-move', name: 'Move', category: 'instant', count: 7, imageUrl: `${BASE}/posterunek-ruch.png` },

    // Soldiers
    { id: 'outpost-sniper', name: 'Sniper', category: 'soldier', count: 1, imageUrl: `${BASE}/posterunek-snajper.png` },
    { id: 'outpost-runner', name: 'Runner', category: 'soldier', count: 2, imageUrl: `${BASE}/posterunek-biegacz.png` },
    { id: 'outpost-hmg', name: 'HMG', category: 'soldier', count: 1, imageUrl: `${BASE}/posterunek-ckm.png` },
    { id: 'outpost-commando', name: 'Commando', category: 'soldier', count: 5, imageUrl: `${BASE}/posterunek-komandos.png` },
    { id: 'outpost-liquidator', name: 'Liquidator', category: 'soldier', count: 2, imageUrl: `${BASE}/posterunek-likwidator.png` },
    { id: 'outpost-powered-armour', name: 'Powered Armour', category: 'soldier', count: 1, imageUrl: `${BASE}/posterunek-pancerzwspomagany.png` },
    { id: 'outpost-strongman', name: 'Strongman', category: 'soldier', count: 1, imageUrl: `${BASE}/posterunek-silacz.png` },

    // Modules
    { id: 'outpost-recon-centre', name: 'Recon Centre', category: 'module', count: 1, imageUrl: `${BASE}/posterunek-centrumrozpoznania.png` },
    { id: 'outpost-saboteur', name: 'Saboteur', category: 'module', count: 1, imageUrl: `${BASE}/posterunek-dywersant.png` },
    { id: 'outpost-medic', name: 'Medic', category: 'module', count: 2, imageUrl: `${BASE}/posterunek-medyk.png` },
    { id: 'outpost-officer', name: 'Officer', category: 'module', count: 1, imageUrl: `${BASE}/posterunek-oficer.png` },
    { id: 'outpost-scoper', name: 'Scoper', category: 'module', count: 1, imageUrl: `${BASE}/posterunek-skoper.png` },
    { id: 'outpost-scout', name: 'Scout', category: 'module', count: 2, imageUrl: `${BASE}/posterunek-zwiadowca.png` },
  ],
};
