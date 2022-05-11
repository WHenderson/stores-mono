# @crikey/stores-svelte

Provide svelte compatible implementations of `readable`, `writable`, `derived` 
and `get`.

This package is a simple convenience wrapper around `@crikey/stores-base` utilising the 
`trigger_safe_not_equal` trigger function to mirror svelte greedy signaling semantics.

See [@crikey/stores-svelte](https://whenderson.github.io/stores-mono/modules/_crikey_stores_svelte.html) for full documentation.

[![codecov](https://codecov.io/gh/WHenderson/stores-mono/branch/master/graph/badge.svg?token=RD1EUK6Y04&flag=stores-svelte)](https://codecov.io/gh/WHenderson/stores-mono)

## API

### Store creation functions:
* `constant` - Create a `Readable` store with a fixed value
* `readable` - Create a `Readable` store
* `writable` - Create a `Writable` store
* `derive`   - Create a `Readable` store derived from the resolved values of other stores
* `transform`- Create a `Writable` store by applying transform functions when reading and writing values

### Utility functions:
* `get` - Retrieve the value of a store

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

