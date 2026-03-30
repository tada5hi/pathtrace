# Conventions

## Code Style

- **Indentation**: 4 spaces
- **Line endings**: LF
- **Charset**: UTF-8
- **Linter**: ESLint with `@tada5hi/eslint-config-typescript`
- **Lint command**: `npm run lint` (checks `src/` and `test/`)

## Commit Messages

Uses **Conventional Commits** enforced by commitlint + Husky:

```
type(scope): description
```

Common types: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`

Examples from this repo:
- `fix: always permit ob key`
- `fix: path normalization + unified key variants`
- `feat: getPathInfo accept PropertyKey as path input`

## Build

```bash
npm run build    # Rollup produces dist/index.cjs, dist/index.mjs, dist/index.d.ts
```

- Bundler: Rollup with SWC plugin
- Config: `rollup.config.mjs`
- TypeScript declarations emitted via `tsc --emitDeclarationOnly`

## CI/CD

**Main workflow** (`.github/workflows/main.yml`): Runs on push/PR to `master`, `develop`, `next`, `beta`, `alpha`.
- Steps: install → build → lint → test

**Release workflow** (`.github/workflows/release.yml`): Runs on push to `master`.
- Uses `release-please` for automated version bumps, changelog generation, and GitHub releases
- Publishes to npm via `workspaces-publish`

## Module Pattern

Each feature module follows this structure:
```
src/<feature>/
├── module.ts       # Main implementation
├── types.ts        # Type definitions (if needed)
├── constants.ts    # Constants (if needed)
├── helper.ts       # Internal helpers (if needed)
└── index.ts        # Barrel re-export
```

New modules should follow this pattern and be re-exported from `src/index.ts`.
