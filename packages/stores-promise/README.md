# @crikey/stores-promise

[Svelte](https://svelte.dev/) compatible stores from promises

See [@crikey/stores-promise](https://whenderson.github.io/stores-mono/modules/_crikey_stores_promise.html) for full documentation.

[![codecov](https://codecov.io/gh/WHenderson/stores-mono/branch/master/graph/badge.svg?token=RD1EUK6Y04&flag=stores-promise)](https://codecov.io/gh/WHenderson/stores-mono)

## API

### Store creation functions:

* `readable` - Create a store tracking the state of a promise
* `derive` - Derive a `Promise` instance from the resolved values of other stores

## Promise creation functions:

* `promise` - Create a `Promise` instance which tracks the state from a readable store containing a promise state

## Installation

```bash
# pnpm
$ pnpm add @crikey/stores-promise

# npm
$ npm add @crikey/stores-promise

# yarn
$ yarn add @crikey/stores-promise
```

