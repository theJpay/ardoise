# Releasing

How a release flows from `beta` to production at [ardoise.page](https://ardoise.page).

## Flow

Feature branches merge into `beta`. `beta → main` ships to prod via Vercel. `main` is protected with linear history; `beta` is protected against force-push and deletion. CI runs on pushes and PRs to both.

## Per-release checklist

1. **Verify `beta`** — CI green, smoke-tested on [beta.ardoise.page](https://beta.ardoise.page).
2. **Bump version** — edit the `version` field in `package.json`, commit as `chore: Bump version to vX.Y.Z`, push.
3. **Open the release PR** — `npm run release:pr`. Review and edit the auto-generated body on GitHub if needed.
4. **Squash-merge** in the GitHub UI. Leave "delete branch" unchecked — `beta` is protected but habit matters.
5. **Sync `beta`** — `npm run release:sync-beta`. Fast-forwards `beta` onto the new `main`.
6. **Tag + publish release** — `npm run release:tag`. Creates the GitHub release with notes auto-generated from merged PRs.
7. **Verify prod** — load ardoise.page, confirm the release deployed.

## Rollback

If a bad release reaches prod:

1. Find the squash commit of the release PR on `main`.
2. On a hotfix branch off `main`: `git revert <sha>` → PR → squash-merge.
3. Vercel redeploys automatically.

Schema caveat: Dexie migrations run client-side when a user loads the app. A code revert does not un-migrate an IndexedDB that has already upgraded. Keep schema changes additive where possible so a revert remains safe.

## Scripts

| Script | Action |
|---|---|
| `release:pr` | Opens PR `beta → main`, title `Release v$npm_package_version`, body seeded from `git log main..beta`. |
| `release:sync-beta` | `git checkout beta && git pull --rebase origin main && git push`. |
| `release:tag` | `gh release create v$npm_package_version --target main --generate-notes`. |
