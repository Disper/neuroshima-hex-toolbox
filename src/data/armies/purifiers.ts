import type { Army } from '../types';

import imgSztab from '../../assets/purifiers/czysciciele-sztab.jpg';
import imgErupcja from '../../assets/purifiers/czysciciele-erupcja-ognia.jpg';
import imgSnajper from '../../assets/purifiers/czysciciele-snajper.jpg';
import imgOdepchniecie from '../../assets/purifiers/czysciciele-odepchniecie.jpg';
import imgRuch from '../../assets/purifiers/czysciciele-ruch.jpg';
import imgBitwa from '../../assets/purifiers/czysciciele-bitwa.jpg';
import imgBeczka from '../../assets/purifiers/czysciciele-beczka-paliwa.jpg';
import imgCzysciciel from '../../assets/purifiers/czysciciele-czysciciel.jpg';
import imgZamiatacz from '../../assets/purifiers/czysciciele-zamiatacz.jpg';
import imgChemik from '../../assets/purifiers/czysciciele-chemik.jpg';
import imgHazarder from '../../assets/purifiers/czysciciele-hazarder.jpg';
import imgAniol from '../../assets/purifiers/czysciciele-aniol.jpg';
import imgPodpalacz from '../../assets/purifiers/czysciciele-podpalacz.jpg';
import imgOficer from '../../assets/purifiers/czysciciele-oficer.jpg';
import imgMedyk from '../../assets/purifiers/czysciciele-medyk.jpg';

export const purifiers: Army = {
  id: 'purifiers',
  name: 'Purifiers',
  color: '#1a0f0f',
  accentColor: '#c85a2d',
  description:
    'Fire is the purest tool of cleansing: everything that touches the disease must burn. These pyromaniacs and extremists cleanse cities, burning the infection and uprooting corruption. They travel from city to city, laying waste to streets with their merciless flames. If they detect even a trace of contamination, they will not hesitate to set cars or even buildings full of people ablaze, for in their eyes the infected are already dead. The Purifiers are utterly devoted to their goal, and whoever or whatever stands in their way shall burn as well.',
  hqAbility: "Scorch — when the HQ destroys an enemy unit with its attack, place a Fire token on the destroyed unit's space. Only direct HQ destruction counts. Ability only works during Battle and is disabled when HQ is netted.",
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    { id: 'purifiers-eruption', name: 'Eruption', category: 'instant', count: 1, imageUrl: imgErupcja },
    { id: 'purifiers-sniper', name: 'Sniper', category: 'instant', count: 1, imageUrl: imgSnajper },
    { id: 'purifiers-push', name: 'Push Back', category: 'instant', count: 3, imageUrl: imgOdepchniecie },
    { id: 'purifiers-move', name: 'Move', category: 'instant', count: 3, imageUrl: imgRuch },
    { id: 'purifiers-battle', name: 'Battle', category: 'instant', count: 5, imageUrl: imgBitwa },

    // Soldiers
    { id: 'purifiers-fuel-drum', name: 'Fuel Drum', category: 'soldier', count: 2, imageUrl: imgBeczka },
    { id: 'purifiers-purifier', name: 'Purifier', category: 'soldier', count: 4, imageUrl: imgCzysciciel },
    { id: 'purifiers-sweeper', name: 'Sweeper', category: 'soldier', count: 3, imageUrl: imgZamiatacz },
    { id: 'purifiers-chemist', name: 'Chemist', category: 'soldier', count: 1, imageUrl: imgChemik },
    { id: 'purifiers-gambler', name: 'Gambler', category: 'soldier', count: 3, imageUrl: imgHazarder },
    { id: 'purifiers-angel', name: 'Angel', category: 'soldier', count: 2, imageUrl: imgAniol },

    // Modules
    { id: 'purifiers-arsonist', name: 'Arsonist', category: 'module', count: 2, imageUrl: imgPodpalacz },
    { id: 'purifiers-officer', name: 'Officer', category: 'module', count: 2, imageUrl: imgOficer },
    { id: 'purifiers-medic', name: 'Medic', category: 'module', count: 2, imageUrl: imgMedyk },
  ],
};
