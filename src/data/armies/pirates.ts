import type { Army } from '../types';

import imgSztab from '../../assets/pirates/piraci-sztab.jpg';
import imgBitwa from '../../assets/pirates/piraci-bitwa.jpg';
import imgRuch from '../../assets/pirates/piraci-ruch.jpg';
import imgFala from '../../assets/pirates/piraci-fala.jpg';
import imgTawerna from '../../assets/pirates/piraci-tawerna.jpg';
import imgMotorowka from '../../assets/pirates/piraci-motorowka.jpg';
import imgWedkarz from '../../assets/pirates/piraci-wedkarz.jpg';
import imgHarpun from '../../assets/pirates/piraci-harpun.jpg';
import imgKrokodyl from '../../assets/pirates/piraci-krokodyl.jpg';
import imgSternik from '../../assets/pirates/piraci-sternik.jpg';
import imgSzmugler from '../../assets/pirates/piraci-szmugler.jpg';
import imgBosman from '../../assets/pirates/piraci-bosman.jpg';
import imgDzialkoWodne from '../../assets/pirates/piraci-dzialko-wodne.jpg';
import imgMatka from '../../assets/pirates/piraci-matka.jpg';
import imgOficer1 from '../../assets/pirates/piraci-oficer1.jpg';
import imgDywersant from '../../assets/pirates/piraci-dywersant.jpg';
import imgMedyk from '../../assets/pirates/piraci-medyk.jpg';

export const pirates: Army = {
  id: 'pirates',
  name: 'Pirates',
  color: '#0c1a2e',
  accentColor: '#177d88',
  description:
    'Ruthless river raiders who control the waterways of the wasteland. Pirates are a nimble, aggressive army with strong ranged firepower and tricks that move both their own units and enemy pieces across the board.',
  hqAbility: 'Drift — HQ moves on Water Fields. Uses special water board setup.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    { id: 'pirates-battle', name: 'Battle', category: 'instant', count: 5, imageUrl: imgBitwa },
    { id: 'pirates-move', name: 'Move', category: 'instant', count: 3, imageUrl: imgRuch },
    { id: 'pirates-wave', name: 'Wave', category: 'instant', count: 1, imageUrl: imgFala },

    // Implants
    { id: 'pirates-tavern', name: 'Tavern', category: 'implant', count: 1, imageUrl: imgTawerna },

    // Soldiers
    { id: 'pirates-motorboat', name: 'Motorboat', category: 'soldier', count: 2, imageUrl: imgMotorowka },
    { id: 'pirates-fisherman', name: 'Fisherman', category: 'soldier', count: 1, imageUrl: imgWedkarz },
    { id: 'pirates-harpoon', name: 'Harpoon', category: 'soldier', count: 2, imageUrl: imgHarpun },
    { id: 'pirates-crocodile', name: 'Crocodile', category: 'soldier', count: 2, imageUrl: imgKrokodyl },
    { id: 'pirates-helmsman', name: 'Helmsman', category: 'soldier', count: 3, imageUrl: imgSternik },
    { id: 'pirates-smuggler', name: 'Smuggler', category: 'soldier', count: 3, imageUrl: imgSzmugler },
    { id: 'pirates-boatswain', name: 'Bossman', category: 'soldier', count: 1, imageUrl: imgBosman },
    { id: 'pirates-water-cannon', name: 'Water Gun', category: 'soldier', count: 1, imageUrl: imgDzialkoWodne },

    // Modules
    { id: 'pirates-mother', name: 'Mother', category: 'module', count: 2, imageUrl: imgMatka },
    { id: 'pirates-officer', name: 'Officer I', category: 'module', count: 2, imageUrl: imgOficer1 },
    { id: 'pirates-saboteur', name: 'Saboteur', category: 'module', count: 3, imageUrl: imgDywersant },
    { id: 'pirates-medic', name: 'Medic', category: 'module', count: 2, imageUrl: imgMedyk },
  ],
};
