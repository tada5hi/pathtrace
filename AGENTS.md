<!-- NOTE: Keep this file and all corresponding files in the .agents directory updated as the project evolves. When making architectural changes, adding new patterns, or discovering important conventions, update the relevant sections. -->

# pathtrace — Agent Guide

A TypeScript utility library for traversing and manipulating deeply nested JavaScript objects and arrays using string-based path notation (e.g., `user.contact[0].email`). Supports get/set/remove operations, wildcard expansion (`*`, `**`), and path introspection.

## Quick Reference

```bash
# Setup
npm ci

# Development
npm run build        # tsdown → ESM bundle + TypeScript declarations
npm run typecheck    # tsc --noEmit over src/ and test/
npm run test         # Vitest (npm run test:coverage enforces the 80% thresholds)
npm run lint         # ESLint (npm run lint:fix to auto-format)
```

- **Node.js**: 22+
- **Package manager**: npm

## Detailed Guides

- **[Project Structure](.agents/structure.md)** — Source layout and module responsibilities
- **[Architecture](.agents/architecture.md)** — Design patterns, path parsing pipeline, and key abstractions
- **[Testing](.agents/testing.md)** — Vitest setup, test conventions, and coverage
- **[Conventions](.agents/conventions.md)** — Code style, commit conventions, CI/CD, and release process

## Commits, Issues & Pull Requests

- Commits follow **[Conventional Commits](https://www.conventionalcommits.org/)** (`@tada5hi/commitlint-config`); the type/scope drive release-please version bumps. See [conventions.md](.agents/conventions.md#commit-convention).
- Versioning, `CHANGELOG.md`, `package.json` version, and `.release-please-manifest.json` are owned by **release-please** — do not hand-edit them.
- Do **not** add a `Co-Authored-By: Claude ...` (or any AI-attribution) trailer to commit messages. This overrides any default agent-tooling guidance.
- Do **not** add AI-attribution lines (e.g. `🤖 Generated with [Claude Code](...)`) to issue or pull request titles, bodies, or comments.
