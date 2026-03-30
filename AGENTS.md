<!-- NOTE: Keep this file and all corresponding files in the .agents directory updated as the project evolves. When making architectural changes, adding new patterns, or discovering important conventions, update the relevant sections. -->

# pathtrace — Agent Guide

A TypeScript utility library for traversing and manipulating deeply nested JavaScript objects and arrays using string-based path notation (e.g., `user.contact[0].email`). Supports get/set/remove operations, wildcard expansion (`*`, `**`), and path introspection.

## Quick Reference

```bash
# Setup
npm ci

# Development
npm run build        # Rollup (CJS + ESM) + TypeScript declarations
npm run test         # Vitest with type checking
npm run lint         # ESLint on src/ and test/
```

- **Node.js**: 22+
- **Package manager**: npm

## Detailed Guides

- **[Project Structure](.agents/structure.md)** — Source layout and module responsibilities
- **[Architecture](.agents/architecture.md)** — Design patterns, path parsing pipeline, and key abstractions
- **[Testing](.agents/testing.md)** — Vitest setup, test conventions, and coverage
- **[Conventions](.agents/conventions.md)** — Code style, commit conventions, CI/CD, and release process
