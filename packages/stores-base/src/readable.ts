import {Readable, StartNotifier, Trigger} from "./types";
import {read_only} from "./read-only";
import {writable} from "./writable";

/**
 * Creates a readable store with the value of `undefined`.
 *
 * This signature provides little benefit other than mirroring the signature for its counterpart, {@link readable}
 *
 * _Example_:
 * {@codeblock ../stores-base/examples/readable.test.ts#example-readable-undefined}
 *
 * Explicitly defining the type of store via `readable<Type>` will
 * result in a store of type `Readable<Type | undefined>` to allow for the default value.
 * If this is undesired, an alternate default value/type can be provided.
 *
 * @category Create Store
 * @param trigger callback used to determine if subscribers should be called
 */
export function readable<T = undefined>(trigger: Trigger<T>): Readable<T | undefined>;

/**
 * Creates a readable store with an initial value of `value`.
 *
 * Readable stores provide no external methods for changing the store value, but their value can be changed via
 * the implementation of `start`.
 * See {@link writable} for detailed usage of the `start` argument.
 *
 * _Example_:
 * {@codeblock ../stores-base/examples/readable.test.ts#example-readable-start}
 *
 * @category Create Store
 * @param trigger callback used to determine if subscribers should be called
 * @param value initial store value
 * @param start callback which is signaled whenever the number of subscribers changes from 0 to 1
 */
export function readable<T>(trigger: Trigger<T>, value: T, start?: StartNotifier<T>): Readable<T>;

export function readable<T>(trigger: Trigger<T>, value?: T, start?: StartNotifier<T>): Readable<T | undefined> {
    return read_only(writable(trigger, value!, start));
}
