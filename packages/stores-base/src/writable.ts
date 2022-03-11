import {Invalidator, StartNotifier, Subscriber, Trigger, Unsubscriber, Updater, Writable} from "./types";
import {noop} from "./noop";
import {enqueue_store_signals} from "@crikey/stores-base-queue";

type SubscribeInvalidateTuple<T> = [Subscriber<T>, Invalidator];

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
    const subscribers: Set<SubscribeInvalidateTuple<T>> = new Set();

    function set(new_value: T): void {
        if (trigger(initial, new_value, value)) {
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
    }

    function update(fn: Updater<T>): void {
        set(fn(value!));
    }

    function subscribe(run: Subscriber<T>, invalidate: Invalidator = noop): Unsubscriber {
        const subscriber: SubscribeInvalidateTuple<T> = [run, invalidate];
        subscribers.add(subscriber);
        if (subscribers.size === 1) {
            stop = start(set) || noop;
        }
        run(value!);

        return () => {
            subscribers.delete(subscriber);
            if (subscribers.size === 0 && stop) {
                stop();
                stop = undefined;
            }
        };
    }

    return { set, update, subscribe };
}
