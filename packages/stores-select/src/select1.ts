import {Readable, Subscribe, Update, UpdaterAsync, UpdaterSync, Writable, Set} from "@crikey/stores-base";
import {Delete, Deletable, DeleteSelector, ReadSelector, WriteSelector} from "./types";

/**
 * Create a derived writable/deletable store
 *
 * @param store
 * @param options
 */
export function select1<I,O>(
    store: Writable<I>,
    options: ReadSelector<I, O> & WriteSelector<I, O> & DeleteSelector<I>
) : Writable<O> & Deletable;

/**
 * Create a derived writable store
 *
 * @param store
 * @param options
 */
export function select1<I,O>(
    store: Writable<I>,
    options: ReadSelector<I, O> & WriteSelector<I, O>
) : Writable<O>;

/**
 * Create a derived readable/deletable store
 *
 * @param store
 * @param options
 */
export function select1<I,O>(
    store: Writable<I>,
    options: ReadSelector<I, O> & DeleteSelector<I>
) : Readable<O> & Deletable;

/**
 * Create a derived readable store
 *
 * @param store
 * @param options
 */
export function select1<I,O>(
    store: Readable<I>,
    options: ReadSelector<I, O>
) : Readable<O>;

export function select1<I,O>(
    store: Readable<I> | Writable<I>,
    options: ReadSelector<I, O> & Partial<WriteSelector<I, O>> & Partial<DeleteSelector<I>>
) : Partial<Readable<O>> & Partial<Writable<O>> & Partial<Deletable> {
    const { get: option_get, update: option_update, delete: option_delete } = options;

    const method_subscribe: Subscribe<O> = (run, invalidate, revalidate) => {
            return store.subscribe(
                (parent) => run(option_get(parent)),
                invalidate,
                revalidate
            );
        };

    const method_update: Update<O> | undefined = ('update' in store) && option_update
        ? (updater) => {
            if (updater.length === 1) {
                const updaterSync = <UpdaterSync<O>>updater;
                return store.update(
                    (parent) => option_update(parent, updaterSync(option_get(parent)))
                );
            }
            else {
                const updaterAsync = <UpdaterAsync<O>>updater;
                store.update(
                    (parent, set) => {
                        updaterAsync(
                            option_get(parent),
                            (updated) =>
                                set(option_update(parent, updated))
                        );
                    }
                )
            }
        }
        : undefined;

    const method_set: Set<O> | undefined = ('update' in store) && option_update
        ? (value) => {
            store.update(
                (parent) => option_update(parent, value)
            );
        }
        : undefined;

    const method_delete: Delete | undefined = ('update' in store) && option_delete
        ? () => {
            store.update(
                (parent) => option_delete(parent)
            )
        }
        : undefined;

    return {
        subscribe: method_subscribe,
        ...(method_set ? { set: method_set } : {}),
        ...(method_update ? { update: method_update } : {}),
        ...(method_delete ? { delete: method_delete } : {})
    }
}
