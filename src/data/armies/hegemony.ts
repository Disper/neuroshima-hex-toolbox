import type { Army } from '../types';

import imgSztab from '../../assets/hegemony/hegemonia-sztab.png';
import imgBitwa from '../../assets/hegemony/hegemonia-bitwa.png';
import imgRuch from '../../assets/hegemony/hegemonia-ruch.png';
import imgOdepchniecie from '../../assets/hegemony/hegemonia-odepchniecie.png';
import imgSnajper from '../../assets/hegemony/hegemonia-snajper.png';
import imgBiegacz from '../../assets/hegemony/hegemonia-biegacz.png';
import imgBydlak from '../../assets/hegemony/hegemonia-bydlak.png';
import imgGanger from '../../assets/hegemony/hegemonia-ganger.png';
import imgGladiator from '../../assets/hegemony/hegemonia-gladiator.png';
import imgSieciarz from '../../assets/hegemony/hegemonia-sieciarz.png';
import imgStraznik from '../../assets/hegemony/hegemonia-straznik.png';
import imgSupersieciarz from '../../assets/hegemony/hegemonia-supersieciarz.png';
import imgUniwersalnyzolnierz from '../../assets/hegemony/hegemonia-uniwersalnyzolnierz.png';
import imgBoss from '../../assets/hegemony/hegemonia-boss.png';
import imgKwatermistrz from '../../assets/hegemony/hegemonia-kwatermistrz.png';
import imgOficer1 from '../../assets/hegemony/hegemonia-oficer1.png';
import imgOficer2 from '../../assets/hegemony/hegemonia-oficer2.png';
import imgTransport from '../../assets/hegemony/hegemonia-transport.png';
import imgZwiadowca from '../../assets/hegemony/hegemonia-zwiadowca.png';

export const hegemony: Army = {
  id: 'hegemony',
  name: 'Hegemony',
  color: '#1a1005',
  accentColor: '#9d882c',
  description:
    'A ruthless criminal empire that controls the wasteland through fear and firepower. Hegemony combines cheap, abundant Gangers with elite specialists and powerful support modules to dominate the mid-game.',
  hqAbility: 'All friendly adjacent units gain +1 melee attack strength.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    { id: 'heg-battle', name: 'Battle', category: 'instant', count: 5, imageUrl: imgBitwa },
    { id: 'heg-move', name: 'Move', category: 'instant', count: 3, imageUrl: imgRuch },
    { id: 'heg-push', name: 'Push Back', category: 'instant', count: 2, imageUrl: imgOdepchniecie },
    { id: 'heg-sniper', name: 'Sniper', category: 'instant', count: 1, imageUrl: imgSnajper },

    // Soldiers
    { id: 'heg-runner', name: 'Runner', category: 'soldier', count: 3, imageUrl: imgBiegacz },
    { id: 'heg-brute', name: 'Thug', category: 'soldier', count: 1, imageUrl: imgBydlak },
    { id: 'heg-ganger', name: 'Ganger', category: 'soldier', count: 4, imageUrl: imgGanger },
    { id: 'heg-gladiator', name: 'Gladiator', category: 'soldier', count: 1, imageUrl: imgGladiator },
    { id: 'heg-netter', name: 'Net Fighter', category: 'soldier', count: 2, imageUrl: imgSieciarz },
    { id: 'heg-guardian', name: 'Guard', category: 'soldier', count: 1, imageUrl: imgStraznik },
    { id: 'heg-super-netter', name: 'Net Master', category: 'soldier', count: 1, imageUrl: imgSupersieciarz },
    { id: 'heg-universal-soldier', name: 'Universal Soldier', category: 'soldier', count: 3, imageUrl: imgUniwersalnyzolnierz },

    // Modules
    { id: 'heg-boss', name: 'The Boss', category: 'module', count: 1, imageUrl: imgBoss },
    { id: 'heg-quartermaster', name: 'Quartermaster', category: 'module', count: 1, imageUrl: imgKwatermistrz },
    { id: 'heg-officer-1', name: 'Officer I', category: 'module', count: 2, imageUrl: imgOficer1 },
    { id: 'heg-officer-2', name: 'Officer II', category: 'module', count: 1, imageUrl: imgOficer2 },
    { id: 'heg-transport', name: 'Transport', category: 'module', count: 1, imageUrl: imgTransport },
    { id: 'heg-scout', name: 'Scout', category: 'module', count: 1, imageUrl: imgZwiadowca },
  ],
};
