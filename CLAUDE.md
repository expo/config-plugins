# CLAUDE.md

## Project Overview

Monorepo of community-maintained Expo config plugins for React Native libraries. Plugins auto-configure native Android/iOS projects during `npx expo prebuild`.

- **Namespace**: `@config-plugins/*`
- **Package manager**: pnpm with workspaces
- **Orchestrator**: Lerna (independent versioning, `npmClient: pnpm`)
- **Workspaces**: `apps/*` (example apps), `packages/*` (published plugins)

## Common Commands

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm prepare

# Watch build all packages
pnpm start

# Generate a new plugin
pnpm gen

# Run tests for a specific package
cd packages/<name> && pnpm test

# Lint a specific package
cd packages/<name> && pnpm lint --max-warnings 0

# Build a specific package
cd packages/<name> && pnpm build

# Clean a specific package
cd packages/<name> && pnpm clean

# Rebuild an example app to test config plugins
cd apps/<name> && pnpm expo prebuild --clean
```

## Project Structure

- `packages/` — Config plugin packages (each has `src/`, `__tests__/`)
- `apps/` — Example apps for testing plugins
- `fixtures/` — Shared test fixtures (native config files: AppDelegate, build.gradle, Podfile, etc.)
- `scripts/` — Repo tooling (plugin generator, dependabot config, issue templates)

## Conventions

- Use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) (e.g., `feat(react-native-foo): add bar`)
- Branch naming: `@your-github-username/type/description`
- Each package delegates build/test/lint to `expo-module-scripts`
- TypeScript source in `src/`, compiled output in `build/`
- Peer dependency on `expo@^55`
- Tests use Jest with `memfs` for virtual filesystem testing

## CI

GitHub Actions runs on Node 20 and 22. Build step runs `pnpm lerna run prepare --stream`, then per-package lint and test. Not all packages have CI tests — check `.github/workflows/test.yml` for the matrix.

## Upgrading Plugins for a New Expo SDK Version

When a new Expo SDK is released (e.g., SDK 54 → SDK 55), every package and example app must be updated. Use conventional commits scoped to the package name (e.g., `chore(react-native-foo): bump to expo@^55`).

### Per-package updates (`packages/<name>/`)

For each package:

1. **`package.json`** — Update `peerDependencies.expo` to `^<NEW_SDK>`.
2. **`README.md`** — Add a new row to the version compatibility table with the new SDK version, the latest compatible upstream package version, and the next config plugin major version.
3. **Build & test** — Run `pnpm build` and `pnpm test` (if tests exist) to verify nothing broke.

### Example app updates (`apps/<name>/`)

For each example app:

1. **`package.json`** — Update `expo` to the new SDK version (e.g., `~54` → `~55`).
2. Run `npx expo install --fix` to align all other dependencies (`react`, `react-native`, `expo-splash-screen`, etc.) to compatible versions.
3. Remove any stale vendored templates or files (e.g., old `expo-template-bare-minimum-*.tgz`).

### Monorepo root updates

1. **`package.json`** — Update `expo-module-scripts` to the version matching the new SDK (e.g., `^55.0.2`).
2. **`scripts/generate-plugin.ts`** — Update `SDK_VERSION` to the new SDK number.
3. **`scripts/template/package.json`** — Update the `expo` peer dependency version.

### Final steps

1. Run `pnpm install` from the root to regenerate `pnpm-lock.yaml`.
2. Run `pnpm prepare` to verify all packages build.
3. Run tests for packages that have them.
4. Update `CLAUDE.md` if any conventions changed (e.g., the peer dependency version listed under Conventions).

## After Adding/Removing Packages

Run these from the root:
```bash
pnpm update-dependabot-config
pnpm update-issue-template
```
