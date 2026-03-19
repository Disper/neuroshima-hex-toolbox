import type { Army } from '../types';

import imgSztab from '../../assets/sandrunners/sandrunners-sztab.png';
import imgRuch from '../../assets/sandrunners/sandrunners-ruch.png';
import imgBurzapiaskowa from '../../assets/sandrunners/sandrunners-burzapiaskowa.png';
import imgOdepchniecie from '../../assets/sandrunners/sandrunners-odepchniecie.png';
import imgCyngiel from '../../assets/sandrunners/sandrunners-cyngiel.png';
import imgAmok from '../../assets/sandrunners/sandrunners-amok.png';
import imgStaragwardia from '../../assets/sandrunners/sandrunners-staragwardia.png';
import imgKafar from '../../assets/sandrunners/sandrunners-kafar.png';
import imgSekator from '../../assets/sandrunners/sandrunners-sekator.png';
import imgFatamorgana from '../../assets/sandrunners/sandrunners-fatamorgana.png';
import imgMedykpolowysanta from '../../assets/sandrunners/sandrunners-medykpolowysanta.png';
import imgMedykpolowylu from '../../assets/sandrunners/sandrunners-medykpolowylu.png';
import imgOficer1 from '../../assets/sandrunners/sandrunners-oficer1.png';
import imgWodz from '../../assets/sandrunners/sandrunners-wodz.png';
import imgOficer2 from '../../assets/sandrunners/sandrunners-oficer2.png';
import imgKarawana from '../../assets/sandrunners/sandrunners-karawana.png';
import imgRuchomepiaski from '../../assets/sandrunners/sandrunners-ruchomepiaski.png';

export const sandRunners: Army = {
  id: 'sand-runners',
  name: 'Sand Runners',
  color: '#1a140a',
  accentColor: '#d4a574',
  description:
    'A desert tribe surviving in the wasteland. Sand Runners rely on Sandstorm tokens for area control, Field Medics for healing, and a mix of veterans and specialists — Amok, Old Guard, and Pruners hold the line.',
  hqAbility: 'Two-sided HQ — one side eliminates a slower target before it attacks; the other has different abilities.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    { id: 'sr-move', name: 'Move', category: 'instant', count: 3, imageUrl: imgRuch },
    { id: 'sr-sandstorm', name: 'Sandstorm', category: 'instant', count: 5, imageUrl: imgBurzapiaskowa },
    { id: 'sr-push', name: 'Push', category: 'instant', count: 2, imageUrl: imgOdepchniecie },
    { id: 'sr-trigger', name: 'Trigger', category: 'soldier', count: 1, imageUrl: imgCyngiel },

    // Soldiers
    { id: 'sr-amok', name: 'Amok', category: 'soldier', count: 3, imageUrl: imgAmok },
    { id: 'sr-old-guard', name: 'Old Guard', category: 'soldier', count: 2, imageUrl: imgStaragwardia },
    { id: 'sr-pile-driver', name: 'Pile Driver', category: 'soldier', count: 3, imageUrl: imgKafar },
    { id: 'sr-pruner', name: 'Pruner', category: 'soldier', count: 2, imageUrl: imgSekator },
    { id: 'sr-mirage', name: 'Mirage', category: 'module', count: 2, imageUrl: imgFatamorgana },

    // Modules
    { id: 'sr-field-medic-santa', name: 'Field Medic Santa', category: 'soldier', count: 1, imageUrl: imgMedykpolowysanta },
    { id: 'sr-field-medic-lu', name: 'Field Medic Lu', category: 'soldier', count: 1, imageUrl: imgMedykpolowylu },
    { id: 'sr-officer-1', name: 'Officer I', category: 'module', count: 2, imageUrl: imgOficer1 },
    { id: 'sr-chief', name: 'Chief', category: 'module', count: 2, imageUrl: imgWodz },
    { id: 'sr-officer-2', name: 'Officer II', category: 'module', count: 1, imageUrl: imgOficer2 },
    { id: 'sr-caravan', name: 'Caravan', category: 'module', count: 2, imageUrl: imgKarawana },
    { id: 'sr-quicksand', name: 'Quicksand', category: 'module', count: 2, imageUrl: imgRuchomepiaski },
  ],
};
