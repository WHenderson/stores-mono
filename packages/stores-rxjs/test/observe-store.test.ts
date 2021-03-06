import {expect, vi, it} from 'vitest'
import {writable, trigger_always} from "@crikey/stores-base";
import {observe_store} from "../src";

it('should signal upon changing values', () => {
    const store = writable(trigger_always, 1);
    const observable = observe_store(store);
    const watcher = vi.fn();
    observable.subscribe(watcher);

    const watcher2 = vi.fn();
    observable.subscribe(watcher2);

    store.set(2);
    store.set(3);
    store.set(4);
    observable.complete();

    expect(watcher.mock.calls).to.deep.equal([[1],[2],[3],[4]])
})

