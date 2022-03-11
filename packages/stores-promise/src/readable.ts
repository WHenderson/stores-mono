import {readable as strictReadable, writable} from "@crikey/stores-strict";
import {State, Stateful, StatefulFulfilled, StatefulRejected} from "./types";
import {Readable, readOnly} from "@crikey/stores-base";

/**
 * Create a readable store that resolves according to the provided promise
 * @param promise promise which resolves into the store value / rejects into the store error
 * @param initial_value initial store value
 */
export function readable<T>(promise: Promise<T>, initial_value?: T): Readable<Stateful<T>> {
    const promise$ = writable<Stateful<T>>({
        isPending: true,
        isFulfilled: false,
        isRejected: false,
        state: State.Pending,
        value: initial_value
    });

    promise.then(
        (v) => {
            promise$.set({
                isPending: false,
                isFulfilled: true,
                isRejected: false,
                state: State.Fulfilled,
                value: v
            });
            return v;
        },
        (e) => {
            promise$.set({
                isPending: false,
                isFulfilled: false,
                isRejected: true,
                state: State.Rejected,
                error: e
            });
        }
    );

    return readOnly(promise$);
}

/**
 * Create a resolved promise store without the overhead of a promise
 * @param value the value of the store
 */
function resolve<T>(value: T): Readable<StatefulFulfilled<T>> {
    return strictReadable({
        state: State.Fulfilled,
        value: value,
        isPending: false,
        isFulfilled: true,
        isRejected: false
    });
}

/**
 * Create a rejected promise store without the overhead of a promise
 * @param error the error value of the store
 */
function reject(error: any): Readable<StatefulRejected> {
    return strictReadable({
        state: State.Rejected,
        error: error,
        isPending: false,
        isFulfilled: false,
        isRejected: true
    });
}

readable.resolve = resolve;
readable.reject = reject;


