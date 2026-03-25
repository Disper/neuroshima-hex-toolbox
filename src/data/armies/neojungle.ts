import type { Army } from '../types';

import imgSztab from '../../assets/neojungle/neodzungla-sztab.png';
import imgBitwa from '../../assets/neojungle/neodzungla-bitwa.png';
import imgRoszada from '../../assets/neojungle/neodzungla-roszada.png';
import imgRuch from '../../assets/neojungle/neodzungla-ruch.png';
import imgMalabomba from '../../assets/neojungle/neodzungla-malabomba.png';
import imgMonstrum from '../../assets/neojungle/neodzungla-monstrum.png';
import imgRozkrajacz from '../../assets/neojungle/neodzungla-rozkrajacz.png';
import imgTruciciel from '../../assets/neojungle/neodzungla-truciciel.png';
import imgMiazdzyciel from '../../assets/neojungle/neodzungla-miazdzyciel.png';
import imgScianadrzew from '../../assets/neojungle/neodzungla-scianadrzew.png';
import imgSieciarz from '../../assets/neojungle/neodzungla-sieciarz.png';
import imgKlebowisko from '../../assets/neojungle/neodzungla-klebowisko.png';
import imgPnacza from '../../assets/neojungle/neodzungla-pnacza.png';
import imgMedyk from '../../assets/neojungle/neodzungla-medyk.png';
import imgSymbiontalfa from '../../assets/neojungle/neodzungla-symbiontalfa.png';
import imgSymbiontbeta from '../../assets/neojungle/neodzungla-symbiontbeta.png';
import imgSymbiontgamma from '../../assets/neojungle/neodzungla-symbiontgamma.png';
import imgKorzen from '../../assets/neojungle/neodzungla-korzen.png';

export const neojungle: Army = {
  id: 'neojungle',
  name: 'Neojungle',
  color: '#0d1a0d',
  accentColor: '#437232',
  description:
    'A mutated jungle that has reclaimed the wasteland. Neojungle fights with monstrous creatures, poison, and living terrain — Rippers, Poisoners, and Tree Walls control the board while Symbionts and Roots provide support.',
  hqAbility: 'Matrix — adjacent units form a Matrix. Units adjacent to the Matrix join it. Modules on Matrix units apply to all Matrix units.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    { id: 'nj-battle', name: 'Battle', category: 'instant', count: 4, imageUrl: imgBitwa },
    { id: 'nj-castling', name: 'Castling', category: 'instant', count: 2, imageUrl: imgRoszada },
    { id: 'nj-move', name: 'Move', category: 'instant', count: 1, imageUrl: imgRuch },
    { id: 'nj-small-bomb', name: 'Small Bomb', category: 'instant', count: 1, imageUrl: imgMalabomba },

    // Soldiers
    { id: 'nj-monster', name: 'Monster', category: 'soldier', count: 1, imageUrl: imgMonstrum },
    { id: 'nj-ripper', name: 'Slicer', category: 'soldier', count: 4, imageUrl: imgRozkrajacz },
    { id: 'nj-poisoner', name: 'Nightshade', category: 'soldier', count: 2, imageUrl: imgTruciciel },
    { id: 'nj-crusher', name: 'Crusher', category: 'soldier', count: 3, imageUrl: imgMiazdzyciel },
    { id: 'nj-tree-wall', name: 'Wall of Trees', category: 'soldier', count: 1, imageUrl: imgScianadrzew },
    { id: 'nj-netter', name: 'Net Fighter', category: 'soldier', count: 3, imageUrl: imgSieciarz },
    { id: 'nj-tangle', name: 'Swarm', category: 'soldier', count: 2, imageUrl: imgKlebowisko },
    { id: 'nj-vine', name: 'Vines', category: 'module', count: 1, imageUrl: imgPnacza },

    // Foundations
    { id: 'nj-root', name: 'Roots', category: 'foundation', count: 2, imageUrl: imgKorzen },

    // Modules
    { id: 'nj-medic', name: 'Medic', category: 'module', count: 3, imageUrl: imgMedyk },
    { id: 'nj-symbiont-alpha', name: 'Symbiont Alpha', category: 'module', count: 1, imageUrl: imgSymbiontalfa },
    { id: 'nj-symbiont-beta', name: 'Symbiont Beta', category: 'module', count: 1, imageUrl: imgSymbiontbeta },
    { id: 'nj-symbiont-gamma', name: 'Symbiont Gamma', category: 'module', count: 2, imageUrl: imgSymbiontgamma },
  ],
};
