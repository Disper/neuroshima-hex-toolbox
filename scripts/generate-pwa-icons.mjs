#!/usr/bin/env node
import { access, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '..', 'public');
const sourcePath = resolve(publicDir, 'app-icon-source.png');

async function assertSource() {
  try {
    await access(sourcePath);
  } catch {
    throw new Error(
      `Missing ${sourcePath}. Add the master app icon as public/app-icon-source.png (square PNG), then re-run this script.`
    );
  }
}

/** Resize source to a square PNG of `size`. */
async function renderSquarePng(size, outPath) {
  await sharp(sourcePath)
    .resize(size, size, { fit: 'cover', position: 'centre' })
    .png()
    .toFile(outPath);
  console.log(`  wrote ${outPath.replace(publicDir + '/', '')}`);
}

/**
 * Maskable 512×512: keep artwork inside the central ~80% safe zone (W3C / Android).
 */
async function renderMaskable512(outPath) {
  const canvas = 512;
  const maxInner = Math.floor(canvas * 0.8);
  const innerBuf = await sharp(sourcePath)
    .resize(maxInner, maxInner, { fit: 'inside', withoutEnlargement: false })
    .png()
    .toBuffer();
  const meta = await sharp(innerBuf).metadata();
  const w = meta.width ?? maxInner;
  const h = meta.height ?? maxInner;
  const left = Math.floor((canvas - w) / 2);
  const top = Math.floor((canvas - h) / 2);
  await sharp({
    create: {
      width: canvas,
      height: canvas,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite([{ input: innerBuf, left, top }])
    .png()
    .toFile(outPath);
  console.log(`  wrote ${outPath.replace(publicDir + '/', '')}`);
}

async function main() {
  await assertSource();
  await mkdir(publicDir, { recursive: true });

  await renderSquarePng(32, resolve(publicDir, 'icon-32.png'));
  await renderSquarePng(192, resolve(publicDir, 'icon-192.png'));
  await renderSquarePng(512, resolve(publicDir, 'icon-512.png'));
  await renderSquarePng(180, resolve(publicDir, 'apple-touch-icon.png'));
  await renderMaskable512(resolve(publicDir, 'icon-512-maskable.png'));

  console.log('PWA icons generated.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
