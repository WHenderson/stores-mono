import {expect, it, vi} from 'vitest'
import {get, trigger_always, writable, Action} from "../src";
import {
    get_store_runner,
    set_store_runner,
    store_runner_throw_errors,
    StoreRunner
} from "@crikey/stores-base-queue";

it('should update with each change', () => {
    const store = writable(trigger_always, 1);
    let count = 0;
    store.subscribe(_ => ++count);

    expect(get(store)).toBe(1);

    store.set(2);

    expect(get(store)).toBe(2);

    store.set(2);

    expect(get(store)).toBe(2);
    expect(count).toBe(3);
});

const run = (runner: StoreRunner, action: Action) => {
    const originalRunner = set_store_runner(runner);
    expect(get_store_runner()).to.equal(runner);
    try {
        action();
    } finally {
        expect(get_store_runner()).to.equal(runner);
        set_store_runner(originalRunner);
        expect(get_store_runner()).to.equal(originalRunner);
    }
}

it('should perform cleanup even during an unhandled exception', () => {
    run(store_runner_throw_errors, () => {
        const started = vi.fn();
        const stopped = vi.fn();
        const store = writable(trigger_always, 1, () => {
            started();
            return stopped;
        });

        expect(() => {
            store.subscribe(
                _value => {
                    throw Error('unhandled exception');
                }
            );
        }).toThrow('unhandled exception');

        expect(started.mock.calls.length).toBe(1);
        expect(stopped.mock.calls.length).toBe(1);

        expect(() => {
            store.set(2);
        }).not.toThrow();
    });
});
