import type { Army } from '../types';

import imgSztab from '../../assets/outpost/posterunek-sztab.png';
import imgBitwa from '../../assets/outpost/posterunek-bitwa.png';
import imgRuch from '../../assets/outpost/posterunek-ruch.png';
import imgSnajper from '../../assets/outpost/posterunek-snajper.png';
import imgBiegacz from '../../assets/outpost/posterunek-biegacz.png';
import imgCkm from '../../assets/outpost/posterunek-ckm.png';
import imgKomandos from '../../assets/outpost/posterunek-komandos.png';
import imgLikwidator from '../../assets/outpost/posterunek-likwidator.png';
import imgPancerzwspomagany from '../../assets/outpost/posterunek-pancerzwspomagany.png';
import imgSilacz from '../../assets/outpost/posterunek-silacz.png';
import imgCentrumrozpoznania from '../../assets/outpost/posterunek-centrumrozpoznania.png';
import imgDywersant from '../../assets/outpost/posterunek-dywersant.png';
import imgMedyk from '../../assets/outpost/posterunek-medyk.png';
import imgOficer from '../../assets/outpost/posterunek-oficer.png';
import imgSkoper from '../../assets/outpost/posterunek-skoper.png';
import imgZwiadowca from '../../assets/outpost/posterunek-zwiadowca.png';

export const outpost: Army = {
  id: 'outpost',
  name: 'Outpost',
  color: '#0d1a10',
  accentColor: '#63982a',
  description:
    'A disciplined human military unit holding the line against all threats. Outpost has the most Move tokens in the game, letting it reposition constantly, and fields highly versatile Commandos that excel in any situation.',
  hqAbility: 'Adjacent units may repeat their action in an Initiative segment 1 later. Units that acted in Initiative 0 cannot repeat.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    { id: 'outpost-battle', name: 'Battle', category: 'instant', count: 6, imageUrl: imgBitwa },
    { id: 'outpost-move', name: 'Move', category: 'instant', count: 7, imageUrl: imgRuch },
    { id: 'outpost-sniper', name: 'Sniper', category: 'instant', count: 1, imageUrl: imgSnajper },

    // Soldiers
    { id: 'outpost-runner', name: 'Runner', category: 'soldier', count: 2, imageUrl: imgBiegacz },
    { id: 'outpost-hmg', name: 'HMG', category: 'soldier', count: 1, imageUrl: imgCkm },
    { id: 'outpost-commando', name: 'Commando', category: 'soldier', count: 5, imageUrl: imgKomandos },
    { id: 'outpost-liquidator', name: 'Annihilator', category: 'soldier', count: 2, imageUrl: imgLikwidator },
    { id: 'outpost-powered-armour', name: 'Mobile Armor', category: 'soldier', count: 1, imageUrl: imgPancerzwspomagany },
    { id: 'outpost-strongman', name: 'Brawler', category: 'soldier', count: 1, imageUrl: imgSilacz },

    // Modules
    { id: 'outpost-recon-centre', name: 'Recon Centre', category: 'module', count: 1, imageUrl: imgCentrumrozpoznania },
    { id: 'outpost-saboteur', name: 'Saboteur', category: 'module', count: 1, imageUrl: imgDywersant },
    { id: 'outpost-medic', name: 'Medic', category: 'module', count: 2, imageUrl: imgMedyk },
    { id: 'outpost-officer', name: 'Officer', category: 'module', count: 1, imageUrl: imgOficer },
    { id: 'outpost-scoper', name: 'Scoper', category: 'module', count: 1, imageUrl: imgSkoper },
    { id: 'outpost-scout', name: 'Scout', category: 'module', count: 2, imageUrl: imgZwiadowca },
  ],
};
