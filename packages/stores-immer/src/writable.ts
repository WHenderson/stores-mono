import {noop, StartNotifier, Updater, Writable} from "@crikey/stores-base";
import {writable as strictWritable} from "@crikey/stores-strict";
import produce, {Draft, nothing} from "immer";

/**
 * Create a writable store using immer to provide copy-on-write semantics during updates
 */
export function writable<T = undefined>(): Writable<T | undefined>;

/**
 * Create a writable store using immer to provide copy-on-write semantics during updates
 * @param value initial store value
 * @param start callback called whenever the number of subscribers changes from 0 to 1
 */
export function writable<T>(value?: T, start?: StartNotifier<T>): Writable<T>;

/**
 * Create a writable store using immer to provide copy-on-write semantics during updates
 * @param value initial store value
 * @param start callback called whenever the number of subscribers changes from 0 to 1
 */
export function writable<T>(value?: T, start: StartNotifier<T> = noop): Writable<T | undefined> {
    const store = strictWritable(value, start);

    function update(fn: Updater<T>): void {
        store.update(
            (value : T) => {
                return produce(
                    value,
                    draft => {
                        const result = fn(<T>draft);

                        return <Draft<T>>((result !== undefined)
                                ? result
                                : nothing
                        );
                    }
                );
            }
        );
    }

    return {
        ...store,
        update
    }
}
