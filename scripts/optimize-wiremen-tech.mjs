#!/usr/bin/env node
/**
 * Resizes Wiremen technology (instant) PNGs to match other army tile assets (150×140)
 * and applies PNG compression. Filenames and imports stay unchanged.
 *
 * Run: node scripts/optimize-wiremen-tech.mjs
 * Dry run (sizes only): node scripts/optimize-wiremen-tech.mjs --dry-run
 *
 * Optional: install oxipng (https://github.com/shssoichiro/oxipng) for an extra pass;
 * the script runs `oxipng -o 4 -s` when `oxipng` is on PATH.
 */
import { readdir, stat, writeFile } from 'fs/promises';
import { execFileSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const WIREMEN_DIR = join(ROOT, 'src/assets/wiremen');
const PREFIX = 'HEX_wiremen_TECH_';
const TARGET_W = 150;
const TARGET_H = 140;

function tryOxipng(filePath) {
  try {
    // oxipng 10+: `--strip` requires a mode (`safe`/`all`); `-s` is shorthand for `--strip safe`
    execFileSync('oxipng', ['-o', '4', '-s', filePath], {
      stdio: 'pipe',
    });
    return true;
  } catch (e) {
    if (e?.code === 'ENOENT') return false;
    throw e;
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const names = (await readdir(WIREMEN_DIR))
    .filter((f) => f.startsWith(PREFIX) && f.endsWith('.png'))
    .sort();

  if (!names.length) {
    console.error(`No ${PREFIX}*.png files in ${WIREMEN_DIR}`);
    process.exit(1);
  }

  let totalBefore = 0;
  let totalAfter = 0;
  let oxipngUsed = false;

  for (const name of names) {
    const abs = join(WIREMEN_DIR, name);
    const beforeStat = await stat(abs);
    const before = beforeStat.size;
    totalBefore += before;

    if (dryRun) {
      const meta = await sharp(abs).metadata();
      console.log(
        `${name}: ${meta.width}×${meta.height} → ${TARGET_W}×${TARGET_H} (${before} bytes)`,
      );
      continue;
    }

    const buf = await sharp(abs)
      .resize(TARGET_W, TARGET_H, { fit: 'cover', position: 'centre' })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();

    await writeFile(abs, buf);
    let after = (await stat(abs)).size;

    if (tryOxipng(abs)) {
      oxipngUsed = true;
      after = (await stat(abs)).size;
    }

    totalAfter += after;
    console.log(`${name}: ${before} → ${after} bytes`);
  }

  if (dryRun) return;

  const saved = totalBefore - totalAfter;
  const pct =
    totalBefore > 0 ? ((100 * saved) / totalBefore).toFixed(1) : '0';
  console.log(
    `\nTotal: ${totalBefore} → ${totalAfter} bytes (${saved} saved, ${pct}% smaller)`,
  );
  if (!oxipngUsed) {
    console.log(
      'Tip: install oxipng and re-run for a smaller extra pass (optional).',
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
