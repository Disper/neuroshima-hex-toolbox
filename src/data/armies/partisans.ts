import type { Army } from '../types';

import imgSztab from '../../assets/partisans/partyzanci-sztab.jpg';
import imgWycofanie from '../../assets/partisans/partyzanci-wycofanie.jpg';
import imgTaktyka from '../../assets/partisans/partyzanci-taktyka.jpg';
import imgRuch from '../../assets/partisans/partyzanci-ruch.jpg';
import imgBitwa from '../../assets/partisans/partyzanci-bitwa.jpg';
import imgZarzadcaBunkra from '../../assets/partisans/partyzanci-zarzadca-bunkra.jpg';
import imgUspionyAgent from '../../assets/partisans/partyzanci-uspiony-agent.jpg';
import imgAsystentkaDoktora from '../../assets/partisans/partyzanci-asystentka-doktora.jpg';
import imgDronStraznik from '../../assets/partisans/partyzanci-dron-straznik.jpg';
import imgCyborgCharlie from '../../assets/partisans/partyzanci-cyborg-charlie.jpg';
import imgProwokatorka from '../../assets/partisans/partyzanci-prowokatorka.jpg';
import imgGustav2 from '../../assets/partisans/partyzanci-gustav-2.jpg';
import imgSzalonySid from '../../assets/partisans/partyzanci-szalony-sid.jpg';
import imgZwiadowcaWeteran from '../../assets/partisans/partyzanci-zwiadowca-weteran.jpg';
import imgZwiadowca from '../../assets/partisans/partyzanci-zwiadowca.jpg';
import imgMedyk from '../../assets/partisans/partyzanci-medyk.jpg';
import imgSzofer from '../../assets/partisans/partyzanci-szofer.jpg';

export const partisans: Army = {
  id: 'partisans',
  name: 'Partisans',
  color: '#14100a',
  accentColor: '#5a333d',
  description:
    'Resistance fighters who strike from the shadows. Partisans combine Tactics and Withdrawal tokens for flexibility, Cyborg Charlie and Provocateurs for board control, and a mix of specialists — Bunker Manager, Sleeper Agent, Dr. Assistant.',
  hqAbility: 'Trap Launcher — once per turn, place a face-down Trap marker on any empty field in a straight line from the HQ.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    { id: 'part-withdrawal', name: 'Withdrawal', category: 'instant', count: 1, imageUrl: imgWycofanie },
    { id: 'part-tactics', name: 'Tactics', category: 'instant', count: 4, imageUrl: imgTaktyka },
    { id: 'part-move', name: 'Move', category: 'instant', count: 3, imageUrl: imgRuch },
    { id: 'part-battle', name: 'Battle', category: 'instant', count: 5, imageUrl: imgBitwa },

    // Soldiers
    { id: 'part-bunker-manager', name: 'Bunker Manager', category: 'module', count: 1, imageUrl: imgZarzadcaBunkra },
    { id: 'part-sleeper-agent', name: 'Sleeper Agent', category: 'soldier', count: 2, imageUrl: imgUspionyAgent },
    { id: 'part-doctor-assistant', name: 'Assistant Doctor', category: 'soldier', count: 2, imageUrl: imgAsystentkaDoktora },
    { id: 'part-guard-drone', name: 'Defense Drone', category: 'soldier', count: 1, imageUrl: imgDronStraznik },
    { id: 'part-cyborg-charlie', name: 'Cyborg Charlie', category: 'soldier', count: 4, imageUrl: imgCyborgCharlie },
    { id: 'part-provocateur', name: 'Provocateur', category: 'soldier', count: 3, imageUrl: imgProwokatorka },
    { id: 'part-gustav', name: 'Gustav 2.0', category: 'soldier', count: 2, imageUrl: imgGustav2 },
    { id: 'part-crazy-sid', name: 'Mad Sid', category: 'soldier', count: 1, imageUrl: imgSzalonySid },

    // Modules
    { id: 'part-veteran-scout', name: 'Scout Veteran', category: 'module', count: 1, imageUrl: imgZwiadowcaWeteran },
    { id: 'part-scout', name: 'Scout', category: 'module', count: 2, imageUrl: imgZwiadowca },
    { id: 'part-medic', name: 'Medic', category: 'module', count: 1, imageUrl: imgMedyk },
    { id: 'part-driver', name: 'Chauffeur', category: 'module', count: 1, imageUrl: imgSzofer },
  ],
};
