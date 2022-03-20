import {Readable, StartNotifier, Trigger} from "./types";
import {read_only} from "./read-only";
import {writable} from "./writable";

/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param trigger callback used to determine if subscribers should be called
 */
export function readable<T = undefined>(trigger: Trigger<T>): Readable<T | undefined>;

/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param trigger callback used to determine if subscribers should be called
 * @param value initial store value
 * @param start callback which is signaled whenever the number of subscribers changes from 0 to 1
 */
export function readable<T>(trigger: Trigger<T>, value: T, start?: StartNotifier<T>): Readable<T>;

/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param trigger callback used to determine if subscribers should be called
 * @param value initial store value
 * @param start callback which is signaled whenever the number of subscribers changes from 0 to 1
 */
export function readable<T>(trigger: Trigger<T>, value?: T, start?: StartNotifier<T>): Readable<T | undefined> {
    return read_only(writable(trigger, value!, start));
}
