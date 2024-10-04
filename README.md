# pathtrace 🔍

[![npm version](https://badge.fury.io/js/pathtrace.svg)](https://badge.fury.io/js/pathtrace)
[![codecov](https://codecov.io/gh/tada5hi/pathtrace/graph/badge.svg?token=VIP3G2QT16)](https://codecov.io/gh/tada5hi/pathtrace)
[![main](https://github.com/tada5hi/pathtrace/actions/workflows/main.yml/badge.svg)](https://github.com/tada5hi/pathtrace/actions/workflows/main.yml)
[![Known Vulnerabilities](https://snyk.io/test/github/tada5hi/pathtrace/badge.svg)](https://snyk.io/test/github/tada5hi/pathtrace)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

**Pathtrace** is a library for managing nested objects and arrays. 
It offers straightforward methods for retrieving ([getPathValue](#getpathvalue)) and
setting ([setPathValue](#setpathvalue)) values at any path. 
Additionally, [getPathInfo](#getpathinfo) provides detailed path information, 
and the [expandPath](#expandpath) helper allows for querying and expanding paths with wildcards and globstars,
making it ideal for handling complex data structures efficiently.

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
    - [getPathValue](#getpathvalue)
    - [setPathValue](#setpathvalue)
    - [expandPath](#expandpath)
    - [getPathInfo](#getpathinfo)
    - [removePath](#removepath)
- [License](#license)

## Installation

```bash
npm install pathtrace --save
```

## Usage
The following examples demonstrate how to use the library.

### getPathValue

This method retrieves the value of a property at a given `path` 
inside an `object`.

```ts
const obj = {
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
```ts
import { getPathValue } from 'pathtrace';

var value = getPathValue(obj, 'user.name');
console.log(value); // 'Alice'
```

**Example 2: Retrieving a nested property value**
```ts
import { getPathValue } from 'pathtrace';

var value = getPathValue(obj, 'user.contact.email');
console.log(value); // 'alice@example.com'
```

**Example 3: Retrieving an array element by index**
```ts
import { getPathValue } from 'pathtrace';

var value = getPathValue(obj, 'user.roles[1]');
console.log(value); // 'editor'
```

**Example 4: Retrieving a nested property within an array**
```ts
import { getPathValue } from 'pathtrace';

var value = getPathValue(obj, 'settings[1].notifications');
console.log(value); // true
```

**Example 5: Retrieving a value from a multi-dimensional array**
```ts
import { getPathValue } from 'pathtrace';

var value = getPathValue(obj, 'settings[2][0].privacy');
console.log(value); // 'high'
```

**Example 6: Handling undefined objects and properties**
```ts
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

```ts
var obj = {
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
```ts
import { setPathValue } from 'pathtrace';

setPathValue(obj, 'user.name', 'Bob');
console.log(obj.user.name); // 'Bob'
```

**Example 2: Setting a nested property value**
```ts
import { setPathValue } from 'pathtrace';

setPathValue(obj, 'user.contact.email', 'bob@example.com');
console.log(obj.user.contact.email); // 'bob@example.com'
```

**Example 3: Setting a nested array value**
```ts
import { setPathValue } from 'pathtrace';

setPathValue(obj, 'user.roles[1]', 'viewer');
console.log(obj.user.roles[1]); // 'viewer'
```

**Example 4: Setting a value in an array**
```ts
import { setPathValue } from 'pathtrace';

setPathValue(obj, 'settings[2][0].privacy', 'low');
console.log(obj.settings[2][0].privacy); // 'low'
```

**Example 5: Adding a new property to an object**
```ts
import { setPathValue } from 'pathtrace';

setPathValue(obj, 'user.contact.address', '123 Main St');
console.log(obj.user.contact.address); // '123 Main St'
```

**Example 6: Setting a value in an object within an array**
```ts
import { setPathValue } from 'pathtrace';

setPathValue(obj, 'settings[1].notifications', false);
console.log(obj.settings[1].notifications); // false
```

**Example 7: Creating a new array and setting values**
```ts
import { setPathValue } from 'pathtrace';

setPathValue(obj, 'user.history[0]', 'logged in');
setPathValue(obj, 'user.history[2]', 'logged out');
console.log(obj.user.history[0]); // 'logged in'
console.log(obj.user.history[1]); // undefined
console.log(obj.user.history[2]); // 'logged out'
```

**Example 8: Setting a value in a multi-dimensional array**
```ts
import { setPathValue } from 'pathtrace';

setPathValue(obj, 'settings[2][1]', { secure: true });
console.log(obj.settings[2][1].secure); // true
```

**Example 9: Setting a value in an object inside an array**
```ts
import { setPathValue } from 'pathtrace';

setPathValue(obj, 'settings[2][0].description', 'private settings');
console.log(obj.settings[2][0].description); // 'private settings'
```

**Example 10: Returning the modified object**
```ts
import { setPathValue } from 'pathtrace';

var modifiedObj = setPathValue(obj, 'user.contact.phone', '987-654-3210');
console.log(modifiedObj === obj); // true
```

### expandPath

The expandPath function takes an object and a string representing a path, 
potentially containing wildcards (`*`) and globstars (`**`),
and returns an array of all possible matching paths within the object.

**Example: Wildcard (`*`) - Select all shallow paths of an array**
```ts
import { expandPath } from 'pathtrace';

const obj = {
    foo: ['bar', 'baz'],
};
const paths = expandPath(obj, 'foo.*');
console.log(paths); // ['foo[0]', 'foo[1]']
```

**Example: Wildcard (`*`) - Select matching paths under a wildcard branch**

```ts
import { expandPath } from 'pathtrace';

const obj = { foo: { bar: { a: true }, baz: { a: false, b: 1 } } };
const paths = expandPath(obj, 'foo.*.a');
console.log(paths); // ['foo.bar.a', 'foo.baz.a']
```

**Example: Globstar (`**`) - Select all leaves that match a leaf globstar**

```ts
import { expandPath } from 'pathtrace';

const obj = { foo: { a: { b: { c: 1 } }, d: { e: 2 } } };
const paths = expandPath(obj, 'foo.**');
console.log(paths); // ['foo.a.b.c', 'foo.d.e']
```

**Example: Globstar (`**`) - Select deeply nested matching paths under a globstar branch**

```ts
import { expandPath } from 'pathtrace';

const obj = { foo: { a: { b: { bar: 1 } }, c: { bar: 2 } } };
const paths = expandPath(obj, 'foo.**.bar');
console.log(paths); // ['foo.a.b.bar', 'foo.c.bar']
```

### getPathInfo

This method returns an object with information indicating the value
of the `parent` of that path, the `name` of the property being retrieved,
and its `value`.

```ts
const obj = {
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

```ts
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

```ts
import { getPathInfo } from 'pathtrace';

const info = getPathInfo(obj, 'user.roles[1]');

if (info.parent) {
    console.log(info.parent.name); // 'roles'
    console.log(info.parent.value); // ['admin', 'editor']
    console.log(info.parent.exists); // true
}
console.log(info.value); // 'editor'
console.log(info.name); // '1'
console.log(info.exists); // true
```

**Example 3: Handling a non-existent property**
```ts
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
```ts
import { getPathInfo } from 'pathtrace';

const info = getPathInfo(obj, 'user.roles[5]');

if (info.parent) {
    console.log(info.parent.name); // 'roles'
    console.log(info.parent.value); // ['admin', 'editor']
    console.log(info.parent.exists); // true
}
console.log(info.value); // undefined
console.log(info.name); // '5'
console.log(info.exists); // false
```

**Example 5: Handling backslash-escaping for . and []**
```ts
import { getPathInfo } from 'pathtrace';

const info = getPathInfo(obj, 'user\\.roles.\\[1\\]');

if (info.parent) {
    console.log(info.parent.name); // '[1]'
    console.log(info.parent.value); // 'editor'
    console.log(info.exists); // true
}
console.log(info.value); // 'editor'
console.log(info.name); // '1'
console.log(info.exists); // true
```

### removePath

This method removes a property by a given `path`
inside an `object`.

```ts
import { removePath } from 'pathtrace';

const obj = {
    hello: 'universe',
    foo: 'bar',
};

removePath(obj, 'foo');

console.log(obj);
// { hello: 'universe' }
```

## License

Made with 💚
