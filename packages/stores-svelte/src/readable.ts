import {Readable, readable as baseReadable, StartNotifier, trigger_safe_not_equal} from "@crikey/stores-base";

/**
 * Creates a readable store with the value of `undefined`.
 *
 * This signature provides little benefit other than mirroring the signature for its counterpart, {@link readable}
 *
 * _Example_:
 * {@codeblock ../stores-svelte/examples/readable.test.ts#example-readable-undefined}
 *
 * Explicitly defining the type of store via `readable<Type>` will
 * result in a store of type `Readable<Type | undefined>` to allow for the default value.
 * If this is undesired, an alternate default value/type can be provided.
 *
 * @category Create Store
 */
export function readable<T = undefined>(): Readable<T | undefined>;

/**
 * Creates a readable store with an initial value of `value`.
 *
 * Readable stores provide no external methods for changing the store value, but their value can be changed via
 * the implementation of `start`.
 * See {@link writable} for detailed usage of the `start` argument.
 *
 * _Example_:
 * {@codeblock ../stores-svelte/examples/readable.test.ts#example-readable-start}
 *
 * @category Create Store
 * @param value initial store value
 * @param start callback which is signaled whenever the number of subscribers changes from 0 to 1
 */
export function readable<T>(value: T, start?: StartNotifier<T>): Readable<T>;

export function readable<T>(value?: T, start?: StartNotifier<T>): Readable<T | undefined> | Readable<T> {
    return baseReadable(trigger_safe_not_equal, value!, start);
}
