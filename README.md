# Mono-Repo for Svelte compatible Store packages

See [stores-mono](https://whenderson.github.io/stores-mono/) for full documentation.

[![codecov](https://codecov.io/gh/WHenderson/stores-mono/branch/master/graph/badge.svg?token=RD1EUK6Y04)](https://codecov.io/gh/WHenderson/stores-mono)

## Packages

* [@crikey/stores-strict](./packages/stores-strict/README.md)<br> [Svelte](https://svelte.dev/) compatible stores using strict inequality checking
* [@crikey/stores-svelte](./packages/stores-svelte/README.md)<br> Drop in replacement for [Svelte](https://svelte.dev/) stores
* [@crikey/stores-promise](./packages/stores-promise/README.md)<br> [Svelte](https://svelte.dev/) compatible stores from promises
* [@crikey/stores-immer](./packages/stores-immer/README.md)<br> Immutable [Svelte](https://svelte.dev/) compatible stores using the [Immer](https://immerjs.github.io/immer/)
* [@crikey/stores-select](./packages/stores-select/README.md)<br> Elegant methods for deriving sub-stores from existing stores. Supports deriving `Writable` stores. 
* [@crikey/stores-selectable](./packages/stores-selectable/README.md)<br> Extend stores with selection semantics, allowing for the easy creation of type safe sub-stores 
* [@crikey/stores-dynamic](./packages/stores-dynamic/README.md)<br> Derived stores with dynamic dependency support and natural error handling/propagation 
* [@crikey/stores-temporal](./packages/stores-temporal/README.md)<br> Simple time based higher order svelte stores such as debounce and throttle 
* [@crikey/stores-rxjs](./packages/stores-rxjs/README.md)<br> Simple conversion functions to allow interop of [Svelte](https://svelte.dev/) style stores with [RxJS](https://rxjs.dev/) style stores

## Internal
Internal packages providing basic types, utilities and reusable implementations

* [@crikey/stores-base-queue](./packages/stores-base-queue/README.md)<br> Internal peer dependency for managing execution queue between store implementations
* [@crikey/stores-base](./packages/stores-base/README.md)<br> Types and functions for creating [Svelte](https://svelte.dev/) compatible stores

