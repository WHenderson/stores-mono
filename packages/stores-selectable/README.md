# @crikey/stores-selectify

Types and functions for creating [Svelte](https://svelte.dev/) compatible stores.
`@crikey/stores-base` stores further extend the the [svelte/store](https://svelte.dev/docs#run-time-svelte-store)
contract to allow for additional features and extensibility.

Store creation function:
* {@link constant} - Create a {@link Readable} store with a fixed value
* {@link readable} - Create a {@link Readable} store
* {@link writable} - Create a {@link Writable} store
* {@link derive | derived} - Create a {@link Readable} store derived from the resolved values of other stores

Utility functions:
* {@link get} - Retrieve the value of a store
* {@link read_only} - Restrict a store to the {@link Readable} interface

Trigger functions:
* {@link trigger_always} - Trigger at every available opportunity
* {@link trigger_strict_not_equal} - Trigger based on strict inequality
* {@link trigger_safe_not_equal} - Svelte compatible trigger - Trigger when not equal or value is complex

## Installation

```bash
# pnpm
$ pnpm add @crikey/stores-base

# npm
$ npm add @crikey/stores-base

# yarn
$ yarn add @crikey/stores-base
```

## Usage
