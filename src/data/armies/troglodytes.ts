import type { Army } from '../types';

import imgSztab from '../../assets/troglodytes/troglodyci-sztab.png';
import imgBitwa from '../../assets/troglodytes/troglodyci-bitwa.png';
import imgRuch from '../../assets/troglodytes/troglodyci-ruch.png';
import imgLawina from '../../assets/troglodytes/troglodyci-lawina.png';
import imgSkanibalizowanieWroga from '../../assets/troglodytes/troglodyci-skanibalizowanie-wroga.png';
import imgFrost from '../../assets/troglodytes/troglodyci-frost.png';
import imgLucznik from '../../assets/troglodytes/troglodyci-lucznik.png';
import imgTundra from '../../assets/troglodytes/troglodyci-tundra.png';
import imgSopel from '../../assets/troglodytes/troglodyci-sopel.png';
import imgNiedzwiedz from '../../assets/troglodytes/troglodyci-niedzwiedz.png';
import imgMroznaMatrona from '../../assets/troglodytes/troglodyci-mrozna-matrona.png';
import imgLodowaMalpa from '../../assets/troglodytes/troglodyci-lodowa-malpa.png';
import imgDzieciaki from '../../assets/troglodytes/troglodyci-dzieciaki.png';

export const troglodytes: Army = {
  id: 'troglodytes',
  name: 'Troglodytes',
  color: '#0a1414',
  accentColor: '#67e8f9',
  description:
    'Cave-dwelling mutants adapted to cold and darkness. Troglodytes field Bears, Archers, Ice Monkeys, and the unique Satiety system — markers placed when Cannibalizing that grow stronger as the battle progresses.',
  hqAbility: 'Gourmand — adjacent units may place Greater Satiety when they Cannibalize.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    { id: 'trog-battle', name: 'Battle', category: 'instant', count: 7, imageUrl: imgBitwa },
    { id: 'trog-move', name: 'Move', category: 'instant', count: 3, imageUrl: imgRuch },
    { id: 'trog-avalanche', name: 'Avalanche', category: 'instant', count: 1, imageUrl: imgLawina },
    { id: 'trog-cannibalize', name: 'Cannibalize Enemy', category: 'instant', count: 1, imageUrl: imgSkanibalizowanieWroga },
    { id: 'trog-frost', name: 'Frost', category: 'soldier', count: 2, imageUrl: imgFrost },

    // Soldiers
    { id: 'trog-archer', name: 'Archer', category: 'soldier', count: 2, imageUrl: imgLucznik },
    { id: 'trog-tundra', name: 'Tundra', category: 'soldier', count: 4, imageUrl: imgTundra },
    { id: 'trog-icicle', name: 'Icicle', category: 'soldier', count: 5, imageUrl: imgSopel },
    { id: 'trog-bear', name: 'Bear', category: 'soldier', count: 3, imageUrl: imgNiedzwiedz },
    { id: 'trog-frost-matron', name: 'Frost Matron', category: 'soldier', count: 2, imageUrl: imgMroznaMatrona },
    { id: 'trog-ice-monkey', name: 'Ice Monkey', category: 'soldier', count: 2, imageUrl: imgLodowaMalpa },
    { id: 'trog-kids', name: 'Kids', category: 'soldier', count: 2, imageUrl: imgDzieciaki },
  ],
};
