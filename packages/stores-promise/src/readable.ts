import {writable} from "@crikey/stores-strict";
import {ReadablePromise, State, Stateful, StatefulFulfilled, StatefulRejected} from "./types";
import {readOnly} from "@crikey/stores-base";
import {constant} from "@crikey/stores-const";

/**
 * Create a readable store that resolves according to the provided promise
 * @param promise promise which resolves into the store value / rejects into the store error
 * @param initial_value initial store value
 */
export function readable<T>(promise: PromiseLike<T>, initial_value?: T): ReadablePromise<Stateful<T>> {
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

    return Object.assign({
            promise
        },
        readOnly(promise$)
    );
}

/**
 * Create a resolved promise store without the overhead of a promise
 * @param value the value of the store
 */
function resolve<T>(value: T): ReadablePromise<StatefulFulfilled<T>> {
    return Object.assign({
            promise: Promise.resolve(value)
        },
        constant<StatefulFulfilled<T>>({
            state: State.Fulfilled,
            value: value,
            isPending: false,
            isFulfilled: true,
            isRejected: false
        })
    );
}

/**
 * Create a rejected promise store without the overhead of a promise
 * @param error the error value of the store
 */
function reject(error: any): ReadablePromise<StatefulRejected> {
    const promise = Promise.reject(error);
    promise.catch(() => {}); // prevent unhandled rejection errors

    return Object.assign(
        {
            promise
        },
        constant<StatefulRejected>({
           state: State.Rejected,
           error: error,
           isPending: false,
           isFulfilled: false,
           isRejected: true
       })
    );
}

readable.resolve = resolve;
readable.reject = reject;


