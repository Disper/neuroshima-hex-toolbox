import type { Army } from '../types';

import imgObiektniebieski from '../../assets/dancer/dancer-obiektniebieski.png';
import imgAkcja from '../../assets/dancer/dancer-akcja.png';
import imgBitwa from '../../assets/dancer/dancer-bitwa.png';
import imgOdepchniecie from '../../assets/dancer/dancer-odepchniecie.png';
import imgRuch from '../../assets/dancer/dancer-ruch.png';
import imgObiektczerwony from '../../assets/dancer/dancer-obiektczerwony.png';
import imgObiektzolty from '../../assets/dancer/dancer-obiektzolty.png';

export const dancer: Army = {
  id: 'dancer',
  name: 'Dancer',
  color: '#0a0a1a',
  accentColor: '#7d6d60',
  description:
    'Three board Objects (Blue, Red, Yellow) replace a normal HQ. The army has the highest instant count in the game — huge stacks of Action, Battle, Push Back, and Move. Strengths: durable units and Healing; Objects can hurt the enemy outside Battle. Weakness: only three units — you lose when any Object is destroyed (see NeuroshimaHex.pl / Dancer).',
  hqAbility:
    'Dancer uses three Object HQs. Yellow Object — Healing: may restore durability to itself or to an Object adjacent along its healing edge. All Objects: each has module-style edges that increase initiative or melee or ranged attack strength.',
  hqImageUrl: imgObiektniebieski,
  multiHeadquarters: true,
  tiles: [
    // Instant tokens
    { id: 'dancer-action', name: 'Action', category: 'instant', count: 7, imageUrl: imgAkcja },
    { id: 'dancer-battle', name: 'Battle', category: 'instant', count: 8, imageUrl: imgBitwa },
    { id: 'dancer-push', name: 'Push Back', category: 'instant', count: 7, imageUrl: imgOdepchniecie },
    { id: 'dancer-move', name: 'Move', category: 'instant', count: 10, imageUrl: imgRuch },

    // Board Objects — three HQs (Żetony Planszy – Obiekty), not in draw deck
    { id: 'dancer-blue-object', name: 'Blue Object', category: 'hq', count: 1, imageUrl: imgObiektniebieski, excludeFromDeck: true },
    { id: 'dancer-red-object', name: 'Red Object', category: 'hq', count: 1, imageUrl: imgObiektczerwony, excludeFromDeck: true },
    { id: 'dancer-yellow-object', name: 'Yellow Object', category: 'hq', count: 1, imageUrl: imgObiektzolty, excludeFromDeck: true },
  ],
};
