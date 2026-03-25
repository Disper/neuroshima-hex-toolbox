import type { Army } from '../types';

import imgSztab from '../../assets/sharrash/sharrash-sztab.png';
import imgBitwa from '../../assets/sharrash/sharrash-bitwa.png';
import imgRuch from '../../assets/sharrash/sharrash-ruch.png';
import imgParaliz from '../../assets/sharrash/sharrash-paraliz.png';
import imgPlaga from '../../assets/sharrash/sharrash-plaga.png';
import imgBestia from '../../assets/sharrash/sharrash-bestia.png';
import imgMutant from '../../assets/sharrash/sharrash-mutant.png';
import imgSzczury from '../../assets/sharrash/sharrash-szczury.png';
import imgMozdzierz from '../../assets/sharrash/sharrash-mozdzierz.png';
import imgLadunekwybuchowy from '../../assets/sharrash/sharrash-ladunekwybuchowy.png';
import imgPodziemia from '../../assets/sharrash/sharrash-podziemia.png';
import imgSmietnisko from '../../assets/sharrash/sharrash-smietnisko.png';
import imgMatka from '../../assets/sharrash/sharrash-matka.png';
import imgTransport from '../../assets/sharrash/sharrash-transport.png';
import imgOficer from '../../assets/sharrash/sharrash-oficer.png';
import imgMedyk from '../../assets/sharrash/sharrash-medyk.png';
import imgZwiadowca from '../../assets/sharrash/sharrash-zwiadowca.png';
import imgDziura from '../../assets/sharrash/sharrash-dziura.png';

export const sharrash: Army = {
  id: 'sharrash',
  name: 'Sharrash',
  color: '#14100a',
  accentColor: '#497762',
  description:
    'A chaotic underground faction of mutants, rats, and beasts. Sharrash floods the board with cheap units and explosives — Mortars, Demolition Charges, and Plague tokens create havoc while Mutants and Rats swarm the enemy.',
  hqAbility: 'Underground Castling — once per turn, swap HQ with an adjacent Underground unit.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    { id: 'sharrash-battle', name: 'Battle', category: 'instant', count: 5, imageUrl: imgBitwa },
    { id: 'sharrash-move', name: 'Move', category: 'instant', count: 2, imageUrl: imgRuch },
    { id: 'sharrash-paralysis', name: 'Paralysis', category: 'instant', count: 1, imageUrl: imgParaliz },
    { id: 'sharrash-plague', name: 'Plague', category: 'soldier', count: 2, imageUrl: imgPlaga },

    // Soldiers
    { id: 'sharrash-beast', name: 'Beast', category: 'soldier', count: 1, imageUrl: imgBestia },
    { id: 'sharrash-mutant', name: 'Mutant', category: 'soldier', count: 3, imageUrl: imgMutant },
    { id: 'sharrash-rats', name: 'Rats', category: 'soldier', count: 3, imageUrl: imgSzczury },
    { id: 'sharrash-mortar', name: 'Mortar', category: 'soldier', count: 3, imageUrl: imgMozdzierz },
    { id: 'sharrash-demolition-charge', name: 'Explosive', category: 'soldier', count: 4, imageUrl: imgLadunekwybuchowy },
    { id: 'sharrash-underground', name: 'Underworlds', category: 'module', count: 1, imageUrl: imgPodziemia },
    { id: 'sharrash-dump', name: 'Landfill', category: 'module', count: 1, imageUrl: imgSmietnisko },

    // Foundations
    { id: 'sharrash-hole', name: 'Hole', category: 'foundation', count: 1, imageUrl: imgDziura },

    // Modules
    { id: 'sharrash-mother', name: 'Mother', category: 'module', count: 1, imageUrl: imgMatka },
    { id: 'sharrash-transport', name: 'Transport', category: 'module', count: 2, imageUrl: imgTransport },
    { id: 'sharrash-officer', name: 'Officer', category: 'module', count: 1, imageUrl: imgOficer },
    { id: 'sharrash-medic', name: 'Medic', category: 'module', count: 2, imageUrl: imgMedyk },
    { id: 'sharrash-scout', name: 'Scout', category: 'module', count: 1, imageUrl: imgZwiadowca },
  ],
};
