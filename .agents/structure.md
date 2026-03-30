# Project Structure

## Directory Layout

```
pathtrace/
├── src/                    # Library source code
│   ├── index.ts            # Barrel export (public API)
│   ├── types.ts            # Recursive Path<T> type definitions
│   ├── remove.ts           # removePath() function
│   ├── helpers/            # Path string parsing utilities
│   │   ├── path-to-array.ts    # String path → PropertyKey[]
│   │   └── array-to-path.ts    # PropertyKey[] → string path
│   ├── utils/
│   │   └── is-object.ts        # isObject() type guard
│   ├── path-value/         # Core get/set operations
│   │   ├── get.ts              # getPathValue()
│   │   └── set.ts              # setPathValue()
│   ├── path-expand/        # Wildcard/globstar expansion
│   │   ├── module.ts           # expandPath(), expandPathVerbose()
│   │   ├── types.ts            # PathExpanded type
│   │   └── constants.ts        # Character enum (*, **)
│   └── path-info/          # Path introspection
│       ├── module.ts           # PathInfo class
│       └── helper.ts           # Internal helpers
├── test/
│   └── unit/               # All test specs (8 files)
├── .github/
│   ├── actions/            # Reusable CI actions (install, build)
│   └── workflows/          # CI + release workflows
└── dist/                   # Build output (gitignored)
```

## Module Responsibilities

| Module | Exports | Purpose |
|--------|---------|---------|
| `path-value/get.ts` | `getPathValue()` | Retrieve a value at a dot-notation path |
| `path-value/set.ts` | `setPathValue()` | Set a value, auto-creating intermediate objects/arrays |
| `path-info/module.ts` | `getPathInfo()` → `PathInfo` | Introspect a path: parent, value, name, exists |
| `path-expand/module.ts` | `expandPath()`, `expandPathVerbose()` | Expand `*` and `**` wildcards to concrete paths |
| `remove.ts` | `removePath()` | Delete a property at a path |
| `helpers/path-to-array.ts` | `pathToArray()` | Parse `"a.b[0].c"` → `["a", "b", 0, "c"]` |
| `helpers/array-to-path.ts` | `arrayToPath()` | Reverse: `["a", "b", 0]` → `"a.b[0]"` |
| `types.ts` | `Path<T>`, `ObjectLiteral` | Recursive generic types for type-safe path strings |

## Key Dependencies

| Dependency | Purpose |
|------------|---------|
| `rollup` + `@rollup/plugin-swc` | Bundle CJS + ESM outputs |
| `typescript` | Type checking and declaration emit |
| `vitest` + `@vitest/coverage-v8` | Test runner and coverage |
| `eslint` + `@tada5hi/eslint-config-typescript` | Linting |
| `husky` + `commitlint` | Git hooks and commit message validation |
