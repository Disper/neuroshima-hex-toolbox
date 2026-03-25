import type { Army } from '../types';

// Wiremen HQ and soldier images
import imgSztab from '../../assets/wiremen/druciarze-sztab.jpg';
import imgSentinel from '../../assets/wiremen/druciarze-sentinel.jpg';
import imgZabojcaMaszyn from '../../assets/wiremen/druciarze-zabojca-maszyn.jpg';
import imgPsychocyborg from '../../assets/wiremen/druciarze-psychocyborg.jpg';
import imgSkorpion from '../../assets/wiremen/druciarze-skorpion.jpg';
import imgTetra from '../../assets/wiremen/druciarze-tetra.jpg';
import imgOsa from '../../assets/wiremen/druciarze-osa.jpg';
import imgPlaczka from '../../assets/wiremen/druciarze-placzka.jpg';
import imgZolnierzUmo from '../../assets/wiremen/druciarze-zolnierz-umo.jpg';
import imgError from '../../assets/wiremen/druciarze-error.jpg';
import imgDruciarz from '../../assets/wiremen/druciarze-druciarz.jpg';

// Wiremen instant/Technology tokens — each has a unique ability and image
import sniperImg from '../../assets/wiremen/HEX_wiremen_TECH_snajper.png';
import castlingIniImg from '../../assets/wiremen/HEX_wiremen_TECH_roszada_ini.png';
import castlingMatkaImg from '../../assets/wiremen/HEX_wiremen_TECH_roszada_matka.png';
import pushCiosImg from '../../assets/wiremen/HEX_wiremen_TECH_odepchniecie_cios.png';
import pushMatkaImg from '../../assets/wiremen/HEX_wiremen_TECH_odepchniecie_matka.png';
import pushStrzalImg from '../../assets/wiremen/HEX_wiremen_TECH_odepchniecie_strzal.png';
import moveCiosImg from '../../assets/wiremen/HEX_wiremen_TECH_ruch_cios.png';
import moveIniImg from '../../assets/wiremen/HEX_wiremen_TECH_ruch_ini.png';
import moveMatkaImg from '../../assets/wiremen/HEX_wiremen_TECH_ruch_matka.png';
import moveStrzalImg from '../../assets/wiremen/HEX_wiremen_TECH_ruch_strzal.png';
import battleCiosIniImg from '../../assets/wiremen/HEX_wiremen_TECH_bitwa_cios_ini.png';
import battleMatkaCiosImg from '../../assets/wiremen/HEX_wiremen_TECH_bitwa_matka_cios.png';
import battleMatkaStrzalImg from '../../assets/wiremen/HEX_wiremen_TECH_bitwa_matka_strzal.png';
import battleStrzalIniImg from '../../assets/wiremen/HEX_wiremen_TECH_bitwa_strzal_ini.png';
import battleZeroIniImg from '../../assets/wiremen/HEX_wiremen_TECH_bitwa_zero_ini.png';

export const wiremen: Army = {
  id: 'wiremen',
  name: 'Wiremen',
  color: '#0f2520',
  accentColor: '#8a526d',
  description:
    'A community of rebels living inside Moloch itself — rogue cyborgs, escaped mutants, researchers and survivors. They fight using stolen Machine resources and cutting-edge cybernetics, blurring the line between friend and foe.',
  hqAbility:
    'Inspirator — once per turn the Wiremen player may place an Inspiration marker on any Technology token.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant / Technology tokens — each unique (dual-purpose: instant or Technology field)
    { id: 'wiremen-sniper', name: 'Sniper', category: 'instant', count: 1, imageUrl: sniperImg },
    { id: 'wiremen-castling-ini', name: 'Castling (Initiative)', category: 'instant', count: 1, imageUrl: castlingIniImg },
    { id: 'wiremen-castling-matka', name: 'Castling (Mother)', category: 'instant', count: 1, imageUrl: castlingMatkaImg },
    { id: 'wiremen-push-cios', name: 'Push Back (Melee)', category: 'instant', count: 1, imageUrl: pushCiosImg },
    { id: 'wiremen-push-matka', name: 'Push Back (Mother)', category: 'instant', count: 1, imageUrl: pushMatkaImg },
    { id: 'wiremen-push-strzal', name: 'Push Back (Ranged)', category: 'instant', count: 1, imageUrl: pushStrzalImg },
    { id: 'wiremen-move-cios', name: 'Move (Melee)', category: 'instant', count: 1, imageUrl: moveCiosImg },
    { id: 'wiremen-move-ini', name: 'Move (Initiative)', category: 'instant', count: 1, imageUrl: moveIniImg },
    { id: 'wiremen-move-matka', name: 'Move (Mother)', category: 'instant', count: 1, imageUrl: moveMatkaImg },
    { id: 'wiremen-move-strzal', name: 'Move (Ranged)', category: 'instant', count: 1, imageUrl: moveStrzalImg },
    { id: 'wiremen-battle-cios-ini', name: 'Battle (Melee + Initiative)', category: 'instant', count: 1, imageUrl: battleCiosIniImg },
    { id: 'wiremen-battle-matka-cios', name: 'Battle (Mother + Melee)', category: 'instant', count: 1, imageUrl: battleMatkaCiosImg },
    { id: 'wiremen-battle-matka-strzal', name: 'Battle (Mother + Ranged)', category: 'instant', count: 1, imageUrl: battleMatkaStrzalImg },
    { id: 'wiremen-battle-strzal-ini', name: 'Battle (Ranged + Initiative)', category: 'instant', count: 1, imageUrl: battleStrzalIniImg },
    { id: 'wiremen-battle-zero-ini', name: 'Battle (Zero Initiative)', category: 'instant', count: 1, imageUrl: battleZeroIniImg },

    // Soldiers
    {
      id: 'wiremen-sentinel',
      name: 'Sentinel',
      category: 'soldier',
      count: 1,
      imageUrl: imgSentinel,
    },
    {
      id: 'wiremen-machine-killer',
      name: 'Machine Slayer',
      category: 'soldier',
      count: 2,
      imageUrl: imgZabojcaMaszyn,
    },
    {
      id: 'wiremen-psychocyborg',
      name: 'Psychocyborg',
      category: 'soldier',
      count: 2,
      imageUrl: imgPsychocyborg,
    },
    {
      id: 'wiremen-scorpion',
      name: 'Scorpio',
      category: 'soldier',
      count: 2,
      imageUrl: imgSkorpion,
    },
    {
      id: 'wiremen-tetra',
      name: 'Tetra',
      category: 'soldier',
      count: 3,
      imageUrl: imgTetra,
    },
    {
      id: 'wiremen-wasp',
      name: 'Wasp',
      category: 'soldier',
      count: 2,
      imageUrl: imgOsa,
    },
    {
      id: 'wiremen-weeper',
      name: 'Mourner',
      category: 'soldier',
      count: 3,
      imageUrl: imgPlaczka,
    },
    {
      id: 'wiremen-umo-soldier',
      name: 'UMO Soldier',
      category: 'soldier',
      count: 2,
      imageUrl: imgZolnierzUmo,
    },
    {
      id: 'wiremen-error',
      name: 'Error',
      category: 'soldier',
      count: 1,
      imageUrl: imgError,
    },
    {
      id: 'wiremen-wireman',
      name: 'Wireman',
      category: 'soldier',
      count: 1,
      imageUrl: imgDruciarz,
    },
  ],
};
