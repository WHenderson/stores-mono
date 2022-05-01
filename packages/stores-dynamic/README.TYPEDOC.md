# @crikey/stores-dynamic

Types and functions for creating [Svelte](https://svelte.dev/) compatible stores.

`@crikey/stores-dynamic` stores further extend the [svelte/store](https://svelte.dev/docs#run-time-svelte-store)
contract to allow for dynamic dependencies and natural error handling.

## API

### Store creation functions:
* {@link constant} - Create a {@link Readable} store with a fixed {@link DynamicResolved}
* {@link constant_value} - Create a {@link Readable} store with a fixed {@link DynamicValue}
* {@link constant_error} - Create a {@link Readable} store with a fixed {@link DynamicError}
* {@link dynamic} - Convert a standard {@link Readable} to a {@link DynamicReadable}
* {@link dynamic} - Create a {@link DynamicReadable} store derived from the resolved values of other stores

### Utility functions:
* {@link get_error} - Uses {@link get} to retrieve the current store value and return its error property (or undefined)
* {@link get_value} - Uses {@link get} to retrieve the current store value and return its value property (or throw its error property)
* {@link resolve} - Resolves the given {@link Dynamic} item to its contained value, or throws its contained error
* {@link smart} - Resolve store to a constant {@link DynamicResolved} value (on demand) if possible, or keep as a {@link DynamicReadable}

### Type Guards:
* {@link is_dynamic_resolved} - Returns true if the given argument is a {@link DynamicResolved} value (has either a value or an error property)
* {@link is_dynamic_value} - Returns true if the given argument is a {@link DynamicValue}
* {@link is_dynamic_error} - Returns true if the given argument is a {@link DynamicError}

### Trigger functions:
* {@link create_trigger_dynamic} - Creates a trigger function for {@link DynamicResolved} values

## Installation

```bash
# pnpm
$ pnpm add @crikey/stores-dynamic

# npm
$ npm add @crikey/stores-dynamic

# yarn
$ yarn add @crikey/stores-dynamic
```

## Introduction

Dynamic stores store more than just a simple value, instead they store a {@link DynamicResolved} which
can itself contain a value via {@link DynamicValue}, or an error via {@link DynamicError}. Storing values
and errors separately facilities' error handling.

Any {@link Readable} containing an object with either a `value` or `error` property is considered a
{@link DynamicReadable} and can safely be mixed with this library.

The kind of dynamic can be ascertained by querying its properties. An object with an `error` property is a
{@link DynamicError}, an object with a `value` property is a {@link DynamicValue} and an object with a `subscribe`
function is a {@link Readable}.
Being able to distinguish types in this way allows for a cohesive syntax when dealing with otherwise arbitrary inputs.


## Usage

The {@link dynamic} function has many signatures:

### Converting an existing {@link Readable}
`dynamic(store)`

Convert a regular {@link Readable} store to a {@link DynamicReadable} by wrapping its value via {@link DynamicValue}

### Creating a new derived store
`dynamic([trigger,] [args,] calculate [,initial_value])`

* `trigger` - Optional function used for comparing {@link DynamicResolved} values and determining if subscribers should be called
* `args` - Optional array of arbitrary data to be passed as-is as the first argument to `calculate`
* `calculate([args,] resolve [,set])` - Callback used to derive the store value. Will be called each time any of the dependencies change
* `initial_value` - Initial value of the store. Useful when `calculate` is async.

If `args` are provided to `dynamic`, they are passed unchanged to `calculate` as the first argument.

If `calculate` accepts an argument after `resolve`, it is deemed asynchronous.

`resolve` can be used to obtain the inner value of any {@link Dynamic}.
* If `resolve` is called with a {@link DynamicReadable} store, then the store will be added as a dependency.
* If `resolve` is called with a {@link DynamicError} or a {@link DynamicReadable} which resolves to a {@link DynamicError}, the contained error will be thrown.
  Each execution of `calculate` will subscribe to new stores as required and unsubscribe to stores no longer required.

Synchronous dynamic stores which are only dependent on constant inputs (see: {@link DynamicFlagConstant}) will be cached.
This can be avoided by setting `is_const` in the result of `calculate`.

## Examples

_Example: Dynamic dependencies_

```ts
import {writable} from "@crikey/stores-strict";
import {dynamic} from "@crikey/stores-dynamic";

const a = writable({ value: 0 });
const b = writable({ value: 'b value' });
const c = writable({ value: 'c value' });

const derived = dynamic(
    (resolve) => {
        return resolve(a) % 2 === 0
        ? { value: resolve(b) }
        : { value: resolve(c) }
    }
);

derived.subscribe((value) => console.log('derived value:', value))

a.set({ value: 1 });

// > derived value: { value: 'b value', dependencies: [a, b] }
// > derived value: { value: 'c value', dependencies: [a, c] }
```
