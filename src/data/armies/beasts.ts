import type { Army } from '../types';

import imgSztab from '../../assets/beasts/bestie-sztab.png';
import imgRuch from '../../assets/beasts/bestie-ruch.png';
import imgBitwa from '../../assets/beasts/bestie-bitwa.png';
import imgPolowanie from '../../assets/beasts/bestie-polowanie.png';
import imgPrzyciagniecie from '../../assets/beasts/bestie-przyciagniecie.png';
import imgCerber from '../../assets/beasts/bestie-cerber.png';
import imgAlfa from '../../assets/beasts/bestie-alfa.png';
import imgRoj from '../../assets/beasts/bestie-roj.png';
import imgTaran from '../../assets/beasts/bestie-taran.png';
import imgKwasopluj from '../../assets/beasts/bestie-kwasopluj.png';
import imgRobal from '../../assets/beasts/bestie-robal.png';
import imgJezowiec from '../../assets/beasts/bestie-jezowiec.png';
import imgSep from '../../assets/beasts/bestie-sep.png';
import imgArachnoid from '../../assets/beasts/bestie-arachnoid.png';
import imgZwiadowca from '../../assets/beasts/bestie-zwiadowca.png';
import imgOficer1 from '../../assets/beasts/bestie-oficer1.png';
import imgSzarpak from '../../assets/beasts/bestie-szarpak.png';

export const beasts: Army = {
  id: 'beasts',
  name: 'Beasts',
  color: '#14200f',
  accentColor: '#84cc16',
  description:
    'Feral mutants and monstrous creatures that roam the wasteland. Beasts overwhelm enemies with raw numbers and relentless aggression — fast, hard-hitting swarms backed by a surprisingly large Battle token pool.',
  hqAbility: 'Lair — at game start, place Cerberus adjacent to HQ. Beasts HQ has Initiative 1.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    { id: 'beasts-move', name: 'Move', category: 'instant', count: 2, imageUrl: imgRuch },
    { id: 'beasts-battle', name: 'Battle', category: 'instant', count: 6, imageUrl: imgBitwa },
    { id: 'beasts-hunt', name: 'Hunt', category: 'instant', count: 1, imageUrl: imgPolowanie },
    { id: 'beasts-pull', name: 'Pull', category: 'instant', count: 3, imageUrl: imgPrzyciagniecie },

    // Soldiers
    {
      id: 'beasts-cerberus',
      name: 'Cerberus',
      category: 'soldier',
      count: 1,
      imageUrl: imgCerber,
      excludeFromDeck: true,
      displayWithHq: true,
    },
    { id: 'beasts-alpha', name: 'Alpha', category: 'soldier', count: 1, imageUrl: imgAlfa },
    { id: 'beasts-swarm', name: 'Swarm', category: 'soldier', count: 2, imageUrl: imgRoj },
    { id: 'beasts-ram', name: 'Ram', category: 'soldier', count: 4, imageUrl: imgTaran },
    { id: 'beasts-acid-spitter', name: 'Acid Spitter', category: 'soldier', count: 2, imageUrl: imgKwasopluj },
    { id: 'beasts-bug', name: 'Bug', category: 'soldier', count: 2, imageUrl: imgRobal },
    { id: 'beasts-urchin', name: 'Urchin', category: 'soldier', count: 2, imageUrl: imgJezowiec },
    { id: 'beasts-vulture', name: 'Vulture', category: 'soldier', count: 2, imageUrl: imgSep },
    { id: 'beasts-arachnoid', name: 'Arachnoid', category: 'soldier', count: 1, imageUrl: imgArachnoid },

    // Modules
    { id: 'beasts-scout', name: 'Scout', category: 'module', count: 3, imageUrl: imgZwiadowca },
    { id: 'beasts-officer', name: 'Officer I', category: 'module', count: 2, imageUrl: imgOficer1 },
    { id: 'beasts-ripper', name: 'Ripper', category: 'module', count: 1, imageUrl: imgSzarpak },
  ],
};
