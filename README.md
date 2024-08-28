# pathtrace 🔍

[![main](https://github.com/tada5hi/pathtrace/actions/workflows/main.yml/badge.svg)](https://github.com/tada5hi/pathtrace/actions/workflows/main.yml)
[![CodeQL](https://github.com/tada5hi/pathtrace/actions/workflows/codeql.yml/badge.svg)](https://github.com/tada5hi/pathtrace/actions/workflows/codeql.yml)
[![Known Vulnerabilities](https://snyk.io/test/github/tada5hi/pathtrace/badge.svg)](https://snyk.io/test/github/tada5hi/pathtrace)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

**Pathtrace** is a library for managing nested objects and arrays. 
It offers straightforward methods for 
retrieving ([getPathValue](#getPathValue)) and
setting ([setPathValue](#setPathValue)) values at any path.
Additionally, [getPathInfo](#getPathInfo) provides detailed path information, 
making it ideal for handling complex data structures efficiently.

**Table of Contents**

- [Installation](#installation)
- [Usage](#usage)
    - [getPathInfo](#getpathinfo)
    - [getPathValue](#getpathvalue)
    - [setPathValue](#setpathvalue)
- [License](#license)

## Installation

```bash
npm install pathtrace --save
```

## Usage
The following examples demonstrate how to use the library.

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

const info = getPathInfo(
    obj,
    'user.contact.email'
);
console.log(info);
/*
{
parent: { email: 'alice@example.com', phone: '123-456-7890' },
name: 'email',
value: 'alice@example.com',
exists: true
}
 */
```
**Example 2: Handling an array index**

```ts
import { getPathInfo } from 'pathtrace';

const info = getPathInfo(obj, 'user.roles[0]');
console.log(info);
/*
{
parent: ['admin', 'editor'],
name: '0',
value: 'admin',
exists: true
}
*/
```

**Example 3: Handling a non-existent property**
```ts
import { getPathInfo } from 'pathtrace';

const info = getPathInfo(obj, 'user.address');
console.log(info);
/*
{
parent: { name: 'Alice', roles: ['admin', 'editor'], contact: { email: 'alice@example.com', phone: '123-456-7890' } },
name: 'address',
value: undefined,
exists: false
}
*/
```

**Example 4: Handling an out-of-bounds array index**
```ts
import { getPathInfo } from 'pathtrace';

const info = getPathInfo(obj, 'user.roles[3]');
console.log(info);
/*
{
parent: ['admin', 'editor'],
name: '3',
value: undefined,
exists: false
}
*/
```

**Example 5: Handling backslash-escaping for . and []**
```ts
import { getPathInfo } from 'pathtrace';

const info = getPathInfo(obj, 'user\\.roles.\\[1\\]');
console.log(info);
/*
{
parent: { '[1]': 'editor' },
name: '1',
value: 'editor',
exists: true
}
*/
```

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

## License

Made with 💚
