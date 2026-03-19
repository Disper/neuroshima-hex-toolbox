import { moloch } from './moloch';
import { wiremen } from './wiremen';
import { uranopolis } from './uranopolis';
import { steelPolice } from './steelpolice';
import { beasts } from './beasts';
import { mephisto } from './mephisto';
import { pirates } from './pirates';
import { borgo } from './borgo';
import { outpost } from './outpost';
import { hegemony } from './hegemony';
import { mississippi } from './mississippi';
import { newYork } from './newyork';
import { smart } from './smart';
import { neojungle } from './neojungle';
import { vegas } from './vegas';
import { dancer } from './dancer';
import { sharrash } from './sharrash';
import { sandRunners } from './sandrunners';
import { ironGang } from './irongang';
import { desertPeople } from './desertpeople';
import { troglodytes } from './troglodytes';
import { partisans } from './partisans';
import { merchantsGuild } from './merchantsguild';
import { deathBreath } from './deathbreath';
import { doomsdayMachine } from './doomsdaymachine';
import type { Army } from '../types';

// Order: Outpost, Borgo, Hegemony, Moloch first, then by release date (neuroshimahex.pl/produkty/dodatki-armijne/)
export const armies: Army[] = [
  outpost, borgo, hegemony, moloch,
  steelPolice,      // Mar 2012
  dancer,           // Jul 2012
  newYork,          // 2012
  neojungle,        // 2012
  sharrash,         // May 2013
  mephisto,         // Oct 2013
  doomsdayMachine,  // Dec 2013
  mississippi,      // May 2014
  vegas,            // Aug 2014
  smart,            // Sep 2014
  uranopolis,       // Jan 2015
  deathBreath,      // Oct 2016
  ironGang,         // Nov 2017
  sandRunners,      // Oct 2019
  troglodytes,      // Sep 2020
  beasts,           // Sep 2021
  pirates,          // Sep 2022
  merchantsGuild,   // Sep 2023
  partisans,        // Nov 2023
  desertPeople,     // Sep 2024
  wiremen,          // Sep 2025
];

export const getArmy = (id: string): Army | undefined =>
  armies.find((a) => a.id === id);
