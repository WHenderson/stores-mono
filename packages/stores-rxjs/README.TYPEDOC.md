# @crikey/stores-rxjs

Simple conversion functions to allow interop of [Svelte](https://svelte.dev/) style stores with [RxJS](https://rxjs.dev/) style stores

## API

### Store creation functions:

* {@link readable} - Create a {@link Readable} store from an [RxJS](https://rxjs.dev/) store without any caching
* {@link readable_persist} - Create a {@link Readable} store which is updated from an [RxJS](https://rxjs.dev/) store
* {@link observe_store} - Created a [BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject) style [RxJS](https://rxjs.dev/) store from a [Svelte](https://svelte.dev/) style store

## Promise creation functions:

* {@link promise} - Create a `Promise` instance which tracks the state from a readable store containing a promise state

## Installation

```bash
# pnpm
$ pnpm add @crikey/stores-rxjs

# npm
$ npm add @crikey/stores-rxjs

# yarn
$ yarn add @crikey/stores-rxjs
```

