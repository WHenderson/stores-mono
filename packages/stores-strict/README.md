# @crikey/stores-strict

Provide signature compatible implementations of {@linkcode readable}, {@linkcode writable}, {@linkcode derived} with 
strict equality semantics.

## Differences from svelte stores
Classic svelte stores signal for changes greedily. If a store value is updated and either the old or new value are 
complex types, then svelte will signal a change even if those values are strictly equal.

Strict stores use a simple referential quality check (`!==`) to determine if a change signal should be sent.

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

Strict stores mirror the functionality provided by 
[<svelte:options immutable={true} />](https://svelte.dev/docs#template-syntax-svelte-options) in the svelte compiler.

Strict equality stores make the most sense when programming with strict immutability rules and functional programming.

 

