import type { Army } from '../types';

import imgSztab from '../../assets/desertpeople/ludziepustyni-sztab.jpg';
import imgBitwa from '../../assets/desertpeople/ludziepustyni-bitwa.jpg';
import imgRuch from '../../assets/desertpeople/ludziepustyni-ruch.jpg';
import imgMiraz from '../../assets/desertpeople/ludziepustyni-miraz.jpg';
import imgSkalpel from '../../assets/desertpeople/ludziepustyni-skalpel.jpg';
import imgKojot from '../../assets/desertpeople/ludziepustyni-kojot.jpg';
import imgLucznik from '../../assets/desertpeople/ludziepustyni-lucznik.jpg';
import imgMlodziWojownicy from '../../assets/desertpeople/ludziepustyni-mlodzi-wojownicy.jpg';
import imgTropiciel from '../../assets/desertpeople/ludziepustyni-tropiciel.jpg';
import imgGrzechotnik from '../../assets/desertpeople/ludziepustyni-grzechotnik.jpg';
import imgWojownikKlanuCzerwia from '../../assets/desertpeople/ludziepustyni-wojownik-klanu-czerwia.jpg';
import imgGrotnik from '../../assets/desertpeople/ludziepustyni-grotnik.jpg';
import imgKryjowka from '../../assets/desertpeople/ludziepustyni-kryjowka.jpg';
import imgSzamanka from '../../assets/desertpeople/ludziepustyni-szamanka.jpg';
import imgOficer from '../../assets/desertpeople/ludziepustyni-oficer.jpg';
import imgZwiadowca from '../../assets/desertpeople/ludziepustyni-zwiadowca.jpg';

export const desertPeople: Army = {
  id: 'desert-people',
  name: 'Desert Tribes',
  color: '#1a1408',
  accentColor: '#76552e',
  description:
    'Tribal warriors of the wasteland who blend stealth, ranged combat, and shamanic support. Desert People field Coyotes, Archers, Young Warriors, and Shamans — a versatile mix of scouts and fighters backed by Mirage tokens.',
  hqAbility: 'Self-defense — in its Initiative, destroys one adjacent enemy unit. Does not affect enemy HQs.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    { id: 'dp-battle', name: 'Battle', category: 'instant', count: 5, imageUrl: imgBitwa },
    { id: 'dp-move', name: 'Move', category: 'instant', count: 4, imageUrl: imgRuch },
    { id: 'dp-mirage', name: 'Mirage', category: 'instant', count: 2, imageUrl: imgMiraz },

    // Soldiers
    { id: 'dp-scalpel', name: 'Scalpel', category: 'soldier', count: 1, imageUrl: imgSkalpel },
    { id: 'dp-coyote', name: 'Coyote', category: 'soldier', count: 2, imageUrl: imgKojot },
    { id: 'dp-archer', name: 'Dust Arrow', category: 'soldier', count: 2, imageUrl: imgLucznik },
    { id: 'dp-young-warriors', name: 'Younglings', category: 'soldier', count: 2, imageUrl: imgMlodziWojownicy },
    { id: 'dp-tracker', name: 'Nomad', category: 'soldier', count: 2, imageUrl: imgTropiciel },
    { id: 'dp-rattlesnake', name: 'Rattlesnake', category: 'soldier', count: 1, imageUrl: imgGrzechotnik },
    { id: 'dp-worm-clan-warrior', name: 'Maggot Clan Warrior', category: 'soldier', count: 3, imageUrl: imgWojownikKlanuCzerwia },
    { id: 'dp-shaman', name: 'Shaman', category: 'soldier', count: 3, imageUrl: imgSzamanka },

    // Modules
    { id: 'dp-spearman', name: 'Fletcher', category: 'module', count: 2, imageUrl: imgGrotnik },
    { id: 'dp-hideout', name: 'Hideout', category: 'module', count: 1, imageUrl: imgKryjowka },
    { id: 'dp-officer', name: 'Officer', category: 'module', count: 2, imageUrl: imgOficer },
    { id: 'dp-scout', name: 'Scout', category: 'module', count: 2, imageUrl: imgZwiadowca },
  ],
};
