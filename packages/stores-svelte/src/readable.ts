import {Readable, readable as baseReadable, StartNotifier} from "@crikey/stores-base";
import {trigger_safe_not_equal} from "./trigger-safe-not-equal";

/**
 * Creates a `Readable` store that allows reading by subscription.
 */
export function readable<T = undefined>(): Readable<T | undefined>;

/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial store value
 * @param start callback which is signaled whenever the number of subscribers changes from 0 to 1
 */
export function readable<T>(value: T, start?: StartNotifier<T>): Readable<T>;

/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial store value
 * @param start callback which is signaled whenever the number of subscribers changes from 0 to 1
 */
export function readable<T>(value?: T, start?: StartNotifier<T>): Readable<T | undefined> | Readable<T> {
    return baseReadable(trigger_safe_not_equal, value!, start);
}
