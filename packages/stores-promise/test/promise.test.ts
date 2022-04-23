import {expect, it, vi} from "vitest";
import {derive, promise, State, Stateful} from "../src";
import {trigger_strict_not_equal, writable} from "@crikey/stores-base";

it('should handle immediate promises by unsubscribing immediately', async () => {
    const watch_start = vi.fn();
    const watch_stop = vi.fn();
    const store = writable<Stateful<number>>(
        trigger_strict_not_equal,
        {
            isPending: false,
            isFulfilled: true,
            isRejected: false,
            state: State.Fulfilled,
            value: 1
        },
        () => {
            watch_start();
            return watch_stop;
        }
    );

    expect(watch_start.mock.calls.length).toBe(0);
    expect(watch_stop.mock.calls.length).toBe(0);

    const p = promise(store);

    expect(watch_start.mock.calls.length).toBe(1);
    expect(watch_stop.mock.calls.length).toBe(1);

    await p;

    expect(watch_start.mock.calls.length).toBe(1);
    expect(watch_stop.mock.calls.length).toBe(1);
});

it('should discard old promises', async () => {
    const store = writable(trigger_strict_not_equal, 1);

    const derived = derive(store, value => {
        return new Promise<number>(resolve => {
            setTimeout(() => resolve(value), 0);
        });
    })

    const watch = vi.fn();

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

it('should discard old promises (reject)', async () => {
    const store = writable(trigger_strict_not_equal, 1);

    const derived = derive(store, value => {
        return new Promise<number>((_resolve, reject) => {
            setTimeout(() => reject(value), 0);
        });
    })

    const watch = vi.fn();

    derived.subscribe(watch);

    store.set(2);
    store.set(3);
    store.set(4);


    await expect(promise(derived)).rejects.toThrow();

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
            isFulfilled: false,
            isRejected: true,
            state: -1,
            error: 4
        }]
    ]);
});

