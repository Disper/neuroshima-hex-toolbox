import { moloch } from './moloch';
import { wiremen } from './wiremen';
import { uranopolis } from './uranopolis';
import { steelPolice } from './steelpolice';
import type { Army } from '../types';

export const armies: Army[] = [moloch, wiremen, uranopolis, steelPolice];

export const getArmy = (id: string): Army | undefined =>
  armies.find((a) => a.id === id);
