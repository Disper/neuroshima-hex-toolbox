import type { Army } from '../types';

import imgSztab from '../../assets/moloch/moloch-sztab.png';
import imgBitwa from '../../assets/moloch/moloch-bitwa.png';
import imgRuch from '../../assets/moloch/moloch-ruch.png';
import imgOdepchniecie from '../../assets/moloch/moloch-odepchniecie.png';
import imgBomba from '../../assets/moloch/moloch-bomba.png';
import imgBloker from '../../assets/moloch/moloch-bloker.png';
import imgCyborg from '../../assets/moloch/moloch-cyborg.png';
import imgDzialkogaussa from '../../assets/moloch/moloch-dzialkogaussa.png';
import imgJuggernaut from '../../assets/moloch/moloch-juggernaut.png';
import imgKlaun from '../../assets/moloch/moloch-klaun.png';
import imgLowca from '../../assets/moloch/moloch-lowca.png';
import imgObronca from '../../assets/moloch/moloch-obronca.png';
import imgOpancerzonylowca from '../../assets/moloch/moloch-opancerzonylowca.png';
import imgOpancerzonywartownik from '../../assets/moloch/moloch-opancerzonywartownik.png';
import imgRozpruwacz from '../../assets/moloch/moloch-rozpruwacz.png';
import imgSieciarz from '../../assets/moloch/moloch-sieciarz.png';
import imgSzturmowiec from '../../assets/moloch/moloch-szturmowiec.png';
import imgWartownik from '../../assets/moloch/moloch-wartownik.png';
import imgMozg from '../../assets/moloch/moloch-mozg.png';
import imgOficer from '../../assets/moloch/moloch-oficer.png';
import imgZwiadowca from '../../assets/moloch/moloch-zwiadowca.png';
import imgMedyk from '../../assets/moloch/moloch-medyk.png';
import imgMatka from '../../assets/moloch/moloch-matka.png';

export const moloch: Army = {
  id: 'moloch',
  name: 'Moloch',
  color: '#1e293b',
  accentColor: '#a93e29',
  description:
    'A mechano-electronic entity spanning several states. After 30 years it is larger and more powerful than ever, sending machine armies across the wasteland. Strong and durable, but slow and with few Battle tokens.',
  hqAbility: '+1 to ranged attack strength for all adjacent friendly units.',
  hqImageUrl: imgSztab,
  tiles: [
    { id: 'moloch-battle', name: 'Battle', category: 'instant', count: 4, imageUrl: imgBitwa },
    { id: 'moloch-move', name: 'Move', category: 'instant', count: 1, imageUrl: imgRuch },
    { id: 'moloch-push', name: 'Push Back', category: 'instant', count: 5, imageUrl: imgOdepchniecie },
    { id: 'moloch-bomb', name: 'Air Strike', category: 'instant', count: 1, imageUrl: imgBomba },
    { id: 'moloch-blocker', name: 'Blocker', category: 'soldier', count: 2, imageUrl: imgBloker },
    { id: 'moloch-cyborg', name: 'Hybrid', category: 'soldier', count: 2, imageUrl: imgCyborg },
    { id: 'moloch-gauss-cannon', name: 'Gauss Cannon', category: 'soldier', count: 1, imageUrl: imgDzialkogaussa },
    { id: 'moloch-juggernaut', name: 'Juggernaut', category: 'soldier', count: 1, imageUrl: imgJuggernaut },
    { id: 'moloch-clown', name: 'The Clown', category: 'soldier', count: 1, imageUrl: imgKlaun },
    { id: 'moloch-hunter', name: 'Hunter Killer', category: 'soldier', count: 2, imageUrl: imgLowca },
    { id: 'moloch-defender', name: 'Protector', category: 'soldier', count: 1, imageUrl: imgObronca },
    { id: 'moloch-armored-hunter', name: 'Armored Hunter', category: 'soldier', count: 2, imageUrl: imgOpancerzonylowca },
    { id: 'moloch-armored-sentry', name: 'Guard', category: 'soldier', count: 1, imageUrl: imgOpancerzonywartownik },
    { id: 'moloch-ripper', name: 'Ripper', category: 'soldier', count: 1, imageUrl: imgRozpruwacz },
    { id: 'moloch-netter', name: 'Net Fighter', category: 'soldier', count: 1, imageUrl: imgSieciarz },
    { id: 'moloch-assault', name: 'Stormtrooper', category: 'soldier', count: 1, imageUrl: imgSzturmowiec },
    { id: 'moloch-sentry', name: 'Armored Guard', category: 'soldier', count: 1, imageUrl: imgWartownik },
    { id: 'moloch-brain', name: 'The Brain', category: 'module', count: 1, imageUrl: imgMozg },
    { id: 'moloch-officer', name: 'Officer', category: 'module', count: 1, imageUrl: imgOficer },
    { id: 'moloch-scout', name: 'Scout', category: 'module', count: 1, imageUrl: imgZwiadowca },
    { id: 'moloch-medic', name: 'Medic', category: 'module', count: 2, imageUrl: imgMedyk },
    { id: 'moloch-mother', name: 'Mother Module', category: 'module', count: 1, imageUrl: imgMatka },
  ],
};
