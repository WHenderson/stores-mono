import {
    Invalidate,
    Revalidate,
    StartNotifier,
    Subscriber,
    Trigger,
    Unsubscriber,
    UpdaterAsync,
    UpdaterSync,
    Writable
} from "./types";
import {noop} from "./noop";
import {enqueue_actions, actionRunner} from "@crikey/stores-base-queue";
import {RecursionError} from "./recursion-error";

type SubscribeInvalidateTuple<T> = [Subscriber<T>, Invalidate, Revalidate];

/**
 * Create a writable store with an initial value of `undefined`.
 *
 * Writable stores allow the store value to be set and updated by
 * external code via {@link Writable.set} and {@link Writable.update}.
 *
 * _Example_:
 * {@codeblock ../stores-base/examples/writable.test.ts#example-writable-undefined}
 *
 * Explicitly defining the type of store via `writable<Type>` will
 * result in a store of type `Writable<Type | undefined>` to allow for the default value.
 * If this is undesired, an alternate default value/type can be provided.
 *
 * @category Create Store
 * @param trigger callback used to determine if subscribers should be called
 */
export function writable<T = undefined>(trigger: Trigger<T | undefined>): Writable<T | undefined>;

/**
 * Create a writable store with an initial value of `value`.
 *
 * Writable stores allow the store value to be set and updated by
 * external code via {@link Writable.set} and {@link Writable.update}.
 *
 * _Example_:
 * {@codeblock ../stores-base/examples/writable.test.ts#example-writable-default}
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
 * @param trigger callback used to determine if subscribers should be called
 * @param value initial store value
 * @param start callback called whenever the number of subscribers changes from 0 to 1
 */
export function writable<T>(trigger: Trigger<T>, value: T, start?: StartNotifier<T>): Writable<T>;

/* implementation */
export function writable<T>(trigger: Trigger<T>, value?: T, start: StartNotifier<T> = noop): Writable<T> {
    let initial = true;
    let stop: Unsubscriber | undefined;
    let invalidated = false;
    const subscribers: Set<SubscribeInvalidateTuple<T>> = new Set();

    function revalidate() {
        if (!invalidated)
            return;

        // value unchanged, but store is now valid
        invalidated = false;

        if (stop) { // store is ready
            const local_queue = Array.from(subscribers.values());

            // immediately signal each subscriber value has been revalidated
            local_queue.forEach(([, , revalidate]) => revalidate());
        }
    }

    function invalidate(): void {
        if (invalidated)
            return;

        if (stop) { // store is ready
            invalidated = true; // ensure the next update is sent

            const local_queue = Array.from(subscribers.values());

            // immediately signal each subscriber value is invalid
            local_queue.forEach(([, invalidate]) => invalidate());
        }
    }

    function set(new_value: T | undefined): void {
        // note: setting the store revalidates the value

        const changed = trigger(initial, new_value!, value);
        if (changed) {
            // value changed, store is valid
            invalidated = false;

            initial = false;
            value = new_value;
            if (stop) { // store is ready
                const local_queue = Array.from(subscribers.values());

                // immediately signal each subscriber value is invalid
                local_queue.forEach(([, invalidate]) => invalidate());

                // queue subscription actions
                enqueue_actions(
                    local_queue.map(([subscriber]) => () => subscriber(new_value!))
                );
            }
        }
        else
            revalidate();

    }

    const complexSet = Object.assign(
        (new_value: T | undefined) => set(new_value), // avoid cyclic reference
        {
            set,
            update,
            invalidate,
            revalidate
        }
    );

    function update(fn: UpdaterSync<T> | UpdaterSync<T | undefined> | UpdaterAsync<T> | UpdaterAsync<T | undefined>): void {
        if (fn.length <= 1)
            set((<UpdaterSync<T>>fn)(value!)); // sync
        else
            fn(value!, set); // async
    }

    let subscribing = false;
    function subscribe(run: Subscriber<T>, invalidator: Invalidate = noop, revalidator: Revalidate = noop): Unsubscriber {
        if (subscribing)
            throw new RecursionError();

        subscribing = true;
        try {
            const subscriber: SubscribeInvalidateTuple<T> = [run, invalidator, revalidator];
            subscribers.add(subscriber);

            const unsubscribe = () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = undefined;
                }
            };

            try {
                actionRunner(
                    () => {
                        if (subscribers.size === 1) {
                            stop = start(complexSet) || noop;
                        }
                        run(value!);
                    }
                );
            }
            catch (ex) {
                unsubscribe();

                throw ex;
            }

            return unsubscribe;
        }
        finally {
            subscribing = false;
        }
    }

    return {set, update, subscribe};
}
