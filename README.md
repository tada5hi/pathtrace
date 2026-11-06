<div align="center">
  <img src="https://raw.githubusercontent.com/tada5hi/pathtrace/fe3b8ff02f6027361f97951b953f88662c75cca7/.github/assets/logo.svg" width="144" height="144" alt="pathtrace logo">
  <h1>pathtrace</h1>
  <p><strong>Simplifies working with nested objects and arrays by providing easy methods to retrieve, set, and check values at any path.</strong></p>
  <p><a href="https://www.npmjs.com/package/pathtrace"><img src="https://img.shields.io/npm/v/pathtrace" alt="npm version"></a> <a href="https://github.com/tada5hi/pathtrace/actions/workflows/main.yml"><img src="https://github.com/tada5hi/pathtrace/actions/workflows/main.yml/badge.svg" alt="CI status"></a> <a href="LICENSE"><img src="https://img.shields.io/github/license/tada5hi/pathtrace" alt="License"></a></p>
  <p><a href="#why-pathtrace">Why pathtrace?</a> · <a href="#installation">Install</a> · <a href="#usage">Usage</a> · <a href="#api">API</a></p>
</div>

---

## Why pathtrace?

Use one path notation for nested reads, writes, removals and wildcard selection.

| Concern | Without it | With pathtrace |
| --- | --- | --- |
| A dynamic path | Split keys and walk each level yourself | Read `users[0].name` with `getPathValue()` |
| Missing containers | Decide when to create an object or array | `setPathValue()` creates intermediates from the next segment |
| Wildcard selection | Write a traversal for each object shape | Expand `*` or `**` into concrete paths |
| Missing vs undefined | Inspect each parent and property | `PathInfo.exists` distinguishes an existing undefined value |
| Reusing paths | Maintain a parser and escaping rules | Convert paths to segments and back |

For a known shape, use `data.users[0]?.name`. For a path supplied by configuration, use the same operation with a string:

```typescript
import { getPathValue, setPathValue } from 'pathtrace';

const data = { users: [{ name: 'Ada' }] };
console.log(getPathValue(data, 'users[0].name')); // Ada
setPathValue(data, 'users[1].name', 'Lin');
console.log(data.users[1]?.name); // Lin
```

<img src="https://raw.githubusercontent.com/tada5hi/pathtrace/fe3b8ff02f6027361f97951b953f88662c75cca7/.github/assets/mechanism.svg" width="960" alt="expandPath(data, users.*.name) produces users[0].name and users[1].name. Pass each concrete path to getPathValue to read Ada and Lin. getPathValue itself does not expand wildcards.">

## Installation

```sh
npm install pathtrace
```

Requires Node.js 22 or newer. The package is ESM and includes TypeScript declarations.

## Usage

### Select many paths

```typescript
import { expandPath, expandPathVerbose, getPathValue } from 'pathtrace';

const data = { users: [{ name: 'Ada' }, { name: 'Lin' }] };
const paths = expandPath(data, 'users.*.name');
console.log(paths); // ['users[0].name', 'users[1].name']
console.log(paths.map((path) => getPathValue(data, path))); // ['Ada', 'Lin']
console.log(expandPathVerbose(data, 'users.*.name')[0]);
// { value: 'users[0].name', matches: ['0'] }
```

`*` matches one level; `**` traverses recursively. Expansion returns path strings, not values. Verbose expansion also records the wildcard matches. Concrete suffixes can be returned even when their fields are missing, so read or inspect the result if existence matters. Expand patterns first, then call the single-path getter, setter or remover.

### Inspect, remove and escape

```typescript
import { arrayToPath, getPathInfo, pathToArray, removePath } from 'pathtrace';

const data = { users: [{ name: 'Ada' }, { name: 'Lin' }] };
const info = getPathInfo(data, 'users[0].name');
console.log(info.exists, info.name, info.value); // true name Ada
console.log(info.parent?.value); // { name: 'Ada' }
removePath(data, 'users[0]');
console.log(data.users); // [{ name: 'Lin' }]
console.log(pathToArray('users[0].name')); // ['users', 0, 'name']
console.log(arrayToPath(['user.name', 0])); // user\.name[0]
```

| Notation | Meaning |
| --- | --- |
| `user.name` | Nested object property |
| `users[0].name` | Array index followed by a property |
| `user\.name` | Literal key containing a dot |
| `['user.name', 'email']` | Segment array, avoiding string escaping |

In a JavaScript string literal, write `'user\\.name'` to pass the escaped path `user\.name`.

`getPathInfo()` returns a `PathInfo` with `value`, `name`, `parent` and `exists`. An empty segment list describes the root, whose name and parent are `null`. Create a new `PathInfo` after mutations: its properties are lazily cached.

## API

| Export | Kind | Purpose |
| --- | --- | --- |
| `getPathValue(data, path)` | Function | Read one path; missing paths return `undefined` |
| `setPathValue(data, path, value)` | Function | Mutate data, create intermediates, and return the original root |
| `removePath(data, path)` | Function | Mutate data by deletion; array removal uses `splice` |
| `getPathInfo(data, path)` | Function | Construct a `PathInfo` |
| `PathInfo` | Class | Inspect `value`, `name`, `parent`, `exists` |
| `expandPath(data, path)` | Function | Expand patterns into a `string[]` |
| `expandPathVerbose(data, path)` | Function | Expand patterns with wildcard match details |
| `pathToArray(path)` | Function | Parse a string or numeric path into segments; symbols yield `[]` |
| `arrayToPath(parts)` | Function | Format string/number segments with escaping and bracket indices |
| `BRACKET_NUMBER_REGEX` | Constant | Parser expression for an unescaped trailing bracket index |
| `Path<T, Depth = 4>` | Type | Bounded recursive path-string suggestions |
| `PathExpanded` | Type | `{ value: string, matches: readonly (string | string[])[] }` |
| `ObjectLiteral` | Type | `Record<PropertyKey, any>` |

## Notes

- **Mutation:** setters can replace a primitive intermediate with an object/array. Removing an array element shifts later indices.
- **Traversal:** reads reject `__proto__`, `constructor` and `prototype`. They allow own properties and inherited data/getters other than names owned by `Object.prototype`. Removals require own properties.
- **Writes:** unsafe segments stop traversal, but earlier intermediates may already have been created. Treat a write as a mutation, not an atomic validation step.
- **Patterns:** expansion is a separate traversal from guarded reads/writes. Use it on data you control; it does not establish that a concrete path is readable or safe to write. Recursive expansion has no cycle detection.
- **Typing:** `getPathValue()` returns `unknown`; narrow the value before using it. `Path<T>` suggests strings without validating runtime input.

## License

Made with 💚

Published under the [MIT License](LICENSE).
