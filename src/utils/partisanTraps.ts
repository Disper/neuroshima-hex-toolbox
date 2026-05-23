/** Partisans trap markers — not part of the draw deck (see neuroshimahex.pl trap rules). */

import imgMina from '../assets/partisans/partyzanci-mina.jpg';
import imgSmoke from '../assets/partisans/partyzanci-zaslona-dymna.jpg';
import imgDrill from '../assets/partisans/partyzanci-swider.jpg';
import imgMedpack from '../assets/partisans/partyzanci-medpack.jpg';
import imgNet from '../assets/partisans/partyzanci-siec.jpg';
import imgRabies from '../assets/partisans/partyzanci-wscieklizna.jpg';
import imgParalysis from '../assets/partisans/partyzanci-paraliz.jpg';

export const PARTISANS_ARMY_ID = 'partisans';

export interface PartisanTrapInstance {
  instanceId: string;
  trapId: string;
  /** English display name */
  name: string;
  imageUrl: string;
}

/** Trap pool order matches https://neuroshimahex.pl/zasady/znaczniki/pulapki/ */
const TRAP_COUNTS: { id: string; name: string; count: number; imageUrl: string }[] = [
  { id: 'part-trap-mine', name: 'Mine', count: 1, imageUrl: imgMina },
  { id: 'part-trap-smoke', name: 'Smoke Screen', count: 1, imageUrl: imgSmoke },
  { id: 'part-trap-drill', name: 'Drill', count: 1, imageUrl: imgDrill },
  { id: 'part-trap-medpack', name: 'Medpack', count: 2, imageUrl: imgMedpack },
  { id: 'part-trap-net', name: 'Net', count: 1, imageUrl: imgNet },
  { id: 'part-trap-rabies', name: 'Rabies', count: 1, imageUrl: imgRabies },
  { id: 'part-trap-paralysis', name: 'Paralysis', count: 1, imageUrl: imgParalysis },
];

export function buildPartisanTrapPool(): PartisanTrapInstance[] {
  const pool: PartisanTrapInstance[] = [];
  for (const trap of TRAP_COUNTS) {
    for (let i = 0; i < trap.count; i++) {
      pool.push({
        instanceId: `${trap.id}-${i}`,
        trapId: trap.id,
        name: trap.name,
        imageUrl: trap.imageUrl,
      });
    }
  }
  return pool;
}

export const PARTISAN_TRAP_POOL_SIZE = buildPartisanTrapPool().length;
