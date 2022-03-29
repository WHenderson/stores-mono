import {
    derive as baseDerive,
    DeriveFnAsyncComplex,
    DeriveFnAsyncSimple,
    DeriveFnSync,
    Readable,
    Stores,
    trigger_safe_not_equal
} from "@crikey/stores-base";

/**
 * Derives a store from one or more other stores. The store value is calculated on demand and recalculated whenever any of
 * the store dependencies change.
 *
 * For simple usage, see the alternate signature.
 *
 * Values may be updated asynchronously:
 *
 * _Example_:
 * {@codeblock ../stores-svelte/examples/derive.test.ts#example-derive-async-update}
 *
 * @category Create Store
 * @param stores input stores
 * @param fn callback that aggregates the store values which are passed in as the first argument
 * @param initial_value initial value - useful when the aggregate function initialises the store asynchronously
 */
export function derive<S extends Stores, T>(
    stores: S,
    fn: DeriveFnAsyncComplex<S,T>,
    initial_value?: T
): Readable<T>;

/**
 * Derives a store from one or more other stores. The store value is calculated on demand and recalculated whenever any of
 * the store dependencies change.
 *
 * For simple usage, see the alternate signature.
 *
 * Values may be derived asynchronously:
 *
 * _Example_:
 * {@codeblock ../stores-svelte/examples/derive.test.ts#example-derive-async-simple}
 *
 * @category Create Store
 * @param stores input stores
 * @param fn callback that aggregates the store values which are passed in as the first argument
 * @param initial_value initial value - useful when the aggregate function initialises the store asynchronously
 */
export function derive<S extends Stores, T>(
    stores: S,
    fn: DeriveFnAsyncSimple<S,T>,
    initial_value?: T
): Readable<T>;

/**
 * Derives a store from one or more other stores. The store value is calculated on demand and recalculated whenever any of
 * the store dependencies change.
 *
 * In the simplest version, `derive` takes a single store, and the callback returns a derived value:
 *
 * _Example_:
 * {@codeblock ../stores-svelte/examples/derive.test.ts#example-derive-simple-single}
 *
 * `derive` may also take a tuple or array of inputs a derive a value from those:
 *
 * _Example_:
 * {@codeblock ../stores-svelte/examples/derive.test.ts#example-derive-simple-add}
 *
 * Alternate signatures provide a means for deriving the value asynchronously.
 *
 * @category Create Store
 * @param stores input stores
 * @param fn callback that aggregates the store values
 * @param initial_value initial value - useful when the aggregate function initialises the store asynchronously
 */
export function derive<S extends Stores, T>(
    stores: S,
    fn: DeriveFnSync<S,T>,
    initial_value?: T
): Readable<T>;

export function derive<T>(
    stores: Stores,
    fn: any,
    initial_value?: T
): Readable<T> {
    return baseDerive(trigger_safe_not_equal, stores, fn, initial_value);
}
