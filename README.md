# Neuroshima Hex Toolbox

Offline-capable randomizer, counter, and army-selection companion tools for the board game **Neuroshima Hex!** by Portal Games. Built with React + TypeScript + Vite + Tailwind v4, deployed as a PWA.

Live:

- Vercel: <https://neuroshima-hex-toolbox.vercel.app/>
- GitHub Pages: <https://disper.github.io/hex-toolbox/>

The old `https://neuroshima-hex-randomizer.vercel.app/` URL auto-redirects to the new Vercel hostname after the Vercel project was renamed.

## Development

```bash
npm install
npm run dev
```

Vite serves at <http://localhost:5173/>.

## Building

Two build targets, one source tree — controlled by the `VITE_BASE` env var read in [`vite.config.ts`](vite.config.ts):

| Target | Command | Vite `base` |
| --- | --- | --- |
| Vercel (root) | `npm run build` | `/` |
| GitHub Pages (subpath) | `npm run build:ghpages` | `/hex-toolbox/` |

`npm run build` also runs [`scripts/build-pwa.mjs`](scripts/build-pwa.mjs), which generates the Workbox service worker (`dist/sw.js`) that precaches the whole bundle for offline use. The static manifest at [`public/manifest.webmanifest`](public/manifest.webmanifest) uses `start_url: "."` and `scope: "."`, so it works unchanged under either base.

Vercel is wired to `npm run build`, so no configuration changes are needed there.

## Deployment

- **Vercel** — automatic on push to `main` (project: `neuroshima-hex-toolbox`).
- **GitHub Pages** — the [`deploy-ghpages`](.github/workflows/deploy-ghpages.yml) workflow runs `npm run build:ghpages` and publishes `dist/` into the `hex-toolbox/` folder of the `Disper/disper.github.io` repo on every push to `main`. It authenticates with the `DISPER_GH_IO_TOKEN` secret (a fine-grained PAT with `contents:write` on `Disper/disper.github.io`).

## Versioning

Every push bumps the patch version in [`src/version.ts`](src/version.ts) (`APP_VERSION` + `APP_VERSION_DATE`) per the [version-bump rule](.cursor/rules/version-bump.mdc).

## Mobile shells

Native Android / iOS shells live under [`android/`](android) and [`ios/`](ios). Shared TypeScript → native resource generation runs via `npm run mobile:generate` (see [`scripts/generate-native-shared.mjs`](scripts/generate-native-shared.mjs)).

## UI conventions

See [`.cursor/skills/neuroshima-hex-ui-style/SKILL.md`](.cursor/skills/neuroshima-hex-ui-style/SKILL.md) for the dark-stone palette, army accent colors, tile category chrome, card shells, and typography used across the app.
