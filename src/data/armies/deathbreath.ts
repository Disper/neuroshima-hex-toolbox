import type { Army } from '../types';

import imgSztab from '../../assets/deathbreath/deathbreath-sztab.png';
import imgRoszada from '../../assets/deathbreath/deathbreath-roszada.png';
import imgPowrot from '../../assets/deathbreath/deathbreath-powrot.png';
import imgRuch from '../../assets/deathbreath/deathbreath-ruch.png';
import imgBitwa from '../../assets/deathbreath/deathbreath-bitwa.png';
import imgZarazony from '../../assets/deathbreath/deathbreath-zarazony.png';
import imgChwytacz from '../../assets/deathbreath/deathbreath-chwytacz.png';
import imgZombiak from '../../assets/deathbreath/deathbreath-zombiak.png';
import imgAnomalia from '../../assets/deathbreath/deathbreath-anomalia.png';
import imgMutant from '../../assets/deathbreath/deathbreath-mutant.png';
import imgTruposz from '../../assets/deathbreath/deathbreath-truposz.png';
import imgPozeracz from '../../assets/deathbreath/deathbreath-pozeracz.png';
import imgBestia from '../../assets/deathbreath/deathbreath-bestia.png';
import imgMedyk from '../../assets/deathbreath/deathbreath-medyk.png';
import imgOficer from '../../assets/deathbreath/deathbreath-oficer.png';
import imgZwiadowca from '../../assets/deathbreath/deathbreath-zwiadowca.png';

export const deathBreath: Army = {
  id: 'death-breath',
  name: 'Death Breath',
  color: '#0a0f14',
  accentColor: '#8d5131',
  description:
    'A zombie horde that spreads infection across the board. Death Breath fields Infected, Grippers, and Zombies, backed by Reappearance and Castling with the Opponent tokens to recycle units. Eight Battle tokens make it one of the most combat-heavy armies.',
  hqAbility: 'Revival — when Death Breath kills an enemy, place units from Zombie Pool on the empty spaces after Battle.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    { id: 'db-castling', name: 'Castling with the Opponent', category: 'instant', count: 1, imageUrl: imgRoszada },
    { id: 'db-return', name: 'Reappearance', category: 'instant', count: 2, imageUrl: imgPowrot },
    { id: 'db-move', name: 'Move', category: 'instant', count: 3, imageUrl: imgRuch },
    { id: 'db-battle', name: 'Battle', category: 'instant', count: 8, imageUrl: imgBitwa },

    // Soldiers
    { id: 'db-infected', name: 'Infected', category: 'soldier', count: 3, imageUrl: imgZarazony },
    { id: 'db-grabber', name: 'Gripper', category: 'soldier', count: 3, imageUrl: imgChwytacz },
    { id: 'db-zombie', name: 'Zombie', category: 'soldier', count: 1, imageUrl: imgZombiak },
    { id: 'db-anomaly', name: 'Anomaly', category: 'soldier', count: 2, imageUrl: imgAnomalia },
    { id: 'db-mutant', name: 'Mutant', category: 'soldier', count: 1, imageUrl: imgMutant },
    { id: 'db-corpse', name: 'Corpse', category: 'soldier', count: 1, imageUrl: imgTruposz },
    { id: 'db-devourer', name: 'Devourer', category: 'soldier', count: 1, imageUrl: imgPozeracz },
    { id: 'db-beast', name: 'Beast', category: 'soldier', count: 1, imageUrl: imgBestia },

    // Modules
    { id: 'db-medic', name: 'Medic', category: 'module', count: 2, imageUrl: imgMedyk },
    { id: 'db-officer', name: 'Officer', category: 'module', count: 2, imageUrl: imgOficer },
    { id: 'db-scout', name: 'Scout', category: 'module', count: 3, imageUrl: imgZwiadowca },
  ],
};
