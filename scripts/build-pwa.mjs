#!/usr/bin/env node
// Postbuild step: generate a Workbox service worker that precaches the
// entire Vite production output under `dist/`, so the web app works fully
// offline after a single successful online visit.
//
// Run after `vite build`. Consumed by `npm run build`.

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { generateSW } from 'workbox-build';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', 'dist');

const { count, size, warnings } = await generateSW({
  globDirectory: distDir,
  globPatterns: [
    '**/*.{js,css,html,svg,png,jpg,jpeg,webp,woff2,ico,webmanifest,json}',
  ],
  swDest: resolve(distDir, 'sw.js'),
  // Skip terser: its rollup plugin hangs on Node 20+ inside workbox-build.
  // The SW is only ~20KB uncompressed, so minification is noise anyway.
  mode: 'development',
  // Keep SW in sync across tabs: new version takes over as soon as all
  // clients have reloaded. We do NOT call skipWaiting to avoid mid-session
  // asset swaps breaking a live draw/counter view.
  clientsClaim: true,
  skipWaiting: false,
  cleanupOutdatedCaches: true,
  navigateFallback: 'index.html',
  navigateFallbackDenylist: [/^\/api\//],
  // 6MB total today; guard against future asset bloat silently breaking.
  maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
  // Avoid precaching third-party scripts referenced from index.html.
  dontCacheBustURLsMatching: /\-[a-zA-Z0-9_-]{8}\.(?:js|css|png|jpg|jpeg|webp|svg|woff2)$/,
});

for (const w of warnings) console.warn('[workbox]', w);

const sizeMb = (size / 1024 / 1024).toFixed(2);
console.log(
  `[pwa] precache: ${count} files, ${sizeMb} MB -> dist/sw.js`
);
