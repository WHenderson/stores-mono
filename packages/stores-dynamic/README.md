# @crikey/stores-dynamic

Types and functions for creating [Svelte](https://svelte.dev/) compatible stores.

`@crikey/stores-dynamic` stores further extend the [svelte/store](https://svelte.dev/docs#run-time-svelte-store)
contract to allow for dynamic dependencies and natural error handling.

Store creation function:
* {@link constant} - Create a {@link Readable} store with a fixed {@link DynamicResolved}
* {@link constant_value} - Create a {@link Readable} store with a fixed {@link DynamicValue}
* {@link constant_error} - Create a {@link Readable} store with a fixed {@link DynamicError}
* {@link dynamic} - Convert a standard {@link Readable} to a {@link DynamicReadable}
* {@link dynamic} - Create a {@link DynamicReadable} store derived from the resolved values of other stores

Utility functions:
* {@link get_error} - Uses {@link get} to retrieve the current store value and return its error property (or undefined)
* {@link get_value} - Uses {@link get} to retrieve the current store value and return its value property (or throw its error property)
* {@link resolve} - Resolves the given {@link Dynamic} item to its contained value, or throws its contained error
* {@link smart} - Resolve store to a constant {@link DynamicResolved} value (on demand) if possible, or keep as a {@link DynamicReadable}

Type Guards:
* {@link is_dynamic_resolved} - Returns true if the given argument is a {@link DynamicResolved} value (has either a value or an error property)
* {@link is_dynamic_value} - Returns true if the given argument is a {@link DynamicValue}
* {@link is_dynamic_error} - Returns true if the given argument is a {@link DynamicError}

Trigger functions:
* {@link create_trigger_dynamic} - Creates a trigger function for {@link DynamicResolved} values
