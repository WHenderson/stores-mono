# @crikey/stores-rxjs

Simple conversion functions to allow interop of [Svelte](https://svelte.dev/) style stores with [RxJS](https://rxjs.dev/) style stores

See [@crikey/stores-rxjs](https://whenderson.github.io/stores-mono/modules/_crikey_stores_rxjs.html) for full documentation.

[![codecov](https://codecov.io/gh/WHenderson/stores-mono/branch/master/graph/badge.svg?token=RD1EUK6Y04&flag=stores-rxjs)](https://codecov.io/gh/WHenderson/stores-mono)

## API

### Store creation functions:

* `readable` - Create a `Readable` store from an [RxJS](https://rxjs.dev/) store without any caching
* `readable_persist` - Create a `Readable` store which is updated from an [RxJS](https://rxjs.dev/) store
* `observe_store` - Created a [BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject) style [RxJS](https://rxjs.dev/) store from a [Svelte](https://svelte.dev/) style store

## Promise creation functions:

* `promise` - Create a `Promise` instance which tracks the state from a readable store containing a promise state

## Installation

```bash
# pnpm
$ pnpm add @crikey/stores-rxjs

# npm
$ npm add @crikey/stores-rxjs

# yarn
$ yarn add @crikey/stores-rxjs
```

