import type { Army } from '../types';

import imgSztab from '../../assets/steelpolice/stalowapolicja-sztab.png';
import imgBitwa from '../../assets/steelpolice/stalowapolicja-bitwa.png';
import imgRuch from '../../assets/steelpolice/stalowapolicja-ruch.png';
import imgOdepchniecie from '../../assets/steelpolice/stalowapolicja-odepchniecie.png';
import imgTerror from '../../assets/steelpolice/stalowapolicja-terror.png';
import imgEgzekutor from '../../assets/steelpolice/stalowapolicja-egzekutor.png';
import imgPacyfikator from '../../assets/steelpolice/stalowapolicja-pacyfikator.png';
import imgPredator from '../../assets/steelpolice/stalowapolicja-predator.png';
import imgBrytan from '../../assets/steelpolice/stalowapolicja-brytan.png';
import imgFunkcjonariusz from '../../assets/steelpolice/stalowapolicja-funkcjonariusz.png';
import imgSedzia from '../../assets/steelpolice/stalowapolicja-sedzia.png';
import imgWardog from '../../assets/steelpolice/stalowapolicja-wardog.png';
import imgWyrzutniastalowejsieci from '../../assets/steelpolice/stalowapolicja-wyrzutniastalowejsieci.png';
import imgOficer from '../../assets/steelpolice/stalowapolicja-oficer.png';
import imgSierzant from '../../assets/steelpolice/stalowapolicja-sierzant.png';
import imgMedyk from '../../assets/steelpolice/stalowapolicja-medyk.png';
import imgZwiadowca from '../../assets/steelpolice/stalowapolicja-zwiadowca.png';
import imgDywersant from '../../assets/steelpolice/stalowapolicja-dywersant.png';
import imgSterydomat from '../../assets/steelpolice/stalowapolicja-sterydomat.png';

export const steelPolice: Army = {
  id: 'steel-police',
  name: 'Steel Police',
  color: '#0f172a',
  accentColor: '#7b4767',
  description:
    'The brutal law enforcement arm of a crumbling empire. Heavily armed with riot control units, judges, and wardogs, Steel Police excels at aggressive close-quarters combat backed by a deep module bench.',
  hqAbility: 'May spend 1 durability to place Steel Net on any enemy unit (except HQ). Acts like Net. Returns when target is removed.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    {
      id: 'sp-battle',
      name: 'Battle',
      category: 'instant',
      count: 5,
      imageUrl: imgBitwa,
    },
    {
      id: 'sp-move',
      name: 'Move',
      category: 'instant',
      count: 1,
      imageUrl: imgRuch,
    },
    {
      id: 'sp-push',
      name: 'Push Back',
      category: 'instant',
      count: 1,
      imageUrl: imgOdepchniecie,
    },
    {
      id: 'sp-terror',
      name: 'Terror',
      category: 'instant',
      count: 1,
      imageUrl: imgTerror,
    },

    // Soldiers
    {
      id: 'sp-executor',
      name: 'Executioner',
      category: 'soldier',
      count: 1,
      imageUrl: imgEgzekutor,
    },
    {
      id: 'sp-pacifier',
      name: 'Pacifier',
      category: 'soldier',
      count: 2,
      imageUrl: imgPacyfikator,
    },
    {
      id: 'sp-predator',
      name: 'Predator',
      category: 'soldier',
      count: 1,
      imageUrl: imgPredator,
    },
    {
      id: 'sp-brytan',
      name: 'Bandog',
      category: 'soldier',
      count: 1,
      imageUrl: imgBrytan,
    },
    {
      id: 'sp-functionary',
      name: 'Riot Policeman',
      category: 'soldier',
      count: 2,
      imageUrl: imgFunkcjonariusz,
    },
    {
      id: 'sp-judge',
      name: 'Judge',
      category: 'soldier',
      count: 3,
      imageUrl: imgSedzia,
    },
    {
      id: 'sp-wardog',
      name: 'Wardog',
      category: 'soldier',
      count: 2,
      imageUrl: imgWardog,
    },
    {
      id: 'sp-steel-net-launcher',
      name: 'Net of Steel Launcher',
      category: 'module',
      count: 1,
      imageUrl: imgWyrzutniastalowejsieci,
    },

    // Modules
    {
      id: 'sp-officer',
      name: 'Officer',
      category: 'module',
      count: 3,
      imageUrl: imgOficer,
    },
    {
      id: 'sp-sergeant',
      name: 'Sergeant',
      category: 'module',
      count: 3,
      imageUrl: imgSierzant,
    },
    {
      id: 'sp-medic',
      name: 'Medic',
      category: 'module',
      count: 2,
      imageUrl: imgMedyk,
    },
    {
      id: 'sp-scout',
      name: 'Scout',
      category: 'module',
      count: 2,
      imageUrl: imgZwiadowca,
    },
    {
      id: 'sp-saboteur',
      name: 'Saboteur',
      category: 'module',
      count: 2,
      imageUrl: imgDywersant,
    },
    {
      id: 'sp-sterydomat',
      name: 'Steroid Dispenser',
      category: 'module',
      count: 1,
      imageUrl: imgSterydomat,
    },
  ],
};
