#!/usr/bin/env node
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '..', 'public');

// Pointy-top hex vertex generator centered at (cx, cy) with circumradius r.
function hexPath(cx, cy, r) {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 90);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `M ${points.join(' L ')} Z`;
}

// `padding` controls how much of the square is background vs artwork.
// Maskable icons need the safe zone (artwork inside central 80%) per W3C spec.
function buildIconSvg({ size, padding, rounded }) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = (size / 2) * (1 - padding);
  const midR = outerR * 0.72;
  const innerR = outerR * 0.42;
  const stroke = Math.max(2, size * 0.018);

  const bg = rounded
    ? `<rect width="${size}" height="${size}" rx="${size * 0.22}" ry="${size * 0.22}" fill="#0c0a09"/>`
    : `<rect width="${size}" height="${size}" fill="#0c0a09"/>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${bg}
  <path d="${hexPath(cx, cy, outerR)}" fill="none" stroke="#f59e0b" stroke-width="${stroke}" stroke-linejoin="round" opacity="0.95"/>
  <path d="${hexPath(cx, cy, midR)}" fill="none" stroke="#f59e0b" stroke-width="${stroke * 0.75}" stroke-linejoin="round" opacity="0.55"/>
  <path d="${hexPath(cx, cy, innerR)}" fill="#f59e0b" opacity="0.85"/>
</svg>`;
}

async function renderPng(svg, size, outPath) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outPath);
  console.log(`  wrote ${outPath.replace(publicDir + '/', '')}`);
}

async function main() {
  await mkdir(publicDir, { recursive: true });

  const appIconSvg = buildIconSvg({ size: 512, padding: 0.12, rounded: true });
  await writeFile(resolve(publicDir, 'app-icon.svg'), appIconSvg);
  console.log('  wrote app-icon.svg');

  await renderPng(appIconSvg, 192, resolve(publicDir, 'icon-192.png'));
  await renderPng(appIconSvg, 512, resolve(publicDir, 'icon-512.png'));
  await renderPng(appIconSvg, 180, resolve(publicDir, 'apple-touch-icon.png'));

  const maskableSvg = buildIconSvg({ size: 512, padding: 0.18, rounded: false });
  await renderPng(maskableSvg, 512, resolve(publicDir, 'icon-512-maskable.png'));

  console.log('PWA icons generated.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
