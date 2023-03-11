import {ComplexSet, noop, StartNotifier, UpdaterSync, UpdaterAsync, Writable} from "@crikey/stores-base";
import {writable as strictWritable} from "@crikey/stores-strict";
import {create, safeReturn} from "mutative";
import {isDraftable} from "./_is-draftable";

/**
 * Create a writable store with an initial value of `undefined`.
 *
 * Writable stores allow the store value to be set and updated by
 * external code via {@link Writable.set} and {@link Writable.update}.
 *
 * _Example_:
 * {@codeblock ../stores-base/examples/writable.test.ts#example-writable-undefined}
 *
 * Updates to the store value via {@link Writable.update} have copy-on-write semantics
 * via [immer](https://immerjs.github.io/immer/).
 *
 * {@codeblock ../stores-immer/examples/writable.test.ts#example-writable-copy-on-write}
 *
 * Explicitly defining the type of store via `writable<Type>` will
 * result in a store of type `Writable<Type | undefined>` to allow for the default value.
 * If this is undesired, an alternate default value/type can be provided.
 *
 * @category Create Store
 */
export function writable<T = undefined>(): Writable<T | undefined>;

/**
 * Create a writable store with an initial value of `value`.
 *
 * Writable stores allow the store value to be set and updated by
 * external code via {@link Writable.set} and {@link Writable.update}.
 *
 * _Example_:
 * {@codeblock ../stores-base/examples/writable.test.ts#example-writable-default}
 *
 * Updates to the store value via {@link Writable.update} have copy-on-write semantics
 * via [immer](https://immerjs.github.io/immer/).
 *
 * If `start` is provided, it will be called when the number of subscribers goes from zero to one (but not from one
 * to two, etc). Thus, `start` is called whenever the writable store 'starts up'.
 * `start` may optionally return a function which will be called when the last subscriber unsubscribes.
 *
 * _Example_:
 * {@codeblock ../stores-base/examples/writable.test.ts#example-writable-start}
 *
 * `start` is passed 4 functions - `set`, `update`, `invalidate`, and `validate`.
 *
 * #### `start`: `set`
 * Set the current value of the store (and thus marking the store value as valid).
 *
 * _Example_:
 * {@codeblock ../stores-base/examples/writable.test.ts#example-writable-start-set}
 *
 * #### `start`: `update`
 * Update the current value of the store (and thus marking the store value as valid).
 *
 * _Example_:
 * {@codeblock ../stores-base/examples/writable.test.ts#example-writable-start-update}
 *
 * #### `start`: `invalidate`
 * Mark the store (and any dependencies) as dirty.
 * Only necessary when creating advanced stores such as {@link derive}.
 *
 * #### `start`: `validate`
 * Mark the store (and any dependencies) as valid.
 * Only necessary when creating advanced stores such as {@link derive}.
 *
 * ### invalidate/validate
 * Usage of `invalidate` and `validate` is only necessary when creating advanced stores such as {@link derive} which are
 * dependent on other stores but should only be recalculated once all dependent stores are in a valid state.
 *
 * @category Create Store
 * @param value initial store value
 * @param start callback called whenever the number of subscribers changes from 0 to 1
 */
export function writable<T>(value?: T, start?: StartNotifier<T>): Writable<T>;

export function writable<T>(value?: T, start: StartNotifier<T> = noop): Writable<T | undefined> | Writable<T> {
    const store = strictWritable(value, ({set, update, invalidate, revalidate}) => {
        const complexSet: ComplexSet<T> = Object.assign(
            (value: T) => set(value),
            {
                set,
                update: (fn: UpdaterAsync<T> | UpdaterSync<T>) => {
                    if (fn.length <= 1) {
                        const updater = <UpdaterSync<T>>fn;

                        update(
                            (value: T) => {
                                return create(
                                    value,
                                    draft => {
                                        const result = updater(<T>draft);

                                        return ((result !== undefined)
                                                ? result
                                                : safeReturn(undefined)
                                        );
                                    }
                                );
                            }
                        )
                    }
                    else {
                        const updater = <UpdaterAsync<T>>fn;

                        update(
                            (value: T, set) => {
                                if (isDraftable(value)) {
                                    const [draft, finalize] = create(value);

                                    const local_set = (new_value: T): void => {
                                        const state = finalize();

                                        set(
                                            new_value !== draft
                                                ? new_value
                                                : state
                                        );
                                    };

                                    updater(draft, local_set);
                                }
                                else {
                                    updater(value, set);
                                }
                            }
                        );
                    }

                },
                invalidate,
                revalidate
            }
        );

        return start(complexSet);
    });

    function update(fn: UpdaterAsync<T> | UpdaterSync<T>): void {
        if (fn.length <= 1) {
            const updater = <UpdaterSync<T>>fn;

            store.update(
                (value : T) => {
                    return create(
                        value,
                        draft => {
                            const result = updater(<T>draft);

                            return ((result !== undefined)
                                    ? result
                                    : safeReturn(undefined)
                            );
                        }
                    );
                }
            );
        }
        else {
            const updater = <UpdaterAsync<T>>fn;

            store.update(
                (value: T, set) => {
                    if (isDraftable(value)) {
                        const [draft, finalize] = create(value);

                        const local_set = (new_value: T): void => {
                            const state = finalize();

                            set(
                                new_value !== draft
                                    ? new_value
                                    : state
                            );
                        };

                        updater(draft, local_set);
                    }
                    else {
                        updater(value, set);
                    }
                }
            );
        }
    }

    return {
        ...store,
        update
    }
}
