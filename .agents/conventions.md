# Conventions

## Code Style

- **Indentation**: 4 spaces
- **Line endings**: LF
- **Charset**: UTF-8
- **Linter**: ESLint with `@tada5hi/eslint-config`
- **Lint command**: `npm run lint` (checks the whole repo, `dist/` excluded)
- **Object literals**: `@stylistic/object-curly-newline` keeps literals with fewer than three
  properties on a single line — `npm run lint:fix` rewrites them, so do not hand-format against it

## Commit Messages

Uses **Conventional Commits**, enforced by `@commitlint/cli` from the Husky `commit-msg` hook:

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
npm run build    # tsdown produces dist/index.mjs, dist/index.mjs.map, dist/index.d.mts
```

- Bundler: `tsdown` (rolldown)
- Config: `tsdown.config.ts`
- The build does **not** type check — `npm run typecheck` (`tsc --noEmit`) is the separate gate

## CI/CD

**Main workflow** (`.github/workflows/main.yml`): Runs on push/PR to `master`, `develop`, `next`, `beta`, `alpha`.
- Jobs: install → build → typecheck / lint / test (`npm run test:coverage`)

**Release workflow** (`.github/workflows/release.yml`): Runs on push to `master`.
- Uses `release-please` for automated version bumps, changelog generation, and GitHub releases
- Publishes to npm via `tada5hi/monoship`

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
