import type { Army } from '../types';

import imgSztab from '../../assets/vegas/vegas-sztab.png';
import imgBitwa from '../../assets/vegas/vegas-bitwa.png';
import imgObrot from '../../assets/vegas/vegas-obrot.png';
import imgOdepchniecie from '../../assets/vegas/vegas-odepchniecie.png';
import imgRoszada from '../../assets/vegas/vegas-roszada.png';
import imgRuch from '../../assets/vegas/vegas-ruch.png';
import imgSnajper from '../../assets/vegas/vegas-snajper.png';
import imgNajemnik from '../../assets/vegas/vegas-najemnik.png';
import imgOchroniarz from '../../assets/vegas/vegas-ochroniarz.png';
import imgStraznik from '../../assets/vegas/vegas-straznik.png';
import imgStrzelec from '../../assets/vegas/vegas-strzelec.png';
import imgAgitator from '../../assets/vegas/vegas-agitator.png';
import imgDywersant from '../../assets/vegas/vegas-dywersant.png';
import imgMedyk from '../../assets/vegas/vegas-medyk.png';
import imgZwiadowca from '../../assets/vegas/vegas-zwiadowca.png';
import imgMina from '../../assets/vegas/vegas-mina.png';

export const vegas: Army = {
  id: 'vegas',
  name: 'Vegas',
  color: '#1a0f0a',
  accentColor: '#935d3f',
  description:
    'A casino-run city-state where mercenaries and bodyguards enforce the house rules. Vegas excels at repositioning — Rotation, Castling, and Push tokens let it shuffle the board, while Agitators and Shooters apply pressure.',
  hqAbility: 'Control Seizure — enemy units connected to HQ (in its direction) are taken over and count as yours.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    { id: 'vegas-battle', name: 'Battle', category: 'instant', count: 5, imageUrl: imgBitwa },
    { id: 'vegas-rotation', name: 'Rotation', category: 'instant', count: 3, imageUrl: imgObrot },
    { id: 'vegas-push', name: 'Push Back', category: 'instant', count: 3, imageUrl: imgOdepchniecie },
    { id: 'vegas-castling', name: 'Castling', category: 'instant', count: 2, imageUrl: imgRoszada },
    { id: 'vegas-move', name: 'Move', category: 'instant', count: 3, imageUrl: imgRuch },
    { id: 'vegas-sniper', name: 'Sniper', category: 'instant', count: 1, imageUrl: imgSnajper },

    // Soldiers
    { id: 'vegas-mercenary', name: 'Mercenary', category: 'soldier', count: 2, imageUrl: imgNajemnik },
    { id: 'vegas-bodyguard', name: 'Bodyguard', category: 'soldier', count: 2, imageUrl: imgOchroniarz },
    { id: 'vegas-guardian', name: 'Guardian', category: 'soldier', count: 2, imageUrl: imgStraznik },
    { id: 'vegas-shooter', name: 'Shooter', category: 'soldier', count: 2, imageUrl: imgStrzelec },

    // Foundations
    { id: 'vegas-mine', name: 'Mine', category: 'foundation', count: 2, imageUrl: imgMina },

    // Modules
    { id: 'vegas-agitator', name: 'Agitator', category: 'module', count: 3, imageUrl: imgAgitator },
    { id: 'vegas-saboteur', name: 'Saboteur', category: 'module', count: 1, imageUrl: imgDywersant },
    { id: 'vegas-medic', name: 'Medic', category: 'module', count: 1, imageUrl: imgMedyk },
    { id: 'vegas-scout', name: 'Scout', category: 'module', count: 2, imageUrl: imgZwiadowca },
  ],
};
