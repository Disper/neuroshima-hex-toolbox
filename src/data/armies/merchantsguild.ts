import type { Army } from '../types';

import imgSztab from '../../assets/merchantsguild/gildiakupcow-sztab.jpg';
import imgPlatnySnajper from '../../assets/merchantsguild/gildiakupcow-platny-snajper.jpg';
import imgCzarnyRynek from '../../assets/merchantsguild/gildiakupcow-czarny-rynek.jpg';
import imgRuch from '../../assets/merchantsguild/gildiakupcow-ruch.jpg';
import imgBitwa from '../../assets/merchantsguild/gildiakupcow-bitwa.jpg';
import imgStrateg from '../../assets/merchantsguild/gildiakupcow-strateg.jpg';
import imgLapowkarz from '../../assets/merchantsguild/gildiakupcow-lapowkarz.jpg';
import imgWybuchowyChris from '../../assets/merchantsguild/gildiakupcow-wybuchowy-chris.jpg';
import imgKowalski from '../../assets/merchantsguild/gildiakupcow-kowalski.jpg';
import imgCzarnaSkrzynka from '../../assets/merchantsguild/gildiakupcow-czarna-skrzynka.jpg';
import imgRyzykant from '../../assets/merchantsguild/gildiakupcow-ryzykant.jpg';
import imgLiderZwiadu from '../../assets/merchantsguild/gildiakupcow-lider-zwiadu.jpg';
import imgHakerka from '../../assets/merchantsguild/gildiakupcow-hakerka.jpg';
import imgCzolg from '../../assets/merchantsguild/gildiakupcow-czolg.jpg';
import imgPiratDrogowy from '../../assets/merchantsguild/gildiakupcow-pirat-drogowy.jpg';
import imgLowczyniGlow from '../../assets/merchantsguild/gildiakupcow-lowczyni-glow.jpg';
import imgWiezyczkaZFotokomorka from '../../assets/merchantsguild/gildiakupcow-wiezyczka-z-fotokomorka.jpg';
import imgZwiadowca from '../../assets/merchantsguild/gildiakupcow-zwiadowca.jpg';
import imgKomander from '../../assets/merchantsguild/gildiakupcow-komander.jpg';
import imgNaczelnik from '../../assets/merchantsguild/gildiakupcow-naczelnik.jpg';

export const merchantsGuild: Army = {
  id: 'merchants-guild',
  name: 'Merchants Guild',
  color: '#1a1408',
  accentColor: '#9d8a2b',
  description:
    'A wealthy trading faction that buys victory. Merchants Guild fields Paid Snipers, Black Market, Bomber Chris, and Welders — backed by Commanders, Bosses, and the unique Gamble mechanic for high-risk, high-reward plays.',
  hqAbility: 'Capital — gain Gamble when HQ destroys units in Battle. Start with 2 Gamble.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    { id: 'mg-paid-sniper', name: 'Paid Sniper', category: 'instant', count: 1, imageUrl: imgPlatnySnajper },
    { id: 'mg-black-market', name: 'Black Market', category: 'instant', count: 1, imageUrl: imgCzarnyRynek },
    { id: 'mg-move', name: 'Move', category: 'instant', count: 5, imageUrl: imgRuch },
    { id: 'mg-battle', name: 'Battle', category: 'instant', count: 2, imageUrl: imgBitwa },

    // Implants
    { id: 'mg-strategist', name: 'Strategist', category: 'implant', count: 1, imageUrl: imgStrateg },
    { id: 'mg-briber', name: 'Briber', category: 'implant', count: 1, imageUrl: imgLapowkarz },

    // Soldiers
    { id: 'mg-explosive-chris', name: 'Bomber Chris', category: 'soldier', count: 3, imageUrl: imgWybuchowyChris },
    { id: 'mg-kowalski', name: 'Welder', category: 'soldier', count: 2, imageUrl: imgKowalski },
    { id: 'mg-black-box', name: 'Black Box', category: 'soldier', count: 2, imageUrl: imgCzarnaSkrzynka },
    { id: 'mg-risk-taker', name: 'Daredevil', category: 'soldier', count: 1, imageUrl: imgRyzykant },
    { id: 'mg-squad-leader', name: 'Scout Leader', category: 'soldier', count: 2, imageUrl: imgLiderZwiadu },
    { id: 'mg-hacker', name: 'Hacker', category: 'soldier', count: 1, imageUrl: imgHakerka },
    { id: 'mg-tank', name: 'Tank', category: 'soldier', count: 1, imageUrl: imgCzolg },
    { id: 'mg-road-pirate', name: 'Highway Cruiser', category: 'soldier', count: 2, imageUrl: imgPiratDrogowy },
    { id: 'mg-head-hunter', name: 'Debt Hunter', category: 'soldier', count: 1, imageUrl: imgLowczyniGlow },
    { id: 'mg-turret', name: 'Automatic Turret', category: 'soldier', count: 1, imageUrl: imgWiezyczkaZFotokomorka },

    // Modules
    { id: 'mg-scout', name: 'Scout', category: 'module', count: 1, imageUrl: imgZwiadowca },
    { id: 'mg-commander', name: 'Commander', category: 'module', count: 2, imageUrl: imgKomander },
    { id: 'mg-chief', name: 'Boss', category: 'module', count: 4, imageUrl: imgNaczelnik },
  ],
};
