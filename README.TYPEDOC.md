# Mono-Repo for Svelte compatible Store packages

## Packages

* {@link @crikey/stores-strict}<br> [Svelte](https://svelte.dev/) compatible stores using strict inequality checking
* {@link @crikey/stores-svelte}<br> Drop in replacement for [Svelte](https://svelte.dev/) stores
* {@link @crikey/stores-promise}<br> [Svelte](https://svelte.dev/) compatible stores from promises
* {@link @crikey/stores-immer}<br> Immutable [Svelte](https://svelte.dev/) compatible stores using the [Immer](https://immerjs.github.io/immer/)
* {@link @crikey/stores-select}<br> Elegant methods for deriving sub-stores from existing stores.<br> Supports deriving `Writable` stores.
* {@link @crikey/stores-selectable}<br> Extend stores with selection semantics, allowing for the easy creation of type safe sub-stores
* {@link @crikey/stores-dynamic}<br> Derived stores with dynamic dependency support and natural error handling/propagation
* {@link @crikey/stores-temporal}<br> Simple time based higher order svelte stores such as debounce and throttle
* {@link @crikey/stores-rxjs}<br> Simple conversion functions to allow interop of [Svelte](https://svelte.dev/) style stores with [RxJS](https://rxjs.dev/) style stores

## Internal

* {@link @crikey/stores-base-queue}<br> Internal peer dependency for managing execution queue between store implementations
* {@link @crikey/stores-base}<br> Types and functions for creating [Svelte](https://svelte.dev/) compatible stores
