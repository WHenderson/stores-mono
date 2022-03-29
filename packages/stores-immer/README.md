# @crikey/stores-immer

Provide [svelte](https://svelte.dev/docs#run-time-svelte-store) compatible implementations of {@link readable}, {@link writable}, {@link derived}
and {@link get} using immutible values via [immer](https://immerjs.github.io/immer/).

Strict inequality triggering semantics provide a store version of the functionality seen with
[<svelte:options immutable={true} />](https://svelte.dev/docs#template-syntax-svelte-options)
in the svelte compiler.

Using [immer](https://immerjs.github.io/immer/), {@link @crikey/stores-immer} is able to provide copy-on-write semantics 
during updates.

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
copy-on-write semantics during an {@link Writable.update | update}.  

See:
* {@link writable}
* {@link readable}
* {@link derived}
* {@link get}
* {@link constant}

## Example

{@codeblock ../stores-immer/examples/writable.test.ts#example-writable-copy-on-write}
