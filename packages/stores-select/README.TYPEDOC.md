# @crikey/stores-select

Elegant methods for deriving sub-stores from existing stores.

Supports deriving {@link Writable} stores.

See [@crikey/stores-select](https://whenderson.github.io/stores-mono/modules/_crikey_select.html) for full documentation.

[![codecov](https://codecov.io/gh/WHenderson/stores-mono/branch/master/graph/badge.svg?token=RD1EUK6Y04&flag=stores-select)](https://codecov.io/gh/WHenderson/stores-mono)

## API

### Store creation functions:

* {@link select} - Create a sub store from an existing store

### Selector functions:
* {@link by_index} - Utility method used to access array elements by index
* {@link by_key} - Utility method used to access Map elements by key
* {@link by_last_index} - Utility method used to access the last element in an array
* {@link by_property} - Utility method used to access object properties by name
* {@link by_property_get} - Utility method used to access object properties by name (read only)
* {@link by_set_element} - Utility method used to add/remove elements from a set
* {@link by_size} - Utility method getting the size of a Set or Map
* {@link by_sparse_index} - Utility method used to access sparse array elements by index


## Installation

```bash
# pnpm
$ pnpm add @crikey/stores-select

# npm
$ npm add @crikey/stores-select

# yarn
$ yarn add @crikey/stores-select
```

# Example

```js
import {by_key, by_property, by_size, select} from "@crikey/stores-select";

const state = writable({
    user: {
        id: 5,
        username: 'Joe Blogs'
    },
    accounts: new Map([
        [2, { id: 2, name: 'First National' }],
        [3, { id: 3, name: 'Bank of mum and dad'}]
    ])
});

// Create nested derived stores to access user information
const user = select(state, by_property('user'));
const user_id = select(user, by_property('id'));
const user_username = select(user, by_property('username'));
console.log(get(user_id)); // 5
console.log(get(user_username)); // Joe Blogs

// These are stores, so everything is reactive
user_username.set('Joe Middlename Blogs');
console.log(get(user)); // { id: 5, username: 'Joe Middlename Blogs' }

// Create derived account stores
const accounts = select(state, by_property('accounts'));
const n_accounts = select(accounts, by_size());
console.log(get(n_accounts)); // 2

// Selectors can be chained to access deeply nested values
const first_national = select(state, by_property('accounts'), by_key(2));
console.log(get(first_national)); // { id: 2, name: 'First National' }
```
