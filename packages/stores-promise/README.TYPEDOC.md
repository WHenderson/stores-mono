# @crikey/stores-promise

[Svelte](https://svelte.dev/) compatible stores from promises

## API

### Store creation functions:

* {@link readable} - Create a store tracking the state of a promise
* {@link derive} - Derive a `Promise` instance from the resolved values of other stores

## Promise creation functions:

* {@link promise} - Create a `Promise` instance which tracks the state from a readable store containing a promise state

## Installation

```bash
# pnpm
$ pnpm add @crikey/stores-promise

# npm
$ npm add @crikey/stores-promise

# yarn
$ yarn add @crikey/stores-promise
```

