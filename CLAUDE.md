# Neuroshima Hex Toolbox — Claude Instructions

## Workflow (disp)

- Git + GitHub: the repo is on GitHub (`Disper/neuroshima-hex-toolbox`); commit and push there.
- OpenSpec: **any request to add, change or fix functionality MUST start with the `disp:new-change` skill** (`/disp:new-change <name> <description>`) instead of editing code directly. It creates a worktree, a herdr tab and a new Claude session running `/opsx:propose`. Never work on a change in the main checkout.
- herdr: all agents run in one workspace named after the project; each change has its own tab, kept until the change is finalized.
- Versioning: `VERSION` (semver) is the source of truth. `/disp:finalize` bumps the patch version and tags `vX.Y.Z`; pass `minor`, `major` or `no-bump` to override. Every bump must also update the in-app version and release notes — see **Version bump** below.
- Finish with `/disp:finalize` (archive, commit, merge into `main`, push, clean up), which ends by asking whether the herdr tab can be closed.

- Run locally: `make run` starts the app. Keep this target working; update it when the entry point changes.

## Version bump

Whenever the version is bumped (by `/disp:finalize`, or when the user asks to **push**/ship outside the disp flow):

1. Increment the version with a **patch** bump by default (e.g. `1.1.1` → `1.1.2`), unless a **minor** (`1.1.x` → `1.2.0`) or **major** (`1.x.x` → `2.0.0`) bump is requested. Write it to:
   - `VERSION`
   - `src/version.ts` → `APP_VERSION`, and set `APP_VERSION_DATE` to **today's date** (`YYYY-MM-DD`).
2. **Update `src/releaseNotes.ts`**:
   - Prepend a new entry (newest first) with the new version, today's date, and a short bilingual summary (`summaryEn` + `summaryPl`) describing the changes.
   - Remove the oldest entries so the array never exceeds 7 items.
3. **Include** `VERSION`, `src/version.ts` and `src/releaseNotes.ts` in the same commit as the other changes (or the commit that gets pushed).
4. Push, and tag `vX.Y.Z`.

If there is nothing else to commit when asked to push, still bump the patch version, update release notes, and push that version-only commit.

## Checks

Commands `/disp:finalize` runs in the worktree before archiving (all must pass):

```
npm ci && npm run build
```

## Deploy

Deployment is automatic: `.github/workflows/deploy-ghpages.yml` builds and publishes to GitHub Pages on every push to `main`, so a green CI run on `main` means it is deployed. Nothing to run manually:

```
echo "Deployed by GitHub Actions (deploy-ghpages.yml) on push to main"
```
