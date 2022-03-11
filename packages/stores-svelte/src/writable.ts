import {noop, StartNotifier, Writable, writable as baseWritable} from "@crikey/stores-base";
import {trigger_safe_not_equal} from "./trigger-safe-not-equal";

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
export function writable<T>(value?: T, start: StartNotifier<T> = noop): Writable<T | undefined> {
    return baseWritable(trigger_safe_not_equal, value, start);
}
