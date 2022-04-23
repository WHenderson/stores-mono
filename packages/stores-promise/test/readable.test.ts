import {expect, it} from 'vitest'
import {readable, State} from "../src";
import {get} from "@crikey/stores-base";

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
