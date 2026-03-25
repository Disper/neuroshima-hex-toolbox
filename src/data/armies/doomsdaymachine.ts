import type { Army } from '../types';

import imgSztab from '../../assets/doomsdaymachine/doomsdaymachine-sztab.png';
import imgBitwa from '../../assets/doomsdaymachine/doomsdaymachine-bitwa.png';
import imgOdepchniecie from '../../assets/doomsdaymachine/doomsdaymachine-odepchniecie.png';
import imgMalabomba from '../../assets/doomsdaymachine/doomsdaymachine-malabomba.png';
import imgStrzelecalfa from '../../assets/doomsdaymachine/doomsdaymachine-strzelecalfa.png';
import imgDzialkogaussa from '../../assets/doomsdaymachine/doomsdaymachine-dzialkogaussa.png';
import imgStrzelecgamma from '../../assets/doomsdaymachine/doomsdaymachine-strzelecgamma.png';
import imgRoztrajacz from '../../assets/doomsdaymachine/doomsdaymachine-roztrajacz.png';
import imgStrzelecdelta from '../../assets/doomsdaymachine/doomsdaymachine-strzelecdelta.png';
import imgStrzelecomega from '../../assets/doomsdaymachine/doomsdaymachine-strzelecomega.png';
import imgSieciarzzaglady from '../../assets/doomsdaymachine/doomsdaymachine-sieciarzzaglady.png';
import imgStanowiskoogniowe from '../../assets/doomsdaymachine/doomsdaymachine-stanowiskoogniowe.png';
import imgPulapka from '../../assets/doomsdaymachine/doomsdaymachine-pulapka.png';
import imgMedyk from '../../assets/doomsdaymachine/doomsdaymachine-medyk.png';
import imgOficer from '../../assets/doomsdaymachine/doomsdaymachine-oficer.png';
import imgZwiadowca from '../../assets/doomsdaymachine/doomsdaymachine-zwiadowca.png';
import imgGlownyprocesorbojowy from '../../assets/doomsdaymachine/doomsdaymachine-glownyprocesorbojowy.png';

export const doomsdayMachine: Army = {
  id: 'doomsday-machine',
  name: 'Doomsday Machine',
  color: '#0a0a0f',
  accentColor: '#5a645f',
  description:
    'An autonomous war machine that deploys Shooter units — Alpha, Gamma, Delta, Omega — and Gauss Cannons. Doomsday Machine has five Medics, the most in the game, and relies on Fire Positions and Traps for area control.',
  hqAbility: 'Once per turn, one friendly unit may rotate.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    { id: 'ddm-battle', name: 'Battle', category: 'instant', count: 4, imageUrl: imgBitwa },
    { id: 'ddm-push', name: 'Push Back', category: 'instant', count: 1, imageUrl: imgOdepchniecie },
    { id: 'ddm-small-bomb', name: 'Small Bomb', category: 'instant', count: 1, imageUrl: imgMalabomba },

    // Soldiers
    { id: 'ddm-shooter-alpha', name: 'Alpha Shooter', category: 'soldier', count: 2, imageUrl: imgStrzelecalfa },
    { id: 'ddm-gauss-cannon', name: 'Gauss Cannon', category: 'soldier', count: 2, imageUrl: imgDzialkogaussa },
    { id: 'ddm-shooter-gamma', name: 'Gamma Shooter', category: 'soldier', count: 1, imageUrl: imgStrzelecgamma },
    { id: 'ddm-disintegrator', name: 'Tripler', category: 'soldier', count: 2, imageUrl: imgRoztrajacz },
    { id: 'ddm-shooter-delta', name: 'Delta Shooter', category: 'soldier', count: 1, imageUrl: imgStrzelecdelta },
    { id: 'ddm-shooter-omega', name: 'Omega Shooter', category: 'soldier', count: 4, imageUrl: imgStrzelecomega },
    { id: 'ddm-doom-netter', name: 'Doom Net Fighter', category: 'soldier', count: 2, imageUrl: imgSieciarzzaglady },
    { id: 'ddm-fire-position', name: 'Fireblast', category: 'soldier', count: 2, imageUrl: imgStanowiskoogniowe },
    { id: 'ddm-trap', name: 'Trap', category: 'module', count: 1, imageUrl: imgPulapka },

    // Modules
    { id: 'ddm-medic', name: 'Medic', category: 'module', count: 5, imageUrl: imgMedyk },
    { id: 'ddm-officer', name: 'Officer', category: 'module', count: 2, imageUrl: imgOficer },
    { id: 'ddm-scout', name: 'Scout', category: 'module', count: 2, imageUrl: imgZwiadowca },
    { id: 'ddm-main-processor', name: 'Main War Processor', category: 'module', count: 2, imageUrl: imgGlownyprocesorbojowy },
  ],
};
