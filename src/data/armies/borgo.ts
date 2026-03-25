import type { Army } from '../types';

import imgSztab from '../../assets/borgo/borgo-sztab.png';
import imgBitwa from '../../assets/borgo/borgo-bitwa.png';
import imgRuch from '../../assets/borgo/borgo-ruch.png';
import imgGranat from '../../assets/borgo/borgo-granat.png';
import imgMutek from '../../assets/borgo/borgo-mutek.png';
import imgNozownik from '../../assets/borgo/borgo-nozownik.png';
import imgSieciarz from '../../assets/borgo/borgo-sieciarz.png';
import imgSupermutant from '../../assets/borgo/borgo-supermutant.png';
import imgSilacz from '../../assets/borgo/borgo-silacz.png';
import imgZabojca from '../../assets/borgo/borgo-zabojca.png';
import imgMedyk from '../../assets/borgo/borgo-medyk.png';
import imgOficer from '../../assets/borgo/borgo-oficer.png';
import imgSuperoficer from '../../assets/borgo/borgo-superoficer.png';
import imgZwiadowca from '../../assets/borgo/borgo-zwiadowca.png';

export const borgo: Army = {
  id: 'borgo',
  name: 'Borgo',
  color: '#1a0a0f',
  accentColor: '#4a657f',
  description:
    'A savage mutant gang led by the towering Super-mutant. Borgo floods the board with cheap, aggressive fighters and overwhelms enemies through sheer numbers, backed by the highest Battle token count in the game.',
  hqAbility: 'All friendly adjacent units gain +1 to Initiative.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    { id: 'borgo-battle', name: 'Battle', category: 'instant', count: 6, imageUrl: imgBitwa },
    { id: 'borgo-move', name: 'Move', category: 'instant', count: 4, imageUrl: imgRuch },
    { id: 'borgo-grenade', name: 'Grenade', category: 'instant', count: 1, imageUrl: imgGranat },

    // Soldiers
    { id: 'borgo-mutek', name: 'Mutant', category: 'soldier', count: 6, imageUrl: imgMutek },
    { id: 'borgo-knifer', name: 'Claws', category: 'soldier', count: 4, imageUrl: imgNozownik },
    { id: 'borgo-netter', name: 'Net Fighter', category: 'soldier', count: 2, imageUrl: imgSieciarz },
    { id: 'borgo-super-mutant', name: 'Super-mutant', category: 'soldier', count: 1, imageUrl: imgSupermutant },
    { id: 'borgo-strongman', name: 'Brawler', category: 'soldier', count: 2, imageUrl: imgSilacz },
    { id: 'borgo-assassin', name: 'Assassin', category: 'soldier', count: 2, imageUrl: imgZabojca },

    // Modules
    { id: 'borgo-medic', name: 'Medic', category: 'module', count: 1, imageUrl: imgMedyk },
    { id: 'borgo-officer', name: 'Officer', category: 'module', count: 2, imageUrl: imgOficer },
    { id: 'borgo-super-officer', name: 'Super-officer', category: 'module', count: 1, imageUrl: imgSuperoficer },
    { id: 'borgo-scout', name: 'Scout', category: 'module', count: 2, imageUrl: imgZwiadowca },
  ],
};
