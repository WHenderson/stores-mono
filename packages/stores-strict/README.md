# @crikey/stores-strict

Provide [svelte](https://svelte.dev/docs#run-time-svelte-store) compatible implementations of `readable`, `writable`, `derived` 
and `get` with strict inequality triggering semantics.

Strict inequality triggering semantics provide a store version of the functionality seen with
[<svelte:options immutable={true} />](https://svelte.dev/docs#template-syntax-svelte-options) 
in the svelte compiler.

Strict equality stores make the most sense when programming with strict immutability rules and functional programming.

For complex structured immutable types, try `@crikey/stores-immer` 

See [@crikey/stores-strict](https://whenderson.github.io/stores-mono/modules/_crikey_stores_strict.html) for full documentation.

[![codecov](https://codecov.io/gh/WHenderson/stores-mono/branch/master/graph/badge.svg?token=RD1EUK6Y04&flag=stores-strict)](https://codecov.io/gh/WHenderson/stores-mono)

## API

### Store creation functions:
* `constant` - Create a `Readable` store with a fixed value
* `readable` - Create a `Readable` store
* `writable` - Create a `Writable` store
* `derive`   - Create a `Readable` store derived from the resolved values of other stores

### Utility functions:
* `get` - Retrieve the value of a store

## Installation

```bash
# pnpm
$ pnpm add @crikey/stores-strict

# npm
$ npm add @crikey/stores-strict

# yarn
$ yarn add @crikey/stores-strict
```
## Usage

Standard usage should be a drop in replacement for `svelte/store`, with the exception of when subscriptions are 
triggered.

## Differences from svelte stores
Classic svelte stores signal for changes greedily. If a store value is updated and either the old or new value are 
complex types, then svelte will signal a change even if those values are strictly equal.

Strict stores use a simple referential inequality check (`!==`) to determine if a change signal should be sent.

e.g.
```js

const store = writable([1]);

// log each change
store.subscribe(arr => console.log(arr));

// don't change anything
store.update(arr => {
    return arr;
});

// push an item onto the array
store.update(arr => {
    arr.push(2);
    return arr;
});

// @crikey/stores-strict
// > [1]
//
// @crikey/stores-svelte (svelte compatible stores)
// > [1]
// > [1]
// > [1,2]
//
```


 

