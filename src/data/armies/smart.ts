import type { Army } from '../types';

import imgSztab from '../../assets/smart/smart-sztab.png';
import imgBitwa from '../../assets/smart/smart-bitwa.png';
import imgOdepchniecie from '../../assets/smart/smart-odepchniecie.png';
import imgRuch from '../../assets/smart/smart-ruch.png';
import imgSnajper from '../../assets/smart/smart-snajper.png';
import imgTerror from '../../assets/smart/smart-terror.png';
import imgRozpruwacz from '../../assets/smart/smart-rozpruwacz.png';
import imgTwister from '../../assets/smart/smart-twister.png';
import imgSieciarz from '../../assets/smart/smart-sieciarz.png';
import imgDzialkogaussa from '../../assets/smart/smart-dzialkogaussa.png';
import imgGolemmk3 from '../../assets/smart/smart-golemmk3.png';
import imgCyborg from '../../assets/smart/smart-cyborg.png';
import imgBiodroid from '../../assets/smart/smart-biodroid.png';
import imgTransporter from '../../assets/smart/smart-transporter.png';
import imgOficer from '../../assets/smart/smart-oficer.png';
import imgMatka from '../../assets/smart/smart-matka.png';
import imgZwiadowca from '../../assets/smart/smart-zwiadowca.png';

export const smart: Army = {
  id: 'smart',
  name: 'Smart',
  color: '#0a0f14',
  accentColor: '#575b5d',
  description:
    'An AI-controlled army of robots, cyborgs, and bio-droids. Smart combines heavy firepower — Gauss Cannons, MK3 Golems, Rippers — with Terror tokens and strong module support. Few instants, but devastating when they strike.',
  hqAbility: 'Adjacent units may perform an extra move and/or rotate, as if they had Mobility.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    { id: 'smart-battle', name: 'Battle', category: 'instant', count: 4, imageUrl: imgBitwa },
    { id: 'smart-push', name: 'Push Back', category: 'instant', count: 3, imageUrl: imgOdepchniecie },
    { id: 'smart-move', name: 'Move', category: 'instant', count: 1, imageUrl: imgRuch },
    { id: 'smart-sniper', name: 'Sniper', category: 'instant', count: 1, imageUrl: imgSnajper },
    { id: 'smart-terror', name: 'Terror', category: 'instant', count: 2, imageUrl: imgTerror },

    // Soldiers
    { id: 'smart-ripper', name: 'Ripper', category: 'soldier', count: 1, imageUrl: imgRozpruwacz },
    { id: 'smart-twister', name: 'Twister', category: 'soldier', count: 1, imageUrl: imgTwister },
    { id: 'smart-netter', name: 'Net Fighter', category: 'soldier', count: 2, imageUrl: imgSieciarz },
    { id: 'smart-gauss-cannon', name: 'Gauss Cannon', category: 'soldier', count: 3, imageUrl: imgDzialkogaussa },
    { id: 'smart-golem-mk3', name: 'MK3 Golem', category: 'soldier', count: 2, imageUrl: imgGolemmk3 },
    { id: 'smart-cyborg', name: 'Cyborg', category: 'soldier', count: 2, imageUrl: imgCyborg },
    { id: 'smart-bio-droid', name: 'Bio-droid', category: 'soldier', count: 1, imageUrl: imgBiodroid },

    // Modules
    { id: 'smart-transporter', name: 'Transporter', category: 'soldier', count: 3, imageUrl: imgTransporter },
    { id: 'smart-officer', name: 'Officer', category: 'module', count: 4, imageUrl: imgOficer },
    { id: 'smart-mother', name: 'Mother Module', category: 'module', count: 2, imageUrl: imgMatka },
    { id: 'smart-scout', name: 'Scout', category: 'module', count: 2, imageUrl: imgZwiadowca },
  ],
};
