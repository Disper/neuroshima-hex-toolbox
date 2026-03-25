import type { Army } from '../types';

import imgSztab from '../../assets/uranopolis/uranopolis-sztab.png';
import imgRuch from '../../assets/uranopolis/uranopolis-ruch.png';
import imgBitwa from '../../assets/uranopolis/uranopolis-bitwa.png';
import imgOdepchniecie from '../../assets/uranopolis/uranopolis-odepchniecie.png';
import imgPromien from '../../assets/uranopolis/uranopolis-promien.png';
import imgElektrosieciarz from '../../assets/uranopolis/uranopolis-elektrosieciarz.png';
import imgMechanik from '../../assets/uranopolis/uranopolis-mechanik.png';
import imgInferno from '../../assets/uranopolis/uranopolis-inferno.png';
import imgBuldozer from '../../assets/uranopolis/uranopolis-buldozer.png';
import imgStraznik from '../../assets/uranopolis/uranopolis-straznik.png';
import imgSwider from '../../assets/uranopolis/uranopolis-swider.png';
import imgHammerhead from '../../assets/uranopolis/uranopolis-hammerhead.png';
import imgWyburzacz from '../../assets/uranopolis/uranopolis-wyburzacz.png';
import imgNajemnik from '../../assets/uranopolis/uranopolis-najemnik.png';
import imgGeneratorprzyspieszajacy from '../../assets/uranopolis/uranopolis-generatorprzyspieszajacy.png';
import imgGeneratorbojowy from '../../assets/uranopolis/uranopolis-generatorbojowy.png';
import imgMedyk from '../../assets/uranopolis/uranopolis-medyk.png';
import imgPodwajacz from '../../assets/uranopolis/uranopolis-podwajacz.png';
import imgTransformatorgaussa from '../../assets/uranopolis/uranopolis-transformatorgaussa.png';
import imgTransport from '../../assets/uranopolis/uranopolis-transport.png';
import imgOdpady from '../../assets/uranopolis/uranopolis-odpady.png';

export const uranopolis: Army = {
  id: 'uranopolis',
  name: 'Uranopolis',
  color: '#1a0f2e',
  accentColor: '#596155',
  description:
    'A technologically advanced city-state whose citizens wield powerful generators and cutting-edge weaponry. Uranopolis units are fragile but pack devastating firepower, supported by a powerful array of modules.',
  hqAbility: 'Provides Power to each adjacent friendly unit.',
  hqImageUrl: imgSztab,
  tiles: [
    // Instant tokens
    {
      id: 'uranopolis-move',
      name: 'Move',
      category: 'instant',
      count: 1,
      imageUrl: imgRuch,
    },
    {
      id: 'uranopolis-battle',
      name: 'Battle',
      category: 'instant',
      count: 4,
      imageUrl: imgBitwa,
    },
    {
      id: 'uranopolis-push',
      name: 'Push Back',
      category: 'instant',
      count: 3,
      imageUrl: imgOdepchniecie,
    },
    {
      id: 'uranopolis-ray',
      name: 'Ray',
      category: 'instant',
      count: 1,
      imageUrl: imgPromien,
    },

    // Soldiers
    {
      id: 'uranopolis-electrowireman',
      name: 'Electro Net Fighter',
      category: 'soldier',
      count: 2,
      imageUrl: imgElektrosieciarz,
    },
    {
      id: 'uranopolis-mechanic',
      name: 'Mechanic',
      category: 'soldier',
      count: 3,
      imageUrl: imgMechanik,
    },
    {
      id: 'uranopolis-inferno',
      name: 'Inferno',
      category: 'soldier',
      count: 4,
      imageUrl: imgInferno,
    },
    {
      id: 'uranopolis-bulldozer',
      name: 'Bulldozer',
      category: 'soldier',
      count: 1,
      imageUrl: imgBuldozer,
    },
    {
      id: 'uranopolis-guardian',
      name: 'Guard',
      category: 'soldier',
      count: 2,
      imageUrl: imgStraznik,
    },
    {
      id: 'uranopolis-drill',
      name: 'Drill',
      category: 'soldier',
      count: 1,
      imageUrl: imgSwider,
    },
    {
      id: 'uranopolis-hammerhead',
      name: 'Hammerhead',
      category: 'soldier',
      count: 1,
      imageUrl: imgHammerhead,
    },
    {
      id: 'uranopolis-demolisher',
      name: 'Ravager',
      category: 'soldier',
      count: 1,
      imageUrl: imgWyburzacz,
    },
    {
      id: 'uranopolis-mercenary',
      name: 'Mercenary',
      category: 'soldier',
      count: 1,
      imageUrl: imgNajemnik,
    },

    // Modules
    {
      id: 'uranopolis-speed-generator',
      name: 'Acceleration Generator',
      category: 'module',
      count: 1,
      imageUrl: imgGeneratorprzyspieszajacy,
    },
    {
      id: 'uranopolis-combat-generator',
      name: 'Combat Generator',
      category: 'module',
      count: 2,
      imageUrl: imgGeneratorbojowy,
    },
    {
      id: 'uranopolis-medic',
      name: 'Medic',
      category: 'module',
      count: 1,
      imageUrl: imgMedyk,
    },
    {
      id: 'uranopolis-doubler',
      name: 'Doubler',
      category: 'module',
      count: 1,
      imageUrl: imgPodwajacz,
    },
    {
      id: 'uranopolis-gauss-transformer',
      name: 'Gauss Transformer',
      category: 'module',
      count: 1,
      imageUrl: imgTransformatorgaussa,
    },
    {
      id: 'uranopolis-transport',
      name: 'Transport',
      category: 'module',
      count: 2,
      imageUrl: imgTransport,
    },
    {
      id: 'uranopolis-waste',
      name: 'Wastes',
      category: 'module',
      count: 1,
      imageUrl: imgOdpady,
    },
  ],
};
