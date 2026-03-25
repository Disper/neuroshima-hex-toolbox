#!/usr/bin/env node
/**
 * Samples average color from each army's HQ image (hqImageUrl import) and suggests accentColor
 * hex values aligned with tile art. Darkens light colors so white text on buttons meets ~3:1 contrast.
 *
 * Requires: assets under src/assets (run `npm run download-assets` first).
 *
 * Usage:
 *   node scripts/sample-army-accent.mjs           # print table + write army-accent-suggestions.json
 *   node scripts/sample-army-accent.mjs --write  # also patch accentColor in src/data/armies/*.ts
 */
import { readdir, readFile, writeFile } from 'fs/promises';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ARMIES_DIR = join(ROOT, 'src/data/armies');

/** WCAG contrast (white #fff as foreground, hex bg as background). Target >= 3 for large UI text. */
const MIN_CONTRAST = 3;

function relativeLuminance(r, g, b) {
  const lin = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function contrastWhite(bgR, bgG, bgB) {
  const Lbg = relativeLuminance(bgR, bgG, bgB);
  return (1.05 / (Lbg + 0.05));
}

function clamp255(x) {
  return Math.max(0, Math.min(255, Math.round(x)));
}

function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map((c) => clamp255(c).toString(16).padStart(2, '0'))
      .join('')
  );
}

/** Darken RGB toward black until contrast with white is at least MIN_CONTRAST. */
function ensureContrastForWhiteText(r, g, b) {
  let rr = r;
  let gg = g;
  let bb = b;
  let guard = 0;
  while (contrastWhite(rr, gg, bb) < MIN_CONTRAST && guard < 50) {
    rr *= 0.92;
    gg *= 0.92;
    bb *= 0.92;
    guard++;
  }
  return [clamp255(rr), clamp255(gg), clamp255(bb)];
}

function parseImports(content) {
  const map = new Map();
  const re = /^import\s+(\w+)\s+from\s+['"]([^'"]+)['"]\s*;?/gm;
  let m;
  while ((m = re.exec(content)) !== null) {
    map.set(m[1], m[2]);
  }
  return map;
}

function parseArmyId(content) {
  const m = content.match(/id:\s*'([^']+)'/);
  return m ? m[1] : null;
}

function parseHqIdentifier(content) {
  const m = content.match(/hqImageUrl:\s*(\w+)\s*,/);
  return m ? m[1] : null;
}

function parseAccentColor(content) {
  const m = content.match(/accentColor:\s*'([^']+)'/);
  return m ? m[1] : null;
}

function satWeight(r, g, b) {
  const maxc = Math.max(r, g, b);
  const minc = Math.min(r, g, b);
  if (maxc < 1) return 0;
  const s = (maxc - minc) / maxc;
  return s * s + 0.08;
}

/**
 * Center-crop (~55% of min dimension) then saturation-weighted average RGB
 * so faction hues dominate over brown borders/frames.
 */
async function averageRgbFromImage(absPath) {
  const meta = await sharp(absPath).metadata();
  const W = meta.width ?? 0;
  const H = meta.height ?? 0;
  if (!W || !H) {
    throw new Error('missing dimensions');
  }
  const side = Math.floor(Math.min(W, H) * 0.55);
  const left = Math.floor((W - side) / 2);
  const top = Math.floor((H - side) / 2);

  const { data, info } = await sharp(absPath)
    .extract({ left, top, width: side, height: side })
    .resize(72, 72, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const ch = info.channels;
  let wr = 0;
  let wg = 0;
  let wb = 0;
  let wt = 0;
  for (let i = 0; i < data.length; i += ch) {
    const pr = data[i];
    const pg = data[i + 1];
    const pb = data[i + 2];
    const lum = (pr + pg + pb) / 3;
    if (lum < 10 || lum > 248) continue;
    const w = satWeight(pr, pg, pb);
    wr += pr * w;
    wg += pg * w;
    wb += pb * w;
    wt += w;
  }
  if (wt < 1e-6) {
    for (let i = 0; i < data.length; i += ch) {
      wr += data[i];
      wg += data[i + 1];
      wb += data[i + 2];
      wt += 1;
    }
  }
  return [wr / wt, wg / wt, wb / wt];
}

async function main() {
  const writeFlag = process.argv.includes('--write');
  const files = (await readdir(ARMIES_DIR)).filter((f) => f.endsWith('.ts') && f !== 'index.ts');

  const results = [];

  for (const file of files.sort()) {
    const armyPath = join(ARMIES_DIR, file);
    const content = await readFile(armyPath, 'utf8');
    const id = parseArmyId(content);
    const hqId = parseHqIdentifier(content);
    const oldAccent = parseAccentColor(content);
    const imports = parseImports(content);

    if (!id || !hqId) {
      console.warn(`Skip ${file}: missing id or hqImageUrl`);
      continue;
    }

    const relImport = imports.get(hqId);
    if (!relImport) {
      console.warn(`Skip ${file}: no import for ${hqId}`);
      results.push({ id, file, error: `missing import ${hqId}`, oldAccent });
      continue;
    }

    const absImage = resolve(dirname(armyPath), relImport);
    let sampled;
    try {
      sampled = await averageRgbFromImage(absImage);
    } catch (e) {
      console.warn(`${id}: could not read ${absImage}:`, e.message);
      results.push({ id, file, error: e.message, oldAccent, image: absImage });
      continue;
    }

    const rawHex = rgbToHex(sampled[0], sampled[1], sampled[2]);
    const [fr, fg, fb] = ensureContrastForWhiteText(sampled[0], sampled[1], sampled[2]);
    const finalHex = rgbToHex(fr, fg, fb);

    results.push({
      id,
      file,
      image: relImport,
      sampledHex: rawHex,
      accentColor: finalHex,
      oldAccent,
      contrast: contrastWhite(fr, fg, fb).toFixed(2),
    });
  }

  console.log('\nid\toldAccent\tsampled\tfinal\tcontrast');
  console.log('-'.repeat(72));
  for (const r of results) {
    if (r.error) {
      console.log(`${r.id}\tERROR: ${r.error}`);
    } else {
      console.log(`${r.id}\t${r.oldAccent}\t${r.sampledHex}\t${r.accentColor}\t${r.contrast}`);
    }
  }

  const jsonPath = join(__dirname, 'army-accent-suggestions.json');
  await writeFile(jsonPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nWrote ${jsonPath}`);

  if (writeFlag) {
    for (const r of results) {
      if (r.error || !r.accentColor) continue;
      const armyPath = join(ARMIES_DIR, r.file);
      let txt = await readFile(armyPath, 'utf8');
      const next = txt.replace(/accentColor:\s*'[^']+'/, `accentColor: '${r.accentColor}'`);
      if (next === txt) {
        console.warn(`No accentColor replace in ${r.file}`);
        continue;
      }
      await writeFile(armyPath, next, 'utf8');
      console.log(`Updated accentColor: ${r.id} -> ${r.accentColor}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
