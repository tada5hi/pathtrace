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

**Table of Contents**

- [Why pathtrace?](#why-pathtrace)
- [Installation](#installation)
- [Usage](#usage)
  - [getPathValue](#getpathvalue)
  - [setPathValue](#setpathvalue)
  - [expandPath](#expandpath)
  - [getPathInfo](#getpathinfo)
  - [removePath](#removepath)
  - [Select many paths](#select-many-paths)
  - [Inspect, remove and escape](#inspect-remove-and-escape)
- [API](#api)
- [Notes](#notes)
- [License](#license)

## Installation

```sh
npm install pathtrace
```

Requires Node.js 22 or newer. The package is ESM and includes TypeScript declarations.

## Usage
The following examples demonstrate each operation. The getter, setter and introspection sections each define an `obj` fixture reused by their numbered examples. `Record<string, any>` allows the setter examples to add new properties; narrow values returned as `unknown` in application code.

### getPathValue

This method retrieves the value of a property at a given `path`
inside an `object`.

```typescript
const obj: Record<string, any> = {
    user: {
        name: 'Alice',
        roles: ['admin', 'editor'],
        contact: {
            email: 'alice@example.com',
            phone: '123-456-7890',
        },
    },
    settings: [
        { theme: 'dark' },
        { notifications: true },
        [{ privacy: 'high' }]
    ]
};
```

**Example 1: Retrieving a simple property value**
```typescript
import { getPathValue } from 'pathtrace';

var value = getPathValue(obj, 'user.name');
console.log(value); // 'Alice'
```

**Example 2: Retrieving a nested property value**
```typescript
import { getPathValue } from 'pathtrace';

var value = getPathValue(obj, 'user.contact.email');
console.log(value); // 'alice@example.com'
```

**Example 3: Retrieving an array element by index**
```typescript
import { getPathValue } from 'pathtrace';

var value = getPathValue(obj, 'user.roles[1]');
console.log(value); // 'editor'
```

**Example 4: Retrieving a nested property within an array**
```typescript
import { getPathValue } from 'pathtrace';

var value = getPathValue(obj, 'settings[1].notifications');
console.log(value); // true
```

**Example 5: Retrieving a value from a multi-dimensional array**
```typescript
import { getPathValue } from 'pathtrace';

var value = getPathValue(obj, 'settings[2][0].privacy');
console.log(value); // 'high'
```

**Example 6: Handling undefined objects and properties**
```typescript
import { getPathValue } from 'pathtrace';

var value = getPathValue(undefined, 'user.name');
console.log(value); // undefined

var value = getPathValue(obj, 'user.address');
console.log(value); // undefined

var value = getPathValue('hello', 'length');
console.log(value); // 5
```

### setPathValue

This method sets the `value` of a property at a given `path`
inside an `object` and returns the object in which the property has been set.

```typescript
const obj: Record<string, any> = {
    user: {
        name: 'Alice',
        roles: ['admin', 'editor'],
        contact: {
            email: 'alice@example.com',
            phone: '123-456-7890',
        },
    },
    settings: [
        { theme: 'dark' },
        { notifications: true },
        [{ privacy: 'high' }]
    ]
};
```

**Example 1: Setting a simple property value**
```typescript
import { setPathValue } from 'pathtrace';

setPathValue(obj, 'user.name', 'Bob');
console.log(obj.user.name); // 'Bob'
```

**Example 2: Setting a nested property value**
```typescript
import { setPathValue } from 'pathtrace';

setPathValue(obj, 'user.contact.email', 'bob@example.com');
console.log(obj.user.contact.email); // 'bob@example.com'
```

**Example 3: Setting a nested array value**
```typescript
import { setPathValue } from 'pathtrace';

setPathValue(obj, 'user.roles[1]', 'viewer');
console.log(obj.user.roles[1]); // 'viewer'
```

**Example 4: Setting a value in an array**
```typescript
import { setPathValue } from 'pathtrace';

setPathValue(obj, 'settings[2][0].privacy', 'low');
console.log(obj.settings[2][0].privacy); // 'low'
```

**Example 5: Adding a new property to an object**
```typescript
import { setPathValue } from 'pathtrace';

setPathValue(obj, 'user.contact.address', '123 Main St');
console.log(obj.user.contact.address); // '123 Main St'
```

**Example 6: Setting a value in an object within an array**
```typescript
import { setPathValue } from 'pathtrace';

setPathValue(obj, 'settings[1].notifications', false);
console.log(obj.settings[1].notifications); // false
```

**Example 7: Creating a new array and setting values**
```typescript
import { setPathValue } from 'pathtrace';

setPathValue(obj, 'user.history[0]', 'logged in');
setPathValue(obj, 'user.history[2]', 'logged out');
console.log(obj.user.history[0]); // 'logged in'
console.log(obj.user.history[1]); // undefined
console.log(obj.user.history[2]); // 'logged out'
```

**Example 8: Setting a value in a multi-dimensional array**
```typescript
import { setPathValue } from 'pathtrace';

setPathValue(obj, 'settings[2][1]', { secure: true });
console.log(obj.settings[2][1].secure); // true
```

**Example 9: Setting a value in an object inside an array**
```typescript
import { setPathValue } from 'pathtrace';

setPathValue(obj, 'settings[2][0].description', 'private settings');
console.log(obj.settings[2][0].description); // 'private settings'
```

**Example 10: Returning the modified object**
```typescript
import { setPathValue } from 'pathtrace';

var modifiedObj = setPathValue(obj, 'user.contact.phone', '987-654-3210');
console.log(modifiedObj === obj); // true
```

### expandPath

The expandPath function takes an object and a string representing a path,
potentially containing wildcards (`*`) and globstars (`**`),
and returns an array of all possible matching paths within the object.

**Example: Wildcard (`*`) - Select all shallow paths of an array**
```typescript
import { expandPath } from 'pathtrace';

const obj = {
    foo: ['bar', 'baz'],
};
const paths = expandPath(obj, 'foo.*');
console.log(paths); // ['foo[0]', 'foo[1]']
```

**Example: Wildcard (`*`) - Select matching paths under a wildcard branch**

```typescript
import { expandPath } from 'pathtrace';

const obj = { foo: { bar: { a: true }, baz: { a: false, b: 1 } } };
const paths = expandPath(obj, 'foo.*.a');
console.log(paths); // ['foo.bar.a', 'foo.baz.a']
```

**Example: Globstar (`**`) - Select all leaves that match a leaf globstar**

```typescript
import { expandPath } from 'pathtrace';

const obj = { foo: { a: { b: { c: 1 } }, d: { e: 2 } } };
const paths = expandPath(obj, 'foo.**');
console.log(paths); // ['foo.a.b.c', 'foo.d.e']
```

**Example: Globstar (`**`) - Select deeply nested matching paths under a globstar branch**

```typescript
import { expandPath } from 'pathtrace';

const obj = { foo: { a: { b: { bar: 1 } }, c: { bar: 2 } } };
const paths = expandPath(obj, 'foo.**.bar');
console.log(paths); // ['foo.a.b.bar', 'foo.c.bar']
```

### getPathInfo

This method returns an object with information indicating the value
of the `parent` of that path, the `name` of the property being retrieved,
and its `value`.

```typescript
const obj: Record<string, any> = {
    user: {
        name: 'Alice',
        roles: ['admin', 'editor'],
        contact: {
            email: 'alice@example.com',
            phone: '123-456-7890',
        },
    },
    'user.roles': {
        '[1]': 'editor',
    },
};
```

**Example 1: Handling a nested property**

```typescript
import { getPathInfo } from 'pathtrace';

const info = getPathInfo(obj, 'user.contact.email');

if (info.parent) {
    console.log(info.parent.name); // 'contact'
    console.log(info.parent.value);
    // { email: 'alice@example.com', phone: '123-456-7890' }
    console.log(info.parent.exists); // true
}
console.log(info.value); // 'alice@example.com'
console.log(info.exists); // true
console.log(info.name); // 'email'

```
**Example 2: Handling an array index**

```typescript
import { getPathInfo } from 'pathtrace';

const info = getPathInfo(obj, 'user.roles[1]');

if (info.parent) {
    console.log(info.parent.name); // 'roles'
    console.log(info.parent.value); // ['admin', 'editor']
    console.log(info.parent.exists); // true
}
console.log(info.value); // 'editor'
console.log(info.name); // 1
console.log(info.exists); // true
```

**Example 3: Handling a non-existent property**
```typescript
import { getPathInfo } from 'pathtrace';

const info = getPathInfo(obj, 'user.contact.address');

if (info.parent) {
    console.log(info.parent.name); // 'contact'
    console.log(info.parent.value);
    // { email: 'alice@example.com', phone: '123-456-7890' }
    console.log(info.parent.exists); // true
}
console.log(info.value); // undefined
console.log(info.name); // 'address'
console.log(info.exists); // false
```

**Example 4: Handling an out-of-bounds array index**
```typescript
import { getPathInfo } from 'pathtrace';

const info = getPathInfo(obj, 'user.roles[5]');

if (info.parent) {
    console.log(info.parent.name); // 'roles'
    console.log(info.parent.value); // ['admin', 'editor']
    console.log(info.parent.exists); // true
}
console.log(info.value); // undefined
console.log(info.name); // 5
console.log(info.exists); // false
```

**Example 5: Handling backslash-escaping for . and []**
```typescript
import { getPathInfo } from 'pathtrace';

const info = getPathInfo(obj, 'user\\.roles.\\[1\\]');

if (info.parent) {
    console.log(info.parent.name); // 'user.roles'
    console.log(info.parent.value); // { '[1]': 'editor' }
    console.log(info.exists); // true
}
console.log(info.value); // 'editor'
console.log(info.name); // '[1]'
console.log(info.exists); // true
```

### removePath

This method removes a property by a given `path`
inside an `object`.

```typescript
import { removePath } from 'pathtrace';

const obj = {
    hello: 'universe',
    foo: 'bar',
};

removePath(obj, 'foo');

console.log(obj);
// { hello: 'universe' }
```

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
