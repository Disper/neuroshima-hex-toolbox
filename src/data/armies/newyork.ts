import type { Army } from '../types';

import imgSztab from '../../assets/newyork/nowyjork-sztab.png';
import imgBitwa from '../../assets/newyork/nowyjork-bitwa.png';
import imgRuch from '../../assets/newyork/nowyjork-ruch.png';
import imgOdepchniecie from '../../assets/newyork/nowyjork-odepchniecie.png';
import imgSnajper from '../../assets/newyork/nowyjork-snajper.png';
import imgStrzelec from '../../assets/newyork/nowyjork-strzelec.png';
import imgStrzelecwyborowy from '../../assets/newyork/nowyjork-strzelecwyborowy.png';
import imgShotgun from '../../assets/newyork/nowyjork-shotgun.png';
import imgSzpiegstrzelec from '../../assets/newyork/nowyjork-szpiegstrzelec.png';
import imgWyrzutniarakiet from '../../assets/newyork/nowyjork-wyrzutniarakiet.png';
import imgGliniarz from '../../assets/newyork/nowyjork-gliniarz.png';
import imgStalowybokser from '../../assets/newyork/nowyjork-stalowybokser.png';
import imgMlot from '../../assets/newyork/nowyjork-mlot.png';
import imgOdpychacz from '../../assets/newyork/nowyjork-odpychacz.png';
import imgSzpiegczysciciel from '../../assets/newyork/nowyjork-szpiegczysciciel.png';
import imgSieciarz from '../../assets/newyork/nowyjork-sieciarz.png';
import imgSierzant from '../../assets/newyork/nowyjork-sierzant.png';
import imgOficer1 from '../../assets/newyork/nowyjork-oficer1.png';
import imgOficer2 from '../../assets/newyork/nowyjork-oficer2.png';
import imgZwiadowca from '../../assets/newyork/nowyjork-zwiadowca.png';
import imgMina from '../../assets/newyork/nowyjork-mina.png';

export const newYork: Army = {
  id: 'new-york',
  name: 'New York',
  color: '#0f1419',
  accentColor: '#56647d',
  description:
    'A hardened urban militia defending the ruins of the Big Apple. New York fields a mix of cops, snipers, and street fighters — strong ranged firepower backed by versatile modules and Mine tokens for area control.',
  hqAbility: 'Adjacent friendly units gain +1 durability (one extra wound before death). Lost when unit leaves adjacency or HQ is netted.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    { id: 'ny-battle', name: 'Battle', category: 'instant', count: 5, imageUrl: imgBitwa },
    { id: 'ny-move', name: 'Move', category: 'instant', count: 2, imageUrl: imgRuch },
    { id: 'ny-push', name: 'Push Back', category: 'instant', count: 1, imageUrl: imgOdepchniecie },
    { id: 'ny-sniper', name: 'Sniper', category: 'instant', count: 1, imageUrl: imgSnajper },

    // Soldiers
    { id: 'ny-shooter', name: 'Shooter', category: 'soldier', count: 1, imageUrl: imgStrzelec },
    { id: 'ny-marksman', name: 'Sharpshooter', category: 'soldier', count: 2, imageUrl: imgStrzelecwyborowy },
    { id: 'ny-shotgun', name: 'Shotgun', category: 'soldier', count: 1, imageUrl: imgShotgun },
    { id: 'ny-spy-shooter', name: 'Spy Shooter', category: 'soldier', count: 2, imageUrl: imgSzpiegstrzelec },
    { id: 'ny-rocket-launcher', name: 'Rocket Launcher', category: 'soldier', count: 1, imageUrl: imgWyrzutniarakiet },
    { id: 'ny-cop', name: 'Cop', category: 'soldier', count: 2, imageUrl: imgGliniarz },
    { id: 'ny-steel-boxer', name: 'Steel Boxer', category: 'soldier', count: 2, imageUrl: imgStalowybokser },
    { id: 'ny-hammer', name: 'Hammer', category: 'soldier', count: 2, imageUrl: imgMlot },
    { id: 'ny-pusher', name: 'Pusher', category: 'soldier', count: 1, imageUrl: imgOdpychacz },
    { id: 'ny-spy-cleaner', name: 'Spy Cleaner', category: 'soldier', count: 1, imageUrl: imgSzpiegczysciciel },
    { id: 'ny-netter', name: 'Net Fighter', category: 'soldier', count: 1, imageUrl: imgSieciarz },

    // Foundations
    { id: 'ny-mine', name: 'Mine', category: 'foundation', count: 2, imageUrl: imgMina },

    // Modules
    { id: 'ny-sergeant', name: 'Sergeant', category: 'module', count: 1, imageUrl: imgSierzant },
    { id: 'ny-officer-1', name: 'Officer I', category: 'module', count: 2, imageUrl: imgOficer1 },
    { id: 'ny-officer-2', name: 'Officer II', category: 'module', count: 2, imageUrl: imgOficer2 },
    { id: 'ny-scout', name: 'Scout', category: 'module', count: 2, imageUrl: imgZwiadowca },
  ],
};
