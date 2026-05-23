#!/usr/bin/env node
/**
 * Downloads all army tile images from neuroshimahex.pl to src/assets
 * Run: node scripts/download-assets.mjs
 */
import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BASE_URL = 'https://neuroshimahex.pl/gfx';

// gfx folder -> assets folder
const ARMY_FOLDERS = {
  moloch: 'moloch',
  druciarze: 'wiremen',
  uranopolis: 'uranopolis',
  stalowapolicja: 'steelpolice',
  bestie: 'beasts',
  mephisto: 'mephisto',
  piraci: 'pirates',
  borgo: 'borgo',
  posterunek: 'outpost',
  hegemonia: 'hegemony',
  missisipi: 'mississippi',
  nowyjork: 'newyork',
  smart: 'smart',
  neodzungla: 'neojungle',
  vegas: 'vegas',
  dancer: 'dancer',
  sharrash: 'sharrash',
  sandrunners: 'sandrunners',
  irongang: 'irongang',
  ludziepustyni: 'desertpeople',
  troglodyci: 'troglodytes',
  partyzanci: 'partisans',
  gildiakupcow: 'merchantsguild',
  deathbreath: 'deathbreath',
  doomsdaymachine: 'doomsdaymachine',
};

// Extract image filenames from each army (from the army ts files)
const ARMY_IMAGES = {
  moloch: ['moloch-sztab.png', 'moloch-bitwa.png', 'moloch-ruch.png', 'moloch-odepchniecie.png', 'moloch-bomba.png', 'moloch-bloker.png', 'moloch-cyborg.png', 'moloch-dzialkogaussa.png', 'moloch-juggernaut.png', 'moloch-klaun.png', 'moloch-lowca.png', 'moloch-obronca.png', 'moloch-opancerzonylowca.png', 'moloch-opancerzonywartownik.png', 'moloch-rozpruwacz.png', 'moloch-sieciarz.png', 'moloch-szturmowiec.png', 'moloch-wartownik.png', 'moloch-mozg.png', 'moloch-oficer.png', 'moloch-zwiadowca.png', 'moloch-medyk.png', 'moloch-matka.png'],
  druciarze: ['druciarze-sztab.jpg', 'druciarze-sentinel.jpg', 'druciarze-zabojca-maszyn.jpg', 'druciarze-psychocyborg.jpg', 'druciarze-skorpion.jpg', 'druciarze-tetra.jpg', 'druciarze-osa.jpg', 'druciarze-placzka.jpg', 'druciarze-zolnierz-umo.jpg', 'druciarze-error.jpg', 'druciarze-druciarz.jpg'],
  uranopolis: ['uranopolis-sztab.png', 'uranopolis-ruch.png', 'uranopolis-bitwa.png', 'uranopolis-odepchniecie.png', 'uranopolis-promien.png', 'uranopolis-elektrosieciarz.png', 'uranopolis-mechanik.png', 'uranopolis-inferno.png', 'uranopolis-buldozer.png', 'uranopolis-straznik.png', 'uranopolis-swider.png', 'uranopolis-hammerhead.png', 'uranopolis-wyburzacz.png', 'uranopolis-najemnik.png', 'uranopolis-generatorprzyspieszajacy.png', 'uranopolis-generatorbojowy.png', 'uranopolis-medyk.png', 'uranopolis-podwajacz.png', 'uranopolis-transformatorgaussa.png', 'uranopolis-transport.png', 'uranopolis-odpady.png'],
  stalowapolicja: ['stalowapolicja-sztab.png', 'stalowapolicja-bitwa.png', 'stalowapolicja-ruch.png', 'stalowapolicja-odepchniecie.png', 'stalowapolicja-terror.png', 'stalowapolicja-egzekutor.png', 'stalowapolicja-pacyfikator.png', 'stalowapolicja-predator.png', 'stalowapolicja-brytan.png', 'stalowapolicja-funkcjonariusz.png', 'stalowapolicja-sedzia.png', 'stalowapolicja-wardog.png', 'stalowapolicja-wyrzutniastalowejsieci.png', 'stalowapolicja-oficer.png', 'stalowapolicja-sierzant.png', 'stalowapolicja-medyk.png', 'stalowapolicja-zwiadowca.png', 'stalowapolicja-dywersant.png', 'stalowapolicja-sterydomat.png'],
  bestie: ['bestie-sztab.png', 'bestie-ruch.png', 'bestie-bitwa.png', 'bestie-polowanie.png', 'bestie-przyciagniecie.png', 'bestie-cerber.png', 'bestie-alfa.png', 'bestie-roj.png', 'bestie-taran.png', 'bestie-kwasopluj.png', 'bestie-robal.png', 'bestie-jezowiec.png', 'bestie-sep.png', 'bestie-arachnoid.png', 'bestie-zwiadowca.png', 'bestie-oficer1.png', 'bestie-szarpak.png'],
  mephisto: ['mephisto-sztab.png', 'mephisto-roszada.png', 'mephisto-bitwa.png', 'mephisto-ruch.png', 'mephisto-inkubator.png', 'mephisto-transmiter.png', 'mephisto-szczeki.png', 'mephisto-ogon.png', 'mephisto-koleclewy.png', 'mephisto-kolecprawy.png', 'mephisto-macki.png', 'mephisto-odnoza.png', 'mephisto-swider.png', 'mephisto-wzmacniacz.png', 'mephisto-sonda.png', 'mephisto-paszcza.png', 'mephisto-szpon.png', 'mephisto-akcelerator.png'],
  piraci: ['piraci-sztab.jpg', 'piraci-bitwa.jpg', 'piraci-ruch.jpg', 'piraci-fala.jpg', 'piraci-tawerna.jpg', 'piraci-motorowka.jpg', 'piraci-wedkarz.jpg', 'piraci-harpun.jpg', 'piraci-krokodyl.jpg', 'piraci-sternik.jpg', 'piraci-szmugler.jpg', 'piraci-bosman.jpg', 'piraci-dzialko-wodne.jpg', 'piraci-matka.jpg', 'piraci-oficer1.jpg', 'piraci-dywersant.jpg', 'piraci-medyk.jpg'],
  borgo: ['borgo-sztab.png', 'borgo-bitwa.png', 'borgo-ruch.png', 'borgo-granat.png', 'borgo-mutek.png', 'borgo-nozownik.png', 'borgo-sieciarz.png', 'borgo-supermutant.png', 'borgo-silacz.png', 'borgo-zabojca.png', 'borgo-medyk.png', 'borgo-oficer.png', 'borgo-superoficer.png', 'borgo-zwiadowca.png'],
  posterunek: ['posterunek-sztab.png', 'posterunek-bitwa.png', 'posterunek-ruch.png', 'posterunek-snajper.png', 'posterunek-biegacz.png', 'posterunek-ckm.png', 'posterunek-komandos.png', 'posterunek-likwidator.png', 'posterunek-pancerzwspomagany.png', 'posterunek-silacz.png', 'posterunek-centrumrozpoznania.png', 'posterunek-dywersant.png', 'posterunek-medyk.png', 'posterunek-oficer.png', 'posterunek-skoper.png', 'posterunek-zwiadowca.png'],
  hegemonia: ['hegemonia-sztab.png', 'hegemonia-bitwa.png', 'hegemonia-ruch.png', 'hegemonia-odepchniecie.png', 'hegemonia-snajper.png', 'hegemonia-biegacz.png', 'hegemonia-bydlak.png', 'hegemonia-ganger.png', 'hegemonia-gladiator.png', 'hegemonia-sieciarz.png', 'hegemonia-straznik.png', 'hegemonia-supersieciarz.png', 'hegemonia-uniwersalnyzolnierz.png', 'hegemonia-boss.png', 'hegemonia-kwatermistrz.png', 'hegemonia-oficer1.png', 'hegemonia-oficer2.png', 'hegemonia-transport.png', 'hegemonia-zwiadowca.png'],
  missisipi: ['missisipi-sztab.png', 'missisipi-bitwa.png', 'missisipi-zaslonadymna.png', 'missisipi-podmiana.png', 'missisipi-odepchniecie.png', 'missisipi-ruch.png', 'missisipi-cien.png', 'missisipi-mutant.png', 'missisipi-truciciel.png', 'missisipi-straznik.png', 'missisipi-skrytobojca.png', 'missisipi-sieciarz.png', 'missisipi-paraliz.png', 'missisipi-medyk.png', 'missisipi-mutacja.png', 'missisipi-strefa.png', 'missisipi-bojler.png', 'missisipi-toksycznabomba.png'],
  nowyjork: ['nowyjork-sztab.png', 'nowyjork-bitwa.png', 'nowyjork-ruch.png', 'nowyjork-odepchniecie.png', 'nowyjork-snajper.png', 'nowyjork-strzelec.png', 'nowyjork-strzelecwyborowy.png', 'nowyjork-shotgun.png', 'nowyjork-szpiegstrzelec.png', 'nowyjork-wyrzutniarakiet.png', 'nowyjork-gliniarz.png', 'nowyjork-stalowybokser.png', 'nowyjork-mlot.png', 'nowyjork-odpychacz.png', 'nowyjork-szpiegczysciciel.png', 'nowyjork-sieciarz.png', 'nowyjork-sierzant.png', 'nowyjork-oficer1.png', 'nowyjork-oficer2.png', 'nowyjork-zwiadowca.png', 'nowyjork-mina.png'],
  smart: ['smart-sztab.png', 'smart-bitwa.png', 'smart-odepchniecie.png', 'smart-ruch.png', 'smart-snajper.png', 'smart-terror.png', 'smart-rozpruwacz.png', 'smart-twister.png', 'smart-sieciarz.png', 'smart-dzialkogaussa.png', 'smart-golemmk3.png', 'smart-cyborg.png', 'smart-transporter.png', 'smart-biodroid.png', 'smart-oficer.png', 'smart-matka.png', 'smart-zwiadowca.png'],
  neodzungla: ['neodzungla-sztab.png', 'neodzungla-bitwa.png', 'neodzungla-roszada.png', 'neodzungla-ruch.png', 'neodzungla-malabomba.png', 'neodzungla-monstrum.png', 'neodzungla-rozkrajacz.png', 'neodzungla-truciciel.png', 'neodzungla-miazdzyciel.png', 'neodzungla-scianadrzew.png', 'neodzungla-sieciarz.png', 'neodzungla-klebowisko.png', 'neodzungla-pnacza.png', 'neodzungla-medyk.png', 'neodzungla-symbiontalfa.png', 'neodzungla-symbiontbeta.png', 'neodzungla-symbiontgamma.png', 'neodzungla-korzen.png'],
  vegas: ['vegas-sztab.png', 'vegas-bitwa.png', 'vegas-obrot.png', 'vegas-odepchniecie.png', 'vegas-roszada.png', 'vegas-ruch.png', 'vegas-snajper.png', 'vegas-najemnik.png', 'vegas-ochroniarz.png', 'vegas-straznik.png', 'vegas-strzelec.png', 'vegas-agitator.png', 'vegas-dywersant.png', 'vegas-medyk.png', 'vegas-zwiadowca.png', 'vegas-mina.png'],
  dancer: ['dancer-obiektniebieski.png', 'dancer-obiektczerwony.png', 'dancer-obiektzolty.png', 'dancer-akcja.png', 'dancer-bitwa.png', 'dancer-odepchniecie.png', 'dancer-ruch.png'],
  sharrash: ['sharrash-sztab.png', 'sharrash-bitwa.png', 'sharrash-ruch.png', 'sharrash-paraliz.png', 'sharrash-plaga.png', 'sharrash-bestia.png', 'sharrash-mutant.png', 'sharrash-szczury.png', 'sharrash-mozdzierz.png', 'sharrash-ladunekwybuchowy.png', 'sharrash-podziemia.png', 'sharrash-smietnisko.png', 'sharrash-matka.png', 'sharrash-transport.png', 'sharrash-oficer.png', 'sharrash-medyk.png', 'sharrash-zwiadowca.png', 'sharrash-dziura.png'],
  sandrunners: ['sandrunners-sztab.png', 'sandrunners-ruch.png', 'sandrunners-burzapiaskowa.png', 'sandrunners-odepchniecie.png', 'sandrunners-cyngiel.png', 'sandrunners-amok.png', 'sandrunners-staragwardia.png', 'sandrunners-kafar.png', 'sandrunners-medykpolowysanta.png', 'sandrunners-medykpolowylu.png', 'sandrunners-sekator.png', 'sandrunners-fatamorgana.png', 'sandrunners-oficer1.png', 'sandrunners-wodz.png', 'sandrunners-oficer2.png', 'sandrunners-karawana.png', 'sandrunners-ruchomepiaski.png'],
  irongang: ['irongang-sztab.png', 'irongang-podwojnyruch.png', 'irongang-rozkaz.png', 'irongang-fanatyk.png', 'irongang-sieciarzdystansowy.png', 'irongang-drwal.png', 'irongang-gora.png', 'irongang-motocyklista.png', 'irongang-oficer.png', 'irongang-szef.png', 'irongang-hak.jpg'],
  ludziepustyni: ['ludziepustyni-sztab.jpg', 'ludziepustyni-bitwa.jpg', 'ludziepustyni-ruch.jpg', 'ludziepustyni-miraz.jpg', 'ludziepustyni-skalpel.jpg', 'ludziepustyni-kojot.jpg', 'ludziepustyni-lucznik.jpg', 'ludziepustyni-mlodzi-wojownicy.jpg', 'ludziepustyni-szamanka.jpg', 'ludziepustyni-tropiciel.jpg', 'ludziepustyni-grzechotnik.jpg', 'ludziepustyni-wojownik-klanu-czerwia.jpg', 'ludziepustyni-grotnik.jpg', 'ludziepustyni-kryjowka.jpg', 'ludziepustyni-oficer.jpg', 'ludziepustyni-zwiadowca.jpg'],
  troglodyci: ['troglodyci-sztab.png', 'troglodyci-bitwa.png', 'troglodyci-ruch.png', 'troglodyci-lawina.png', 'troglodyci-skanibalizowanie-wroga.png', 'troglodyci-frost.png', 'troglodyci-lucznik.png', 'troglodyci-tundra.png', 'troglodyci-sopel.png', 'troglodyci-niedzwiedz.png', 'troglodyci-mrozna-matrona.png', 'troglodyci-lodowa-malpa.png', 'troglodyci-dzieciaki.png', 'troglodyci-pluca.png', 'troglodyci-pazury.png', 'troglodyci-oczy.png', 'troglodyci-kly.png', 'troglodyci-miesnie.png', 'troglodyci-serce.png'],
  partyzanci: ['partyzanci-sztab.jpg', 'partyzanci-wycofanie.jpg', 'partyzanci-taktyka.jpg', 'partyzanci-ruch.jpg', 'partyzanci-bitwa.jpg', 'partyzanci-zarzadca-bunkra.jpg', 'partyzanci-uspiony-agent.jpg', 'partyzanci-asystentka-doktora.jpg', 'partyzanci-dron-straznik.jpg', 'partyzanci-cyborg-charlie.jpg', 'partyzanci-prowokatorka.jpg', 'partyzanci-gustav-2.jpg', 'partyzanci-szalony-sid.jpg', 'partyzanci-zwiadowca-weteran.jpg', 'partyzanci-zwiadowca.jpg', 'partyzanci-medyk.jpg', 'partyzanci-szofer.jpg', 'partyzanci-mina.jpg', 'partyzanci-zaslona-dymna.jpg', 'partyzanci-swider.jpg', 'partyzanci-medpack.jpg', 'partyzanci-siec.jpg', 'partyzanci-wscieklizna.jpg', 'partyzanci-paraliz.jpg'],
  gildiakupcow: ['gildiakupcow-sztab.jpg', 'gildiakupcow-platny-snajper.jpg', 'gildiakupcow-czarny-rynek.jpg', 'gildiakupcow-ruch.jpg', 'gildiakupcow-bitwa.jpg', 'gildiakupcow-strateg.jpg', 'gildiakupcow-lapowkarz.jpg', 'gildiakupcow-wybuchowy-chris.jpg', 'gildiakupcow-kowalski.jpg', 'gildiakupcow-czarna-skrzynka.jpg', 'gildiakupcow-ryzykant.jpg', 'gildiakupcow-lider-zwiadu.jpg', 'gildiakupcow-hakerka.jpg', 'gildiakupcow-czolg.jpg', 'gildiakupcow-pirat-drogowy.jpg', 'gildiakupcow-lowczyni-glow.jpg', 'gildiakupcow-wiezyczka-z-fotokomorka.jpg', 'gildiakupcow-zwiadowca.jpg', 'gildiakupcow-komander.jpg', 'gildiakupcow-naczelnik.jpg'],
  deathbreath: ['deathbreath-sztab.png', 'deathbreath-roszada.png', 'deathbreath-powrot.png', 'deathbreath-ruch.png', 'deathbreath-bitwa.png', 'deathbreath-zarazony.png', 'deathbreath-chwytacz.png', 'deathbreath-zombiak.png', 'deathbreath-anomalia.png', 'deathbreath-mutant.png', 'deathbreath-truposz.png', 'deathbreath-pozeracz.png', 'deathbreath-bestia.png', 'deathbreath-medyk.png', 'deathbreath-oficer.png', 'deathbreath-zwiadowca.png'],
  doomsdaymachine: ['doomsdaymachine-sztab.png', 'doomsdaymachine-bitwa.png', 'doomsdaymachine-odepchniecie.png', 'doomsdaymachine-malabomba.png', 'doomsdaymachine-strzelecalfa.png', 'doomsdaymachine-dzialkogaussa.png', 'doomsdaymachine-strzelecgamma.png', 'doomsdaymachine-roztrajacz.png', 'doomsdaymachine-strzelecdelta.png', 'doomsdaymachine-strzelecomega.png', 'doomsdaymachine-sieciarzzaglady.png', 'doomsdaymachine-stanowiskoogniowe.png', 'doomsdaymachine-pulapka.png', 'doomsdaymachine-medyk.png', 'doomsdaymachine-oficer.png', 'doomsdaymachine-zwiadowca.png', 'doomsdaymachine-glownyprocesorbojowy.png'],
};

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  let downloaded = 0;
  let skipped = 0;

  for (const [gfxFolder, filenames] of Object.entries(ARMY_IMAGES)) {
    const assetsFolder = ARMY_FOLDERS[gfxFolder];
    if (!assetsFolder) {
      console.warn(`No assets folder for ${gfxFolder}`);
      continue;
    }

    const dir = join(ROOT, 'src', 'assets', assetsFolder);
    await mkdir(dir, { recursive: true });

    for (const filename of filenames) {
      const url = `${BASE_URL}/${gfxFolder}/${filename}`;
      const outPath = join(dir, filename);

      try {
        const buf = await download(url);
        await writeFile(outPath, buf);
        console.log(`✓ ${assetsFolder}/${filename}`);
        downloaded++;
      } catch (err) {
        console.error(`✗ ${url}: ${err.message}`);
      }
    }
  }

  console.log(`\nDone. Downloaded ${downloaded} images.`);
}

main().catch(console.error);
