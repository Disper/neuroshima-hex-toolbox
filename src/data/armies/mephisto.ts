import type { Army } from '../types';

import imgSztab from '../../assets/mephisto/mephisto-sztab.png';
import imgRoszada from '../../assets/mephisto/mephisto-roszada.png';
import imgBitwa from '../../assets/mephisto/mephisto-bitwa.png';
import imgRuch from '../../assets/mephisto/mephisto-ruch.png';
import imgInkubator from '../../assets/mephisto/mephisto-inkubator.png';
import imgTransmiter from '../../assets/mephisto/mephisto-transmiter.png';
import imgSzczeki from '../../assets/mephisto/mephisto-szczeki.png';
import imgOgon from '../../assets/mephisto/mephisto-ogon.png';
import imgKoleclewy from '../../assets/mephisto/mephisto-koleclewy.png';
import imgKolecprawy from '../../assets/mephisto/mephisto-kolecprawy.png';
import imgMacki from '../../assets/mephisto/mephisto-macki.png';
import imgOdnoza from '../../assets/mephisto/mephisto-odnoza.png';
import imgSwider from '../../assets/mephisto/mephisto-swider.png';
import imgWzmacniacz from '../../assets/mephisto/mephisto-wzmacniacz.png';
import imgSonda from '../../assets/mephisto/mephisto-sonda.png';
import imgPaszcza from '../../assets/mephisto/mephisto-paszcza.png';
import imgSzpon from '../../assets/mephisto/mephisto-szpon.png';
import imgAkcelerator from '../../assets/mephisto/mephisto-akcelerator.png';

export const mephisto: Army = {
  id: 'mephisto',
  name: 'Mephisto',
  color: '#1a0505',
  accentColor: '#854d38',
  description:
    'A colossal bio-mechanical demon assembled from interchangeable body parts. Mephisto\'s tiles are its own limbs and organs — each one a combat piece that snaps onto the growing creature on the board.',
  hqAbility: 'Once per turn, one Mephisto unit (including HQ) may rotate in any direction.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    { id: 'mephisto-castling', name: 'Castling', category: 'instant', count: 2, imageUrl: imgRoszada },
    { id: 'mephisto-battle', name: 'Battle', category: 'instant', count: 3, imageUrl: imgBitwa },
    { id: 'mephisto-move', name: 'Move', category: 'instant', count: 2, imageUrl: imgRuch },

    // Implants (body parts / combat units)
    { id: 'mephisto-incubator', name: 'Incubator', category: 'implant', count: 3, imageUrl: imgInkubator },
    { id: 'mephisto-transmitter', name: 'Transmitter', category: 'implant', count: 1, imageUrl: imgTransmiter },
    { id: 'mephisto-jaws', name: 'Jaws', category: 'implant', count: 2, imageUrl: imgSzczeki },
    { id: 'mephisto-tail', name: 'Tail', category: 'implant', count: 2, imageUrl: imgOgon },
    { id: 'mephisto-left-spike', name: 'Left Quill', category: 'implant', count: 1, imageUrl: imgKoleclewy },
    { id: 'mephisto-right-spike', name: 'Right Quill', category: 'implant', count: 1, imageUrl: imgKolecprawy },
    { id: 'mephisto-tentacles', name: 'Tentacles', category: 'implant', count: 2, imageUrl: imgMacki },
    { id: 'mephisto-appendages', name: 'Limbs', category: 'implant', count: 2, imageUrl: imgOdnoza },
    { id: 'mephisto-drill', name: 'Drill', category: 'implant', count: 1, imageUrl: imgSwider },

    // Modules
    { id: 'mephisto-amplifier', name: 'Toughener', category: 'module', count: 2, imageUrl: imgWzmacniacz },
    { id: 'mephisto-probe', name: 'Probe', category: 'module', count: 2, imageUrl: imgSonda },
    { id: 'mephisto-maw', name: 'Muzzle', category: 'module', count: 1, imageUrl: imgPaszcza },
    { id: 'mephisto-claw', name: 'Claw', category: 'module', count: 4, imageUrl: imgSzpon },
    { id: 'mephisto-accelerator', name: 'Accelerator', category: 'module', count: 3, imageUrl: imgAkcelerator },
  ],
};
