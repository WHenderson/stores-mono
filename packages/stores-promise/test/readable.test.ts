import {expect, fn, it} from 'vitest'
import {promise, readable, repromise, State} from "../src";
import {get, writable} from "@crikey/stores-base";
import {trigger_strict_not_equal} from "../../stores-base/src";

it('should match promise state', async () => {
    const promisePending = new Promise(() => {});
    const storePending = readable(promisePending);

    expect(get(storePending)).to.deep.equal({
        isPending: true,
        isFulfilled: false,
        isRejected: false,
        state: State.Pending,
        value: undefined
    });

    const promiseFulfilled = Promise.resolve(1);
    const storeFulfilled = readable(promiseFulfilled);

    await promiseFulfilled;

    expect(get(storeFulfilled)).to.deep.equal({
        isPending: false,
        isFulfilled: true,
        isRejected: false,
        state: State.Fulfilled,
        value: 1
    });


    const promiseRejected = Promise.reject(-1);
    const storeRejected = readable(promiseRejected);

    try {
        await promiseRejected;
    }
    catch {
    }

    expect(get(storeRejected)).to.deep.equal({
        isPending: false,
        isFulfilled: false,
        isRejected: true,
        state: State.Rejected,
        error: -1,
    });
})

it('should track promise state to fulfilled', async () => {
    let resolve: (value: any) => void;
    const promise = new Promise<any>((r) => {
        resolve = r;
    });

    const store = readable(promise);

    expect(get(store).isPending).toBeTruthy();

    resolve!(1);
    await promise;

    expect(get(store).isFulfilled).toBeTruthy();
});


it('should track promise state to rejected', async () => {
    let reject: (value: any) => void;
    const promise = new Promise<any>((_, r) => {
        reject = r;
    });

    const store = readable(promise);

    expect(get(store).isPending).toBeTruthy();

    reject!(-1);

    try {
        await promise;
    }
    catch {
    }

    expect(get(store).isRejected).toBeTruthy();
});

it('should create synchronous fulfilled', () => {
    const store = readable.resolve(1);
    expect(get(store)).to.deep.equal({
        isPending: false,
        isFulfilled: true,
        isRejected: false,
        state: State.Fulfilled,
        value: 1,
    });
});

it('should create synchronous rejected', () => {
    const store = readable.reject(1);
    expect(get(store)).to.deep.equal({
        isPending: false,
        isFulfilled: false,
        isRejected: true,
        state: State.Rejected,
        error: 1,
    });
})

it('should discard old promises', async () => {
    const store = writable(trigger_strict_not_equal, 1);

    const derived = repromise(store, value => {
        return new Promise<number>(resolve => {
            setTimeout(() => resolve(value), 0);
        });
    })

    const watch = fn();

    derived.subscribe(watch);

    store.set(2);
    store.set(3);
    store.set(4);

    await promise(derived);

    // note that only store.set(4) results in a fulfilled signal

    expect(watch.mock.calls).to.deep.equal([
        [{ // initial creation
            isPending: true,
            isFulfilled: false,
            isRejected: false,
            state: 0,
            value: undefined
        }],
        [{ // set 2
            isPending: true,
            isFulfilled: false,
            isRejected: false,
            state: 0,
            value: undefined
        }],
        [{ // set 3
            isPending: true,
            isFulfilled: false,
            isRejected: false,
            state: 0,
            value: undefined
        }],
        [{ // set 4
            isPending: true,
            isFulfilled: false,
            isRejected: false,
            state: 0,
            value: undefined
        }],
        [{ // set 4 - fulfilled
            isPending: false,
            isFulfilled: true,
            isRejected: false,
            state: 1,
            value: 4
        }]
    ]);
});
