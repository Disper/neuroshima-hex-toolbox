import type { Army } from '../types';

import imgSztab from '../../assets/irongang/irongang-sztab.png';
import imgPodwojnyruch from '../../assets/irongang/irongang-podwojnyruch.png';
import imgRozkaz from '../../assets/irongang/irongang-rozkaz.png';
import imgFanatyk from '../../assets/irongang/irongang-fanatyk.png';
import imgSieciarzdystansowy from '../../assets/irongang/irongang-sieciarzdystansowy.png';
import imgDrwal from '../../assets/irongang/irongang-drwal.png';
import imgGora from '../../assets/irongang/irongang-gora.png';
import imgMotocyklista from '../../assets/irongang/irongang-motocyklista.png';
import imgOficer from '../../assets/irongang/irongang-oficer.png';
import imgSzef from '../../assets/irongang/irongang-szef.png';
import imgHak from '../../assets/irongang/irongang-hak.jpg';

export const ironGang: Army = {
  id: 'iron-gang',
  name: 'Iron Gang',
  color: '#141414',
  accentColor: '#959512',
  description:
    'A biker gang that rules the roads with brute force and mobility. Iron Gang fields Lumberjacks, Mountains, and Bikers, backed by the unique Order token — the most versatile instant in the game, with nine copies.',
  hqAbility:
    'Chain — the HQ has Chain: deal 1 wound to any enemy unit (including HQ) on a straight line between two Chain units.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    { id: 'ig-double-move', name: 'Doubled Move', category: 'instant', count: 2, imageUrl: imgPodwojnyruch },
    { id: 'ig-order', name: 'Order', category: 'instant', count: 9, imageUrl: imgRozkaz },

    // Soldiers
    { id: 'ig-fanatic', name: 'Fanatic', category: 'soldier', count: 3, imageUrl: imgFanatyk },
    { id: 'ig-ranged-netter', name: 'Ranged Net Fighter', category: 'soldier', count: 3, imageUrl: imgSieciarzdystansowy },
    { id: 'ig-lumberjack', name: 'Lumberjack', category: 'soldier', count: 5, imageUrl: imgDrwal },
    { id: 'ig-mountain', name: 'Mountain', category: 'soldier', count: 3, imageUrl: imgGora },
    { id: 'ig-motorcyclist', name: 'Biker', category: 'soldier', count: 4, imageUrl: imgMotocyklista },
    { id: 'ig-hook', name: 'Hook', category: 'soldier', count: 1, imageUrl: imgHak },

    // Modules
    { id: 'ig-officer', name: 'Officer', category: 'module', count: 4, imageUrl: imgOficer },
    { id: 'ig-boss', name: 'Boss', category: 'module', count: 1, imageUrl: imgSzef },
  ],
};
