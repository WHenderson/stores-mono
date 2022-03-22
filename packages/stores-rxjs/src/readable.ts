import {Readable, Subscriber, Unsubscriber} from '@crikey/stores-base';
import {Observable} from "rxjs";

/**
 * Convert an RxJS Observable to a svelte compatible store.
 * note: subscribers will be signaled with undefined upon subscription unless the observable fires a signal
 * synchronously
 * note: RxJs Observables do not support the necessary constructs to avoid the diamond dependency problem
 * note: Each new subscription to the created store will create a new subscription to the underlying observable.
 *   "This shows how subscribe calls are not shared among multiple Observers of the same Observable. When calling
 *   observable.subscribe with an Observer, the function subscribe in
 *   new Observable(function subscribe(subscriber) {...}) is run for that given subscriber. Each call to
 *   observable.subscribe triggers its own independent setup for that given subscriber."
 * @param observable observable to convert into a store
 */
export function readable<T>(observable: Observable<T>): Readable<T | undefined>;

/**
 * Convert an RxJS Observable to a svelte compatible store.
 * note: subscribers will be signaled with initial_value upon subscription unless the observable fires a signal
 * synchronously
 * note: RxJs Observables do not support the necessary constructs to avoid the diamond dependency problem
 * note: Each new subscription to the created store will create a new subscription to the underlying observable.
 *   "This shows how subscribe calls are not shared among multiple Observers of the same Observable. When calling
 *   observable.subscribe with an Observer, the function subscribe in
 *   new Observable(function subscribe(subscriber) {...}) is run for that given subscriber. Each call to
 *   observable.subscribe triggers its own independent setup for that given subscriber."
 * @param observable observable to convert into a store
 * @param initial_value initial_value to signal with if the observable doesn't immediately signal a value
 */
export function readable<T>(observable: Observable<T>, initial_value: T): Readable<T>;

/**
 * Convert an RxJS Observable to a svelte compatible store.
 * note: subscribers will be signaled with initial_value upon subscription unless the observable fires a signal
 * synchronously
 * note: RxJs Observables do not support the necessary constructs to avoid the diamond dependency problem
 * note: Each new subscription to the created store will create a new subscription to the underlying observable.
 *   "This shows how subscribe calls are not shared among multiple Observers of the same Observable. When calling
 *   observable.subscribe with an Observer, the function subscribe in
 *   new Observable(function subscribe(subscriber) {...}) is run for that given subscriber. Each call to
 *   observable.subscribe triggers its own independent setup for that given subscriber."
 * @param observable observable to convert into a store
 * @param initial_value initial_value to signal with if the observable doesn't immediately signal a value
 */
export function readable<T>(observable: Observable<T>, initial_value?: T): Readable<T | undefined>;

export function readable<T>(observable: Observable<T>, initial_value?: T): Readable<T | undefined> {
    return {
        subscribe(run: Subscriber<T | undefined>): Unsubscriber {
            let initiated = false;
            const subscribed = observable.subscribe((value) => {
                initiated = true;
                run(value);
            });

            if (!initiated)
                run(initial_value);

            return () => subscribed.unsubscribe();
        }
    }
}
