# @crikey/stores-select

Elegant methods for deriving sub-stores from existing stores.

Supports deriving `Writable` stores.

See [@crikey/stores-select](https://whenderson.github.io/stores-mono/modules/_crikey_select.html) for full documentation.

[![codecov](https://codecov.io/gh/WHenderson/stores-mono/branch/master/graph/badge.svg?token=RD1EUK6Y04&flag=stores-select)](https://codecov.io/gh/WHenderson/stores-mono)

## API

### Store creation functions:

* `select` - Create a sub store from an existing store

### Selector functions:
* `by_property` - Utility method used to access object properties by name
* `by_key` - Utility method used to access Map elements by key
* `by_index` - Utility method used to access array elements by index
* `by_set` - Utility method used to add/remove elements from a set
* `by_combine` - Utility method used to chain the above functions 

## Installation

```bash
# pnpm
$ pnpm add @crikey/stores-select

# npm
$ npm add @crikey/stores-select

# yarn
$ yarn add @crikey/stores-select
```

# Usage

```js
import { select, by_property, by_combined } from "@crikey/stores-select";

const original = { a: 1, b: { c: { d: 2 }} };
const store = writable(original);

const a = select(store, by_property('a'));
const d = select(store, by_combined(by_property('b'), by_property('c'), by_property('d')))

console.log(get(a)); // 1
console.log(get(d)); // 2

a.set(3);
d.set(4);

// Mutations through set do not mutate the original value, they clone and replace it
console.log(original); // { a: 1, b: { c: { d: 2 }} }
console.log(get(store)); // { a: 3, b: { c: { d: 4 }} }


```
