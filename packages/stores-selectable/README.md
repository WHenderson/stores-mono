# @crikey/stores-selectable

Types and functions for creating [Svelte](https://svelte.dev/) compatible stores.

`@crikey/stores-selectable` further extends the `Readable` and `Writable` interfaces with methods
for generating derived stores by referencing values within the original store.   

See [@crikey/stores-selectable](https://whenderson.github.io/stores-mono/modules/_crikey_stores_selectable.html) for full documentation.

## API

### Store creation functions:
* `selectable` - Create a `Readable` or `Writable` store with select methods (`SelectablePath.path`, `SelectableSelect.select` and `SelectableDelete.delete`). 
* `SelectablePath.path` - get the selection path of the store
* `SelectableSelect.select` - derive a sub-store relative to the current store
* `SelectableDelete.delete` - delete the current store

### Utility functions:
* `traverse_delete`
* `traverse_get`
* `traverse_update`
* `resolve_selector`

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

```ts
interface Person {
    full_name: {
        first_name?: string;
        last_name?: string;
    };
    age: number;
}

const person$ = selectable(writable<Person>({
    age: 30,
    full_name: {
        first_name: 'John'
    }
}));

const age$ = person$
    .select(person => person.age)
const full_name$ = person$
    .select(person => person.full_name);
const first_name$ = person$
    .select(person => person.full_name.first_name); // can do a deep selection
const last_name$ = full_name$
    .select(full_name => full_name.last_name); // can chain selections

console.log(get(person$));
console.log(get(age$));
console.log(get(full_name$));
console.log(get(first_name$));
console.log(get(last_name$));

// > { age: 30, full_name: { first_name: 'John' } }
// > 30
// > { first_name: 'John' }
// > John
// > undefined

age$.update(age => age + 1);
last_name$.set('Smith');

console.log(get(person$));
console.log(get(age$));
console.log(get(full_name$));
console.log(get(first_name$));
console.log(get(last_name$));

// > { age: 30, full_name: { first_name: 'John', last_name: 'Smith' } }
// > 31
// > { first_name: 'John', last_name: 'Smith' }
// > John
// > Smith

console.log(first_name$.path);

// ['full_name', 'first_name']

const first_name_via_full_path$ = person$
    .select(['full_name', 'first_name']); // ≡ first_name$
const first_name_via_path_segments$ = person$
    .select('full_name').select<string>('first_name'); // ≡ first_name$
const full_name_via_relative_path$ = first_name$
    .select([], 1);  // ≡ full_name$

console.log(get(first_name_via_full_path$));
console.log(get(first_name_via_path_segments$));
console.log(get(full_name_via_relative_path$));

// > John
// > John
// > { first_name: 'John', last_name: 'Smith' }

last_name$.delete();

console.log(get(person$));
console.log(get(last_name$));

// > { age: 30, full_name: { first_name: 'John' } }
// > undefined
```
