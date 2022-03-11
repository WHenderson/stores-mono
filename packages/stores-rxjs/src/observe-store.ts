import {Readable, Unsubscriber} from "@crikey/stores-base";
import {BehaviorSubject} from "rxjs";

/**
 * Create an observable from the given store.
 * The observable will emit a signal for the initial store value as well as all subsequent changes
 * @param store the store to create an observable from
 */
export function observe_store<T>(store: Readable<T>): BehaviorSubject<T> {
    const observable = new BehaviorSubject<T>(undefined!);

    let unsubscribe: Unsubscriber = store.subscribe((value) => {
        observable.next(value);
    });

    const subscribed = observable.subscribe({ complete() {
        unsubscribe();
        subscribed.unsubscribe();
    }});

    return observable;
}
