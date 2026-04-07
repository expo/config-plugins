# CLAUDE.md

## Project Overview

Monorepo of community-maintained Expo config plugins for React Native libraries. Plugins auto-configure native Android/iOS projects during `npx expo prebuild`.

- **Namespace**: `@config-plugins/*`
- **Package manager**: pnpm with workspaces
- **Publishing**: `pnpm publish` (independent versioning)

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
- Shared dependency versions are defined in the `catalog:` block in `pnpm-workspace.yaml` and referenced with `catalog:` in each package's `package.json`
- Peer dependency on `expo@^55`
- Tests use Jest with `memfs` for virtual filesystem testing

## Upgrading Plugins for a New Expo SDK Version

When a new Expo SDK is released (e.g., SDK 54 → SDK 55), every package and example app must be updated. Use conventional commits scoped to the package name (e.g., `chore(react-native-foo): bump to expo@^55`).

### Catalog updates (`pnpm-workspace.yaml`)

Update the `catalog:` block with the new SDK versions for shared dependencies:

1. **`expo`** — Update to `^<NEW_SDK>` (used as `peerDependencies` in all packages).
2. **`expo-module-scripts`** — Update to `^<NEW_SDK>`.
3. **`@expo/config-plugins`** — Update to `^<NEW_SDK>`.
4. Review other catalog entries (`@expo/image-utils`, `@expo/plist`, etc.) and bump if needed.

### Per-package updates (`packages/<name>/`)

For each package:

1. **`README.md`** — Add a new row to the version compatibility table with the new SDK version, the latest compatible upstream package version, and the next config plugin major version.
2. **Build & test** — Run `pnpm build` and `pnpm test` (if tests exist) to verify nothing broke.

### Example app updates (`apps/<name>/`)

For each example app:

1. **`package.json`** — Update `expo` to the new SDK version (e.g., `~54` → `~55`).
2. Run `npx expo install --fix` to align all other dependencies (`react`, `react-native`, `expo-splash-screen`, etc.) to compatible versions.
3. Remove any stale vendored templates or files (e.g., old `expo-template-bare-minimum-*.tgz`).

### Monorepo root updates

1. **`scripts/generate-plugin.ts`** — Update `SDK_VERSION` to the new SDK number.

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
