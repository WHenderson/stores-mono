# @crikey/stores-immer

Provide [svelte](https://svelte.dev/docs#run-time-svelte-store) compatible implementations of `readable`, `writable`, `derived`
and `get` using immutible values via [immer](https://immerjs.github.io/immer/).

Strict inequality triggering semantics provide a store version of the functionality seen with
[<svelte:options immutable={true} />](https://svelte.dev/docs#template-syntax-svelte-options)
in the svelte compiler.

Using [immer](https://immerjs.github.io/immer/), `@crikey/stores-immer` is able to provide copy-on-write semantics
during updates.

See [@crikey/stores-immer](https://whenderson.github.io/stores-mono/modules/_crikey_stores_immer.html) for full documentation.

[![codecov](https://codecov.io/gh/WHenderson/stores-mono/branch/master/graph/badge.svg?token=RD1EUK6Y04&flag=stores-immer)](https://codecov.io/gh/WHenderson/stores-mono)

## API

### Store creation functions:
* {@link constant} - Create a {@link Readable} store with a fixed value
* {@link readable} - Create a {@link Readable} store
* {@link writable} - Create a {@link Writable} immer store
* {@link derive} - Create a {@link Readable} store derived from the resolved values of other stores

### Utility functions:
* {@link get} - Retrieve the value of a store

## Installation

```bash
# pnpm
$ pnpm add @crikey/stores-immer

# npm
$ npm add @crikey/stores-immer

# yarn
$ yarn add @crikey/stores-immer
```
## Usage

Standard usage should be a drop in replacement for `svelte/store`.
The key difference being that mutating a store value will use [immer](https://immerjs.github.io/immer/) to perform
copy-on-write semantics during an `Writable.update | update`.

## Example

```ts
const initial = [1,2,3];
const store = writable([1,2,3]);
store.subscribe(value => console.log(value));
// > [ 1, 2, 3 ]

store.update(value => {
    value.push(4);
    return value;
})
// > [ 1, 2, 3, 4 ]

console.log(get(store) !== initial);
// > true
```
