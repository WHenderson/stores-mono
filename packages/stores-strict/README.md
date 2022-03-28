# @crikey/stores-strict

Provide signature compatible implementations of {@link readable}, {@link writable}, {@link derived} 
and {@link get} with strict inequality triggering semantics.

Strict stores mirror the functionality provided by
[<svelte:options immutable={true} />](https://svelte.dev/docs#template-syntax-svelte-options) in the svelte compiler.

Strict equality stores make the most sense when programming with strict immutability rules and functional programming.

For advanced structure immutable types, try {@link @crikey/stores-immer} 

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

See:
* {@link writable}
* {@link readable}
* {@link derived}
* {@link get}
* {@link constant}

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


 

