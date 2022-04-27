import {noop, Readable, trigger_always, writable} from '@crikey/stores-base';
import {Observable, Subscription} from "rxjs";

export interface Linkable {
    link(this: void): void;
}
export interface Unlinkable {
    unlink(this: void): void;
}

/**
 * Convert an RxJS Observable to a svelte compatible store.
 * note: subscribers will be signaled with undefined upon subscription unless the observable fires a signal
 * synchronously
 * note: RxJs Observables do not support the necessary constructs to avoid the diamond dependency problem
 * note: Upon initial subscription, the store will begin receiving signals from the observer and continue until manually
 * unlinked. Unlike traditional RxJS observables, signals originating from the constructor will not be re-sent.
 * @param observable observable to convert into a store
 */
export function readable_persist<T>(observable: Observable<T>): Readable<T | undefined> & Linkable & Unlinkable;

/**
 * Convert an RxJS Observable to a svelte compatible store.
 * note: subscribers will be signaled with undefined upon subscription unless the observable fires a signal
 * synchronously
 * note: RxJs Observables do not support the necessary constructs to avoid the diamond dependency problem
 * note: Upon initial subscription, the store will begin receiving signals from the observer and continue until manually
 * unlinked. Unlike traditional RxJS observables, signals originating from the constructor will not be re-sent.

 * @param observable observable to convert into a store
 * @param initial_value initial_value to signal with if the observable doesn't immediately signal a value
 */
export function readable_persist<T>(observable: Observable<T>, initial_value: T): Readable<T> & Linkable & Unlinkable;

/**
 * Convert an RxJS Observable to a svelte compatible store.
 * note: subscribers will be signaled with undefined upon subscription unless the observable fires a signal
 * synchronously
 * note: RxJs Observables do not support the necessary constructs to avoid the diamond dependency problem
 * note: Upon initial subscription, the store will begin receiving signals from the observer and continue until manually
 * unlinked. Unlike traditional RxJS observables, signals originating from the constructor will not be re-sent.

 * @param observable observable to convert into a store
 * @param initial_value initial_value to signal with if the observable doesn't immediately signal a value
 */
export function readable_persist<T>(observable: Observable<T>, initial_value?: T): Readable<T | undefined> & Linkable & Unlinkable;

export function readable_persist<T>(observable: Observable<T>, initial_value?: T): Readable<T | undefined> & Linkable & Unlinkable {
    let initiated = false;
    let subscriber: Subscription | undefined = undefined;

    const store = writable(
        trigger_always,
        initial_value,
        (set) => {
            if (!initiated && !subscriber) {
                initiated = true;
                subscriber = observable.subscribe(set);
            }
            return noop;
        }
    );

    return {
        subscribe: store.subscribe,
        link() {
            if (!subscriber) {
                initiated = true;
                subscriber = observable.subscribe(store.set);
            }
        },
        unlink() {
            initiated = true;
            if (subscriber) {
                subscriber.unsubscribe();
                subscriber = undefined;
            }
        }
    }
}
