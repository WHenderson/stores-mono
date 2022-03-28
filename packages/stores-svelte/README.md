# @crikey/stores-svelte

Provide svelte compatible implementations of {@link readable}, {@link writable}, {@link derived} 
and {@link get}.

This package is a simple convenience wrapper around {@link @crikey/stores-base} utilising the 
{@link trigger_safe_not_equal} trigger function to mirror svelte greedy signaling semantics.

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

See:
* {@link writable}
* {@link readable}
* {@link derived}
* {@link get}
* {@link constant}
