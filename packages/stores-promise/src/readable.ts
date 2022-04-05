import {ReadablePromise, State, Stateful, StatefulFulfilled, StatefulRejected} from "./types";
import {writable, read_only, constant} from "@crikey/stores-base";
import {trigger_strict_not_equal} from "@crikey/stores-base/src";

/**
 * Create a readable store that resolves according to the provided promise
 *
 * @param promise promise which resolves into the store value / rejects into the store error
 * @param initial_value initial store value
 */
export function readable<T>(
    promise: PromiseLike<T>,
    initial_value?: T
): ReadablePromise<Stateful<T>> {
    const promise$ = writable<Stateful<T>>(
        trigger_strict_not_equal,
        {
            isPending: true,
            isFulfilled: false,
            isRejected: false,
            state: State.Pending,
            value: initial_value
        }
    );

    const chained = promise.then(
        (v) => {
            const state: StatefulFulfilled<T> = {
                isPending: false,
                isFulfilled: true,
                isRejected: false,
                state: State.Fulfilled,
                value: v
            };
            promise$.set(state);

            return state;
        },
        (e) => {
            const state: StatefulRejected = {
                isPending: false,
                isFulfilled: false,
                isRejected: true,
                state: State.Rejected,
                error: e
            };
            promise$.set(state);

            return state;
        }
    );

    return Object.assign({
            promise: chained
        },
        read_only(promise$)
    );
}

/**
 * Create a resolved promise store without the overhead of waiting for a promise
 *
 * @param value the value of the store
 */
function resolve<T>(
    value: T
): ReadablePromise<StatefulFulfilled<T>> {
    const state: StatefulFulfilled<T> = {
        state: State.Fulfilled,
        value: value,
        isPending: false,
        isFulfilled: true,
        isRejected: false
    };

    return Object.assign({
            promise: Promise.resolve(state)
        },
        constant(state)
    );
}

/**
 * Create a rejected promise store without the overhead of waiting for a promise
 *
 * @param error the error value of the store
 */
function reject(error: any): ReadablePromise<StatefulRejected> {
    const state: StatefulRejected = {
        state: State.Rejected,
        error: error,
        isPending: false,
        isFulfilled: false,
        isRejected: true
    };

    return Object.assign(
        {
            promise: Promise.resolve(state)
        },
        constant(state)
    );
}

readable.resolve = resolve;
readable.reject = reject;


