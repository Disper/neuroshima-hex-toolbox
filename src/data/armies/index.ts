import { moloch } from './moloch';
import { wiremen } from './wiremen';
import { uranopolis } from './uranopolis';
import { steelPolice } from './steelpolice';
import { beasts } from './beasts';
import { mephisto } from './mephisto';
import { pirates } from './pirates';
import type { Army } from '../types';

export const armies: Army[] = [moloch, wiremen, uranopolis, steelPolice, beasts, mephisto, pirates];

export const getArmy = (id: string): Army | undefined =>
  armies.find((a) => a.id === id);
