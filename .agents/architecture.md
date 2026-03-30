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

`pathToArray()` filters dangerous keys (`constructor`, `__proto__`, `prototype`) to prevent prototype pollution attacks. This is enforced in `src/helpers/path-to-array.ts`.

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

`setPathValue()` creates intermediate objects or arrays as needed based on the next key type:
- If the next key is a number → creates an array
- If the next key is a string → creates an object

## Dual Module Output

The build produces both CommonJS (`dist/index.cjs`) and ESM (`dist/index.mjs`) bundles via Rollup, with TypeScript declarations (`dist/index.d.ts`). The `package.json` exports map handles resolution for both module systems.
