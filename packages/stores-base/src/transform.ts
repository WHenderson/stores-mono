import {ComplexSet, Set, Trigger, Unsubscriber, UpdaterAsync, UpdaterSync, Writable} from "./types";
import {Action} from "@crikey/stores-base-queue";
import {writable} from "./writable";

// TODO: Should merge any efficiencies into derived and turn `transform` into a read/write version of derived which has functions for input/output transformations
//  Is there a way to have a syntax where the `write` transform is optional leaving us with a readonly store..

/** Synchronous callback for deriving a value from resolved input value */
export type ReadFnSync<I,O> = (values: I) => O;

/** Asynchronous callback for deriving a value from resolved input value */
export type ReadFnAsyncComplex<I,O> =
    ((values: I, set: ComplexSet<O>) => Unsubscriber | void);

/** Synchronous callback for deriving a value from resolved input value */
export type WriteFnSync<I,O> = (values: I) => O;

/** Asynchronous callback for deriving a value from resolved input value */
export type WriteFnAsync<I,O> =
    ((values: I, set: Set<O>) => void);

/**
 * Creates a new store by applying a transform callback to values from the input store.
 * Resulting store values can be provided via the set argument in the transformer callback.
 *
 * Whilst {@link derive} can be used to provide the same utility, transform has less overhead.
 *
 * @param trigger callback used to determine if subscribers should be called
 * @param store input store
 * @param transformer callback used to transfrom values from the input into values for the output store
 */
export function transform<T, R>(
    trigger: Trigger<R | undefined>,
    store: Writable<T>,
    read: ReadFnAsyncComplex<T, R | undefined>,
    write: WriteFnAsync<R | undefined, T>
) : Writable<R | undefined>;

/**
 * Creates a new store by applying a transform callback to values from the input store.
 * Resulting store values can be provided via the set argument in the transformer callback.
 *
 * Whilst {@link derive} can be used to provide the same utility, transform has less overhead.
 *
 * @param trigger callback used to determine if subscribers should be called
 * @param store input store
 * @param transformer callback used to transfrom values from the input into values for the output store
 * @param initial_value Initial value of the resulting store
 */
export function transform<T, R>(
    trigger: Trigger<R>,
    store: Writable<T>,
    read: ReadFnAsyncComplex<T, R>,
    write: WriteFnAsync<R, T>,
    initial_value: R
) : Writable<R>;

/**
 * Creates a new store by applying a transform callback to values from the input store.
 *
 * Whilst {@link derive} can be used to provide the same utility, transform has less overhead.
 *
 * @param trigger callback used to determine if subscribers should be called
 * @param store input store
 * @param transformer callback used to transfrom values from the input into values for the output store
 */
export function transform<T, R>(
    trigger: Trigger<R>,
    store: Writable<T>,
    read: ReadFnSync<T, R>,
    write: WriteFnSync<R, T>
) : Writable<R>;

// TODO: Probably no good reason to assume io are both sync or both async

export function transform<T, R>(
    trigger: Trigger<R>,
    store: Writable<T>,
    read: ReadFnSync<T, R> | ReadFnAsyncComplex<T, R>,
    write: WriteFnSync<R, T> | WriteFnAsync<R, T>,
    initial_value?: R
) : Writable<R>  {

    const cache = writable<R>(
        trigger,
        <R>initial_value!,
        (complexSet) => {
            let async_cleanup: Action | undefined;
            let store_unsub: Action | undefined = store.subscribe(
                value => {
                    if (read.length > 1) {
                        async_cleanup?.();
                        async_cleanup = undefined;

                        const unsub = (<ReadFnAsyncComplex<T, R>>read)(value, complexSet); // async
                        if (unsub)
                            async_cleanup = unsub;
                    }
                    else
                        complexSet((<WriteFnSync<T, R>>read)(value)); // sync
                },
                complexSet.invalidate,
                complexSet.revalidate
            );

            return () => {
                async_cleanup?.();
                async_cleanup = undefined;

                store_unsub?.();
                store_unsub = undefined;
            };
        }
    );

    const write_is_sync = write.length <= 1;

    // TODO: Writable store contract should not _require_ update in the contract. It's just a nice to have... man some things may wind up with soo many signatures without it though...
    // TODO: Update signature should support async, then this becomes possible

    if (write_is_sync) {
        function set(value: R) {
            store.set((<WriteFnSync<R, T>>write)(value));
        }

        function update(updater: UpdaterSync<R> | UpdaterAsync<R>) {
            cache.update((value, _set) => {
                if (updater.length <= 1)
                    set((<UpdaterSync<R>>updater)(value))
                else
                    updater(value, set);
            });
        }

        return {
            subscribe: cache.subscribe,
            set,
            update
        }
    }
    else {
        function set(value: R) {
            write(value, store.set);
        }

        function update(updater: UpdaterSync<R> | UpdaterAsync<R>) {
            cache.update((value, _set) => {
                if (updater.length <= 1)
                    set((<UpdaterSync<R>>updater)(value))
                else
                    updater(value, set);
            });
        }

        return {
            subscribe: cache.subscribe,
            set,
            update
        }
    }
}
