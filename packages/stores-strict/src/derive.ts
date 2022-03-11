import {derive as baseDerive, Readable, Stores, StoresValues, Unsubscriber} from "@crikey/stores-base";
import {trigger_strict_not_equal} from "./trigger-strict-not-equal";


/**
 * Creates a derived value store by synchronizing one or more readable stores and applying an aggregate function over
 * the store values.
 *
 * @param stores input stores
 * @param fn callback that aggregates the store values
 */
export function derive<S extends Stores, T>(
    stores: S,
    fn: (values: StoresValues<S>, set: (value: T) => void) => Unsubscriber | void
): Readable<T | undefined>;

/**
 * Creates a derived value store by synchronizing one or more readable stores and applying an aggregate function over
 * the store values.
 *
 * @param stores input stores
 * @param fn callback that aggregates the store values
 * @param initial_value initial value - useful when the aggregate function initialises the store asynchronously
 */
export function derive<S extends Stores, T>(
    stores: S,
    fn: (values: StoresValues<S>, set: (value: T) => void) => Unsubscriber | void,
    initial_value: T
): Readable<T>;

/**
 * Creates a derived value store by synchronizing one or more readable stores and applying an aggregate function over
 * the store values.
 *
 * @param stores input stores
 * @param fn callback that aggregates the store values
 * @param initial_value initial value - useful when the aggregate function initialises the store asynchronously
 */
export function derive<S extends Stores, T>(
    stores: S,
    fn: (values: StoresValues<S>) => T,
    initial_value?: T
): Readable<T>;

/**
 * Creates a derived value store by synchronizing one or more readable stores and applying an aggregate function over
 * the store values.
 *
 * @param stores input stores
 * @param fn callback that aggregates the store values
 * @param initial_value initial value - useful when the aggregate function initialises the store asynchronously
 */
export function derive<T>(
    stores: Stores,
    fn: any,
    initial_value?: T
): Readable<T> {
    return baseDerive(trigger_strict_not_equal, stores, fn, initial_value);
}
