# @crikey/stores-svelte

Provide svelte compatible implementations of {@link readable}, {@link writable}, {@link derived}
and {@link get}.

This package is a simple convenience wrapper around {@link @crikey/stores-base} utilising the
{@link trigger_safe_not_equal} trigger function to mirror svelte greedy signaling semantics.

See [@crikey/stores-svelte](https://whenderson.github.io/stores-mono/modules/_crikey_stores_svelte.html) for full documentation.

## API

### Store creation functions:
* {@link constant} - Create a {@link Readable} store with a fixed value
* {@link readable} - Create a {@link Readable} store
* {@link writable} - Create a {@link Writable} store
* {@link derive}   - Create a {@link Readable} store derived from the resolved values of other stores

### Utility functions:
* {@link get} - Retrieve the value of a store

## Installation

```bash
# pnpm
$ pnpm add @crikey/stores-svelte

# npm
$ npm add @crikey/stores-svelte

# yarn
$ yarn add @crikey/stores-svelte
```

## Usage

Standard usage should be a drop in replacement for `svelte/store`.

