import type { Army } from '../types';

const BASE = 'https://neuroshimahex.pl/gfx/stalowapolicja';

export const steelPolice: Army = {
  id: 'steel-police',
  name: 'Steel Police',
  color: '#0f172a',
  accentColor: '#3b82f6',
  description:
    'The brutal law enforcement arm of a crumbling empire. Heavily armed with riot control units, judges, and wardogs, Steel Police excels at aggressive close-quarters combat backed by a deep module bench.',
  hqAbility: 'All friendly adjacent units gain +1 armour.',
  hqImageUrl: `${BASE}/stalowapolicja-sztab.png`,
  tiles: [
    // Instant tokens
    {
      id: 'sp-battle',
      name: 'Battle',
      category: 'instant',
      count: 5,
      imageUrl: `${BASE}/stalowapolicja-bitwa.png`,
    },
    {
      id: 'sp-move',
      name: 'Move',
      category: 'instant',
      count: 1,
      imageUrl: `${BASE}/stalowapolicja-ruch.png`,
    },
    {
      id: 'sp-push',
      name: 'Push',
      category: 'instant',
      count: 1,
      imageUrl: `${BASE}/stalowapolicja-odepchniecie.png`,
    },
    {
      id: 'sp-terror',
      name: 'Terror',
      category: 'instant',
      count: 1,
      imageUrl: `${BASE}/stalowapolicja-terror.png`,
    },

    // Soldiers
    {
      id: 'sp-executor',
      name: 'Executor',
      category: 'soldier',
      count: 1,
      imageUrl: `${BASE}/stalowapolicja-egzekutor.png`,
    },
    {
      id: 'sp-pacifier',
      name: 'Pacifier',
      category: 'soldier',
      count: 2,
      imageUrl: `${BASE}/stalowapolicja-pacyfikator.png`,
    },
    {
      id: 'sp-predator',
      name: 'Predator',
      category: 'soldier',
      count: 1,
      imageUrl: `${BASE}/stalowapolicja-predator.png`,
    },
    {
      id: 'sp-brytan',
      name: 'Brytan',
      category: 'soldier',
      count: 1,
      imageUrl: `${BASE}/stalowapolicja-brytan.png`,
    },
    {
      id: 'sp-functionary',
      name: 'Functionary',
      category: 'soldier',
      count: 2,
      imageUrl: `${BASE}/stalowapolicja-funkcjonariusz.png`,
    },
    {
      id: 'sp-judge',
      name: 'Judge',
      category: 'soldier',
      count: 3,
      imageUrl: `${BASE}/stalowapolicja-sedzia.png`,
    },
    {
      id: 'sp-wardog',
      name: 'Wardog',
      category: 'soldier',
      count: 2,
      imageUrl: `${BASE}/stalowapolicja-wardog.png`,
    },
    {
      id: 'sp-steel-net-launcher',
      name: 'Steel Net Launcher',
      category: 'soldier',
      count: 1,
      imageUrl: `${BASE}/stalowapolicja-wyrzutniastalowejsieci.png`,
    },

    // Modules
    {
      id: 'sp-officer',
      name: 'Officer',
      category: 'module',
      count: 3,
      imageUrl: `${BASE}/stalowapolicja-oficer.png`,
    },
    {
      id: 'sp-sergeant',
      name: 'Sergeant',
      category: 'module',
      count: 3,
      imageUrl: `${BASE}/stalowapolicja-sierzant.png`,
    },
    {
      id: 'sp-medic',
      name: 'Medic',
      category: 'module',
      count: 2,
      imageUrl: `${BASE}/stalowapolicja-medyk.png`,
    },
    {
      id: 'sp-scout',
      name: 'Scout',
      category: 'module',
      count: 2,
      imageUrl: `${BASE}/stalowapolicja-zwiadowca.png`,
    },
    {
      id: 'sp-saboteur',
      name: 'Saboteur',
      category: 'module',
      count: 2,
      imageUrl: `${BASE}/stalowapolicja-dywersant.png`,
    },
    {
      id: 'sp-sterydomat',
      name: 'Sterydomat',
      category: 'module',
      count: 1,
      imageUrl: `${BASE}/stalowapolicja-sterydomat.png`,
    },
  ],
};
