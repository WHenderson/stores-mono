import {Invalidator, Revalidator, StartNotifier, Subscriber, Trigger, Unsubscriber, Updater, Writable} from "./types";
import {noop} from "./noop";
import {enqueue_store_signals} from "@crikey/stores-base-queue";
import {store_runner} from "@crikey/stores-base-queue";

type SubscribeInvalidateTuple<T> = [Subscriber<T>, Invalidator, Revalidator];

/**
 * Create a writable store
 * @param trigger callback used to determine if subscribers should be called
 */
export function writable<T = undefined>(trigger: Trigger<T>): Writable<T | undefined>;

/**
 * Create a writable store
 * @param trigger callback used to determine if subscribers should be called
 * @param value initial store value
 * @param start callback called whenever the number of subscribers changes from 0 to 1
 */
export function writable<T>(trigger: Trigger<T>, value?: T, start?: StartNotifier<T>): Writable<T>;

/**
 * Create a writable store
 * @param trigger callback used to determine if subscribers should be called
 * @param value initial store value
 * @param start callback called whenever the number of subscribers changes from 0 to 1
 */
export function writable<T>(trigger: Trigger<T>, value?: T, start: StartNotifier<T> = noop): Writable<T | undefined> {
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

    function set(new_value: T): void {
        // note: setting the store revalidates the value

        const changed = trigger(initial, new_value, value);
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
                enqueue_store_signals(
                    local_queue.map(([subscriber]) => () => subscriber(new_value))
                );
            }
        }
        else
            revalidate();

    }

    function update(fn: Updater<T>): void {
        set(fn(value!));
    }

    function subscribe(run: Subscriber<T>, invalidator: Invalidator = noop, revalidator: Revalidator = noop): Unsubscriber {
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
            store_runner(
                () => {
                    if (subscribers.size === 1) {
                        stop = start(set, invalidate, revalidate) || noop;
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

    return { set, update, subscribe };
}
