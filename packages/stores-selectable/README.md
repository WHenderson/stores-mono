# @crikey/stores-selectable

Types and functions for creating [Svelte](https://svelte.dev/) compatible stores.

`@crikey/stores-selectable` further extends the {@link Readable} and {@link Writable} interfaces with methods
for generating derived stores by referencing values within the original store.   

Store creation function:
* {@link selectable} - Create a {@link Readable} or {@link Writable} store with select methods ({@link SelectablePath.path}, {@link SelectableSelect.select} and {@link SelectableDelete.delete}). 
* {@link SelectablePath.path} - get the selection path of the store
* {@link SelectableSelect.select} - derive a sub-store relative to the current store
* {@link SelectableDelete.delete} - delete the current store

Utility functions:
* {@link traverse_delete}
* {@link traverse_get}
* {@link traverse_update}
* {@link resolve_selector}

## Installation

```bash
# pnpm
$ pnpm add @crikey/stores-selectable

# npm
$ npm add @crikey/stores-selectable

# yarn
$ yarn add @crikey/stores-selectable
```

## Usage

* {@codeblock ../stores-selectable/examples/select.test.ts#example-select}
