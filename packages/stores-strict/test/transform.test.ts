import {expect, it, vi} from "vitest";
import {transform, writable} from "../src";

it('should trigger on !==', () => {
    const store = writable(2);
    const derived = transform(store, value => Math.floor(value / 2));
    const watch = vi.fn();

    derived.subscribe(watch);

    store.set(3);
    store.set(4);
    store.set(5);
    store.set(6);

    expect(watch.mock.calls).to.deep.equal([
        [1],
        [2],
        [3]
    ]);
});
