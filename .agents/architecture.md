# Architecture

## Design Overview

Pathtrace is a function-based library organized by feature domain. Each domain lives in its own directory under `src/` with a barrel `index.ts`. The public API is re-exported from `src/index.ts`.

## Path Parsing Pipeline

All operations share a common parsing step: string paths are converted to `PropertyKey[]` arrays via `pathToArray()`.

```
Input: "user.roles[0].name"
  ↓ pathToArray()
Parsed: ["user", "roles", 0, "name"]
  ↓ iteration
Traversal: obj → obj.user → obj.user.roles → obj.user.roles[0] → obj.user.roles[0].name
```

### Security: Prototype Pollution Prevention

Unsafe segments (`__proto__`, `constructor`, `prototype`) are **kept** by `pathToArray()` and
rejected during traversal instead — dropping them at parse time would silently turn
`a.__proto__.b` into `a.b`, resolving a different path rather than refusing the requested one.

- `src/utils/is-unsafe-key.ts` — the key set
- `src/utils/has-own-entry.ts` — rejects unsafe keys and universally inherited members
  (`toString`, `valueOf`, …) while still resolving own properties and prototype accessors
- `setPathValue()`/`removePath()` stop the walk when they hit an unsafe segment

### Escape Handling

Dots and brackets in key names can be escaped with backslashes:
- `\\.` → literal dot in key name
- `\\[` → literal bracket in key name

## Wildcard Expansion

The `path-expand` module supports two wildcard types:

| Pattern | Name | Behavior |
|---------|------|----------|
| `*` | Shallow wildcard | Matches one level of keys |
| `**` | Globstar | Matches any depth recursively |

```typescript
// Given: { items: { a: { name: 1 }, b: { name: 2 } } }
expandPath(data, 'items.*.name')    // → ['items.a.name', 'items.b.name']
expandPath(data, '**.name')          // → ['items.a.name', 'items.b.name']
```

`expandPathVerbose()` returns `PathExpanded` objects with match metadata instead of plain strings.

## PathInfo Class

`getPathInfo()` returns a `PathInfo` instance that provides introspection:

```typescript
const info = getPathInfo(obj, 'a.b.c');
info.parent  // The parent object (obj.a.b)
info.value   // The value at the path
info.name    // The last key ("c")
info.exists  // Whether the path resolves to a value
```

## setPathValue Auto-Creation

`setPathValue()` creates intermediate objects or arrays as needed. The container kind is decided
by the **next** segment, not the current one:
- If the next segment is a canonical array index (`String(ToUint32(key)) === key`, below 2^32 - 1) → creates an array
- Otherwise → creates an object

A digit-only test is not enough: `'01'`, `'007'` and `'4294967295'` are ordinary string
properties, and hanging them off an array produces non-index properties that `JSON.stringify`
and `structuredClone` discard.

## Module Output

The build is ESM-only: `tsdown` (rolldown) produces `dist/index.mjs` plus declarations
(`dist/index.d.mts`) and a source map. The `package.json` exports map points at both.
