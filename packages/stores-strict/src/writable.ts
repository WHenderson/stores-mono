import {noop, StartNotifier, trigger_strict_not_equal, Writable, writable as baseWritable} from "@crikey/stores-base";

/**
 * Create a writable store
 */
export function writable<T = undefined>(): Writable<T | undefined>;

/**
 * Create a writable store
 * @param value initial store value
 * @param start callback called whenever the number of subscribers changes from 0 to 1
 */
export function writable<T>(value?: T, start?: StartNotifier<T>): Writable<T>;

/**
 * Create a writable store
 * @param value initial store value
 * @param start callback called whenever the number of subscribers changes from 0 to 1
 */
export function writable<T>(value?: T, start: StartNotifier<T> = noop): Writable<T | undefined> | Writable<T> {
    return baseWritable(trigger_strict_not_equal, value!, start);
}
